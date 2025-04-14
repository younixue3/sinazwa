import { useMutation, useQueryClient } from "react-query";
import Swal from "sweetalert2";
import { statusPegawai } from "utils/api/cicilan/installmentApi";

const PegawaiList = ({ pegawai }: { pegawai: { id: number; aktif: number }[] }) => {
  const queryClient = useQueryClient();

  // Mutation untuk update status pegawai
  const { mutateAsync } = useMutation({
    mutationFn: ({ id, aktif }: { id: number; aktif: number }) => statusPegawai(id, aktif),
    onSuccess: () => {
      queryClient.invalidateQueries(["installments"]); // Refresh data setelah update
    },
  });

  // Fungsi untuk menangani klik tombol
  const handleStatusPegawai = async (id: number, aktif: number) => {
    try {
      await mutateAsync({ id, aktif });

      await Swal.fire({
        title: "Berhasil!",
        text: `Status pegawai telah diubah menjadi ${aktif === 1 ? "Tidak Aktif" : "Aktif"}.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error updating status pegawai:", error);

      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat mengubah status pegawai.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      {pegawai.map((item) => (
        <div key={item.id} className="flex items-center gap-4 p-2 border-b">
          <span>ID Pegawai: {item.id}</span>
          <button
            className={`px-4 py-2 rounded ${item.aktif === 1 ? "bg-green-500" : "bg-red-500"} text-white`}
            onClick={() => handleStatusPegawai(item.id, item.aktif)}
          >
            {item.aktif === 1 ? "Nonaktifkan" : "Aktifkan"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default PegawaiList;