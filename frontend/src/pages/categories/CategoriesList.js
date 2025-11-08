import React, { useEffect, useState } from 'react';
import api from '../../api';
import CategoryCard from '../../components/category/CategoryCard';
import './categories.css';

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/categories');
        setCategories(res.data);
      } catch (err) {
        setError('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <main className="category-container">
      <h1 className="page-title">Shop by Category</h1>
      <div className="category-grid">
        {categories.map(cat => (
          <CategoryCard key={cat._id} category={cat} />
        ))}
      </div>
    </main>
  );
}
