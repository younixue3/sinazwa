import TabComponent from 'components/Layout/TabComponent';
import { useEffect, useState } from 'react';
import ProduksiLayout from 'pages/produksi/ProduksiLayout';
import { AUTH_ID } from 'utils/constants/cookies-keys';
import Cookies from 'js-cookie';
import useGetInstallment from 'utils/api/cicilan/use-get-instalment';
import { Each } from 'helper/Each';
import CardComponent from 'components/Card/CardComponent';
import useGetHistoryInstallment from 'utils/api/cicilan/use-get-history-installment';
import Swal from 'sweetalert2';
import { useQueryClient } from 'react-query';
import SwalErrors from 'helper/swal-errors';
import useDeleteHistoryInstallment from 'utils/api/cicilan/use-delete-history-installment';

export default function Produksi() {
  const [id, setId] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [installmentSearchTerm, setInstallmentSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [filteredInstallments, setFilteredInstallments] = useState([]);
  
  const queryClient = useQueryClient();
  const GetInstallment = useGetInstallment();
  const historyInstallments = useGetHistoryInstallment();
  const deleteHistoryMutation = useDeleteHistoryInstallment();

  const activeInstallments = GetInstallment?.data || [];

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
      if (result.isConfirmed) {
        deleteHistoryMutation.mutate(id, {
          onSuccess: () => {
            queryClient.invalidateQueries(useGetHistoryInstallment.keys());
            Swal.fire({
              title: 'Berhasil!',
              text: 'Riwayat produksi berhasil dihapus.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
          },
          onError: (err: any) => {
            const errors = err.response?.data;
            SwalErrors({ errors });
          }
        });
      }
    });
  };
  
  // Filter active installments based on search term
  useEffect(() => {
    if (GetInstallment.data) {
      const filtered = GetInstallment.data.filter(
        (item: any) =>
          item.user &&
          item.user.toLowerCase().includes(installmentSearchTerm.toLowerCase())
      );
      setFilteredInstallments(filtered);
    } else {
      setFilteredInstallments([]);
    }
  }, [installmentSearchTerm, GetInstallment.data]);

  // Filter history installments based on search term
  useEffect(() => {
    if (historyInstallments.data) {
      const filtered = historyInstallments.data.filter(
        (item: any) =>
          (item.category_cake &&
            item.category_cake
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (item.user &&
            item.user.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [searchTerm, historyInstallments.data]);

  return (
    <ProduksiLayout>
      <TabComponent tab={['Produksi', 'Riwayat Produksi']}>
        <section className={'grid gap-5 p-3'}>
          <div className="mx-2 mt-4">
            <input
              type="text"
              placeholder="Cari Cicilan Aktif..."
              className="input input-bordered w-full border-[1px] h-10 rounded-md p-4 border-black"
              value={installmentSearchTerm}
              onChange={e => setInstallmentSearchTerm(e.target.value)}
            />
          </div>
          {!GetInstallment.isLoading && filteredInstallments.length > 0 ? (
            <Each
              of={filteredInstallments}
              render={(item: any) => (
                <CardComponent title={item.user || `ID-${item.id}`}>
                  <div className="p-3">
                    Sisa Target Harian: {item.remaining_installment}
                  </div>
                </CardComponent>
              )}
            />
          ) : (
            <div className="text-center text-gray-500 py-8">
              {GetInstallment.isLoading
                ? 'Memuat data...'
                : 'Tidak ada cicilan aktif.'}
            </div>
          )}
        </section>
        <section className={'grid gap-5 p-3'}>
          <div className="mx-2 mt-4">
            <input
              type="text"
              placeholder="Cari Riwayat Produksi..."
              className="input input-bordered w-full border-[1px] h-10 rounded-md p-4 border-black"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {historyInstallments.isLoading ? (
            <div className="text-center text-gray-500 py-8">Memuat data...</div>
          ) : historyInstallments.data && filteredData.length > 0 ? (
            <Each
              of={filteredData}
              render={(item: any) => (
                <CardComponent title={item.user || 'Nama Tidak Tersedia'}>
                  <div className={'grid grid-cols-1 gap-2 p-3'}>
                    Jenis Kue: {item.category_cake || 'Tidak Tersedia'}
                    <p>Target Harian: {item.total_installment}</p>
                    <p>
                      Tanggal:{' '}
                      {new Date(
                        item.created_at || Date.now()
                      ).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}{' '}
                      waktu{' '}
                      {new Date(
                        item.created_at || Date.now()
                      ).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className={
                      'py-2 w-[90%] my-1 bg-red-500 hover:bg-red-600 text-center text-white mx-4 '
                    }
                  >
                    Hapus
                  </button>
                </CardComponent>
              )}
            />
          ) : (
            <div className="text-center text-gray-500 py-8">
              Tidak ada data riwayat produksi
            </div>
          )}
        </section>
      </TabComponent>
    </ProduksiLayout>
  );
}
