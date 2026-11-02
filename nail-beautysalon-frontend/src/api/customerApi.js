import api, { getErrorMessage } from '../services/api';

// These helpers throw an Error whose message is ready to show to the user.
const wrap = async (request) => {
    try {
        const response = await request();
        return response.data;
    } catch (error) {
        throw new Error(getErrorMessage(error));
    }
};

export const getCustomer = (userId) => wrap(() => api.get(`/customer/read/${encodeURIComponent(userId)}`));

export const updateCustomer = (customer) => wrap(() => api.put('/customer/update', customer));

export const deleteCustomer = (userId) => wrap(() => api.delete(`/customer/delete/${encodeURIComponent(userId)}`));
