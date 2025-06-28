import React from "react";
import Button from "@/Components/Button";
import Select from "@/Components/Select";

const ModalRencanaStudi = ({ isOpen, onClose, onSubmit, onChange, form, dosenList, mataKuliahList }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      {/* Modal Dialog */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Tambah Kelas Baru</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none" aria-label="Close modal">
            &times;
          </button>
        </div>

        {/* Modal Body & Form */}
        <form onSubmit={onSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="mata_kuliah_id" className="block text-sm font-medium text-gray-700 mb-1">
              Mata Kuliah
            </label>
            <Select id="mata_kuliah_id" name="mata_kuliah_id" value={form.mata_kuliah_id} onChange={onChange} required>
              <option value="" disabled>
                -- Pilih Mata Kuliah --
              </option>
              {mataKuliahList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.sks} SKS)
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label htmlFor="dosen_id" className="block text-sm font-medium text-gray-700 mb-1">
              Dosen Pengampu
            </label>
            <Select id="dosen_id" name="dosen_id" value={form.dosen_id} onChange={onChange} required>
              <option value="" disabled>
                -- Pilih Dosen --
              </option>
              {dosenList.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Modal Footer (Actions) */}
          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRencanaStudi;
