import { createBooking } from '../services/bookingService';

// Kept so existing imports keep working - this now talks to the real backend.
export const appointmentsApi = {
  create: (appointment) => createBooking(appointment),
};
