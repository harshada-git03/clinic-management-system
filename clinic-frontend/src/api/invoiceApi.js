import api from "./axiosInstance";
export const generateInvoice = (appointmentId) => api.post(`/invoices/generate/${appointmentId}`);
export const markInvoicePaid = (id) => api.put(`/invoices/${id}/pay`);
export const getMyInvoices = () => api.get("/invoices/me");