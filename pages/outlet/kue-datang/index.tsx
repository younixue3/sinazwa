import OutletLayout from 'pages/outlet/OutletLayout';
import { Each } from 'helper/Each';
import CardComponent from 'components/Card/CardComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import ButtonComponent from 'components/Button/ButtonComponent';
import useGetDelivery from 'utils/api/delivery/use-get-delivery';
import { updateDelivery } from 'utils/api/delivery/deliveryAPI';
import { useQueryClient } from 'react-query';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';

export default function KueDatang() {
  const GetDelivery = useGetDelivery();
  const queryClient = useQueryClient();

  const handleValidation = async (item: any) => {
    const result = await Swal.fire({
      title: 'Apakah anda yakin?',
      text: 'Kue yang dipilih akan divalidasi sebagai selesai!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Tidak',
      confirmButtonText: 'Ya!',
      confirmButtonColor: '#3085d6'
    });

    if (result.isConfirmed) {
      try {
        await updateDelivery(item.id, {
          status_delivery: 'SELESAI'
        });

        await queryClient.invalidateQueries(useGetDelivery.keys());

        Swal.fire({
          title: 'Berhasil!',
          text: 'Status pengiriman berhasil diperbarui.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err: any) {
        const errors = err.response?.data;
        SwalErrors({ errors });
      }
    }
  };

  return (
    <OutletLayout>
      <section className={'grid gap-5 p-3'}>
        {!GetDelivery.isLoading && GetDelivery.data?.length > 0 ? (
          <Each
            of={GetDelivery.data}
            render={(item: any) => (
              <CardComponent title={item.destination.name}>
                <div className={'p-3'}>
                  <div className={'flex relative gap-2'}>
                    <FontAwesomeIcon
                      className={'text-xl m-auto mt-0 bg-gray-200 rounded p-3'}
                      icon={faTruck}
                    />
                    <div className={'w-full flex flex-col gap-2'}>
                      <ButtonComponent
                        text={`${item.cake_production} : ${item.qty_cake} pcs`}
                        color={'btn-primary text-xs ml-0'}
                      />
                      <ButtonComponent
                        text={item.status_delivery}
                        color={`text-xs ml-0 ${item.status_delivery === 'PROSES' ? 'btn-warning' : 'btn-success'}`}
                      />
                      <div className={'text-xs'}>
                        Jadwal Antar:{' '}
                        {new Date(item.date_delivery).toLocaleDateString('id')}
                      </div>
                    </div>
                  </div>
                  {item.status_delivery == 'PROSES' && (
                    <div className={'border-0 border-t-2 mt-3 pt-3'}>
                      <ButtonComponent
                        text={'Validasi'}
                        color={'btn-outline-primary'}
                        onClick={() => handleValidation(item)}
                      />
                    </div>
                  )}
                </div>
              </CardComponent>
            )}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">
            Tidak ada data pengiriman
          </div>
        )}
      </section>
    </OutletLayout>
  );
}
