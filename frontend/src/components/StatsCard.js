import React from 'react';
import './StatsCard.css';

const icons = {
  grid: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  clock: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  zap: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  check: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
};

const colors = {
  accent: { bg: 'rgba(108,99,255,0.12)', icon: '#6c63ff', border: 'rgba(108,99,255,0.2)' },
  amber:  { bg: 'rgba(245,158,11,0.12)', icon: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
  purple: { bg: 'rgba(139,133,255,0.12)', icon: '#8b85ff', border: 'rgba(139,133,255,0.2)' },
  green:  { bg: 'rgba(67,233,123,0.12)', icon: '#43e97b', border: 'rgba(67,233,123,0.2)' },
};

export default function StatsCard({ label, value, color, icon }) {
  const c = colors[color] || colors.accent;
  return (
    <div className="stats-card">
      <div className="stats-icon" style={{ background: c.bg, color: c.icon, border: `1px solid ${c.border}` }}>
        {icons[icon]}
      </div>
      <div className="stats-body">
        <span className="stats-value">{value}</span>
        <span className="stats-label">{label}</span>
      </div>
    </div>
  );
}
