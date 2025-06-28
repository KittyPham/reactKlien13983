import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { getAllKelas, updateKelas, deleteKelas, storeKelas } from "@/Utils/Apis/KelasApi";
import { getAllDosen } from "@/Utils/Apis/DosenApi";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllMataKuliah } from "@/Utils/Apis/MataKuliahApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { confirmDelete } from "@/Utils/Helpers/SwalHelpers";
import TableRencanaStudi from "@/Pages/Admin/RencanaStudi/TableRencanaStudi";
import ModalRencanaStudi from "@/Pages/Admin/RencanaStudi/ModalRencanaStudi";
import Button from "@/Components/Button";
import Card from "@/Components/Card";

const RencanaStudi = () => {
  const { user } = useAuthStateContext();

  const permissions = useMemo(
    () => ({
      canCreate: user?.permission?.includes("rencana-studi.create"),
      canUpdate: user?.permission?.includes("rencana-studi.update"),
      canDelete: user?.permission?.includes("rencana-studi.delete"),
    }),
    [user]
  );

  const [kelas, setKelas] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ mata_kuliah_id: "", dosen_id: "" });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [resKelas, resDosen, resMahasiswa, resMataKuliah] = await Promise.all([getAllKelas(), getAllDosen(), getAllMahasiswa(), getAllMataKuliah()]);
      setKelas(resKelas.data);
      setDosen(resDosen.data);
      setMahasiswa(resMahasiswa.data);
      setMataKuliah(resMataKuliah.data);
    } catch (error) {
      toastError("Gagal memuat data dari server.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const mahasiswaMap = useMemo(() => new Map(mahasiswa.map((m) => [m.id, m])), [mahasiswa]);
  const dosenMap = useMemo(() => new Map(dosen.map((d) => [d.id, d])), [dosen]);
  const mataKuliahMap = useMemo(() => new Map(mataKuliah.map((mk) => [mk.id, mk])), [mataKuliah]);

  const sksInfo = useMemo(() => {
    const mahasiswaSks = {};
    const dosenSks = {};

    mahasiswa.forEach((m) => (mahasiswaSks[m.id] = 0));
    dosen.forEach((d) => (dosenSks[d.id] = 0));

    kelas.forEach((k) => {
      const mk = mataKuliahMap.get(k.mata_kuliah_id);
      if (!mk) return;

      if (dosenSks[k.dosen_id] !== undefined) dosenSks[k.dosen_id] += mk.sks;
      k.mahasiswa_ids.forEach((mhsId) => {
        if (mahasiswaSks[mhsId] !== undefined) mahasiswaSks[mhsId] += mk.sks;
      });
    });
    return { mahasiswaSks, dosenSks };
  }, [kelas, mahasiswa, dosen, mataKuliahMap]);

  const mataKuliahBelumAdaKelas = useMemo(() => {
    const mataKuliahSudahDipakai = new Set(kelas.map((k) => k.mata_kuliah_id));
    return mataKuliah.filter((m) => !mataKuliahSudahDipakai.has(m.id));
  }, [kelas, mataKuliah]);

  const handleAddMahasiswa = useCallback(
    async (kelasItem, mhsId) => {
      if (!mhsId) return;
      const matkul = mataKuliahMap.get(kelasItem.mata_kuliah_id);
      const mhs = mahasiswaMap.get(mhsId);
      if (!matkul || !mhs) return toastError("Data tidak valid");
      if (kelasItem.mahasiswa_ids.includes(mhsId)) return toastError("Mahasiswa sudah terdaftar.");

      const currentMhsSks = sksInfo.mahasiswaSks[mhsId] || 0;
      if (currentMhsSks + matkul.sks > mhs.max_sks) {
        return toastError(`SKS Mahasiswa akan melebihi batas (${mhs.max_sks} SKS)`);
      }

      const updatedKelas = { ...kelasItem, mahasiswa_ids: [...kelasItem.mahasiswa_ids, mhsId] };
      try {
        await updateKelas(kelasItem.id, updatedKelas);
        setKelas((prevKelas) => prevKelas.map((k) => (k.id === kelasItem.id ? updatedKelas : k)));
        toastSuccess("Mahasiswa berhasil ditambahkan");
      } catch (error) {
        toastError("Gagal menambahkan mahasiswa");
      }
    },
    [sksInfo, mataKuliahMap, mahasiswaMap]
  );

  const handleDeleteMahasiswa = useCallback(async (kelasItem, mhsId) => {
    const updatedKelas = { ...kelasItem, mahasiswa_ids: kelasItem.mahasiswa_ids.filter((id) => id !== mhsId) };
    try {
      await updateKelas(kelasItem.id, updatedKelas);
      setKelas((prevKelas) => prevKelas.map((k) => (k.id === kelasItem.id ? updatedKelas : k)));
      toastSuccess("Mahasiswa berhasil dihapus dari kelas");
    } catch (error) {
      toastError("Gagal menghapus mahasiswa");
    }
  }, []);

  const handleChangeDosen = useCallback(
    async (kelasItem, dsnId) => {
      if (!dsnId || kelasItem.dosen_id === dsnId) return;
      const dosenBaru = dosenMap.get(dsnId);
      const kelasSks = mataKuliahMap.get(kelasItem.mata_kuliah_id)?.sks || 0;
      if (!dosenBaru) return toastError("Data Dosen tidak valid");

      const sksDosenSaatIni = sksInfo.dosenSks[dsnId] || 0;
      if (sksDosenSaatIni + kelasSks > dosenBaru.max_sks) {
        return toastError(`Beban SKS Dosen ${dosenBaru.name} akan melebihi batas.`);
      }

      try {
        const updatedKelas = { ...kelasItem, dosen_id: dsnId };
        await updateKelas(kelasItem.id, updatedKelas);
        setKelas((prev) => prev.map((k) => (k.id === kelasItem.id ? updatedKelas : k)));
        toastSuccess("Dosen pengampu berhasil diperbarui");
      } catch (error) {
        toastError("Gagal memperbarui dosen.");
      }
    },
    [sksInfo, dosenMap, mataKuliahMap]
  );

  const handleDeleteKelas = useCallback(async (kelasId) => {
    confirmDelete(async () => {
      try {
        await deleteKelas(kelasId);
        setKelas((prev) => prev.filter((k) => k.id !== kelasId));
        toastSuccess("Kelas berhasil dihapus");
      } catch (error) {
        toastError("Gagal menghapus kelas");
      }
    });
  }, []);

  const openAddModal = () => {
    setForm({ mata_kuliah_id: "", dosen_id: "" });
    setIsModalOpen(true);
  };
  const handleModalChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleModalSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!form.mata_kuliah_id || !form.dosen_id) return toastError("Harap lengkapi semua field");
      try {
        const res = await storeKelas({ ...form, mahasiswa_ids: [] });
        // DIUBAH: Update state lokal
        setKelas((prev) => [...prev, res.data]);
        setIsModalOpen(false);
        toastSuccess("Kelas baru berhasil ditambahkan");
      } catch (error) {
        toastError("Gagal menambahkan kelas baru");
      }
    },
    [form]
  );

  return (
    <>
      <div className="p-4 md:p-8">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Manajemen Rencana Studi</h1>
            {permissions.canCreate && <Button onClick={openAddModal}>+ Tambah Kelas</Button>}
          </div>

          <TableRencanaStudi
            isLoading={isLoading}
            kelas={kelas}
            dosen={dosen}
            mahasiswa={mahasiswa}
            mahasiswaMap={mahasiswaMap}
            dosenMap={dosenMap}
            mataKuliahMap={mataKuliahMap}
            sksInfo={sksInfo}
            permissions={permissions}
            onAddMahasiswa={handleAddMahasiswa}
            onDeleteMahasiswa={handleDeleteMahasiswa}
            onChangeDosen={handleChangeDosen}
            onDeleteKelas={handleDeleteKelas}
          />
        </Card>
      </div>

      <ModalRencanaStudi isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} form={form} onChange={handleModalChange} dosenList={dosen} mataKuliahList={mataKuliahBelumAdaKelas} />
    </>
  );
};

export default RencanaStudi;
