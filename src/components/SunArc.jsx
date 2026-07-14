import React from 'react';
import { Sunrise, Sunset } from 'lucide-react';

export default function SunArc({ sunriseRaw, sunsetRaw, sunriseStr, sunsetStr }) {
  if (!sunriseRaw || !sunsetRaw) return null;

  const nowMs = Date.now();
  const riseMs = new Date(sunriseRaw).getTime();
  const setMs = new Date(sunsetRaw).getTime();
  
  const totalDaylightMs = setMs - riseMs;
  const isNight = nowMs < riseMs || nowMs > setMs;
  
  // Calculate sun position progress (0 to 1)
  const progress = isNight 
    ? (nowMs < riseMs ? 0 : 1) 
    : (nowMs - riseMs) / totalDaylightMs;

  // SVG parameters
  const width = 300;
  const height = 130;
  
  // Arc properties (centered at (150, 120) with radius 110)
  const cx = 150;
  const cy = 120;
  const rx = 110;
  const ry = 90;

  // Coordinates on the ellipse arc
  // Angle goes from PI (180deg - left) to 0 (0deg - right)
  const angle = Math.PI - progress * Math.PI;
  const sunX = cx + rx * Math.cos(angle);
  const sunY = cy - ry * Math.sin(angle);

  // Formatting remaining daylight hours
  const getRemainingDaylight = () => {
    if (isNight) {
      return 'The sun has set. Night time.';
    }
    const remainingMs = setMs - nowMs;
    const remainingHours = Math.floor(remainingMs / (1000 * 60 * 60));
    const remainingMins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${remainingHours}h ${remainingMins}m of daylight remaining`;
  };

  return (
    <div className="sun-arc-card">
      <h4 className="astro-section-title" style={{ marginBottom: '1.5rem' }}>
        Sun Tracker
      </h4>
      <div className="sun-arc-svg-wrapper">
        <svg viewBox={`0 0 ${width} ${height}`} className="sun-arc-svg">
          {/* Base Horizon line */}
          <line 
            x1="20" 
            y1={cy} 
            x2={width - 20} 
            y2={cy} 
            stroke="rgba(255, 255, 255, 0.2)" 
            strokeWidth="2" 
          />
          
          {/* Dash daylight arc */}
          <path 
            d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`} 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.15)" 
            strokeWidth="3.5" 
            strokeDasharray="6, 5" 
          />

          {/* Filled daylight path showing completed day percentage */}
          {!isNight && (
            <path 
              d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${sunX} ${sunY}`} 
              fill="none" 
              stroke="rgba(250, 204, 21, 0.65)" 
              strokeWidth="4" 
              strokeLinecap="round"
            />
          )}

          {/* Sun marker */}
          {!isNight ? (
            <g>
              <circle 
                cx={sunX} 
                cy={sunY} 
                r="10" 
                fill="#facc15" 
                className="sun-marker-glow"
              />
              <circle 
                cx={sunX} 
                cy={sunY} 
                r="5" 
                fill="#ffffff" 
              />
            </g>
          ) : (
            // Moon marker at the center horizon as sunset is done
            <circle 
              cx={nowMs < riseMs ? cx - rx : cx + rx} 
              cy={cy} 
              r="7" 
              fill="rgba(255,255,255,0.4)" 
            />
          )}
        </svg>
      </div>

      <div className="sun-arc-times">
        <div className="sun-arc-node">
          <Sunrise size={14} className="sunrise-color" />
          <span>{sunriseStr}</span>
        </div>
        <div className="sun-arc-meta">{getRemainingDaylight()}</div>
        <div className="sun-arc-node">
          <Sunset size={14} className="sunset-color" />
          <span>{sunsetStr}</span>
        </div>
      </div>
    </div>
  );
}
