import React, { useState, useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ErrorBanner from '../components/ErrorBanner';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const defaultToken = searchParams.get('token') || '';
  const [token, setToken] = useState(defaultToken);
  const { verify } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Automatically verify if token exists in URL
  useEffect(() => {
    if (defaultToken) {
      handleVerify(defaultToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Handles both manual and auto verification
  async function handleVerify(tok) {
    if (!tok || tok.trim() === '') {
      setError('Verification code is required.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Call verify() from AuthContext (GET /user/verify/:token)
      const res = await verify(tok);
      setLoading(false);

      // Backend returns either plain text or JSON { message }
      const msg =
        typeof res.data === 'string'
          ? res.data
          : res.data?.message || 'Email verified successfully!';

      setMessage(msg + ' Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          'Verification failed'
      );
    }
  }

  return (
    <main className="form-card">
      <h1 className="form-title">Verify Your Account</h1>

      {email && (
        <p className="muted">
          A 6-digit verification code has been sent to <strong>{email}</strong>.
        </p>
      )}

      <ErrorBanner message={error} />
      {message && <div className="success-banner">{message}</div>}

      {/* Manual input form (only if token not in URL) */}
      {!defaultToken && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify(token);
          }}
          className="form-grid"
        >
          <label className="form-label">
            Verification Code
            <input
              className="input"
              placeholder="Enter 6-digit code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </label>

          <div className="form-actions">
            <button className="btn" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify'}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate('/register')}
            >
              Create account
            </button>
          </div>
        </form>
      )}

      {/* Auto-verification spinner text */}
      {defaultToken && loading && (
        <p className="muted">Verifying your account, please wait…</p>
      )}
    </main>
  );
}
