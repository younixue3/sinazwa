import { useQuery } from 'react-query';
import { getDeliveriesThresholdByDestinationId } from 'utils/api/DeliveryThreshold/deliveriesThresholdAPI';

const useGetDeliveryThresholdByDestinationId = (destinationId: string) => {
  const query = useQuery({
    queryKey: useGetDeliveryThresholdByDestinationId.keys(destinationId),
    queryFn: async () => {
      const response = await getDeliveriesThresholdByDestinationId({
        destination_id: destinationId
      });
      return response;
    }
  });

  return query;
};

useGetDeliveryThresholdByDestinationId.keys = (destinationId: string) => [
  'get-delivery-threshold',
  destinationId
];

export default useGetDeliveryThresholdByDestinationId;
