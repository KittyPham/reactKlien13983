// src/Utils/Hooks/useMahasiswa.jsx (Versi Diperbarui untuk Vercel Static)

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// Pastikan fungsi API yang diimpor sudah diubah untuk memanggil .json
import { getAllMahasiswa, storeMahasiswa, updateMahasiswa, deleteMahasiswa } from "@/Utils/Apis/MahasiswaApi.jsx";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

// DIUBAH: Hook ini tidak lagi menerima parameter 'query'.
export const useMahasiswa = () =>
  useQuery({
    // DIUBAH: Query key sekarang statis karena kita selalu fetch data yang sama.
    queryKey: ["mahasiswa"],

    // DIUBAH: Panggil getAllMahasiswa tanpa parameter.
    queryFn: getAllMahasiswa,

    // DIUBAH: Kembalikan langsung array datanya. Tidak ada lagi 'total' dari header.
    select: (res) => res?.data ?? [],
  });

// --- Hook Mutasi (Tidak Perlu Diubah) ---
// Hook ini akan tetap berfungsi saat development lokal dengan `npm run serve`.
// Saat di-deploy di Vercel, mereka akan gagal karena tidak ada server untuk memproses POST/PUT/DELETE, dan itu normal untuk metode ini.

export const useStoreMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: storeMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Mahasiswa berhasil ditambahkan!");
    },
    onError: () => toastError("Gagal menambahkan mahasiswa."),
  });
};

export const useUpdateMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMahasiswa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Mahasiswa berhasil diperbarui!");
    },
    onError: () => toastError("Gagal memperbarui mahasiswa."),
  });
};

export const useDeleteMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMahasiswa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
      toastSuccess("Mahasiswa berhasil dihapus!");
    },
    onError: () => toastError("Gagal menghapus mahasiswa."),
  });
};
