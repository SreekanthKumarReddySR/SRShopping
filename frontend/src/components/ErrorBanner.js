import React from 'react';

/**
 * @param {{message?: string}} props
 */
export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div role="alert" className="error-banner">
      {message}
    </div>
  );
}
