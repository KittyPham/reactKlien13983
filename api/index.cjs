// Lokasi: /api/index.cjs (Ganti dengan kode baru ini)
const jsonServer = require("json-server");

// Buat servernya
const server = jsonServer.create();

// Buat database langsung di dalam kode (hardcoded)
// Ini menghilangkan kebutuhan untuk membaca file dari folder /db
const router = jsonServer.router({
  // Kita hanya akan tes endpoint 'user' untuk login
  user: [
    {
      id: 1,
      name: "Admin 1",
      email: "admin@gmail.com",
      password: "admin123",
      role: "admin",
      permission: ["dashboard.page", "mahasiswa.page", "rencana-studi.page"],
    },
  ],
  // Tambahkan endpoint lain dengan data kosong agar tidak error 404 nanti
  mahasiswa: [],
  kelas: [],
  mata_kuliah: [],
  chart: {},
});

const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

// Export server agar Vercel bisa menjalankannya
module.exports = server;
