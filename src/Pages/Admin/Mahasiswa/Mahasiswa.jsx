import { useState, useMemo, useCallback } from "react";
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
  const [search, setSearch] = useState("");

  const {
    data: result,
    isLoading: isLoadingMahasiswa,
    isPreviousData,
  } = useMahasiswa({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: perPage,
  });

  const mahasiswa = result?.data ?? [];
  const totalCount = result?.total ?? 0;
  const totalPages = Math.ceil(totalCount / perPage);

  const { data: kelas = [] } = useKelas();
  const { data: mataKuliah = [] } = useMataKuliah();
  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

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
    setForm({ id: "", nim: "", name: "", max_sks: 0 });
    setIsModalOpen(false);
    setIsEdit(false);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAddModal = () => {
    resetFormAndCloseModal();
    setIsModalOpen(true);
  };

  const openEditModal = (mhs) => {
    setForm({ id: mhs.id, nim: mhs.nim, name: mhs.name, max_sks: mhs.max_sks });
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nim || !form.name || !form.max_sks) {
      toastError("NIM, Nama, dan Max SKS wajib diisi");
      return;
    }
    const payload = { nim: form.nim, name: form.name, max_sks: Number(form.max_sks) };
    if (isEdit) {
      confirmUpdate(() => {
        update({ id: form.id, data: payload });
        resetFormAndCloseModal();
      });
    } else {
      if (mahasiswa.find((m) => m.nim === form.nim)) {
        toastError("NIM sudah terdaftar!");
        return;
      }
      store(payload);
      resetFormAndCloseModal();
    }
  };

  const handleDelete = (id) => {
    confirmDelete(() => remove(id));
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">
          Daftar Mahasiswa
        </Heading>
        {user.permission.includes("mahasiswa.create") && <Button onClick={openAddModal}>+ Tambah</Button>}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari nama/NIM..."
          className="border px-3 py-1 rounded flex-grow"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-1 rounded"
        >
          <option value="name">Sort by Nama</option>
          <option value="nim">Sort by NIM</option>
          <option value="max_sks">Sort by Max SKS</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-1 rounded"
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      {user.permission.includes("mahasiswa.read") && (
        <TableMahasiswa data={mahasiswa} isLoading={isLoadingMahasiswa} onEdit={openEditModal} onDelete={handleDelete} onDetail={(nim) => navigate(`/admin/mahasiswa/${nim}`)} getTotalSks={getTotalSks} />
      )}

      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Halaman {page} dari {totalPages} (Total: {totalCount} mahasiswa)
        </p>
        <div className="flex gap-2">
          <Button onClick={handlePrev} disabled={page === 1}>
            Prev
          </Button>
          <Button onClick={handleNext} disabled={page === totalPages || isPreviousData}>
            Next
          </Button>
        </div>
      </div>

      <ModalMahasiswa isOpen={isModalOpen} isEdit={isEdit} form={form} onChange={handleChange} onSubmit={handleSubmit} onClose={resetFormAndCloseModal} />
    </Card>
  );
};

export default Mahasiswa;
