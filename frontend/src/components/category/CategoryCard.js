import React from 'react';
import { useNavigate } from 'react-router-dom';
import './category.css';

export default function CategoryCard({ category }) {
  const navigate = useNavigate();

  return (
    <div className="category-card" onClick={() => navigate(`/categories/${category._id}`)}>
      <img
        src={category.image || '/placeholder.png'}
        alt={category.name}
        className="category-image"
      />
      <p className="category-name">{category.name}</p>
    </div>
  );
}
