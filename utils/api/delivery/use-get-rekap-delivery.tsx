import { useQuery } from 'react-query';
import { getDelivery, getRekapAntarKue } from 'utils/api/delivery/deliveryAPI';

const useGetRekapDelivery = () => {
  const query = useQuery({
    queryKey: useGetRekapDelivery.keys(),
    queryFn: getRekapAntarKue,
    select: ({ data }) => {
      return data.map((delivery, index) => ({
        no: index + 1,
        id: delivery.id,
        category_cake_id: delivery.category_cake_id,
        category_cake_name: delivery.category_cake_name,
        destination_id: delivery.destination_id,
        destination_name: delivery.destination_name,
        total_box: delivery.total_box,

      }));
    }
  });
  console.log(query);
  return query;
};

useGetRekapDelivery.keys = () => ['get-rekap-delivery'];

export default useGetRekapDelivery;
