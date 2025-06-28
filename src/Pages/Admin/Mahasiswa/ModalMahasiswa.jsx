import Form from "@/Components/Form";
import Input from "@/Components/Input";
import Label from "@/Components/Label";
import Button from "@/Components/Button";

const ModalMahasiswa = ({ isOpen, isEdit, form, onChange, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)] z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{isEdit ? "Edit Mahasiswa" : "Tambah Mahasiswa"}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-500 text-xl">
            &times;
          </button>
        </div>

        <Form onSubmit={onSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="nim">NIM</Label>
            <Input type="text" name="nim" value={form.nim} onChange={onChange} readOnly={isEdit} placeholder="Masukkan NIM" required />
          </div>
          <div>
            <Label htmlFor="name">Nama</Label>
            <Input type="text" name="name" value={form.name} onChange={onChange} placeholder="Masukkan Nama" required />
          </div>

          <div>
            <Label htmlFor="max_sks">Max SKS</Label>
            <Input type="number" name="max_sks" id="max_sks" value={form.max_sks || ""} onChange={onChange} placeholder="Masukkan Max SKS" required />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">{isEdit ? "Update" : "Simpan"}</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ModalMahasiswa;
