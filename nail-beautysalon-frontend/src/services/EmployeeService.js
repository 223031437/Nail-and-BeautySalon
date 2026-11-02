import api from './api';

const BASE_URL = '/employee';

export const getAllEmployees = () => {
    return api.get(`${BASE_URL}/getAll`);
};

export const getEmployeeById = (userId) => {
    return api.get(`${BASE_URL}/read/${encodeURIComponent(userId)}`);
};

export const createEmployee = (employee) => {
    return api.post(`${BASE_URL}/create`, employee);
};

export const updateEmployee = (employee) => {
    return api.put(`${BASE_URL}/update`, employee);
};

export const deleteEmployee = (userId) => {
    return api.delete(`${BASE_URL}/delete/${encodeURIComponent(userId)}`);
};
