import React, { useState, useEffect } from 'react';
import { 
  CloudSun, 
  Compass, 
  LayoutDashboard, 
  Map, 
  BarChart3, 
  Settings, 
  AlertTriangle, 
  RefreshCw,
  Navigation,
  Thermometer,
  Clock,
  Calendar,
  Activity,
  Heart
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { fetchWeather } from './services/weatherService';

import SearchInput from './components/SearchInput';
import WeatherDetails from './components/WeatherDetails';
import Forecast from './components/Forecast';
import WeatherAdvisor from './components/WeatherAdvisor';
import HourlyTimeline from './components/HourlyTimeline';
import Sparkline from './components/Sparkline';
import AstroCard from './components/AstroCard';
import AQICard from './components/AQICard';
import WatercolorSky from './components/WatercolorSky';
import WindMap from './components/WindMap';
import LiveClouds from './components/LiveClouds';
import SettingsPanel from './components/SettingsPanel';
import WeatherEffects from './components/WeatherEffects';

import './App.css';

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [hourlyRawData, setHourlyRawData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [aqiData, setAqiData] = useState(null);
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [unit, setUnit] = useState(() => localStorage.getItem('tempUnit') || 'C');
  const [theme, setTheme] = useState(() => localStorage.getItem('weatherTheme') || 'deep-space');

  // Sync theme with body and local storage
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('weatherTheme', theme);
  }, [theme]);

  // Clear search cache handler
  const handleClearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch weather data for a city selection
  const handleSelectCity = async (selectedCity) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(selectedCity.lat, selectedCity.lon);
      setWeatherData(data.current);
      setHourlyData(data.hourly);
      setHourlyRawData(data.hourlyRaw);
      setForecastData(data.forecast);
      setAqiData(data.aqi);
      setCity(selectedCity.name);

      // Save to recent searches (prevent duplicates, limit to 5)
      setRecentSearches((prev) => {
        const filtered = prev.filter(
          (item) => item.lat !== selectedCity.lat || item.lon !== selectedCity.lon
        );
        const updated = [selectedCity, ...filtered].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
        return updated;
      });

      // Save last searched city coords and name
      localStorage.setItem('lastSearchedCity', JSON.stringify(selectedCity));
    } catch (err) {
      console.error(err);
      setError('Could not fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // On mount, try auto live location detection, falling back to history or Paris
  useEffect(() => {
    const fallbackToHistoryOrDefault = () => {
      try {
        const lastSearch = localStorage.getItem('lastSearchedCity');
        if (lastSearch) {
          handleSelectCity(JSON.parse(lastSearch));
        } else {
          // Default to Paris, France
          handleSelectCity({
            name: 'Paris, Île-de-France, France',
            cityNameOnly: 'Paris',
            lat: 48.8566,
            lon: 2.3522,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          let cityName = "Current Location";
          try {
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
            console.warn("Auto reverse geocoding failed, using fallback:", err);
          }
          
          handleSelectCity({
            name: cityName,
            cityNameOnly: cityName.split(',')[0],
            lat: latitude,
            lon: longitude
          });
        },
        (error) => {
          console.log("Auto location skipped or denied. Loading fallback history/default.");
          fallbackToHistoryOrDefault();
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      fallbackToHistoryOrDefault();
    }
  }, []);

  // Update tempUnit in localStorage
  const toggleUnit = () => {
    setUnit((prev) => {
      const next = prev === 'C' ? 'F' : 'C';
      localStorage.setItem('tempUnit', next);
      return next;
    });
  };

  // Delete search item from history
  const handleDeleteHistoryItem = (itemToDelete) => {
    setRecentSearches((prev) => {
      const updated = prev.filter(
        (item) => item.lat !== itemToDelete.lat || item.lon !== itemToDelete.lon
      );
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  // Refresh weather for the current city
  const handleRefresh = () => {
    const lastSearch = localStorage.getItem('lastSearchedCity');
    if (lastSearch) {
      handleSelectCity(JSON.parse(lastSearch));
    }
  };

  // Temperature formatter
  const formatTemp = (val) => {
    if (val === undefined || val === null) return '--';
    return unit === 'F' ? Math.round((val * 9) / 5 + 32) : Math.round(val);
  };

  // Tone-aware classifier for hero background clouds
  const getHeroTone = (theme, isDay) => {
    if (theme === 'stormy') return 'storm';
    if (theme === 'rainy') return 'storm';
    if (!isDay) return 'night';
    if (theme === 'cloudy' || theme === 'foggy') return 'dusk';
    return 'day';
  };

  return (
    <div className="app-container">
      {/* Soft watercolor bleeding ink background overlay */}
      <WatercolorSky 
        condition={weatherData ? (weatherData.theme === 'rainy' ? 'rain' : weatherData.theme === 'stormy' ? 'thunder' : weatherData.theme === 'cloudy' ? 'cloudy' : weatherData.theme === 'snowy' ? 'snow' : weatherData.theme === 'foggy' ? 'fog' : 'clear') : 'clear'} 
        isNight={weatherData ? !weatherData.isDay : false} 
        theme={theme}
      />
      {weatherData && (
        <WeatherEffects 
          theme={weatherData.theme} 
          isDay={weatherData.isDay} 
          windSpeed={weatherData.windSpeed} 
          windDirection={weatherData.windDirection} 
        />
      )}

      {/* Left Icon-Only Navigation Sidebar */}
      <aside className="app-sidebar">
        <CloudSun className="sidebar-logo" />
        <div 
          className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
          title="Dashboard"
        >
          <LayoutDashboard size={20} />
        </div>
        <div 
          className={`sidebar-nav-item ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
          title="Weather Radar"
        >
          <Compass size={20} />
        </div>
        <div 
          className={`sidebar-nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
          title="Analytics"
        >
          <BarChart3 size={20} />
        </div>
        <div 
          className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('settings');
          }}
          title="Settings"
          style={{ marginTop: 'auto' }}
        >
          <Settings size={20} />
        </div>
      </aside>

      {/* Main content wrapper */}
      <main className="main-content-wrapper">
        <div className="main-header-controls">
          <SearchInput 
            onSearchSelected={handleSelectCity} 
            history={recentSearches}
            onDeleteHistoryItem={handleDeleteHistoryItem}
          />
        </div>

        {activeTab === 'settings' ? (
          <SettingsPanel 
            theme={theme}
            setTheme={setTheme}
            unit={unit}
            toggleUnit={toggleUnit}
            onClearHistory={handleClearHistory}
          />
        ) : (
          <>
            {loading && (
              <div className="glass-panel loading-box">
            <div className="spinner"></div>
            <span className="box-title">Syncing meteorological feed...</span>
            <span className="box-desc">Retrieving atmospheric telemetry, UV and solar data.</span>
          </div>
        )}

        {error && !loading && (
          <div className="glass-panel error-box">
            <AlertTriangle className="error-icon" />
            <span className="box-title">Connection Interrupted</span>
            <span className="box-desc">{error}</span>
            <button
              className="unit-toggle-btn"
              onClick={handleRefresh}
              style={{ marginTop: '0.5rem' }}
            >
              <RefreshCw size={14} style={{ marginRight: '0.5rem' }} /> Re-fetch Coords
            </button>
          </div>
        )}

        {!loading && !error && weatherData && (
          <div className="dashboard-columns-grid">
            
            {/* LEFT COLUMN: Hero, Hourly scroll, Details grid, 7-Day outlook */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              
              {/* Premium Blurry Storm-Cloud Hero weather panel */}
              {(() => {
                const WeatherIcon = LucideIcons[weatherData.icon] || LucideIcons.CloudSun;
                return (
                  <div className="hero-weather-panel">
                    {/* Absolutely-positioned background clouds layer */}
                    <LiveClouds tone={getHeroTone(weatherData.theme, weatherData.isDay)} />
                    <div className="hero-left-block">
                      <span className="hero-city-name">{city?.split(',')[0]}</span>
                      <span className="hero-condition-text">
                        {weatherData.label} &bull; Feels like {formatTemp(weatherData.feelsLike)}°
                      </span>
                      <div className="hero-pills-row">
                        <span className="hero-badge-pill">
                          High: {formatTemp(forecastData[0]?.tempMax)}°
                        </span>
                        <span className="hero-badge-pill">
                          Low: {formatTemp(forecastData[0]?.tempMin)}°
                        </span>
                        <span className="hero-badge-pill" style={{ textTransform: 'capitalize' }}>
                          {weatherData.theme}
                        </span>
                      </div>
                    </div>
                    <div className="hero-right-block">
                      <div className="hero-weather-icon-wrapper">
                        <WeatherIcon className="hero-weather-icon-large" />
                      </div>
                      <span className="hero-temp-value">{formatTemp(weatherData.temp)}°</span>
                    </div>
                  </div>
                );
              })()}

              {/* Hourly Forecast Timeline row */}
              <HourlyTimeline hourlyData={hourlyData} unit={unit} />

              {/* Secondary Meteorology cockpits (Wind, UV, Humidity, etc.) */}
              <WeatherDetails weather={weatherData} unit={unit} />

              {/* Sun Cycle Astro card */}
              {forecastData.length > 0 && (
                <AstroCard todayForecast={forecastData[0]} />
              )}

              {/* 7-Day Grid outlook card */}
              <Forecast forecastData={forecastData} unit={unit} />

            </div>

            {/* RIGHT COLUMN: Live Conditions + Sparkline, Radar wind compass, Recent searches */}
            <div className="right-sidebar-stack">
              
              {/* Live Conditions Card + Gradient Sparkline */}
              {(() => {
                const hourlyTemps = hourlyRawData.map(h => 
                  unit === 'F' ? Math.round((h.temp * 9) / 5 + 32) : Math.round(h.temp)
                );
                return (
                  <div className="glass-panel live-conditions-card">
                    <div className="card-header-compact">
                      <span className="compact-label">Live Conditions</span>
                      <span className="status-pill wind-pill" style={{ background: 'rgba(251,191,36,0.08)', color: '#fbbf24', borderColor: 'rgba(251,191,36,0.15)' }}>
                        UV {weatherData.uvIndex} &bull; {weatherData.uvIndex >= 6 ? 'High' : 'Moderate'}
                      </span>
                    </div>
                    
                    {/* Hourly gradient sparkline */}
                    <div style={{ marginTop: '0.4rem', marginBottom: '0.6rem' }}>
                      <div className="sparkline-header-simple" style={{ marginBottom: '0.6rem' }}>
                        <span className="pm-label">24h Temperature Curve</span>
                        <span className="suggestion-details-small">
                          L: {Math.min(...hourlyTemps)}° H: {Math.max(...hourlyTemps)}°
                        </span>
                      </div>
                      <Sparkline hourlyTemps={hourlyTemps} />
                    </div>

                    {/* Clothing and advice generator panel */}
                    <WeatherAdvisor current={weatherData} />

                    {/* Air Quality Index Gauge mini dashboard */}
                    {aqiData && (
                      <AQICard aqi={aqiData} />
                    )}
                  </div>
                );
              })()}

              {/* Circular Radar-style Wind Map */}
              <WindMap windSpeed={weatherData.windSpeed} windDirection={weatherData.windDirection} />

              {/* Recently Searched Card List */}
              <div className="glass-panel recent-searches-list-card">
                <span className="compact-label">Recently Searched</span>
                <div className="recent-searches-list">
                  {recentSearches.length === 0 ? (
                    <span className="recent-searches-empty">No recent locations in console.</span>
                  ) : (
                    recentSearches.map((cityObj, idx) => (
                      <div 
                        key={idx} 
                        className="recent-search-row"
                        onClick={() => handleSelectCity(cityObj)}
                      >
                        <div className="recent-search-info">
                          <span className="recent-search-name">{cityObj.cityNameOnly}</span>
                          <span className="recent-search-detail">
                            {cityObj.name.substring(cityObj.name.indexOf(',') + 1).trim()}
                          </span>
                        </div>
                        <Navigation size={14} style={{ opacity: 0.6, transform: 'rotate(45deg)' }} />
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
}
