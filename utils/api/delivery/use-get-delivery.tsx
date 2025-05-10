import { useQuery } from 'react-query';
import { getDelivery } from 'utils/api/delivery/deliveryAPI';

const useGetDelivery = () => {
  const query = useQuery({
    queryKey: useGetDelivery.keys(),
    queryFn: getDelivery,
    select: ({ data }) => {
      return data.map((delivery, index) => ({
        no: index + 1,
        id: delivery.id,
        destination: delivery.destination,
        cake_production: delivery.cake_production.category_cake.name,
        qty_cake: delivery.qty_cake,
        box: delivery.box,
        status_delivery: delivery.status_delivery,
        date_delivery: delivery.date_delivery,
        today_shipments_count: delivery.today_shipments_count
      }));
    }
  });
  console.log(query);
  return query;
};

useGetDelivery.keys = () => ['get-delivery'];

export default useGetDelivery;
