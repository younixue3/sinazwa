import { useQueryClient } from 'react-query';
import { useState } from 'react';
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
  const GetDetailInstallment = useGetDetailInstallment({ id: installmentId });
  const DeleteInstallment = useDeleteInstallment(installmentId);


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
            className="block py-1 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200"
            placeholder="Cari cicilan..."
          />
        </div>
      </div>
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
            {data?.data[0] && (
              <Each
                of={Object.keys(data?.data[0]) || []}
                render={(item: string) => (
                  <th scope="col" className="px-6 py-3">
                    {item}
                  </th>
                )}
              />
            )}
            <th scope="col" className="px-6 py-3">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          <Each
            of={data.data || []}
            render={(item: any) => (
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
                  {item.no}
                </th>
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4">{item.daily_installment}</td>
                <td className="px-6 py-4">{item.remaining_installment}</td>
                <td className="px-6 py-4">{item.remaining_yesterday}</td>
                <td className="px-6 py-4">{item.user}</td>
                <td className="px-6 py-4">
                  <button
                    className={`px-4 py-2 rounded-lg text-white ${
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
                      title={'Kurangi Stock'}
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
    </div>
  );
};
