import { useQuery } from 'react-query';
import { getDeliveriesThreshold } from 'utils/api/DeliveryThreshold/deliveriesThresholdAPI';

const useGetDeliveryThreshold = () => {
  const query = useQuery({
    queryKey: useGetDeliveryThreshold.keys(),
    queryFn: async () => {
      const response = await getDeliveriesThreshold();
      return response;
    },
    select: response => {
      return response;
    }
  });

  return query;
};

useGetDeliveryThreshold.keys = () => ['get-delivery-threshold'];

export default useGetDeliveryThreshold;
