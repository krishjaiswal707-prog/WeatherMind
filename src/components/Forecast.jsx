import React from 'react';
import * as LucideIcons from 'lucide-react';

export default function Forecast({ forecastData, unit }) {
  // Show 7 days starting from tomorrow (index 1 to 8)
  const displayForecast = forecastData.slice(1, 8);

  const formatForecastTemp = (tempVal) => {
    return unit === 'F' 
      ? Math.round((tempVal * 9) / 5 + 32)
      : Math.round(tempVal);
  };

  return (
    <div className="forecast-container">
      <h3 className="forecast-title">
        <LucideIcons.Calendar className="forecast-title-icon" />
        7-Day Forecast
      </h3>
      <div className="forecast-grid-layout">
        {displayForecast.map((day, index) => {
          const WeatherIcon = LucideIcons[day.icon] || LucideIcons.HelpCircle;
          return (
            <div key={index} className="glass-panel forecast-grid-card">
              <span className="forecast-day-grid">{day.dayName}</span>
              <span className="forecast-date-grid">{day.fullDateStr}</span>
              <WeatherIcon className="forecast-icon-grid" title={day.label} />
              <span className="forecast-desc-grid">{day.label}</span>
              <div className="forecast-temp-grid">
                <span className="forecast-temp-max">{formatForecastTemp(day.tempMax)}°</span>
                <span className="forecast-temp-min">{formatForecastTemp(day.tempMin)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
