// src/Utils/Apis/AuthApi.js
import axios from "@/Utils/AxiosInstance";

// Fungsi login sekarang hanya mengambil semua data user.
// Logika verifikasi email dan password akan dipindahkan ke komponen Login/AuthContext.
export const getAllUsers = () => axios.get("/user.json");

// Fungsi login yang lama tidak akan berfungsi, ganti dengan ini.
export const login = async (email, password) => {
  // 1. Ambil semua user
  const res = await getAllUsers();
  const users = res.data;

  // 2. Cari user berdasarkan email
  const user = users.find((u) => u.email === email);

  // 3. Lakukan validasi
  if (!user) throw new Error("Email tidak ditemukan");
  if (user.password !== password) throw new Error("Password salah");

  return user;
};
