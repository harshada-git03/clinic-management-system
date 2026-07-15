import api from "./axiosInstance";
export const getAllDoctors = () => api.get("/doctors");
export const updateMyDoctorProfile = (data) => api.put("/doctors/me", data);