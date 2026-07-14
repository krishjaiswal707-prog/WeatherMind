import React from 'react';

export default function UnitToggle({ unit, setUnit }) {
  return (
    <div className="unit-toggle-container">
      <span className="toggle-label-text">°C</span>
      <button
        onClick={() => setUnit(unit === "C" ? "F" : "C")}
        className="unit-toggle-relative-btn"
        aria-label="Toggle temperature unit"
      >
        <span
          className="unit-toggle-thumb-span"
          style={{ transform: unit === "F" ? "translateX(28px)" : "translateX(0)" }}
        />
      </button>
      <span className="toggle-label-text">°F</span>
    </div>
  );
}
