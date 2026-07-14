import React from 'react';
import { Sunrise, Sunset, SunDim } from 'lucide-react';
import SunArc from './SunArc';

export default function AstroCard({ todayForecast }) {
  if (!todayForecast) return null;

  const { sunrise, sunset, uvIndex, sunriseRaw, sunsetRaw } = todayForecast;

  // Determine UV index level details
  const getUVDetails = (uv) => {
    if (uv <= 2) {
      return { label: 'Low', color: '#4ade80', desc: 'No special precautions needed.' };
    } else if (uv <= 5) {
      return { label: 'Moderate', color: '#facc15', desc: 'Sun protection recommended near noon.' };
    } else if (uv <= 7) {
      return { label: 'High', color: '#fb923c', desc: 'Wear sunglasses, hat, and SPF 30+.' };
    } else if (uv <= 10) {
      return { label: 'Very High', color: '#f87171', desc: 'Seek shade. Avoid direct sun 10 AM - 4 PM.' };
    } else {
      return { label: 'Extreme', color: '#c084fc', desc: 'Take all precautions. Skin burns quickly.' };
    }
  };

  const uvDetails = getUVDetails(uvIndex);
  
  // Calculate percentage for UV meter progress bar (max 12 index)
  const uvPercent = Math.min((uvIndex / 12) * 100, 100);

  return (
    <div className="glass-panel astro-container">
      <div className="astro-grid">
        {/* Sunrise / Sunset Arc Tracker (Unique Visual Component) */}
        <SunArc 
          sunriseRaw={sunriseRaw} 
          sunsetRaw={sunsetRaw} 
          sunriseStr={sunrise} 
          sunsetStr={sunset} 
        />

        {/* UV Index Alert Section */}
        <div className="astro-uv-section">
          <h4 className="astro-section-title" style={{ marginBottom: '1.5rem' }}>
            <SunDim size={18} style={{ marginRight: '0.4rem' }} /> UV Index Risk
          </h4>
          <div className="uv-meter-wrapper">
            <div className="uv-level-header">
              <span className="uv-value-badge" style={{ backgroundColor: uvDetails.color }}>
                {uvIndex.toFixed(1)}
              </span>
              <div>
                <span className="uv-risk-label">{uvDetails.label} Risk</span>
                <p className="uv-risk-desc">{uvDetails.desc}</p>
              </div>
            </div>
            
            <div className="uv-progress-track">
              <div 
                className="uv-progress-fill" 
                style={{ 
                  width: `${uvPercent}%`, 
                  backgroundColor: uvDetails.color 
                }} 
              />
            </div>
            <div className="uv-scale-labels">
              <span>0</span>
              <span>3</span>
              <span>6</span>
              <span>9</span>
              <span>12+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
