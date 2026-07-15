import api from "./axiosInstance";
export const getAllMedicines = () => api.get("/medicines");
export const createMedicine = (data) => api.post("/medicines", data);