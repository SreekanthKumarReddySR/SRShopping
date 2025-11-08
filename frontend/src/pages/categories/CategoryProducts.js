import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import ProductCard from '../../components/category/ProductCard';
import { AuthContext } from '../../context/AuthContext';
import './categories.css';

export default function CategoryProducts() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { state } = useContext(AuthContext);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get(`/products/category/${id}`);
        setProducts(res.data);
      } catch (err) {
        setError('Failed to load products for this category');
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [id]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <main className="category-products">
      <h1 className="page-title">Products</h1>
      <div className="products-grid">
        {products.map(prod => (
          <ProductCard key={prod._id} product={prod} isCustomer={state.user?.role === 'customer'} />
        ))}
      </div>
    </main>
  );
}
