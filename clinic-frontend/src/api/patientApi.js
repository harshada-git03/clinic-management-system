import api from "./axiosInstance";
export const getMyPatientProfile = () => api.get("/patients/me");
export const updateMyPatientProfile = (data) => api.put("/patients/me", data);