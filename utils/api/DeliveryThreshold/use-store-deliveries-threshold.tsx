import { useMutation } from 'react-query';
import { storeDeliveriesThreshold } from 'utils/api/DeliveryThreshold/deliveriesThresholdAPI';

const useStoreDeliveriesThreshold = () => {
  const mutation = useMutation({
    mutationFn: payload => storeDeliveriesThreshold(payload)
  });
  return mutation;
};

export default useStoreDeliveriesThreshold;
