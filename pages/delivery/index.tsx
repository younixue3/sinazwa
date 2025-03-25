import { useEffect, useState } from 'react';
import CardComponent from 'components/Card/CardComponent';
import { Each } from 'helper/Each';
import ButtonComponent from 'components/Button/ButtonComponent';
import DeliveryLayout from 'pages/delivery/DeliveryLayout';
import useGetDelivery from 'utils/api/delivery/use-get-delivery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';

export default function Delivery() {
  const { data: deliveries, isLoading } = useGetDelivery();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDeliveries, setFilteredDeliveries] = useState<any[]>([]);

  // Filter data berdasarkan pencarian
  useEffect(() => {
    if (deliveries) {
      const filtered = deliveries.filter((delivery: any) =>
        delivery.destination.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDeliveries(filtered);
    }
  }, [searchTerm, deliveries]);

  return (
    <DeliveryLayout>
      {/* Input pencarian */}
      <div className='mx-2 mt-4'>
      <input
        type="text"
        placeholder="Cari tujuan..."
        className="input input-bordered w-full border-[1px] h-10 rounded-md p-4 border-black mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      </div>

      <section className="grid gap-5 p-3">
        {!isLoading && filteredDeliveries.length > 0 ? (
          <Each
            of={filteredDeliveries}
            render={(delivery: any) => (
              <CardComponent title={delivery.destination.name}>
                <div className="p-3">
                  <div className="flex relative gap-2">
                    <FontAwesomeIcon
                      className="text-xl m-auto mt-0 bg-gray-200 rounded p-3"
                      icon={faTruck}
                    />
                    <div className="w-full flex flex-col gap-2">
                      <ButtonComponent
                        text={`${delivery.cake_production} : ${delivery.box} box`}
                        color="btn-primary text-xs ml-0"
                      />
                      <ButtonComponent
                        text={delivery.status_delivery}
                        color={`text-xs ml-0 ${
                          delivery.status_delivery === 'PROSES'
                            ? 'btn-warning'
                            : 'btn-success'
                        }`}
                      />
                      <div className="text-xs">
                        Jadwal Antar:{' '}
                        {new Date(delivery.date_delivery).toLocaleDateString('id')}
                      </div>
                    </div>
                  </div>
                </div>
              </CardComponent>
            )}
          />
        ) : (
          <div className="text-center text-gray-500 py-8">
            {isLoading ? 'Memuat data...' : 'Tidak ada data pengiriman'}
          </div>
        )}
      </section>
    </DeliveryLayout>
  );
}