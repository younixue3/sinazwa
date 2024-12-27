import InventarisLayout from 'pages/inventaris/InventarisLayout';
import TabComponent from 'components/Layout/TabComponent';
import CardComponent from 'components/Card/CardComponent';
import { Each } from 'helper/Each';
import ButtonComponent from 'components/Button/ButtonComponent';
import { ModalComponent } from 'components/Modal/ModalComponent';
import useGetBarangs from 'utils/api/inventaris/use-get-barangs';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { CreateInventory } from 'components/Pages/inventory/CreateInventory';
import useGetDetailBarang from 'utils/api/inventaris/use-get-detail-barang';
import { EditInventory } from 'components/Pages/inventory/EditInventory';
import Swal from 'sweetalert2';
import useDeleteBarang from 'utils/api/inventaris/use-delete-barang';
import SwalErrors from 'helper/swal-errors';
import useGetHistoryBarang from 'utils/api/inventaris/use-get-history-barang';

export default function Inventaris() {
  const queryClient = useQueryClient();
  const [barangId, setBarangId] = useState();

  const GetBarangs = useGetBarangs({ isSelect: false });
  const GetDetailBarang = useGetDetailBarang({ id: barangId });
  const DeleteBarang = useDeleteBarang(barangId);

  const riwayatBarangs = useGetHistoryBarang();

  const handleDelete = async id => {
    setBarangId(id);
    Swal.fire({
      title: 'Apakah anda yakin?',
      text: 'Barang yang dipilih akan dihapus!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Tidak',
      confirmButtonText: 'Ya!',
      confirmButtonColor: '#3085d6'
    }).then(async result => {
      if (result.isConfirmed) {
        let payload: any;
        DeleteBarang.mutate(payload, {
          onSuccess: () => {
            queryClient.invalidateQueries(useGetBarangs.keys());
            Swal.fire({
              title: 'Berhasil!',
              text: 'Barang berhasil di hapus.',
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

  return (
    <InventarisLayout>
      <TabComponent tab={['Inventaris', 'Riwayat Inventaris']}>
        <section className={'grid gap-5 p-3'}>
          <CreateInventory />
          {!GetBarangs.isLoading && (
            <Each
              of={GetBarangs.data || []}
              render={(item: any) => (
                <CardComponent title={item.name}>
                  <div className={'p-3'}>
                    Stock : {item.qty}
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
        <section className={'grid gap-5 p-3'}>
          <Each
            of={riwayatBarangs.data || []}
            render={(item: any) => (
              <CardComponent title={item.inventory.name}>
                <div className={'p-3 bg-warning'}>Keluar : {item.qty_item}</div>
              </CardComponent>
            )}
          />
        </section>
      </TabComponent>
    </InventarisLayout>
  );
}
