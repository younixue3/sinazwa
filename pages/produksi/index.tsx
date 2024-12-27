import TabComponent from 'components/Layout/TabComponent';
// import CardComponent from 'components/Card/CardComponent';
// import { Each } from 'helper/Each';
// import ButtonComponent from 'components/Button/ButtonComponent';
// import useGetBarangs from 'utils/api/inventaris/use-get-barangs';
import { useEffect, useState } from 'react';
// import { useQueryClient } from 'react-query';
// import Swal from 'sweetalert2';
// import SwalErrors from 'helper/swal-errors';
// import useGetCake from 'utils/api/cake_production/use-get-cake';
// import useGetDetailCake from 'utils/api/cake_production/use-get-detail-cake';
// import useDeleteCake from 'utils/api/cake_production/use-delete-cake';
// import { CreateCake } from 'components/Pages/produksi/CreateCake';
import ProduksiLayout from 'pages/produksi/ProduksiLayout';
import { AUTH_ID } from 'utils/constants/cookies-keys';
import Cookies from 'js-cookie';
import useGetInstallment from 'utils/api/cicilan/use-get-instalment';
import { CicilanTableComponent } from 'components/Table/CicilanTableComponent';
import { Each } from 'helper/Each';
import CardComponent from 'components/Card/CardComponent';
// import useGetDetailInstallment from 'utils/api/cicilan/use-get-detail-installment';

export default function Produksi() {
  // const queryClient = useQueryClient();
  // const [cakeId, setCakeId] = useState();
  const [id, setId] = useState();
  const GetInstallment = useGetInstallment();
  console.log(GetInstallment);

  useEffect(() => {
    setId(Cookies.get(AUTH_ID));
  }, [id]);

  // const GetCake = useGetCake({ isSelect: false });
  // const GetDetailInstallment = useGetDetailInstallment({ id: id });
  // const DeleteCake = useDeleteCake(cakeId);

  // const handleDelete = async id => {
  //   setCakeId(id);
  //   Swal.fire({
  //     title: 'Apakah anda yakin?',
  //     text: 'Cake yang dipilih akan dihapus!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     cancelButtonColor: '#d33',
  //     cancelButtonText: 'Tidak',
  //     confirmButtonText: 'Ya!',
  //     confirmButtonColor: '#3085d6'
  //   }).then(async result => {
  //     if (result.isConfirmed) {
  //       let payload: any;
  //       DeleteCake.mutate(payload, {
  //         onSuccess: () => {
  //           queryClient.invalidateQueries(useGetBarangs.keys());
  //           Swal.fire({
  //             title: 'Berhasil!',
  //             text: 'Barang berhasil di hapus.',
  //             icon: 'success',
  //             timer: 1500,
  //             showConfirmButton: false
  //           });
  //         },
  //         onError: (err: any) => {
  //           const errors = err.response.data;
  //           SwalErrors({ errors });
  //         }
  //       });
  //     }
  //   });
  // };

  return (
    <ProduksiLayout>
      <TabComponent tab={['Produksi', 'Riwayat Produksi']}>
        <section className={'grid gap-5 p-3'}>
          {!GetInstallment.isLoading && (
            <Each
              of={GetInstallment.data || []}
              render={(item: any) => (
                <CardComponent title={item.user}>
                  <div className={'p-3'}>
                    Sisa Cicilan : {`${item.remaining_installment}`}
                  </div>
                </CardComponent>
              )}
            />
          )}
          {/* <CreateCake />
          {!GetCake.isLoading && (
            <Each
              of={GetCake.data || []}
              render={(item: any) => (
                <CardComponent title={item.name}>
                  <div className={'p-3'}>
                    Stock : {item.qty}
                    <div className={'grid grid-cols-2 gap-4 mt-5'}>
                      <ButtonComponent
                        text={'Hapus'}
                        color={'btn-danger text-xs w-full'}
                        onClick={() => handleDelete(item.id)}
                      />
                    </div>
                  </div>
                </CardComponent>
              )}
            />
          )} */}
        </section>
        <section className={'grid gap-5 p-3'}></section>
      </TabComponent>
    </ProduksiLayout>
  );
}
