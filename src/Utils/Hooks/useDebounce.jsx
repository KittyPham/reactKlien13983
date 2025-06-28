import { useState, useEffect } from "react";

/**
 * Custom hook untuk menunda perubahan sebuah nilai.
 * Sangat berguna untuk input search agar tidak memanggil API di setiap ketikan.
 * @param {any} value Nilai yang ingin ditunda perubahannya.
 * @param {number} delay Jeda waktu dalam milidetik (ms).
 * @returns {any} Nilai yang sudah tertunda.
 */
export function useDebounce(value, delay) {
  // State untuk menyimpan nilai yang sudah di-debounce
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Atur sebuah timer yang akan mengupdate nilai `debouncedValue`
      // setelah `delay` waktu berlalu.
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Ini adalah fungsi cleanup yang akan dipanggil setiap kali `useEffect` berjalan lagi
      // (yaitu, setiap kali `value` atau `delay` berubah).
      // Ini akan membersihkan timer yang lama sebelum timer baru dibuat.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Hanya jalankan ulang efek ini jika `value` atau `delay` berubah
  );

  return debouncedValue;
}
