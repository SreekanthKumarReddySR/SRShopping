import React, { useState } from 'react';
import api from '../api';
import ErrorBanner from '../components/ErrorBanner';

export default function SellerAddProduct() {
  const [form, setForm] = useState({
    title: '',
    imageLinks: '',
    category: '',
    price: '',
    discountPrice: '',
    description: '',
    stock: 0,
    brand: '',
    sku: '',
    tags: '',
    isFeatured: false
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, val) {
    setForm(prev => ({ ...prev, [field]: val }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        imageLinks: form.imageLinks ? form.imageLinks.split(',').map(s => s.trim()) : [],
        price: Number(form.price) || 0,
        discountPrice: Number(form.discountPrice) || 0,
        stock: Number(form.stock) || 0,
        tags: form.tags ? form.tags.split(',').map(s => s.trim()) : [],
      };

      await api.post('/products/add-product', payload); // ✅ removed unused 'res'
      setLoading(false);
      setMessage('Product created successfully.');

      // Optionally clear form after creation
      setForm({
        title: '',
        imageLinks: '',
        category: '',
        price: '',
        discountPrice: '',
        description: '',
        stock: 0,
        deliveryType: '',
        brand: '',
        sku: '',
        tags: '',
        isFeatured: false
      });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Create product failed');
    }
  }

  return (
    <main className="form-card">
      <h1 className="form-title">Add New Product</h1>

      <ErrorBanner message={error} />
      {message && <div className="success-banner">{message}</div>}

      <form onSubmit={onSubmit} className="form-grid">
        <label className="form-label">
          Title
          <input className="input" required value={form.title} onChange={e => update('title', e.target.value)} />
        </label>

        <label className="form-label">
          Image URLs (comma separated)
          <input className="input" value={form.imageLinks} onChange={e => update('imageLinks', e.target.value)} />
        </label>

        <label className="form-label">
          Category ID
          <input className="input" required value={form.category} onChange={e => update('category', e.target.value)} />
        </label>

        <label className="form-label">
          Price
          <input className="input" type="number" value={form.price} onChange={e => update('price', e.target.value)} />
        </label>

        <label className="form-label">
          Stock
          <input className="input" type="number" value={form.stock} onChange={e => update('stock', e.target.value)} />
        </label>

        <label className="form-label">
          Description
          <textarea className="input" rows={4} value={form.description} onChange={e => update('description', e.target.value)} />
        </label>

        <div className="form-actions">
          <button className="btn" disabled={loading}>
            {loading ? 'Creating…' : 'Create product'}
          </button>
        </div>
      </form>
    </main>
  );
}
