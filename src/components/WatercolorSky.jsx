import React, { useMemo } from "react";

/**
 * ============================================================
 * WATERCOLOR SKY — animated background (Dark Dashboard Version)
 * ============================================================
 * Soft overlapping color blobs that slowly drift and bleed into
 * a solid near-black (#0d0f12) canvas. Uses screen blending
 * to create soft atmospheric gas glows in the dark control room.
 */

// ---------- Vibrant Curated Art Palettes ----------
const PALETTES = {
  'deep-space': {
    clear: {
      day: ["#eab308", "#ea580c", "#38bdf8", "#0284c7", "#0369a1"], // Sun gold, orange, sky blues
      night: ["#140d26", "#251647", "#5c3d75", "#a6639c", "#e899c7"], // Nebula purple/pink
    },
    cloudy: {
      day: ["#1e293b", "#334155", "#475569", "#d97706", "#b45309"], // Charcoal + warm amber bottom (Dribbble style)
      night: ["#0f172a", "#1e293b", "#334155", "#854d0e", "#78350f"], // Dark cloudy + warm bronze reflection
    },
    fog: {
      day: ["#1e293b", "#334155", "#475569", "#334155", "#1e293b"], // Slate mist
      night: ["#0f172a", "#1e293b", "#1e293b", "#0f172a", "#0f172a"],
    },
    rain: {
      day: ["#1e293b", "#0c4a6e", "#0284c7", "#0ea5e9", "#00f0ff"], // Ocean blue + cyan highlights
      night: ["#0f172a", "#0c4a6e", "#0284c7", "#0369a1", "#0284c7"],
    },
    snow: {
      day: ["#475569", "#94a3b8", "#cbd5e1", "#38bdf8", "#e2e8f0"], // Ice blue + frost silver
      night: ["#1e293b", "#475569", "#94a3b8", "#cbd5e1", "#1e293b"],
    },
    thunder: {
      day: ["#1e1b4b", "#311042", "#2e1065", "#b45309", "#eab308"], // Storm indigo/purple + lightning gold
      night: ["#020617", "#1e1b4b", "#311042", "#7c2d12", "#ca8a04"],
    },
  },
  'cyberpunk': {
    clear: {
      day: ["#ff007f", "#00f0ff", "#7928ca", "#390099", "#d946ef"],
      night: ["#180325", "#3c005a", "#ff007f", "#00f0ff", "#7928ca"],
    },
    cloudy: {
      day: ["#12051c", "#1b0c22", "#2a1236", "#ea580c", "#ff007f"], // Dark violet + hot cyberpunk amber glow
      night: ["#0d0514", "#12051c", "#1b0c22", "#b45309", "#ec4899"],
    },
    fog: {
      day: ["#1a0920", "#220c2b", "#2c0e38", "#1a0920", "#12051c"],
      night: ["#0d0514", "#100216", "#1a0920", "#0d0514", "#0d0514"],
    },
    rain: {
      day: ["#240046", "#3c096c", "#5a189a", "#00f0ff", "#ff007f"],
      night: ["#10002b", "#240046", "#3c096c", "#5a189a", "#7b2cbf"],
    },
    snow: {
      day: ["#3d0066", "#5c0099", "#7a00cc", "#9900ff", "#b33cff"],
      night: ["#1a0033", "#2b0054", "#430089", "#5c00bd", "#7b1fa2"],
    },
    thunder: {
      day: ["#12051c", "#3c005a", "#5a008c", "#ff007f", "#00f0ff"],
      night: ["#0d001a", "#240033", "#4c0066", "#00f0ff", "#ff007f"],
    },
  },
  'emerald': {
    clear: {
      day: ["#10b981", "#34d399", "#059669", "#0f766e", "#115e59"],
      night: ["#02120b", "#052214", "#0f3c25", "#1b5a3a", "#2d7f54"],
    },
    cloudy: {
      day: ["#0a1811", "#0d1d15", "#12261b", "#ea580c", "#10b981"], // Dark forest + jade amber bottom reflection
      night: ["#040b08", "#081710", "#0c2419", "#b45309", "#059669"],
    },
    fog: {
      day: ["#0c1812", "#101e17", "#16281e", "#0c1812", "#0a1811"],
      night: ["#040b08", "#06120d", "#0c1812", "#040b08", "#040b08"],
    },
    rain: {
      day: ["#0f261b", "#153526", "#1c4a35", "#10b981", "#059669"],
      night: ["#020d09", "#051b12", "#0a2d1e", "#10402b", "#18573b"],
    },
    snow: {
      day: ["#1c4f3b", "#276a50", "#1e523f", "#34d399", "#a7f3d0"],
      night: ["#04120c", "#092218", "#113526", "#1c4f39", "#2c6f50"],
    },
    thunder: {
      day: ["#0a1811", "#0a2b16", "#123c20", "#10b981", "#eab308"],
      night: ["#010c05", "#031c0b", "#093315", "#adff2f", "#00fa9a"],
    },
  },
  'crimson': {
    clear: {
      day: ["#ef4444", "#f59e0b", "#dc2626", "#b91c1c", "#991b1b"],
      night: ["#1a0508", "#2a080d", "#4c0f16", "#721b20", "#a12f30"],
    },
    cloudy: {
      day: ["#1f0c0f", "#260f12", "#351419", "#ea580c", "#ef4444"], // Dark crimson cloudy + sunset orange bottom
      night: ["#0d0506", "#1a0b0d", "#260e12", "#b45309", "#dc2626"],
    },
    fog: {
      day: ["#200e10", "#281416", "#331a1d", "#200e10", "#1f0c0f"],
      night: ["#0d0506", "#120507", "#200e10", "#0d0506", "#0d0506"],
    },
    rain: {
      day: ["#2e1217", "#3c1a20", "#4c262e", "#ef4444", "#dc2626"],
      night: ["#120406", "#20090c", "#2e0f14", "#40181e", "#57252d"],
    },
    snow: {
      day: ["#522329", "#6a323a", "#502228", "#f87171", "#fecaca"],
      night: ["#1c080b", "#2c1015", "#3f1c22", "#552a32", "#703e48"],
    },
    thunder: {
      day: ["#1f0c0f", "#3a0e14", "#52161f", "#ef4444", "#f59e0b"],
      night: ["#140205", "#24050a", "#3b0c13", "#ffd700", "#ff4500"],
    },
  },
};

