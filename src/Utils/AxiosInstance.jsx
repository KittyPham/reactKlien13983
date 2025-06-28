import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // DIUBAH DI SINI
});

export default axiosInstance;
