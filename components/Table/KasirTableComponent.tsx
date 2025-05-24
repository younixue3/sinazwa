import { useQueryClient } from 'react-query';
import { useState, useMemo } from 'react';
import { Each } from 'helper/Each';
import useGetSale from 'utils/api/sale/use-get-sale';
import Swal from 'sweetalert2';
import useUpdateSale from 'utils/api/sale/use-update-sale';

export const KasirTableComponent = () => {
  const queryClient = useQueryClient();
  const { data: salesData, isLoading } = useGetSale();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newStock, setNewStock] = useState('');
  // Add a state for the current editing ID
  const [currentEditId, setCurrentEditId] = useState(null);

  // Move the hook to the top level with the current ID
  const updateSaleMutation = useUpdateSale(currentEditId);

  // Mengelompokkan data berdasarkan outlet
  const groupedByOutlet = useMemo(() => {
    if (!salesData) return [];

    // Mengelompokkan data berdasarkan destination_id
    const grouped = salesData.reduce((acc, item) => {
      const key = item.destination_id;
      if (!acc[key]) {
        acc[key] = {
          destination_id: item.destination_id,
          destination: item.destination,
          items: []
        };
      }
      acc[key].items.push(item);
      return acc;
    }, {});

    // Mengubah objek menjadi array
    return Object.values(grouped);
  }, [salesData]);

  // Filter data berdasarkan pencarian
  const filteredData = useMemo(() => {
    if (!groupedByOutlet) return [];

    return groupedByOutlet.filter(group => {
      // Filter berdasarkan nama outlet
      if (
        (group as { destination: string }).destination
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        return true;
      }

      // Filter berdasarkan nama kue di dalam outlet
      return (group as { items: any[] }).items.some(item =>
        item.cakes.some(cake =>
          cake.category_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    });
  }, [groupedByOutlet, searchTerm]);

  // Fungsi untuk membuka modal edit
  // Update handleEditClick to set the current ID
  const handleEditClick = item => {
    setEditingItem(item);
    setCurrentEditId(item.id); // Set the ID for the mutation
    setNewStock(item.cakes_available.toString());
    setIsModalOpen(true);
  };

  // Update handleCloseModal to reset the ID
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setNewStock('');
    setCurrentEditId(null); // Reset the ID
  };

  // Modify handleSaveStock to use the existing mutation
  const handleSaveStock = () => {
    if (!editingItem) return;

    Swal.fire({
      title: 'Konfirmasi',
      text: `Apakah Anda yakin ingin mengubah stok dari ${editingItem.cakes_available} menjadi ${newStock}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Ubah!',
      cancelButtonText: 'Batal'
    }).then(result => {
      if (result.isConfirmed) {
        updateSaleMutation.mutate(
          {
            cakes_available: parseInt(newStock)
          } as any,
          {
            onSuccess: () => {
              queryClient.invalidateQueries(['sales']); // Pastikan key sesuai
              Swal.fire({
                title: 'Berhasil!',
                text: 'Stok berhasil diperbarui',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
              });
              handleCloseModal();
            },
            onError: () => {
              Swal.fire({
                title: 'Error!',
                text: 'Gagal memperbarui stok',
                icon: 'error',
                timer: 1500,
                showConfirmButton: false
              });
            }
          }
        );
      }
    });
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
      <div className="pb-4 bg-white dark:bg-gray-900 p-4">
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search"
            className="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full sm:w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Cari outlet atau kue..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : filteredData.length > 0 ? (
          <Each
            of={filteredData || []}
            render={(outletGroup: any) => (
              <div key={outletGroup.destination_id} className="mb-8">
                <h3 className="text-lg font-semibold bg-gray-100 dark:bg-gray-700 p-3 border-l-4 border-blue-500">
                  Outlet: {outletGroup.destination}
                </h3>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="p-4">
                        <div className="flex items-center">
                          <input
                            id={`checkbox-all-${outletGroup.destination_id}`}
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <label
                            htmlFor={`checkbox-all-${outletGroup.destination_id}`}
                            className="sr-only"
                          >
                            checkbox
                          </label>
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-3">
                        No
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Kue
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Jumlah Stock
                      </th>
                      <th scope="col" className="px-4 py-3">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {outletGroup.items.map((item: any) => (
                      <tr
                        key={item.id}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        <td className="w-4 p-4">
                          <div className="flex items-center">
                            <input
                              id={`checkbox-table-search-${item.no}`}
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              htmlFor={`checkbox-table-search-${item.no}`}
                              className="sr-only"
                            >
                              checkbox
                            </label>
                          </div>
                        </td>
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {item.no}
                        </th>
                        <td className="px-4 py-3">
                          <div className="max-h-20 overflow-y-auto">
                            {item.cakes.map((cake: any, index: number) => (
                              <div key={index} className="mb-1">
                                {cake.category_name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-h-20 overflow-y-auto">
                            <div>{item.cakes_available}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          >
                            Ubah
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          />
        ) : (
          <div className="text-center py-4">Tidak ada data penjualan</div>
        )}
      </div>

      {/* Modal Edit Stock */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-semibold mb-4">Edit Jumlah Stock</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kue:
              </label>
              <div className="text-gray-900">
                {editingItem.cakes.map((cake, index) => (
                  <div key={index}>{cake.category_name}</div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Stock Saat Ini:
              </label>
              <div className="text-gray-900">{editingItem.cakes_available}</div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="newStock"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Jumlah Stock Baru:
              </label>
              <input
                type="number"
                id="newStock"
                value={newStock}
                onChange={e => setNewStock(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Batal
              </button>
              <button
                onClick={handleSaveStock}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