const SKY_BACKGROUNDS = {
  'deep-space': {
    clear: { day: '#0b1c33', night: '#05070c' },
    cloudy: { day: '#0d1117', night: '#06080a' }, // Charcoal base
    fog: { day: '#11161b', night: '#080a0d' },
    rain: { day: '#0c121c', night: '#06090f' },
    snow: { day: '#161f2d', night: '#0a0d14' },
    thunder: { day: '#090b0e', night: '#040507' },
  },
  'cyberpunk': {
    clear: { day: '#200318', night: '#090310' },
    cloudy: { day: '#0d0414', night: '#06010a' },
    fog: { day: '#12051c', night: '#08020e' },
    rain: { day: '#140024', night: '#090014' },
    snow: { day: '#160226', night: '#0a0118' },
    thunder: { day: '#0d001a', night: '#04000d' },
  },
  'emerald': {
    clear: { day: '#0d1f15', night: '#030f0a' },
    cloudy: { day: '#040a07', night: '#020503' },
    fog: { day: '#060f0b', night: '#030705' },
    rain: { day: '#050f0c', night: '#020706' },
    snow: { day: '#081711', night: '#030a07' },
    thunder: { day: '#030b06', night: '#010503' },
  },
  'crimson': {
    clear: { day: '#280e11', night: '#0b0304' },
    cloudy: { day: '#120406', night: '#070102' },
    fog: { day: '#16070a', night: '#080203' },
    rain: { day: '#140306', night: '#070103' },
    snow: { day: '#1c080b', night: '#090304' },
    thunder: { day: '#0d0103', night: '#040001' },
  },
};

