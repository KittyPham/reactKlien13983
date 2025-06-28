// src/Utils/Apis/MahasiswaApi.jsx
import axios from "@/Utils/AxiosInstance";

// DIUBAH: Panggil file .json secara langsung
export const getAllMahasiswa = () => axios.get("/mahasiswa.json");

// Fungsi lain biarkan saja, akan berfungsi di lokal tapi tidak di Vercel
export const getMahasiswa = (id) => axios.get(`/mahasiswa/${id}`);
export const storeMahasiswa = (data) => axios.post("/mahasiswa", data);
export const updateMahasiswa = (id, data) => axios.put(`/mahasiswa/${id}`, data);
export const deleteMahasiswa = (id) => axios.delete(`/mahasiswa/${id}`);
