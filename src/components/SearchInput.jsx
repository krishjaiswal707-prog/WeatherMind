import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, History, X, Locate } from 'lucide-react';
import { searchCities } from '../services/weatherService';

export default function SearchInput({ onSearchSelected, history = [], onDeleteHistoryItem }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicking outside the search element to close the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch geocoding autocomplete suggestions as user types
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        setShowDropdown(true);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      if (suggestions && suggestions.length > 0) {
        handleSelectSuggestion(suggestions[0]);
      } else {
        setLoading(true);
        searchCities(query)
          .then((results) => {
            if (results && results.length > 0) {
              handleSelectSuggestion(results[0]);
            }
          })
          .catch((err) => console.error(err))
          .finally(() => setLoading(false));
      }
    }
  };

  const handleSelectSuggestion = (city) => {
    const cityName = city.admin1 
      ? `${city.name}, ${city.admin1}, ${city.country}`
      : `${city.name}, ${city.country}`;
      
    onSearchSelected({
      name: cityName,
      cityNameOnly: city.name,
      lat: city.latitude,
      lon: city.longitude
    });
    
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  // Get current device geolocation and load local weather
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let cityName = "Current Location";

        try {
          // Attempt reverse geocoding using keyless Nominatim OSM service
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { 'Accept-Language': 'en' } }
          );
          if (response.ok) {
            const data = await response.json();
            const address = data.address;
            const place = address.city || address.town || address.village || address.suburb || "Current Location";
            const country = address.country || "";
            cityName = country ? `${place}, ${country}` : place;
          }
        } catch (err) {
          console.warn("Reverse geocoding failed. Falling back to default name:", err);
        }

        onSearchSelected({
          name: cityName,
          cityNameOnly: cityName.split(',')[0],
          lat: latitude,
          lon: longitude
        });
        setLoading(false);
        setShowDropdown(false);
      },
      (error) => {
        console.error("Error retrieving device coordinates:", error);
        alert("Unable to retrieve location. Please check your browser location permissions.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="search-container" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <Search className="search-input-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search for a city (e.g., London, Cairo)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
          />
          {/* Geolocation target button inside search input wrapper */}
          <button
            type="button"
            className="geolocation-btn"
            onClick={handleGeolocation}
            title="Use current location"
          >
            <Locate size={18} />
          </button>
        </div>
        <button type="submit" className="search-submit-btn">
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Classic Auto-Suggest / History Dropdown */}
      {showDropdown && (
        <ul className="suggestions-dropdown">
          {/* Case A: Query is empty - Show Recent Searches list */}
          {query.trim().length === 0 && history.length > 0 && (
            <>
              <li className="dropdown-header">Recent Searches</li>
              {history.map((city, idx) => (
                <li
                  key={`history-${idx}`}
                  className="suggestion-item history-item"
                >
                  <div 
                    className="history-item-clickable"
                    onClick={() => {
                      onSearchSelected(city);
                      setShowDropdown(false);
                    }}
                  >
                    <History size={14} className="history-item-icon" />
                    <span className="suggestion-name">{city.cityNameOnly || city.name.split(',')[0]}</span>
                    <span className="suggestion-details-small">
                      {city.name.includes(',') ? city.name.substring(city.name.indexOf(',')) : ''}
                    </span>
                  </div>
                  <button 
                    type="button"
                    className="history-delete-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHistoryItem(city);
                    }}
                    title="Remove from history"
                  >
                    <X size={13} />
                  </button>
                </li>
              ))}
            </>
          )}

          {/* Case B: Query has characters - Show Autocomplete suggestions */}
          {query.trim().length >= 2 && suggestions.length > 0 && (
            suggestions.map((city, idx) => (
              <li
                key={`suggest-${city.latitude}-${city.longitude}-${idx}`}
                className="suggestion-item"
                onClick={() => handleSelectSuggestion(city)}
              >
                <MapPin size={16} className="detail-icon" style={{ margin: 0, opacity: 0.7 }} />
                <div>
                  <span className="suggestion-name">{city.name}</span>
                  <span className="suggestion-details">
                    {city.admin1 ? `, ${city.admin1}` : ''}, {city.country}
                  </span>
                </div>
              </li>
            ))
          )}

          {/* Case C: Typing but loading or no suggestions */}
          {query.trim().length >= 2 && suggestions.length === 0 && !loading && (
            <li className="dropdown-message">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}
