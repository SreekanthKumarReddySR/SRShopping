

import React, { useContext, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { state, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Log route change once per path change (for debugging)
  useEffect(() => {
    console.log('📍 Route changed to:', location.pathname);
  }, [location.pathname]); // 👈 depend only on pathname

  // ✅ Memoize logout handler so it doesn’t recreate on each render
  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  return (
    <header className="nav">
      <div className="nav__brand">
        <Link to="/" className="nav__logo">SRShopping</Link>
      </div>

      <nav className="nav__links">
        <Link className="nav__link" to="/">Home</Link>
        <Link className="nav__link" to="/categories">Categories</Link>

        {/* 🔹 Show Login/Register if user is not logged in */}
        {!state.user ? (
          <>
            <Link className="nav__link nav__cta" to="/login">Login</Link>
            <Link className="nav__link" to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="nav__user" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
              {state.user.name} <small>({state.user.role})</small>
            </span>
            {state.user.role === 'seller' && (
              <Link className="nav__link" to="/seller/add-product">Add Product</Link>
            )}

            

            <button className="nav__btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}
