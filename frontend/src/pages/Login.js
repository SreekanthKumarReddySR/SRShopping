import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ErrorBanner from '../components/ErrorBanner';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function update(field, val) {
    setForm(prev => ({ ...prev, [field]: val }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Login failed');
    }
  }

  return (
    <main className="form-card">
      <h1 className="form-title">Sign in</h1>
      <p className="muted">Use your email and password to sign in.</p>

      <ErrorBanner message={error} />

      <form className="form-grid" onSubmit={onSubmit}>
        <label className="form-label">
          Email
          <input required type="email" className="input" value={form.email} onChange={(e) => update('email', e.target.value)} />
        </label>

        <label className="form-label">
          Password
          <input required type="password" className="input" value={form.password} onChange={(e) => update('password', e.target.value)} />
        </label>

        <div className="form-actions">
          <button className="btn" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/register')}>Create account</button>
        </div>
      </form>
    </main>
  );
}
