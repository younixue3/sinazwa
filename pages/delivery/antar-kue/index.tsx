import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import useGetCake from 'utils/api/cake_production/use-get-cake';
import useDeleteCake from 'utils/api/cake_production/use-delete-cake';
import DeliveryLayout from 'pages/delivery/DeliveryLayout';
import { CreateDelivery } from 'components/Pages/delivery/CreateDelivery';
import useGetDetailCake from 'utils/api/cake_production/use-get-detail-cake';
import { Each } from 'helper/Each';
import CardComponent from 'components/Card/CardComponent';

export default function DeliveryCake() {
  const queryClient = useQueryClient();
  const [cakeId, setCakeId] = useState<string| Number | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const deleteCake = useDeleteCake(cakeId);

  const GetCake = useGetCake({ isSelect: false });
  const GetDetailCake = useGetDetailCake({ id: cakeId });

  useEffect(() => {
    if (GetCake.data) {
      const filtered = GetCake.data.filter((item: any) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, GetCake.data]);
  
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
      <div className='mx-2 mt-4'>
        <input
          type="text"
          placeholder="Cari Kue..."
          className="input input-bordered w-full border-[1px] h-10 rounded-md p-4 border-black"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
        <CreateDelivery />
        {!GetCake.isLoading && filteredData.length > 0 ? (
          <Each
            of={filteredData}
            render={(item: any) => (
              <CardComponent title={item.name}>
                <div className={'grid grid-cols-6 gap-2 p-3'}>
                  <div className={'col-span-6'}>Stock : {item.qty}</div>
                  <div className={'col-span-6'}>
                  <p>Jumlah Box : {item.box}</p>
                  </div>
                </div>
              </CardComponent>
            )}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">
            Tidak ada data kue
          </div>
        )}
      </section>
    </DeliveryLayout>
  );
}
