import React from 'react';
import * as LucideIcons from 'lucide-react';

export default function HourlyTimeline({ hourlyData, unit }) {
  if (!hourlyData || hourlyData.length === 0) return null;

  const formatTemp = (val) => {
    return unit === 'F'
      ? Math.round((val * 9) / 5 + 32)
      : Math.round(val);
  };

  return (
    <div className="glass-panel hourly-container">
      <h3 className="forecast-title" style={{ marginBottom: '1.2rem' }}>
        <LucideIcons.Clock className="forecast-title-icon" />
        24-Hour Forecast
      </h3>
      <div className="hourly-scroll-wrapper">
        {hourlyData.map((hour, index) => {
          const WeatherIcon = LucideIcons[hour.icon] || LucideIcons.HelpCircle;
          return (
            <div key={index} className="hourly-item">
              <span className="hourly-time">{hour.displayHour}</span>
              <div className="hourly-icon-container">
                <WeatherIcon className="hourly-icon" />
              </div>
              <span className="hourly-temp">{formatTemp(hour.temp)}°</span>
              <span className="hourly-desc">{hour.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
