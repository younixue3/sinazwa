import { useQueryClient } from 'react-query';
import { useState } from 'react';
import { ModalComponent } from 'components/Modal/ModalComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faMoneyBill,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import { Each } from 'helper/Each';
import useUpdateStatusPayment from 'utils/api/inventaris/use-update-status-payment';
import useGetNota from 'utils/api/inventaris/use-get-nota';
import useDeleteNota from 'utils/api/inventaris/use-delete-nota';

export const ComeItemsTableComponent = (data: any) => {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const UpdateStatusPayment = useUpdateStatusPayment();
  const DeleteNota = useDeleteNota(selectedId);

  const handleDelete = async id => {
    setSelectedId(id);
    Swal.fire({
      title: 'Apakah anda yakin?',
      text: 'Nota yang dipilih akan dihapus!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Tidak',
      confirmButtonText: 'Ya!',
      confirmButtonColor: '#3085d6'
    }).then(async result => {
      if (result.isConfirmed) {
        let payload: any;
        DeleteNota.mutate(payload, {
          onSuccess: () => {
            queryClient.invalidateQueries(useGetNota.keys());
            Swal.fire({
              title: 'Berhasil!',
              text: 'Nota berhasil di hapus.',
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

  const handleUpdatePayment = async id => {
    setSelectedId(id);
    Swal.fire({
      title: 'Update Status Pembayaran?',
      text: 'Status pembayaran akan diubah menjadi lunas!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya!',
      confirmButtonColor: '#3085d6'
    }).then(async result => {
      if (result.isConfirmed) {
        const payload: any = {
          code_notas: [selectedId],
          status_payment: 'SUDAH DIBAYAR'
        };
        UpdateStatusPayment.mutate(payload, {
          onSuccess: () => {
            queryClient.invalidateQueries(useGetNota.keys());
            Swal.fire({
              title: 'Berhasil!',
              text: 'Status pembayaran berhasil diupdate.',
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

  const filteredData =
    data.data?.filter((item: any) => {
      const searchFields = [
        item.code_nota,
        item.inventory.name,
        item.description,
        item.status_payment
      ];
      return searchFields.some(field =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }) || [];

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
            placeholder="Search for items"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
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
            <th scope="col" className="px-6 py-3">
              No
            </th>
            <th scope="col" className="px-6 py-3">
              Code Nota
            </th>
            <th scope="col" className="px-6 py-3">
              Expired Date
            </th>
            <th scope="col" className="px-6 py-3">
              Items
            </th>
            <th scope="col" className="px-6 py-3">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3">
              Status Payment
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              #
            </th>
          </tr>
        </thead>
        <tbody>
          <Each
            of={filteredData}
            render={(item: any, index: number) => (
              <>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-table-search-1"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-colors duration-200"
                      />
                      <label
                        htmlFor="checkbox-table-search-1"
                        className="sr-only"
                      >
                        checkbox
                      </label>
                    </div>
                  </td>
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{item.code_nota}</td>
                  <td className="px-6 py-4">{item.expired_date}</td>
                  <td className="px-6 py-4">{item.inventory.name}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        item.status_payment === 'SUDAH DIBAYAR'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      } transition-colors duration-200`}
                    >
                      {item.status_payment}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.description || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {item.status_payment !== 'SUDAH DIBAYAR' && (
                        <button
                          className="btn-warning m-0 hover:opacity-80 transition-opacity duration-200"
                          onClick={() => handleUpdatePayment(item.id)}
                          disabled={item.status_payment === 'SUDAH DIBAYAR'}
                        >
                          <FontAwesomeIcon icon={faMoneyBill} />
                        </button>
                      )}
                      <button
                        className="btn-danger m-0 hover:opacity-80 transition-opacity duration-200"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              </>
            )}
          />
        </tbody>
      </table>
    </div>
  );
};