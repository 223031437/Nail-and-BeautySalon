import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach token to every outgoing request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: a 401 means the login has expired or is missing -> back to the login page.
// (A 403 only means "you are logged in but not allowed to do this", so we stay on the page and show the message.)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const isAuthCall = error.config?.url?.startsWith('/auth/');
        if (status === 401 && !isAuthCall) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

/** A readable message for any failed request (backend message, or a hint that the server is down). */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.response?.status === 403) return 'You do not have permission to do that.';
    if (error?.response?.status === 401) return 'Please log in again.';
    if (error?.request && !error?.response) {
        return 'Cannot reach the server. Please check that the backend is running and try again.';
    }
    return error?.message || fallback;
}

/** Field-level errors from the backend: { fieldName: "message" } (nested names like address.city become city). */
export function getFieldErrors(error) {
    const raw = error?.response?.data?.errors;
    if (!raw || typeof raw !== 'object') return {};
    const out = {};
    Object.entries(raw).forEach(([key, value]) => {
        out[key.split('.').pop()] = value;
    });
    return out;
}

export default api;