function getSkyBg(condition, isNight, theme) {
  const themeSet = SKY_BACKGROUNDS[theme] || SKY_BACKGROUNDS['deep-space'];
  const set = themeSet[condition] || themeSet.clear;
  return isNight ? set.night : set.day;
}

function getPalette(condition, isNight, theme) {
  const themeSet = PALETTES[theme] || PALETTES['deep-space'];
  const set = themeSet[condition] || themeSet.clear;
  return isNight ? set.night : set.day;
}

const BLOB_LAYOUT = [
  { top: "-15%", left: "-10%", size: 70, duration: 52 },
  { top: "5%", left: "50%", size: 65, duration: 68 },
  { top: "45%", left: "-15%", size: 60, duration: 60 },
  { top: "55%", left: "45%", size: 75, duration: 48 },
  { top: "25%", left: "15%", size: 55, duration: 80 },
];

export default function WatercolorSky({ condition = "clear", isNight = false, theme = "deep-space" }) {
  const colors = useMemo(() => getPalette(condition, isNight, theme), [condition, isNight, theme]);
  const skyBg = useMemo(() => getSkyBg(condition, isNight, theme), [condition, isNight, theme]);

  return (
    <div 
      className="watercolor-sky-wrapper"
      style={{
        background: skyBg,
        transition: 'background 1.5s ease-out'
      }}
    >
      <style>{`
        @keyframes bleedAndRotate {
          0%   { transform: translate(0, 0) scale(1) rotate(0deg); }
          33%  { transform: translate(6%, -4%) scale(1.1) rotate(120deg); }
          66%  { transform: translate(-4%, 5%) scale(0.92) rotate(240deg); }
          100% { transform: translate(0, 0) scale(1) rotate(360deg); }
        }
        @keyframes brushFall {
          0%   { transform: translateY(-20%) rotate(8deg); opacity: 0.45; }
          100% { transform: translateY(120%) rotate(8deg); opacity: 0; }
        }
        
        .watercolor-sky-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          overflow: hidden;
          pointer-events: none;
        }

        .watercolor-blob {
          position: absolute;
          border-radius: 48% 52% 58% 42% / 52% 48% 58% 42%;
          filter: blur(100px); /* Heavy blur for soft, atmospheric gas sheets */
          mix-blend-mode: screen; /* Blends colors cleanly on dark background */
          transition: background 1.5s ease;
        }

        .watercolor-grain {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          mix-blend-mode: overlay;
          background-image: radial-gradient(circle, #fff 1.2px, transparent 1.2px);
          background-size: 4px 4px;
        }
      `}</style>

      {/* Overlapping ink blobs glowing softly in the dark */}
      {BLOB_LAYOUT.map((blob, i) => (
        <div
          key={i}
          className="watercolor-blob"
          style={{
            top: blob.top,
            left: blob.left,
            width: `${blob.size}%`,
            height: `${blob.size}%`,
            background: colors[i % colors.length],
            animation: `bleedAndRotate ${blob.duration}s ease-in-out infinite`,
            animationDelay: `${-i * 8}s`,
            opacity: isNight ? 0.08 : 0.12, /* Muted opacity to keep background dark and premium */
          }}
        />
      ))}

      {/* Paper grain overlay for texture */}
      <div className="watercolor-grain" />

      {/* Rain as soft angled brushstrokes */}
      {condition === "rain" &&
        Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: -50,
              width: 2.5,
              height: 60,
              borderRadius: 4,
              background: `linear-gradient(180deg, transparent, ${colors[i % colors.length]})`,
              filter: "blur(2px)",
              animation: `brushFall ${1.5 + Math.random() * 0.8}s ease-in infinite`,
              animationDelay: `${Math.random() * 2.5}s`,
            }}
          />
        ))}

      {/* Snow as soft round ink dabs drifting down */}
      {condition === "snow" &&
        Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              top: -20,
              width: 8 + Math.random() * 6,
              height: 8 + Math.random() * 6,
              borderRadius: "50%",
              background: colors[i % colors.length],
              filter: "blur(2px)",
              opacity: 0.6,
              animation: `brushFall ${5 + Math.random() * 3}s linear infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
    </div>
  );
}
