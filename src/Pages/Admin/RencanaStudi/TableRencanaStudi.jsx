import React from "react";
import Button from "@/Components/Button";
import Select from "@/Components/Select";

export default function TableRencanaStudi({ isLoading, kelas, dosen, mahasiswa, mahasiswaMap, dosenMap, mataKuliahMap, sksInfo, permissions, onAddMahasiswa, onDeleteMahasiswa, onChangeDosen, onDeleteKelas }) {
  if (isLoading) {
    return <div className="text-center p-8">Memuat data kelas...</div>;
  }

  if (kelas.length === 0) {
    return <div className="text-center p-8 bg-gray-50 rounded-lg">Belum ada kelas yang dibuat.</div>;
  }

  return (
    <div className="space-y-6">
      {kelas.map((kls) => {
        const matkul = mataKuliahMap.get(kls.mata_kuliah_id);
        const dosenPengampu = dosenMap.get(kls.dosen_id);

        if (!matkul || !dosenPengampu) {
          return (
            <div key={kls.id} className="text-red-500 p-4">
              Data untuk kelas ID: {kls.id} tidak lengkap.
            </div>
          );
        }

        const mhsInClass = kls.mahasiswa_ids.map((id) => mahasiswaMap.get(id)).filter(Boolean);
        const mhsNotInClass = mahasiswa.filter((m) => !kls.mahasiswa_ids.includes(m.id));

        return (
          <div key={kls.id} className="border rounded-lg shadow-md bg-white overflow-hidden">
            {/* Header Kelas */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-3 border-b bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold">
                  {matkul.name} ({matkul.sks} SKS)
                </h3>
                <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <span>Dosen:</span>
                  {permissions.canUpdate ? (
                    <Select value={dosenPengampu.id} onChange={(e) => onChangeDosen(kls, e.target.value)} size="sm" className="w-auto p-1">
                      {dosen.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} (Sisa SKS: {d.max_sks - (sksInfo.dosenSks[d.id] || 0)})
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <strong>{dosenPengampu.name}</strong>
                  )}
                </div>
              </div>
              {/* Tombol Hapus Kelas hanya jika diizinkan & tidak ada mahasiswa */}
              {permissions.canDelete && mhsInClass.length === 0 && (
                <Button size="sm" variant="danger" onClick={() => onDeleteKelas(kls.id)}>
                  Hapus Kelas
                </Button>
              )}
            </div>

            {/* Tabel Mahasiswa */}
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 text-left font-semibold">No</th>
                    <th className="py-2 px-4 text-left font-semibold">Nama</th>
                    <th className="py-2 px-4 text-left font-semibold">NIM</th>
                    <th className="py-2 px-4 text-center font-semibold">Total SKS</th>
                    {permissions.canUpdate && <th className="py-2 px-4 text-center font-semibold">Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {mhsInClass.length > 0 ? (
                    mhsInClass.map((m, i) => (
                      <tr key={m.id} className="border-t">
                        <td className="py-2 px-4">{i + 1}</td>
                        <td className="py-2 px-4">{m.name}</td>
                        <td className="py-2 px-4">{m.nim}</td>
                        <td className="py-2 px-4 text-center">
                          {sksInfo.mahasiswaSks[m.id] || 0} / {m.max_sks}
                        </td>
                        {permissions.canUpdate && (
                          <td className="py-2 px-4 text-center">
                            <Button size="sm" variant="danger" onClick={() => onDeleteMahasiswa(kls, m.id)}>
                              Hapus
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={permissions.canUpdate ? 5 : 4} className="py-3 px-4 text-center italic text-gray-500">
                        Belum ada mahasiswa di kelas ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Aksi Tambah Mahasiswa */}
            {permissions.canUpdate && (
              <div className="flex items-center gap-2 px-4 py-3 border-t bg-gray-50">
                <Select
                  onChange={(e) => onAddMahasiswa(kls, e.target.value)}
                  value="" // Selalu reset dropdown setelah memilih
                  size="sm"
                  className="flex-grow"
                >
                  <option value="" disabled>
                    -- Tambah Mahasiswa ke Kelas --
                  </option>
                  {mhsNotInClass.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.nim}) - Sisa SKS: {m.max_sks - (sksInfo.mahasiswaSks[m.id] || 0)}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
