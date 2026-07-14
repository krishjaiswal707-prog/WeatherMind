import React from 'react';
import { Heart, Info } from 'lucide-react';

const AQI_LEVELS = [
  { max: 50, label: "Good", color: "#4ade80", bg: "rgba(74, 222, 128, 0.15)", border: "rgba(74, 222, 128, 0.3)", advice: "Air quality is great — enjoy the outdoors." },
  { max: 100, label: "Moderate", color: "#facc15", bg: "rgba(250, 204, 21, 0.15)", border: "rgba(250, 204, 21, 0.3)", advice: "Acceptable air quality for most people." },
  { max: 150, label: "Unhealthy for Sensitive Groups", color: "#fb923c", bg: "rgba(251, 146, 60, 0.15)", border: "rgba(251, 146, 60, 0.3)", advice: "Sensitive groups should limit prolonged outdoor exertion." },
  { max: 200, label: "Unhealthy", color: "#f87171", bg: "rgba(248, 113, 113, 0.15)", border: "rgba(248, 113, 113, 0.3)", advice: "Everyone may begin to notice effects — reduce time outside." },
  { max: 300, label: "Very Unhealthy", color: "#c084fc", bg: "rgba(192, 132, 252, 0.15)", border: "rgba(192, 132, 252, 0.3)", advice: "Avoid outdoor activity if possible." },
  { max: 500, label: "Hazardous", color: "#7f1d1d", bg: "rgba(127, 29, 29, 0.15)", border: "rgba(127, 29, 29, 0.3)", advice: "Stay indoors — air quality is dangerous." },
];

function getAqiLevel(aqiVal) {
  return AQI_LEVELS.find((l) => aqiVal <= l.max) || AQI_LEVELS[AQI_LEVELS.length - 1];
}

export default function AQICard({ aqi }) {
  if (!aqi) return null;

  const { value, pm25, pm10 } = aqi;
  const level = getAqiLevel(value);

  return (
    <div className="glass-panel aqi-card-container">
      <div className="aqi-card-header">
        <Heart className="aqi-card-header-icon" style={{ color: level.color }} />
        <div>
          <h4>Air Quality Index (AQI)</h4>
          <p className="aqi-subtitle">Live particulate density rating</p>
        </div>
      </div>

      <div className="aqi-content-grid">
        {/* Left: Circular gauge or dial */}
        <div className="aqi-gauge-section">
          <div className="aqi-gauge-circle" style={{ borderColor: level.border }}>
            <span className="aqi-gauge-value" style={{ color: level.color }}>{Math.round(value)}</span>
            <span className="aqi-gauge-label" style={{ backgroundColor: level.bg, color: level.color }}>
              {level.label}
            </span>
          </div>
        </div>

        {/* Right: Particle readings and detailed recommendations */}
        <div className="aqi-details-section">
          <div className="aqi-advice-box">
            <Info size={16} className="aqi-advice-icon" style={{ color: level.color }} />
            <p className="aqi-advice-text">{level.advice}</p>
          </div>

          <div className="aqi-pm-stats">
            <div className="pm-stat-node">
              <span className="pm-label">PM2.5</span>
              <span className="pm-value">
                {pm25?.toFixed(1) || '--'} <span className="pm-unit">μg/m³</span>
              </span>
              <div className="pm-bar-track">
                <div className="pm-bar-fill pm25" style={{ width: `${Math.min((pm25 / 75) * 100, 100)}%` }} />
              </div>
            </div>
            <div className="pm-stat-node">
              <span className="pm-label">PM10</span>
              <span className="pm-value">
                {pm10?.toFixed(1) || '--'} <span className="pm-unit">μg/m³</span>
              </span>
              <div className="pm-bar-track">
                <div className="pm-bar-fill pm10" style={{ width: `${Math.min((pm10 / 150) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
