import api from './api';

// ---------- time slots + bookings ----------
export const getAvailability = (date) =>
    api.get('/appointment/availability', { params: { date } }).then((r) => r.data);

export const createBooking = (payload) =>
    api.post('/appointment/create', payload).then((r) => r.data);

export const getMyBookings = () => api.get('/appointment/mine').then((r) => r.data);

export const getAllBookings = () => api.get('/appointment/getAll').then((r) => r.data);

export const rescheduleBooking = (appointmentId, dateTime) =>
    api.put(`/appointment/${encodeURIComponent(appointmentId)}/reschedule`, { dateTime }).then((r) => r.data);

export const cancelBooking = (appointmentId) =>
    api.put(`/appointment/${encodeURIComponent(appointmentId)}/cancel`).then((r) => r.data);

export const setBookingStatus = (appointmentId, status) =>
    api.put(`/appointment/${encodeURIComponent(appointmentId)}/status`, { status }).then((r) => r.data);

// ---------- payments (staff) ----------
export const getAllPayments = () => api.get('/payment/getAll').then((r) => r.data);

export const setPaymentStatus = (paymentId, status) =>
    api.put(`/payment/${encodeURIComponent(paymentId)}/status`, { status }).then((r) => r.data);

// ---------- contact-page messages ----------
export const submitInquiry = (payload) => api.post('/inquiry', payload).then((r) => r.data);

export const getAllInquiries = () => api.get('/inquiry/getAll').then((r) => r.data);

export const respondToInquiry = (id, response, sendEmail) =>
    api.put(`/inquiry/${id}/respond`, { response, sendEmail }).then((r) => r.data);

export const deleteInquiry = (id) => api.delete(`/inquiry/${id}`).then((r) => r.data);

// ---------- customers (staff) ----------
export const getAllCustomers = () => api.get('/customer/getAll').then((r) => r.data);

// ---------- services ----------
export const getServices = () => api.get('/service/getAll').then((r) => r.data);
