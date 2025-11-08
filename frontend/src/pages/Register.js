// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';
// import ErrorBanner from '../components/ErrorBanner';

// export default function Register() {
//   const { register } = useContext(AuthContext);
//   const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
//   const [error, setError] = useState('');
//   const [successNote, setSuccessNote] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   function update(field, value) {
//     setForm(prev => ({ ...prev, [field]: value }));
//   }

// //   async function onSubmit(e) {
// //   e.preventDefault();
// //   setError('');
// //   setSuccessNote('');
// //   setLoading(true);
// //   try {
// //     const res = await register(form);
// //     setLoading(false);

// //     // Always redirect to verify page after registration
// //     const verificationToken = res?.verificationToken || null;
// //     if (verificationToken) {
// //       navigate(`/verify?token=${encodeURIComponent(verificationToken)}&email=${encodeURIComponent(form.email)}`);
// //     } else {
// //       // If backend sends no token in body, just redirect to verify page
// //       navigate(`/verify?email=${encodeURIComponent(form.email)}`);
// //     }
// //   } catch (err) {
// //     setLoading(false);
// //     setError(err.response?.data?.message || err.message || 'Registration failed');
// //   }
// // }

// async function onSubmit(e) {
//   e.preventDefault();
//   setError('');
//   setSuccessNote('');
//   setLoading(true);

//   try {
//     const res = await register(form);
//     const verificationToken = res?.verificationToken || null;

//     if (verificationToken) {
//       navigate(
//         `/verify?token=${encodeURIComponent(verificationToken)}&email=${encodeURIComponent(form.email)}`
//       );
//     } else {
//       navigate(`/verify?email=${encodeURIComponent(form.email)}`);
//     }
//   } catch (err) {
//     console.error('Registration error:', err);
//     setError(err.response?.data?.message || err.message || 'Registration failed');
//   } finally {
//     setLoading(false);
//   }
// }



//   return (
//     <main className="form-card">
//       <h1 className="form-title">Create account</h1>
//       <p className="muted">Register as a customer or seller.</p>

//       <ErrorBanner message={error} />

//       {successNote && <div className="success-banner">{successNote}</div>}

//       <form onSubmit={onSubmit} className="form-grid" noValidate>
//         <label className="form-label">
//           Name
//           <input required className="input" value={form.name} onChange={e => update('name', e.target.value)} />
//         </label>

//         <label className="form-label">
//           Email
//           <input required type="email" className="input" value={form.email} onChange={e => update('email', e.target.value)} />
//         </label>

//         <label className="form-label">
//           Password
//           <input required type="password" minLength={6} className="input" value={form.password} onChange={e => update('password', e.target.value)} />
//         </label>

//         <label className="form-label">
//           Role
//           <select className="input" value={form.role} onChange={e => update('role', e.target.value)}>
//             <option value="customer">Customer</option>
//             <option value="seller">Seller</option>
//           </select>
//         </label>

//         <div className="form-actions">
//           <button className="btn" disabled={loading}>
//             {loading ? 'Registering…' : 'Register'}
//           </button>
//           <button type="button" className="btn btn--ghost" onClick={() => navigate('/login')}>Have an account? Login</button>
//         </div>
//       </form>
//     </main>
//   );
// }


import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ErrorBanner from '../components/ErrorBanner';

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [successNote, setSuccessNote] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessNote('');
    setLoading(true);
    let isMounted = true; // ✅ prevents setState on unmount

    try {
      const res = await register(form);
      if (!isMounted) return;

      const verificationToken =
        res?.verificationToken || res?.data?.verificationToken || null;

      if (verificationToken) {
        navigate(
          `/verify?token=${encodeURIComponent(verificationToken)}&email=${encodeURIComponent(form.email)}`
        );
      } else {
        navigate(`/verify?email=${encodeURIComponent(form.email)}`);
      }
    } catch (err) {
      if (!isMounted) return;
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      if (isMounted) setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }

  return (
    <main className="form-card">
      <h1 className="form-title">Create account</h1>
      <p className="muted">Register as a customer or seller.</p>

      <ErrorBanner message={error} />
      {successNote && <div className="success-banner">{successNote}</div>}

      <form onSubmit={onSubmit} className="form-grid" noValidate>
        <label className="form-label">
          Name
          <input required className="input" value={form.name} onChange={e => update('name', e.target.value)} />
        </label>

        <label className="form-label">
          Email
          <input required type="email" className="input" value={form.email} onChange={e => update('email', e.target.value)} />
        </label>

        <label className="form-label">
          Password
          <input required type="password" minLength={6} className="input" value={form.password} onChange={e => update('password', e.target.value)} />
        </label>

        <label className="form-label">
          Role
          <select className="input" value={form.role} onChange={e => update('role', e.target.value)}>
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
          </select>
        </label>

        <div className="form-actions">
          <button className="btn" disabled={loading}>
            {loading ? 'Registering…' : 'Register'}
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => navigate('/login')}>
            Have an account? Login
          </button>
        </div>
      </form>
    </main>
  );
}
