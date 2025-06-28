import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/Components/Card";
import Heading from "@/Components/Heading";
import Button from "@/Components/Button";
import ModalMahasiswa from "@/Pages/Admin/Mahasiswa/ModalMahasiswa";
import TableMahasiswa from "@/Pages/Admin/Mahasiswa/TableMahasiswa";

// Import custom hooks
import { useMahasiswa, useStoreMahasiswa, useUpdateMahasiswa, useDeleteMahasiswa } from "@/Utils/Hooks/useMahasiswa";
import { useKelas } from "@/Utils/Hooks/useKelas";
import { useMataKuliah } from "@/Utils/Hooks/useMataKuliah";

import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const Mahasiswa = () => {
  const navigate = useNavigate();
  const { user } = useAuthStateContext();

  // State untuk filter, sort, dan pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // State untuk input search dan versi debounce-nya
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Mengambil SEMUA data sekaligus dari API
  const { data: semuaMahasiswa = [], isLoading: isLoadingMahasiswa } = useMahasiswa();
  const { data: kelas = [] } = useKelas();
  const { data: mataKuliah = [] } = useMataKuliah();

  // Hook mutasi (tidak berubah)
  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  // Logika untuk filter dan sort di sisi klien (browser)
  const processedMahasiswa = useMemo(() => {
    return semuaMahasiswa
      .filter((m) => m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) || m.nim.includes(debouncedSearch))
      .sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [semuaMahasiswa, debouncedSearch, sortBy, sortOrder]);

  // Kalkulasi total halaman berdasarkan data yang sudah diproses
  const totalCount = processedMahasiswa.length;
  const totalPages = Math.ceil(totalCount / perPage);

  // Logika untuk pagination di sisi klien (mengambil sebagian data)
  const mahasiswaToDisplay = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return processedMahasiswa.slice(start, end);
  }, [processedMahasiswa, page, perPage]);

  // State dan fungsi lain (tidak berubah)
  const [form, setForm] = useState({ id: "", nim: "", name: "", max_sks: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const mataKuliahMap = useMemo(() => new Map(mataKuliah.map((mk) => [mk.id, mk])), [mataKuliah]);

  const getTotalSks = useCallback(
    (mhsId) => {
      return kelas.filter((k) => k.mahasiswa_ids.includes(mhsId)).reduce((acc, currentKelas) => acc + (mataKuliahMap.get(currentKelas.mata_kuliah_id)?.sks || 0), 0);
    },
    [kelas, mataKuliahMap]
  );

  const resetFormAndCloseModal = () => {
    /* ... logika tetap sama ... */
  };
  const handleChange = (e) => {
    /* ... logika tetap sama ... */
  };
  const openAddModal = () => {
    /* ... logika tetap sama ... */
  };
  const openEditModal = (mhs) => {
    /* ... logika tetap sama ... */
  };
  const handleSubmit = (e) => {
    /* ... logika tetap sama, tapi ingat ini hanya berfungsi di lokal ... */
  };
  const handleDelete = (id) => {
    /* ... logika tetap sama, tapi ingat ini hanya berfungsi di lokal ... */
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  // Efek untuk reset halaman jika hasil filter lebih sedikit dari halaman saat ini
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
          Daftar Mahasiswa
        </Heading>
        <Button onClick={openAddModal}>+ Tambah</Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <input type="text" placeholder="Cari nama/NIM..." className="border px-3 py-1 rounded flex-grow" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border px-3 py-1 rounded">
          <option value="name">Sort by Nama</option>
          <option value="nim">Sort by NIM</option>
          <option value="max_sks">Sort by Max SKS</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="border px-3 py-1 rounded">
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      <TableMahasiswa data={mahasiswaToDisplay} isLoading={isLoadingMahasiswa} onEdit={openEditModal} onDelete={handleDelete} onDetail={(nim) => navigate(`/admin/mahasiswa/${nim}`)} getTotalSks={getTotalSks} />

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Halaman {page} dari {totalPages} (Total: {totalCount} mahasiswa)
        </p>
        <div className="flex gap-2">
          <Button onClick={handlePrev} disabled={page === 1}>
            Prev
          </Button>
          <Button onClick={handleNext} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      </div>

      <ModalMahasiswa isOpen={isModalOpen} isEdit={isEdit} form={form} onChange={handleChange} onSubmit={handleSubmit} onClose={resetFormAndCloseModal} />
    </Card>
  );
};

export default Mahasiswa;
