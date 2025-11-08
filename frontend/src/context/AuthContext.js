import React, { createContext, useReducer, useCallback } from 'react';
import api, { setAuthToken } from '../api';
import { authReducer, initialState } from './authReducer';
import { getToken, removeToken } from '../utils/token';

export const AuthContext = createContext();

/**
 * AuthProvider handles:
 * - Register, Verify, Login, Logout
 * - Auth state persistence via localStorage token
 */
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ✅ Initialize Auth on app load
  const initializeAuth = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    const token = getToken();
    if (token) {
      setAuthToken(token);
      try {
        const res = await api.get('/user/me');
        dispatch({
          type: 'INITIALIZE',
          payload: { user: res.data.user, token },
        });
      } catch (err) {
        console.error('Token expired or invalid:', err);
        setAuthToken(null);
        removeToken();
        dispatch({
          type: 'INITIALIZE',
          payload: { user: null, token: null },
        });
      }
    } else {
      dispatch({
        type: 'INITIALIZE',
        payload: { user: null, token: null },
      });
    }

    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  // ✅ Register new user
  const register = useCallback(async ({ name, email, password, role }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.post('/user/register', { name, email, password, role });
      return res.data; // May contain verificationToken
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // ✅ Verify user (GET fallback to POST)
  const verify = useCallback(async (token) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Try GET first; fallback to POST
      const response = await api
        .get(`/user/verify/${encodeURIComponent(token)}`)
        .catch(() => api.post('/user/verify', { token }));

      const localToken = localStorage.getItem('token');
      return { ok: true, token: localToken, data: response?.data };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // ✅ Login existing user
  const login = useCallback(async ({ email, password }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.post('/user/login', { email, password });
      console.log(res);
      // token is stored by axios interceptor
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found after login');

      setAuthToken(token);

      // Get user profile after login
      const me = await api.get('/user/me');
      dispatch({
        type: 'LOGIN',
        payload: { user: me.data.user, token },
      });

      return { user: me.data.user };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // ✅ Logout user
  const logout = useCallback(() => {
    setAuthToken(null);
    removeToken();
    dispatch({ type: 'LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        initializeAuth,
        register,
        verify,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
