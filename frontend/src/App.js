import React, { useEffect, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Verify from './pages/Verify';
import Login from './pages/Login';
import Home from './pages/Home';
import SellerAddProduct from './pages/SellerAddProduct';
import BookProduct from './pages/BookProduct';
import PrivateRoute from './components/PrivateRoute';
import './styles.css';
import CategoriesList from './pages/categories/CategoriesList';
import CategoryProducts from './pages/categories/CategoryProducts';
import ProfileDashboard from './pages/profile/ProfileDashboard';

export default function App() {
  const { initializeAuth, state } = useContext(AuthContext);

  // Initialize user authentication on app load
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // ✅ Prevent Navbar flicker during auth initialization
  if (state.loading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.2rem',
          fontWeight: '500',
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/categories/:id" element={<CategoryProducts />} />
        
        {/* Protected routes */}
        <Route
          path="/seller/add-product"
          element={
            <PrivateRoute roleRequired="seller">
              <SellerAddProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/book/:productId"
          element={
            <PrivateRoute roleRequired="customer">
              <BookProduct />
            </PrivateRoute>
          }
        />
        <Route 
          path="/profile" 
          element={
          <PrivateRoute>
            <ProfileDashboard />
            </PrivateRoute>
          } 
        />

      </Routes>
    </>
  );
}
