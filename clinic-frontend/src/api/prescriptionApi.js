import api from "./axiosInstance";
export const createPrescription = (data) => api.post("/prescriptions", data);
export const getMyPrescriptions = () => api.get("/prescriptions/me");
export const getPrescriptionByAppointment = (appointmentId) =>
  api.get(`/prescriptions/appointment/${appointmentId}`);