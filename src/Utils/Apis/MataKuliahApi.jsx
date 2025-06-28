import axios from "@/Utils/AxiosInstance";

// Ambil semua mata kuliah
export const getAllMataKuliah = () => axios.get("/mata_kuliah");

// Ambil satu mata kuliah
export const getMataKuliah = (id) => axios.get(`/mata_kuliah/${id}`);

// Tambah mata kuliah
export const storeMataKuliah = (data) => axios.post("/mata_kuliah", data);

// Update mata kuliah
export const updateMataKuliah = (id, data) => axios.put(`/mata_kuliah/${id}`, data);

// Hapus mata kuliah
export const deleteMataKuliah = (id) => axios.delete(`/mata_kuliah/${id}`);
