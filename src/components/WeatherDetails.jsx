import React from 'react';
import { Droplets, Wind, Umbrella, Navigation } from 'lucide-react';

export default function WeatherDetails({ weather, unit }) {
  const { humidity, windSpeed, windDirection, precipitation } = weather;

  // Format Wind Speed
  const displayWindSpeed = unit === 'F'
    ? `${Math.round(windSpeed * 0.621371)} mph`
    : `${Math.round(windSpeed)} km/h`;

  const detailsList = [
    {
      label: 'Humidity',
      value: `${humidity}%`,
      icon: <Droplets className="detail-icon" />,
    },
    {
      label: 'Precipitation',
      value: `${precipitation} mm`,
      icon: <Umbrella className="detail-icon" />,
    },
    {
      label: 'Wind Speed',
      value: displayWindSpeed,
      // Rotating compass needle!
      icon: (
        <div className="compass-icon-wrapper">
          <Navigation 
            className="compass-needle" 
            style={{ 
              transform: `rotate(${windDirection}deg)`,
              transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)' 
            }} 
          />
        </div>
      ),
      subValue: `Direction: ${windDirection}°`,
    }
  ];

  return (
    <div className="weather-details-grid-wrapper">
      <h3 className="forecast-title" style={{ marginBottom: '1.2rem' }}>
        <Wind className="forecast-title-icon" />
        Meteorology Observations
      </h3>
      <div className="weather-details-grid">
        {detailsList.map((item, index) => {
          return (
            <div key={index} className="glass-panel detail-card">
              <div className="detail-card-icon-container">
                {item.icon}
              </div>
              <span className="detail-label">{item.label}</span>
              <span className="detail-value">{item.value}</span>
              {item.subValue && <div className="detail-subvalue">{item.subValue}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
