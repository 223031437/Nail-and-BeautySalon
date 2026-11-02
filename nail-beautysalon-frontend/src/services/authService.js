import api from './api';

export const authService = {
    login: async (username, password) => {
        const response = await api.post('/auth/login', { username, password });
        return response.data; // { token, role, userId, name, email }
    },

    registerCustomer: async (customerData) => {
        const response = await api.post('/auth/register-customer', customerData);
        return response.data;
    },

    // Admin only - the backend rejects this for anyone else.
    registerEmployee: async (employeeData) => {
        const response = await api.post('/auth/register-employee', employeeData);
        return response.data;
    },
};
