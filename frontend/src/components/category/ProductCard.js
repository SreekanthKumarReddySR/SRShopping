import React, { useState } from 'react';
import api from '../../api';
import './category.css';

export default function ProductCard({ product, isCustomer }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [quantity, setQuantity] = useState(1);

  const maxStock = product.stock || 0;

  function increment() {
    if (quantity < maxStock) setQuantity(q => q + 1);
  }

  function decrement() {
    if (quantity > 1) setQuantity(q => q - 1);
  }

  async function handleBooking() {
    if (!isCustomer) {
      setMessage('Only customers can book products.');
      return;
    }

    if (quantity <= 0) {
      setMessage('Quantity must be greater than zero.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const res = await api.post(`/bookings/${product._id}`, { quantity });
      setMessage(res.data.message || 'Booking successful!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Booking failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="product-card">
      <img
        src={product.imageLinks?.[0] || '/placeholder.png'}
        alt={product.title}
        className="product-image"
      />
      <div className="product-details">
        <h3>{product.title}</h3>
        <p className="product-brand">{product.brand}</p>
        <p className="product-price">
          ${product.discountPrice || product.price}
        </p>
        <p className="product-stock">
          Stock available: <strong>{maxStock}</strong>
        </p>

        {isCustomer && (
          <>
            <div className="quantity-control">
              <button onClick={decrement} className="qty-btn" disabled={quantity <= 1}>–</button>
              <span className="qty-value">{quantity}</span>
              <button onClick={increment} className="qty-btn" disabled={quantity >= maxStock}>+</button>
            </div>

            <button className="btn" onClick={handleBooking} disabled={loading || maxStock === 0}>
              {loading ? 'Booking...' : 'Book Product'}
            </button>
          </>
        )}

        {message && <p className="success-msg">{message}</p>}
      </div>
    </div>
  );
}
