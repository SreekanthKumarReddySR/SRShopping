import React from 'react';

export default function Spinner({ size = 32 }) {
  const s = Math.max(16, size);
  const style = { width: s, height: s };

  return (
    <div className="spinner" aria-hidden="true" style={style}>
      <svg viewBox="0 0 50 50" style={{ width: '100%', height: '100%' }}>
        <circle cx="25" cy="25" r="20" strokeWidth="5" fill="none" className="spinner__ring" />
      </svg>
    </div>
  );
}
