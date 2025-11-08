import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Spinner from './Spinner';

export default function PrivateRoute({ children, roleRequired }) {
  const { state } = useContext(AuthContext);

  // ✅ Step 1: While initializing auth (loading true), show spinner
  if (state.loading) {
    return <Spinner />;
  }

  // ✅ Step 2: Wait until auth check finishes — don't redirect yet if still initializing
  if (state.user === null && !state.loading) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Step 3: Check role (if applicable)
  if (roleRequired && state.user && state.user.role !== roleRequired) {
    return (
      <div style={{ padding: 20 }}>
        <h2>403 — Forbidden</h2>
        <p>Your account does not have permission to view this page.</p>
      </div>
    );
  }

  // ✅ Step 4: Render the protected content
  return children;
}
