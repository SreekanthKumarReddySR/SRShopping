import React, { useEffect, useState } from 'react';
import api from '../api';
import './home.css'; // optional
import { useParams } from 'react-router-dom';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const { id } = useParams();


  useEffect(() => {
    fetchProducts();
  }, [id]);

  async function fetchProducts() {
    setLoading(true);
    setErr('');
    try {
      const res = await api.get('/products/price?min=0&max=9999999');
      setProducts(res.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErr(error.response?.data?.message || error.message || 'Failed to load products');
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Products</h1>
        <p className="muted">Browse available products</p>
      </div>

      {err && <div className="error-banner">{err}</div>}
      {loading && <div className="muted">Loading products…</div>}

      <div className="product-grid">
        {products.length === 0 && !loading && <div className="muted">No products found</div>}
        {products.map((p) => (
          <article key={p._id} className="product-card">
            <img className="product-image" src={p.imageLinks?.[0] || '/placeholder.png'} alt={p.title} />
            <div className="product-body">
              <h3 className="product-title">{p.title}</h3>
              <div className="product-meta">
                <span className="price">₹{p.price ?? 0}</span>
                <span className="stock">Stock: {p.stock ?? 0}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
