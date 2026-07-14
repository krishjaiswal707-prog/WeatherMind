import React, { useState, useEffect } from 'react';

export default function WeatherEffects({ theme, isDay, windSpeed = 10, windDirection = 180 }) {
  // Map our themes to condition keys
  let condition = 'clear';
  if (theme === 'rainy') condition = 'rain';
  else if (theme === 'stormy') condition = 'thunder';
  else if (theme === 'cloudy') condition = 'cloudy';
  else if (theme === 'snowy') condition = 'snow';
  else if (theme === 'foggy') condition = 'fog';

  const isNight = !isDay;
  const [lightningCoords, setLightningCoords] = useState(null);

  // Trigger random lightning bolt coordinates during a thunderstorm
  useEffect(() => {
    if (condition !== 'thunder') return;

    const interval = setInterval(() => {
      // 15% chance of a lightning bolt discharge every 1.5 seconds
      if (Math.random() < 0.25) {
        const xStart = 30 + Math.random() * 40; // center-ish horizontal
        const xEnd = xStart + (Math.random() * 20 - 10);
        setLightningCoords({ xStart, xEnd });
        
        // Hide the bolt after 200ms
        setTimeout(() => setLightningCoords(null), 220);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [condition]);

  // Translate wind direction (0-360) and speed (km/h) to particle drift offsets
  // If wind is high, we tilt rain/snow diagonally
  const windFactor = Math.min(windSpeed / 50, 1); // clamp to max 50 km/h for visual effect
  
  // Decide angle: winds from west (270) blow particles right (positive angle),
  // winds from east (90) blow particles left (negative angle)
  let tiltAngle = 0;
  if (windSpeed > 5) {
    const isWesterly = windDirection > 180 && windDirection < 360;
    tiltAngle = isWesterly ? (10 + windFactor * 25) : -(10 + windFactor * 25);
  }

  // Adjust particle speed based on wind speed
  const rainFallDuration = Math.max(0.3, 0.9 - windFactor * 0.5); // faster as wind increases
  const snowDriftDuration = Math.max(2.0, 6.0 - windFactor * 3.5);

  return (
    <div className="weather-effect-overlay">
      <style>{`
        @keyframes floatCloud {
          from { transform: translateX(-30%); }
          to { transform: translateX(130%); }
        }
        @keyframes fall {
          from { transform: translateY(-10%) rotate(${tiltAngle}deg); opacity: 0.9; }
          to { transform: translateY(110%) rotate(${tiltAngle}deg); opacity: 0.25; }
        }
        @keyframes drift {
          from { transform: translateY(-10%) translateX(0) rotate(${tiltAngle * 0.5}deg); opacity: 0.9; }
          to { transform: translateY(110%) translateX(${tiltAngle > 0 ? '40px' : '-40px'}) rotate(${tiltAngle * 0.5}deg); opacity: 0.2; }
        }
        @keyframes sunPulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.05); opacity: 0.95; }
        }
        @keyframes sunRotation {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes flash {
          0%, 94%, 100% { opacity: 0; }
          95%, 97% { opacity: 0.65; }
        }
        @keyframes fogDrift {
          0% { transform: translateX(-10%); }
          100% { transform: translateX(10%); }
        }

        .weather-effect-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: hidden;
        }

        .animated-cloud-blob {
          position: absolute;
          border-radius: 9999px;
          background-color: rgba(255, 255, 255, 0.16);
          filter: blur(12px);
          transition: transform 0.5s ease;
        }

        .animated-rain-line {
          position: absolute;
          background-color: rgba(220, 235, 255, 0.45);
          width: 1.5px;
          height: 22px;
        }

        .animated-snowflake {
          position: absolute;
          border-radius: 9999px;
          background-color: rgba(255, 255, 255, 0.85);
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.4);
        }

        .animated-thunder-screen {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(245, 248, 255, 0.95);
          pointer-events: none;
        }

        .fog-drift-layer {
          position: absolute;
          bottom: 0;
          left: -20%;
          width: 140%;
          height: 40%;
          background: radial-gradient(circle, rgba(240, 240, 240, 0.18) 0%, transparent 80%);
          filter: blur(25px);
          animation: fogDrift 30s ease-in-out infinite alternate;
        }

        .fog-drift-layer-two {
          position: absolute;
          bottom: 10%;
          left: -10%;
          width: 130%;
          height: 30%;
          background: radial-gradient(circle, rgba(235, 240, 245, 0.14) 0%, transparent 75%);
          filter: blur(20px);
          animation: fogDrift 20s ease-in-out infinite alternate-reverse;
        }
      `}</style>

      {/* Sun / Moon celestial marker floating on top of realistic sky */}
      {condition === "clear" && (
        <div style={{ position: 'absolute', top: 50, right: 70, width: 140, height: 140 }}>
          {/* Slow rotating flares */}
          {!isNight && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'repeating-conic-gradient(from 0deg, rgba(255,245,180,0.06) 0deg 15deg, transparent 15deg 30deg)',
                animation: 'sunRotation 60s linear infinite',
                borderRadius: '50%',
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              borderRadius: '9999px',
              width: 80,
              height: 80,
              top: 30,
              left: 30,
              background: isNight
                ? "radial-gradient(circle, #f0f2fa 40%, transparent 70%)"
                : "radial-gradient(circle, #fffdf0 40%, transparent 70%)",
              boxShadow: isNight ? "0 0 35px 8px rgba(240,242,250,0.35)" : "0 0 55px 15px rgba(255,253,240,0.45)",
              animation: "sunPulse 5s ease-in-out infinite",
            }}
          />
        </div>
      )}

      {/* Drifting clouds — used for cloudy, fog, rain, thunder, snow */}
      {condition !== "clear" &&
        Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animated-cloud-blob"
            style={{
              width: 150 + i * 40,
              height: 55 + i * 12,
              top: 20 + i * 40,
              animation: `floatCloud ${30 + i * 8}s linear infinite`,
              animationDelay: `${-i * 9}s`,
              opacity: condition === 'thunder' || condition === 'rain' ? 0.45 : 0.65,
            }}
          />
        ))}

      {/* Falling Rain (incorporating wind speed & angle tilt) */}
      {(condition === "rain" || condition === "thunder") &&
        Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="animated-rain-line"
            style={{
              left: `${Math.random() * 100}%`,
              top: -30,
              animation: `fall ${rainFallDuration + Math.random() * 0.4}s linear infinite`,
              animationDelay: `${Math.random() * 1.5}s`,
            }}
          />
        ))}

      {/* Drifting Snow (incorporating wind speed & angle tilt) */}
      {condition === "snow" &&
        Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="animated-snowflake"
            style={{
              width: 3 + Math.random() * 6,
              height: 3 + Math.random() * 6,
              left: `${Math.random() * 100}%`,
              top: -15,
              animation: `drift ${snowDriftDuration + Math.random() * 3}s linear infinite`,
              animationDelay: `${Math.random() * 3.5}s`,
            }}
          />
        ))}

      {/* Volumetric Fog Layers */}
      {condition === "fog" && (
        <>
          <div className="fog-drift-layer" />
          <div className="fog-drift-layer-two" />
        </>
      )}

      {/* Thunder Flash & Branching Lightning Bolts */}
      {condition === "thunder" && (
        <>
          <div
            className="animated-thunder-screen"
            style={{ animation: "flash 4.5s ease-in-out infinite" }}
          />
          {lightningCoords && (
            <svg
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '80%',
                zIndex: 2,
              }}
            >
              <polyline
                points={`
                  ${lightningCoords.xStart},0 
                  ${lightningCoords.xStart + 3},150 
                  ${lightningCoords.xStart - 12},130 
                  ${lightningCoords.xStart - 4},280 
                  ${lightningCoords.xEnd},380
                `}
                fill="none"
                stroke="#dbeafe"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(191,219,254,0.85))',
                }}
              />
              <polyline
                points={`
                  ${lightningCoords.xStart},0 
                  ${lightningCoords.xStart + 3},150 
                  ${lightningCoords.xStart - 12},130 
                  ${lightningCoords.xStart - 4},280 
                  ${lightningCoords.xEnd},380
                `}
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </>
      )}
    </div>
  );
}
