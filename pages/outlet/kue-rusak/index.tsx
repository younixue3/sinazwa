import CardComponent from 'components/Card/CardComponent';
import { CreateKueRusak } from 'components/Pages/delivery/kue-rusak/CreateKueRusak';
import OutletLayout from 'pages/outlet/OutletLayout';
import useGetBrokenCake from 'utils/api/outlet/use-get-broken-cake';
import { useState } from 'react';
import useGetDestination from 'utils/api/destination/use-get-destination';
import Swal from 'sweetalert2';
import useDeleteBrokenCake from 'utils/api/outlet/use-delete-broken-cake';
import SwalErrors from 'helper/swal-errors';

export default function KueRusak() {
  const { data: brokenCakes, isLoading } = useGetBrokenCake();
  const { data: destinations } = useGetDestination({ isSelect: true });
  const [searchDate, setSearchDate] = useState('');
  const [searchDestination, setSearchDestination] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [appliedDate, setAppliedDate] = useState('');
  const [appliedDestination, setAppliedDestination] = useState('');
  const deleteBrokenCake = useDeleteBrokenCake({});

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedDate(searchDate);
    setAppliedDestination(searchDestination);
  };

  const filteredCakes = brokenCakes
    ?.filter(cake => {
      const cakeDate = new Date(cake.date).toISOString().split('T')[0];
      return (
        (appliedDate === '' || cakeDate === appliedDate) &&
        (appliedDestination === '' || cake.destination_id == appliedDestination)
      );
    })
    ?.filter(cake =>
      searchCategory === '' ||
      (cake.category_cake &&
        cake.category_cake.toLowerCase().includes(searchCategory.toLowerCase()))
    );

    const handleDelete = (id) => {
      Swal.fire({
        title: 'Apakah anda yakin?',
        text: 'Riwayat produksi yang dipilih akan dihapus!',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Tidak',
        confirmButtonText: 'Ya!',
        confirmButtonColor: '#3085d6'
      }).then((result) => {
        if(result.isConfirmed){
          deleteBrokenCake.mutate(id, {
            onSuccess: () => {
              Swal.fire({
                title: 'Berhasil!',
                text: 'Riwayat produksi telah dihapus.',
                icon: 'success',
                confirmButtonText: 'Ok'
              }).then(() => {
                window.location.reload();
              });
            },
            onError: (err: any) => {
            const errors = err.response?.data;
            SwalErrors({ errors });
          }
          })
        }
      })
    }

  return (
    <OutletLayout>
      <section className="grid gap-5 p-3">
        <CreateKueRusak />

        <div className="my-2">
          <input
            type="text"
            id="categorySearch"
            placeholder="Masukkan nama kategori kue"
            className="shadow-sm py-4 px-2 fa-border focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            value={searchCategory}
            onChange={e => setSearchCategory(e.target.value)}
          />
        </div>
        <CardComponent>
          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label
                  htmlFor="dateSearch"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cari berdasarkan Tanggal
                </label>
                <input
                  type="date"
                  id="dateSearch"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={searchDate}
                  onChange={e => setSearchDate(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="destinationSearch"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cari berdasarkan Outlet
                </label>
                <select
                  id="destinationSearch"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={searchDestination}
                  onChange={e => setSearchDestination(e.target.value)}
                >
                  <option value="">Semua Outlet</option>
                  {destinations?.map(destination => (
                    <option key={destination.id} value={destination.value}>
                      {destination.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                >
                  Cari
                </button>
              </div>
            </div>
          </form>
        </CardComponent>

        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <CardComponent>
              <div className="flex justify-center items-center min-h-[100px]">
                <div className="animate-pulse text-gray-600">Memuat...</div>
              </div>
            </CardComponent>
          ) : filteredCakes?.length === 0 ? (
            <CardComponent>
              <div className="text-center text-gray-600 py-4">
                Tidak ada data rekap Harian
              </div>
            </CardComponent>
          ) : (
            filteredCakes?.map(cake => (
              <CardComponent key={cake.id}>
                <div className="flex flex-col gap-3 p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm">
                  <div className="text-xl font-bold text-blue-600 border-b pb-2">
                    {cake.destination.name}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">Jenis Kue:</span>
                    <span className="font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                      {cake.category_cake}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">Kue Rusak:</span>
                    <span className="font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                      {cake.qty_broken}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">Kue Mentah:</span>
                    <span className="font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                      {cake.qty_raw_cake}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">Kue Masak:</span>
                    <span className="font-semibold text-green-500 bg-green-50 px-3 py-1 rounded-full">
                      {cake.qty_cooking_cake}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">Tanggal:</span>
                    <span className="text-blue-600 font-medium">
                      {formatDate(cake.date)}
                    </span>
                  </div>
                  {cake.description && (
                    <div className="text-sm bg-gray-50 p-3 rounded-lg mt-1">
                      <span className="font-semibold text-gray-700">
                        Keterangan:
                      </span>
                      <span className="text-gray-600 ml-1">
                        {cake.description}
                      </span>
                    </div>
                  )}
                  <button onClick={() => handleDelete(cake.id)}
                   className='bg-red-500 hover:bg-red600 w-[95%] mx-auto text-white hover:text-gray-300'>Hapus</button>
                </div>
              </CardComponent>
            ))
          )}
        </div>
      </section>
    </OutletLayout>
  );
}
