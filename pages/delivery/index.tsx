import CardComponent from 'components/Card/CardComponent';
import { Each } from 'helper/Each';
import ButtonComponent from 'components/Button/ButtonComponent';
import DeliveryLayout from 'pages/delivery/DeliveryLayout';
import useGetDelivery from 'utils/api/delivery/use-get-delivery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';

export default function Delivery() {
  const { data: deliveries, isLoading } = useGetDelivery();

  return (
    <DeliveryLayout>
      <section className="grid gap-5 p-3">
        {!isLoading && deliveries?.length > 0 ? (
          <Each
            of={deliveries}
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
                        text={`${delivery.cake_production} : ${delivery.qty_cake} pcs`}
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
                        {new Date(delivery.date_delivery).toLocaleDateString(
                          'id'
                        )}
                      </div>
                    </div>
                  </div>
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
    </DeliveryLayout>
  );
}
