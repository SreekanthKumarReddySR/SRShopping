import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import ErrorBanner from '../components/ErrorBanner';

export default function BookProduct() {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onBook(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await api.post(`/bookings/${productId}`, { quantity });
      setLoading(false);
      setMessage(`${res.data.message}. Remaining stock: ${res.data.remainingStock}`);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Booking failed');
    }
  }

  return (
    <main className="form-card">
      <h1 className="form-title">Book Product</h1>
      <p className="muted">Product ID: <code>{productId}</code></p>

      <ErrorBanner message={error} />
      {message && <div className="success-banner">{message}</div>}

      <form onSubmit={onBook} className="form-grid">
        <label className="form-label">
          Quantity
          <input className="input" type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
        </label>

        <div className="form-actions">
          <button className="btn" disabled={loading}>{loading ? 'Booking…' : 'Book'}</button>
        </div>
      </form>
    </main>
  );
}
