import api from '../services/api';

export const appointmentsApi = {
  create: async (appointment) => {
    // Send the real request to Spring Boot
    const response = await api.post('/appointment/book', appointment);
    return response.data;
  },
  getMyAppointments: async () => {
    // We will use this for the dashboard
    const response = await api.get('/appointment/my-appointments');
    return response.data;
  }
};