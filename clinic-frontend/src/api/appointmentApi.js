import api from "./axiosInstance";
export const bookAppointment = (data) => api.post("/appointments", data);
export const getMyAppointments = () => api.get("/appointments/me");
export const getAllAppointments = () => api.get("/appointments");
export const updateAppointmentStatus = (id, data) => api.put(`/appointments/${id}/status`, data);