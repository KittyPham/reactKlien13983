import axios from "@/Utils/AxiosInstance";
// DIUBAH: Panggil file .json secara langsung
export const getAllChartData = () => axios.get("/chart.json");
