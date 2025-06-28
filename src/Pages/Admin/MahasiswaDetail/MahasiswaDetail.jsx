import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "@/Components/Card";
import Heading from "@/Components/Heading";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllKelas } from "@/Utils/Apis/KelasApi";
import { getAllMataKuliah } from "@/Utils/Apis/MataKuliahApi";

const MahasiswaDetail = () => {
  const { nim } = useParams();

  const [mahasiswa, setMahasiswa] = useState(null);
  const [krs, setKrs] = useState([]);
  const [totalSks, setTotalSks] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!nim) return;

      try {
        setIsLoading(true);
        setError(null);

        const [resMahasiswa, resKelas, resMataKuliah] = await Promise.all([getAllMahasiswa(), getAllKelas(), getAllMataKuliah()]);

        const mahasiswaData = resMahasiswa.data.find((m) => m.nim === nim);
        if (!mahasiswaData) {
          throw new Error("Data mahasiswa dengan NIM tersebut tidak ditemukan.");
        }
        setMahasiswa(mahasiswaData);

        const mataKuliahMap = new Map(resMataKuliah.data.map((mk) => [mk.id, mk]));

        const kelasDiambil = resKelas.data.filter((k) => k.mahasiswa_ids.includes(mahasiswaData.id));

        const krsDetail = kelasDiambil.map((k) => mataKuliahMap.get(k.mata_kuliah_id)).filter(Boolean);
        setKrs(krsDetail);

        const sksTerhitung = krsDetail.reduce((acc, mk) => acc + (mk.sks || 0), 0);
        setTotalSks(sksTerhitung);
      } catch (err) {
        setError(err.message);
        console.error("Gagal mengambil detail mahasiswa:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [nim]);

  if (isLoading) {
    return <p className="p-4 text-center">Memuat data mahasiswa...</p>;
  }

  if (error) {
    return <p className="p-4 text-center text-red-600">{error}</p>;
  }

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">
        Detail Mahasiswa
      </Heading>
      <table className="table-auto text-sm w-full mb-6">
        <tbody>
          <tr className="border-b">
            <td className="py-2 px-4 font-medium bg-gray-50 w-1/3">NIM</td>
            <td className="py-2 px-4">{mahasiswa.nim}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 font-medium bg-gray-50">Nama</td>
            <td className="py-2 px-4">{mahasiswa.name}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4 font-medium bg-gray-50">Maksimal SKS</td>
            <td className="py-2 px-4">{mahasiswa.max_sks}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium bg-gray-50">Total SKS Diambil</td>
            <td className="py-2 px-4">{totalSks}</td>
          </tr>
        </tbody>
      </table>

      <Heading as="h3" className="mb-2 text-left text-base font-semibold">
        Mata Kuliah yang Diambil
      </Heading>
      {krs.length > 0 ? (
        <ul className="list-disc list-inside space-y-1 text-sm pl-4">
          {krs.map((mk) => (
            <li key={mk.id}>
              {mk.name} ({mk.sks} SKS)
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 italic">Belum ada mata kuliah yang diambil.</p>
      )}
    </Card>
  );
};

export default MahasiswaDetail;
