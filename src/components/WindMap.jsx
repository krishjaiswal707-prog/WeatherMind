import React from 'react';

/**
 * Radar-style circular Wind Map card.
 * Features rotating sweeps, concentric grids, cardinal guides, and a directional pointer.
 */
export default function WindMap({ windSpeed = 0, windDirection = 0 }) {
  const getCardinalDirection = (deg) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(deg / 22.5) % 16;
    return directions[idx];
  };

  const cardinal = getCardinalDirection(windDirection);

  return (
    <div className="glass-panel wind-map-card">
      <style>{`
        .wind-map-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem !important;
          position: relative;
        }

        .card-header-compact {
          display: flex;
          justify-content: space-between;
          width: 100%;
          align-items: center;
          margin-bottom: 1.2rem;
        }

        .compact-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-muted);
        }

        .status-pill.wind-pill {
          background: rgba(168, 218, 220, 0.08);
          color: #a8dadc;
          border: 1px solid rgba(168, 218, 220, 0.15);
          font-size: 0.72rem;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          font-weight: 600;
        }

        .radar-container {
          position: relative;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
          margin-bottom: 1rem;
        }

        /* Radar scan sweep line */
        .radar-sweep {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: conic-gradient(from 0deg, rgba(168, 218, 220, 0.12) 0deg, transparent 90deg);
          border-radius: 50%;
          animation: radarScan 4s linear infinite;
          pointer-events: none;
        }

        .radar-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 1px dashed rgba(255, 255, 255, 0.05);
        }

        .radar-circle-outer {
          width: 90%;
          height: 90%;
        }

        .radar-circle-mid {
          width: 60%;
          height: 60%;
        }

        .radar-circle-inner {
          width: 30%;
          height: 30%;
        }

        /* Cardinal direction text markers */
        .radar-marker {
          position: absolute;
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .marker-n { top: 6px; left: 50%; transform: translateX(-50%); }
        .marker-e { right: 8px; top: 50%; transform: translateY(-50%); }
        .marker-s { bottom: 6px; left: 50%; transform: translateX(-50%); }
        .marker-w { left: 8px; top: 50%; transform: translateY(-50%); }

        /* Central compass needle */
        .radar-needle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 6px;
          height: 70px;
          transform-origin: center center;
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .needle-arrow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 22px solid #ff7b00; /* Vivid direction color */
        }

        .needle-glow {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 25px;
          background: radial-gradient(circle, rgba(255, 123, 0, 0.35) 0%, transparent 80%);
          filter: blur(2px);
        }

        .radar-center-hub {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 0 8px rgba(255,255,255,0.8);
          border: 1px solid rgba(0,0,0,0.3);
        }

        .wind-details-summary {
          text-align: center;
        }

        .wind-text-large {
          display: block;
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: var(--text-primary);
        }

        .wind-unit {
          font-size: 0.95rem;
          font-weight: 400;
          color: var(--text-secondary);
        }

        .wind-subtext {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @keyframes radarScan {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="card-header-compact">
        <span className="compact-label">Wind Compass</span>
        <span className="status-pill wind-pill">{windSpeed} km/h</span>
      </div>

      <div className="radar-container">
        <div className="radar-sweep" />
        <div className="radar-circle radar-circle-outer" />
        <div className="radar-circle radar-circle-mid" />
        <div className="radar-circle radar-circle-inner" />
        
        <span className="radar-marker marker-n">N</span>
        <span className="radar-marker marker-e">E</span>
        <span className="radar-marker marker-s">S</span>
        <span className="radar-marker marker-w">W</span>

        <div 
          className="radar-needle" 
          style={{ transform: `translate(-50%, -50%) rotate(${windDirection}deg)` }}
        >
          <div className="needle-arrow" />
          <div className="needle-glow" />
        </div>

        <div className="radar-center-hub" />
      </div>

      <div className="wind-details-summary">
        <span className="wind-text-large">{windSpeed} <span className="wind-unit">km/h</span></span>
        <span className="wind-subtext">{windDirection}° {cardinal} Direction</span>
      </div>
    </div>
  );
}
