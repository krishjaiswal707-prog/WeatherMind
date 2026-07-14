import React from 'react';

/**
 * LiveClouds — Animated multi-layered parallax cloud component
 * Generates irregular puffy clouds with box-shadows, dropshadows, and a light glow.
 * Tone-aware: day | dusk | night | storm
 */
export default function LiveClouds({ tone = "day" }) {
  // Define tone configuration mapping
  const config = {
    day: {
      background: "linear-gradient(135deg, #4682b4 0%, #87ceeb 100%)",
      cloudColor: "rgba(255, 255, 255, 0.78)",
      shadowColor: "rgba(10, 20, 40, 0.08)",
      glowColor: "rgba(255, 253, 240, 0.55)",
      glowPosition: { top: "20%", right: "25%" }
    },
    dusk: {
      background: "linear-gradient(135deg, #1b0e2b 0%, #783d58 50%, #d87040 100%)",
      cloudColor: "rgba(245, 205, 195, 0.55)",
      shadowColor: "rgba(20, 5, 30, 0.2)",
      glowColor: "rgba(255, 160, 100, 0.45)",
      glowPosition: { top: "30%", right: "20%" }
    },
    night: {
      background: "linear-gradient(135deg, #090a0f 0%, #151d2a 100%)",
      cloudColor: "rgba(120, 140, 180, 0.3)",
      shadowColor: "rgba(0, 0, 0, 0.4)",
      glowColor: "rgba(240, 245, 255, 0.15)",
      glowPosition: { top: "15%", right: "30%" }
    },
    storm: {
      background: "linear-gradient(135deg, #11141c 0%, #202736 100%)",
      cloudColor: "rgba(40, 46, 60, 0.65)",
      shadowColor: "rgba(0, 0, 0, 0.55)",
      glowColor: "rgba(220, 225, 245, 0.08)",
      glowPosition: { top: "25%", right: "35%" }
    }
  }[tone] || {
    background: "linear-gradient(135deg, #4682b4 0%, #87ceeb 100%)",
    cloudColor: "rgba(255, 255, 255, 0.78)",
    shadowColor: "rgba(0, 0, 0, 0.08)",
    glowColor: "rgba(255, 253, 240, 0.55)",
    glowPosition: { top: "20%", right: "25%" }
  };

  return (
    <div 
      className="live-clouds-container" 
      style={{ 
        background: config.background,
        '--cloud-color': config.cloudColor,
        '--cloud-shadow': config.shadowColor,
      }}
    >
      <style>{`
        .live-clouds-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
          transition: background 1.5s ease;
        }

        /* Celestial Light Glow source */
        .live-clouds-glow {
          position: absolute;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: radial-gradient(circle, ${config.glowColor} 0%, transparent 70%);
          filter: blur(15px);
          z-index: 1;
        }

        /* Parallax Clouds Base Styles */
        .cloud-drift-node {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          pointer-events: none;
        }

        .cloud-wrapper-outer {
          position: absolute;
          left: -180px; /* start off-screen */
        }

        /* Irregular cumulus shape built from offset box-shadows */
        .cloud-irregular-silhouette {
          width: 60px;
          height: 40px;
          background: var(--cloud-color);
          border-radius: 40px;
          position: relative;
          color: var(--cloud-color);
          box-shadow: 
            35px -25px 0 10px currentColor, 
            75px -15px 0 2px currentColor, 
            110px 0px 0 0px currentColor, 
            25px 5px 0 4px currentColor,
            85px 5px 0 2px currentColor;
          filter: blur(12px) drop-shadow(0 12px 16px var(--cloud-shadow));
          transition: background 1.5s ease, color 1.5s ease;
        }

        /* Keyframes for sliding and bobbing parallax */
        @keyframes driftLeftToRight {
          from { transform: translateX(0); }
          to { transform: translateX(110vw); }
        }

        @keyframes bobVertical {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }

        @keyframes bobVerticalAlt {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Celestial Light direction glow */}
      <div 
        className="live-clouds-glow" 
        style={{ 
          top: config.glowPosition.top, 
          right: config.glowPosition.right 
        }} 
      />

      {/* ==========================================
          LAYER 1: Back Clouds (Small, faint, slow)
          ========================================== */}
      <div className="cloud-drift-node" style={{ zIndex: 2 }}>
        <div 
          className="cloud-wrapper-outer" 
          style={{ 
            top: '15%', 
            animation: 'driftLeftToRight 55s linear infinite', 
            animationDelay: '-12s' 
          }}
        >
          <div 
            className="cloud-irregular-silhouette" 
            style={{ 
              transform: 'scale(0.65)', 
              opacity: 0.35, 
              animation: 'bobVertical 8s ease-in-out infinite' 
            }} 
          />
        </div>
        <div 
          className="cloud-wrapper-outer" 
          style={{ 
            top: '35%', 
            animation: 'driftLeftToRight 65s linear infinite', 
            animationDelay: '-35s' 
          }}
        >
          <div 
            className="cloud-irregular-silhouette" 
            style={{ 
              transform: 'scale(0.55)', 
              opacity: 0.3, 
              animation: 'bobVerticalAlt 9s ease-in-out infinite' 
            }} 
          />
        </div>
      </div>

      {/* ==========================================
          LAYER 2: Middle Clouds (Medium, medium speed)
          ========================================== */}
      <div className="cloud-drift-node" style={{ zIndex: 3 }}>
        <div 
          className="cloud-wrapper-outer" 
          style={{ 
            top: '25%', 
            animation: 'driftLeftToRight 38s linear infinite', 
            animationDelay: '-5s' 
          }}
        >
          <div 
            className="cloud-irregular-silhouette" 
            style={{ 
              transform: 'scale(0.9)', 
              opacity: 0.55, 
              animation: 'bobVerticalAlt 6s ease-in-out infinite' 
            }} 
          />
        </div>
        <div 
          className="cloud-wrapper-outer" 
          style={{ 
            top: '55%', 
            animation: 'driftLeftToRight 45s linear infinite', 
            animationDelay: '-22s' 
          }}
        >
          <div 
            className="cloud-irregular-silhouette" 
            style={{ 
              transform: 'scale(0.8)', 
              opacity: 0.5, 
              animation: 'bobVertical 7s ease-in-out infinite' 
            }} 
          />
        </div>
      </div>

      {/* ==========================================
          LAYER 3: Front Clouds (Large, faster)
          ========================================== */}
      <div className="cloud-drift-node" style={{ zIndex: 4 }}>
        <div 
          className="cloud-wrapper-outer" 
          style={{ 
            top: '10%', 
            animation: 'driftLeftToRight 25s linear infinite', 
            animationDelay: '-15s' 
          }}
        >
          <div 
            className="cloud-irregular-silhouette" 
            style={{ 
              transform: 'scale(1.3)', 
              opacity: 0.75, 
              animation: 'bobVertical 4.5s ease-in-out infinite' 
            }} 
          />
        </div>
        <div 
          className="cloud-wrapper-outer" 
          style={{ 
            top: '40%', 
            animation: 'driftLeftToRight 30s linear infinite', 
            animationDelay: '-2s' 
          }}
        >
          <div 
            className="cloud-irregular-silhouette" 
            style={{ 
              transform: 'scale(1.25)', 
              opacity: 0.7, 
              animation: 'bobVerticalAlt 5.5s ease-in-out infinite' 
            }} 
          />
        </div>
      </div>
    </div>
  );
}
