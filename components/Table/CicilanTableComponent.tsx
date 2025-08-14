import { useQueryClient } from 'react-query';
import { useState, useMemo } from 'react';
import { ModalComponent } from 'components/Modal/ModalComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import { Each } from 'helper/Each';
import useGetDetailInstallment from 'utils/api/cicilan/use-get-detail-installment';
import useDeleteInstallment from 'utils/api/cicilan/use-delete-installment';
import { EditInstallment } from 'components/Pages/cicilan/EditInstallment';
import useGetInstallment from 'utils/api/cicilan/use-get-instalment';
import useUpdateStatusPegawai from 'utils/api/cicilan/use-update-state-pegawai';
import { statusPegawai } from 'utils/api/cicilan/installmentApi';

export const CicilanTableComponent = (data: any) => {
  const queryClient = useQueryClient();
  const [installmentId, setInstallmentId] = useState<string>();
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;
  
  const GetDetailInstallment = useGetDetailInstallment({ id: installmentId });
  const DeleteInstallment = useDeleteInstallment(installmentId);

  // Filter data berdasarkan search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data.data || [];
    
    return (data.data || []).filter((item: any) =>
      item.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.daily_installment.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.remaining_installment.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.remaining_yesterday.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.user?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data.data, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when search changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Adjust current page if it becomes empty after deletion
  const adjustCurrentPage = () => {
    if (currentData.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleStatusPegawai = async (id: number, aktif: number) => {
    try {
      const newAktif = aktif === 1 ? 0 : 1;
      await statusPegawai(id, { aktif: newAktif });
  
      Swal.fire({
        title: 'Berhasil!',
        text: `Status pegawai diubah menjadi ${newAktif ? 'Aktif' : 'Tidak Aktif'}.`,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      });
  
      window.location.reload(); // Reload untuk memastikan perubahan terlihat
    } catch (error) {
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat mengubah status pegawai.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleDelete = async (id: string) => {
    setInstallmentId(id);
    Swal.fire({
      title: 'Apakah anda yakin?',
      text: 'Cicilan yang dipilih akan dihapus!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Tidak',
      confirmButtonText: 'Ya!',
      confirmButtonColor: '#3085d6'
    }).then(async result => {
      if (result.isConfirmed) {
        DeleteInstallment.mutate(undefined, {
          onSuccess: () => {
            queryClient.invalidateQueries(useGetInstallment.keys());
            adjustCurrentPage();
            Swal.fire({
              title: 'Berhasil!',
              text: 'Cicilan berhasil di hapus.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          },
          onError: (err: any) => {
            const errors = err.response.data;
            SwalErrors({ errors });
          }
        });
      }
    });
  };

  const handleEdit = (id: string) => {
    setInstallmentId(id);
    setShowEditModal(true);
  };

  return (
    <div className="overflow-x-auto mt-5">
      {/* Search Section */}
      <div className="pb-4 bg-white dark:bg-gray-900 p-4 transition-colors duration-200">
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-colors duration-200"
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
            value={searchTerm}
            onChange={handleSearchChange}
            className="block py-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200"
            placeholder="Cari cicilan..."
          />
        </div>
        
        {/* Search Results Info */}
        {searchTerm && (
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Menampilkan {filteredData.length} hasil untuk `{searchTerm}`
          </div>
        )}
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 transition-colors duration-200">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-colors duration-200"
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">No</th>
            <th scope="col" className="px-6 py-3">ID</th>
            <th scope="col" className="px-6 py-3">Daily Installment</th>
            <th scope="col" className="px-6 py-3">Remaining Installment</th>
            <th scope="col" className="px-6 py-3">Remaining Yesterday</th>
            <th scope="col" className="px-6 py-3">User</th>
            <th scope="col" className="px-6 py-3">Status Pegawai</th>
            <th scope="col" className="px-6 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <Each
            of={currentData || []}
            render={(item: any, index: number) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                <td className="w-4 p-4">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-${item.id}`}
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-colors duration-200"
                    />
                    <label htmlFor={`checkbox-${item.id}`} className="sr-only">
                      checkbox
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white transition-colors duration-200"
                >
                  {startIndex + index + 1}
                </th>
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4">{item.daily_installment || 0}</td>
                <td className="px-6 py-4">{item.remaining_installment || 0}</td>
                <td className="px-6 py-4">{item.remaining_yesterday || 0}</td>
                <td className="px-6 py-4">{item.user || '-'}</td>
                <td className="px-6 py-4">
                  <button
                    className={`px-4 py-2 rounded-lg text-white transition-colors duration-200 ${
                      item.aktif === 1
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-500 hover:bg-gray-600'
                    }`}
                    onClick={() => handleStatusPegawai(item.id, item.aktif)}
                  >
                    {item.aktif == 1 ? 'Nonaktifkan' : 'Aktifkan'} Pegawai
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      className="btn-danger m-0 hover:opacity-80 transition-opacity duration-200"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>

                    <ModalComponent
                      text={<FontAwesomeIcon icon={faEdit} />}
                      title={'Edit Cicilan'}
                      color={'btn-warning m-0'}
                      onClick={() => {
                        setInstallmentId(item.id);
                      }}
                    >
                      <EditInstallment
                        queryClient={queryClient}
                        GetDetailUser={GetDetailInstallment}
                      />
                    </ModalComponent>
                  </div>
                </td>
              </tr>
            )}
          />
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6 transition-colors duration-200">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{' '}
                <span className="font-medium">{startIndex + 1}</span>
                {' '}to{' '}
                <span className="font-medium">
                  {Math.min(endIndex, filteredData.length)}
                </span>
                {' '}of{' '}
                <span className="font-medium">{filteredData.length}</span>
                {' '}results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Previous
                </button>
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                    disabled={page === '...'}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200 ${
                      page === currentPage
                        ? 'z-10 bg-blue-500 border-blue-500 text-blue-600 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300'
                        : page === '...'
                        ? 'border-gray-300 bg-white text-gray-700 cursor-default dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
