import InventarisLayout from 'pages/inventaris/InventarisLayout';
import TabComponent from 'components/Layout/TabComponent';
import CardComponent from 'components/Card/CardComponent';
import { Each } from 'helper/Each';
import ButtonComponent from 'components/Button/ButtonComponent';
import { ModalComponent } from 'components/Modal/ModalComponent';
import useGetBarangs from 'utils/api/inventaris/use-get-barangs';
import { useState, useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { CreateInventory } from 'components/Pages/inventory/CreateInventory';
import useGetDetailBarang from 'utils/api/inventaris/use-get-detail-barang';
import { EditInventory } from 'components/Pages/inventory/EditInventory';
import Swal from 'sweetalert2';
import useDeleteBarang from 'utils/api/inventaris/use-delete-barang';
import SwalErrors from 'helper/swal-errors';
import useGetHistoryBarang from 'utils/api/inventaris/use-get-history-barang';
import { InputInventaris } from 'components/Pages/inventory/InputInventaris';

export default function Inventaris() {
  const queryClient = useQueryClient();

  const [barangId, setBarangId] = useState<number | null>(null);
  const [searchTermInventaris, setSearchTermInventaris] = useState('');
  const [searchTermRiwayat, setSearchTermRiwayat] = useState('');

  const GetBarangs = useGetBarangs({ isSelect: false });
  const GetDetailBarang = useGetDetailBarang({ id: barangId });
  const DeleteBarang = useDeleteBarang(barangId);
  const riwayatBarangs = useGetHistoryBarang();

  const filteredInventaris = GetBarangs.data?.filter(item =>
    item.name.toLowerCase().includes(searchTermInventaris.toLowerCase())
  ) ?? [];

  const filteredRiwayat = riwayatBarangs.data?.filter(item =>
    item.inventory?.name.toLowerCase().includes(searchTermRiwayat.toLowerCase())
  ) ?? [];

  const handleDelete = async (id: number) => {
    setBarangId(id);
    Swal.fire({
      title: 'Apakah anda yakin?',
      text: 'Barang yang dipilih akan dihapus!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Tidak',
      confirmButtonText: 'Ya!',
      confirmButtonColor: '#3085d6',
    }).then(async result => {
      if (result.isConfirmed) {
        DeleteBarang.mutate(null, {
          onSuccess: () => {
            queryClient.invalidateQueries(useGetBarangs.keys());
            Swal.fire({
              title: 'Berhasil!',
              text: 'Barang berhasil dihapus.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          onError: (err: any) => {
            const errors = err.response.data;
            SwalErrors({ errors });
          },
        });
      }
    });
  };

  return (
    <InventarisLayout>
      <TabComponent tab={['Inventaris', 'Riwayat Inventaris']}>
        {/* Tab: Inventaris */}
        <section className={'grid gap-5 p-3'}>
          <InputInventaris />

          <div className="mb-3">
            <input
              type="text"
              placeholder="Cari barang..."
              className="input input-bordered w-full border-[1px] h-10 rounded-md p-4 border-black"
              value={searchTermInventaris}
              onChange={(e) => setSearchTermInventaris(e.target.value)}
            />
          </div>

          {!GetBarangs.isLoading && (
            <Each
              of={filteredInventaris}
              render={(item: any) => (
                <CardComponent key={item.id} title={item.name}>
                  <div className={'p-3'}>
                    Stock: {item.qty}
                    <div className={'grid grid-cols-2 gap-4 mt-5'}>
                      <ModalComponent
                        text={'Edit'}
                        color={'btn-primary w-full'}
                        title={'Tambah Stock'}
                        onClick={() => {
                          setBarangId(item.id);
                        }}
                      >
                        <EditInventory
                          queryClient={queryClient}
                          GetDetailBarang={GetDetailBarang}
                        />
                      </ModalComponent>
                      <ButtonComponent
                        text={'Hapus'}
                        color={'btn-danger w-full'}
                        onClick={() => handleDelete(item.id)}
                      />
                    </div>
                  </div>
                </CardComponent>
              )}
            />
          )}
        </section>

        {/* Tab: Riwayat Inventaris */}
        <section className={'grid gap-5 p-3'}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Cari riwayat barang..."
              className="input input-bordered w-full border-[1px] h-10 rounded-md p-4 border-black"
              value={searchTermRiwayat}
              onChange={(e) => setSearchTermRiwayat(e.target.value)}
            />
          </div>

          <Each
            of={filteredRiwayat}
            render={(item: any, index) => (
              <CardComponent key={index} title={item.inventory.name}>
                <div
                  className={`p-3 ${item.tipe_riwayat == 2 ? 'bg-success' : 'bg-warning'}`}
                >
                  {item.tipe_riwayat == 2 ? 'Keluar' : 'Masuk'}: {item.qty_item}
                  <div className="mt-2 text-sm">
                    Tanggal: {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardComponent>
            )}
          />
        </section>
      </TabComponent>
    </InventarisLayout>
  );
}