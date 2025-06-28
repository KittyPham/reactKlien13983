import Card from "@/Components/Card";
import Button from "@/Components/Button";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const TableMahasiswa = ({ data = [], onEdit, onDelete, onDetail, getTotalSks }) => {
  const { user } = useAuthStateContext();

  if (!data || data.length === 0) {
    return (
      <Card>
        <p className="p-4 text-center text-gray-500">Belum ada data mahasiswa.</p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">NIM</th>
              <th className="py-2 px-4 text-left">Nama</th>
              <th className="py-2 px-4 text-center">SKS Diambil / Maksimal</th>
              <th className="py-2 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((mhs, index) => {
              const totalSks = getTotalSks(mhs.id);

              return (
                <tr key={mhs.nim} className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                  <td className="py-2 px-4">{mhs.nim}</td>
                  <td className="py-2 px-4">{mhs.name}</td>
                  <td className="py-2 px-4 text-center">
                    {totalSks} / {mhs.max_sks || 0}
                  </td>
                  <td className="py-2 px-4 text-center space-x-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onDetail(mhs.nim)}>
                      Detail
                    </Button>

                    {user.permission.includes("mahasiswa.update") && (
                      <Button size="sm" variant="warning" onClick={() => onEdit(mhs)}>
                        Edit
                      </Button>
                    )}

                    {user.permission.includes("mahasiswa.delete") && (
                      <Button size="sm" variant="danger" onClick={() => onDelete(mhs.id)}>
                        Hapus
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TableMahasiswa;
