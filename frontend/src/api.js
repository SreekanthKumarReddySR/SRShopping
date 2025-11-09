import axios from 'axios';
import { getToken, setToken } from './utils/token';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const api = axios.create({ baseURL: API_BASE, timeout: 15000 });



// Helper to normalize token string from header value
function parseBearer(headerValue) {
    if (!headerValue) return null;
    const parts = headerValue.split(' ');
    return parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : headerValue;
}


// Attach token to outgoing requests
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        // duplicate for backends/tests that expect this header
        config.headers['auth-token'] = token;
    }
    return config;
});


// Response interceptor: auto-extract token if server sends one in headers or body
api.interceptors.response.use(
    (response) => {
        try {
            const headers = response.headers || {};
            // check headers in order
            const tokenFromAuthHeader = parseBearer(headers.authorization || headers['Authorization']);
            const tokenFromAuthToken = headers['auth-token'] || headers['x-auth-token'];
            const body = response.data || {};
            const tokenFromBody = body.token || body.accessToken || body.verificationToken;


            const finalToken = tokenFromAuthHeader || tokenFromAuthToken || tokenFromBody || null;
            if (finalToken) {
                setToken(finalToken);
            }
        } catch (err) {
            // ignore extraction errors
        }
        return response;
    },
    (error) => {
        // bubble up
        return Promise.reject(error);
    }
);


export function setAuthToken(token) {
    if (token) {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        api.defaults.headers.common['auth-token'] = token;
    } else {
        delete api.defaults.headers.common['Authorization'];
        delete api.defaults.headers.common['auth-token'];
        localStorage.removeItem('token');
    }
}


export default api;