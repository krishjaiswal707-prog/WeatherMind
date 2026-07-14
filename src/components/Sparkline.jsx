import React from 'react';

export default function Sparkline({ hourlyTemps }) {
  if (!hourlyTemps || hourlyTemps.length === 0) return null;
  
  const max = Math.max(...hourlyTemps);
  const min = Math.min(...hourlyTemps);
  const range = max - min || 1;
  
  const points = hourlyTemps.map((t, i) => 
    `${(i / (hourlyTemps.length - 1)) * 100},${40 - ((t - min) / range) * 32 - 4}`
  ).join(" ");
  
  return (
    <svg viewBox="0 0 100 40" className="sparkline-polyline-svg" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="sparkline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />    {/* Blue */}
          <stop offset="50%" stopColor="#a855f7" />   {/* Purple */}
          <stop offset="100%" stopColor="#f97316" />  {/* Orange */}
        </linearGradient>
      </defs>
      <polyline 
        points={points} 
        fill="none" 
        stroke="url(#sparkline-grad)" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
