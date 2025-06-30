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
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { AUTH_ROLE } from 'utils/constants/cookies-keys';
import useGetDestination from 'utils/api/destination/use-get-destination';

export default function KueDatang() {
  const GetDelivery = useGetDelivery();
  const queryClient = useQueryClient();
  const [userRole, setUserRole] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const destinations = useGetDestination({ isSelect: true });

  // Ambil role dari cookies
  useEffect(() => {
    const role = Cookies.get(AUTH_ROLE) || '';
    setUserRole(role);
  }, []);

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

  // Handler untuk perubahan select
  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDestination(e.target.value);
  };

  // Filter data berdasarkan destinasi yang dipilih
  const filteredData = GetDelivery.data?.filter(item => {
    if (!selectedDestination || userRole !== 'admin') return true;
    return item.destination.id.toString() === selectedDestination;
  });

  return (
    <OutletLayout>
      {/* Tampilkan filter select hanya jika user adalah admin */}
      {userRole === 'admin' && (
        <div className="p-3 pb-0">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter berdasarkan Outlet
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={selectedDestination}
              onChange={handleDestinationChange}
            >
              <option value="">Pilih Outlet</option>
              {destinations.data?.map(destination => (
                <option key={destination.value} value={destination.value}>
                  {destination.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <section className={'grid gap-5 p-3'}>
        {!GetDelivery.isLoading && filteredData?.length > 0 ? (
          <Each
            of={filteredData}
            render={(item: any) => (
              <CardComponent title={item.destination.name}>
                <div className={'p-3'}>
                  <div className={'flex relative gap-2'}>
                    <FontAwesomeIcon
                      className={'text-xl m-auto mt-0 bg-gray-200 rounded p-3'}
                      icon={faTruck}
                    />
                    <div className={'w-full flex flex-col gap-2'}>
                      <div className='flex'>
                        <ButtonComponent
                        text={`${item.cake_production} : ${item.qty_cake} pcs`}
                        color={'btn-primary text-xs ml-0 mx-2'}
                      />
                       <ButtonComponent
                        text={`${item.cake_production} : ${item.box} Box`}
                        color={'btn-primary text-xs ml-0'}
                      />
                      </div>
                      <ButtonComponent
                        text={item.status_delivery}
                        color={`text-xs ml-0 ${item.status_delivery === 'PROSES' ? 'btn-warning' : 'btn-success'}`}
                      />
                       {item.status_delivery === 'SELESAI' && item.updated_at && (
                        <div className="text-sm text-green-600 font-medium">
                          Diterima :{' '}
                          {new Date(item.updated_at).toLocaleTimeString('id', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })} 
                        </div>
                      )}
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
