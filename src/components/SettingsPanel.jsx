import React from 'react';
import { Sparkles, Trash2, RefreshCw, Thermometer } from 'lucide-react';
import UnitToggle from './UnitToggle';

const THEMES = [
  {
    id: 'deep-space',
    name: 'Deep Space',
    desc: 'The original premium dark telemetry aesthetic.',
    colors: ['#0d0f12', '#140d26', '#ff7b00', '#3b82f6'],
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    desc: 'Vivid magenta glows and neon violet skies.',
    colors: ['#090514', '#ff007f', '#00f0ff', '#7928ca'],
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    desc: 'Organic dark forest gradients and mint green highlights.',
    colors: ['#040d08', '#10b981', '#34d399', '#0f3c25'],
  },
  {
    id: 'crimson',
    name: 'Sunset Crimson',
    desc: 'Fiery amber accents on deep burgundy skies.',
    colors: ['#0e0407', '#ef4444', '#f59e0b', '#4c0f16'],
  },
];

export default function SettingsPanel({ theme, setTheme, unit, toggleUnit, onClearHistory }) {
  return (
    <div className="glass-panel settings-panel-container">
      <div className="settings-header">
        <Sparkles className="settings-header-icon" style={{ color: 'var(--theme-accent)' }} />
        <div>
          <h2 className="settings-title">Meteorological System Settings</h2>
          <p className="settings-subtitle">Customize the dashboard interface, units, and themes.</p>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Measurement Standard</h3>
        <p className="section-description">Choose how temperature, wind speed, and precipitation values are formatted.</p>
        <div className="settings-control-row">
          <div className="control-info">
            <span className="control-label">Temperature & Telemetry Units</span>
            <p className="control-sublabel">Switch between Celsius (°C) and Fahrenheit (°F) scales globally.</p>
          </div>
          <UnitToggle unit={unit} setUnit={(val) => {
            if (val !== unit) toggleUnit();
          }} />
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Visual Themes</h3>
        <p className="section-description">Select a curated color palette for the watercolor skies, glows, and accents.</p>
        <div className="theme-grid">
          {THEMES.map((t) => {
            const isActive = theme === t.id;
            return (
              <div
                key={t.id}
                className={`theme-card ${isActive ? 'active' : ''}`}
                onClick={() => setTheme(t.id)}
              >
                <div className="theme-card-header">
                  <span className="theme-name">{t.name}</span>
                  {isActive && <span className="theme-active-badge">Active</span>}
                </div>
                <p className="theme-desc">{t.desc}</p>
                <div className="theme-color-preview">
                  {t.colors.map((c, idx) => (
                    <span
                      key={idx}
                      className="theme-color-dot"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">System Actions</h3>
        <p className="section-description">Maintenance operations for local storage cache and query history.</p>
        <div className="settings-control-row">
          <div>
            <span className="control-label text-warning">Clear Search History</span>
            <p className="control-sublabel">Wipe your recently searched meteorological locations.</p>
          </div>
          <button className="settings-danger-btn" onClick={onClearHistory}>
            <Trash2 size={16} />
            <span>Clear Cache</span>
          </button>
        </div>
      </div>
    </div>
  );
}
