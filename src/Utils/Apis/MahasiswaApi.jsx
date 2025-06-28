import axios from "@/Utils/AxiosInstance";

export const getAllMahasiswa = (params = {}) => {
  return axios.get("/mahasiswa", { params });
};

export const getMahasiswa = (id) => axios.get(`/mahasiswa/${id}`);

// Tambah mahasiswa
export const storeMahasiswa = (data) => axios.post("/mahasiswa", data);

// Update mahasiswa
export const updateMahasiswa = (id, data) => axios.put(`/mahasiswa/${id}`, data);

// Hapus mahasiswa
export const deleteMahasiswa = (id) => axios.delete(`/mahasiswa/${id}`);
