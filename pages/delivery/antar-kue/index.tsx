import { useState } from 'react';
import { useQueryClient } from 'react-query';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import useGetCake from 'utils/api/cake_production/use-get-cake';
import useDeleteCake from 'utils/api/cake_production/use-delete-cake';
import DeliveryLayout from 'pages/delivery/DeliveryLayout';
import { CreateDelivery } from 'components/Pages/delivery/CreateDelivery';

export default function DeliveryCake() {
  const queryClient = useQueryClient();
  const [cakeId, setCakeId] = useState<string>();
  const deleteCake = useDeleteCake(cakeId);

  const handleDelete = async (id: string) => {
    setCakeId(id);

    const result = await Swal.fire({
      title: 'Apakah anda yakin?',
      text: 'Cake yang dipilih akan dihapus!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Tidak',
      confirmButtonText: 'Ya!',
      confirmButtonColor: '#3085d6'
    });

    if (result.isConfirmed) {
      deleteCake.mutate(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries(useGetCake.keys());
          Swal.fire({
            title: 'Berhasil!',
            text: 'Cake berhasil dihapus.',
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
  };

  return (
    <DeliveryLayout>
      <section className="grid gap-5 p-3">
        <CreateDelivery />
      </section>
    </DeliveryLayout>
  );
}
