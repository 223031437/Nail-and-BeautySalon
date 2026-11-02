// Small validation helpers shared by every form. Each returns an error message, or '' when the value is fine.
export const required = (value, label) =>
    value === undefined || value === null || String(value).trim() === '' ? `${label} is required` : '';

export const validEmail = (value) => {
    if (!String(value || '').trim()) return 'Email is required';
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).trim()) ? '' : 'Please enter a valid email address';
};

export const validPhone = (value) => {
    if (!String(value || '').trim()) return 'Phone number is required';
    const cleaned = String(value).replace(/[\s\-()]/g, '');
    return /^\+?[0-9]{9,15}$/.test(cleaned) ? '' : 'Please enter a valid phone number (9 to 15 digits)';
};

export const validPassword = (value) => {
    if (!value) return 'Password is required';
    return value.length >= 8 ? '' : 'Password must be at least 8 characters';
};

export const hasErrors = (errors) => Object.values(errors).some(Boolean);

export const formatDateTime = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleString('en-ZA', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
};

export const formatMoney = (value) => `R${Number(value || 0).toFixed(2)}`;

/** Today as YYYY-MM-DD in the browser's local time (used as the minimum of date inputs). */
export const todayString = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
};
