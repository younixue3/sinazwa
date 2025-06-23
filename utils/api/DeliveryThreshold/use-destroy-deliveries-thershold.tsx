import { useMutation } from 'react-query';
import { destroyDeliveriesThreshold } from 'utils/api/DeliveryThreshold/deliveriesThresholdAPI';

const useDestroyDeliveriesThreshold = id => {
  const mutation = useMutation({
    mutationFn: () => destroyDeliveriesThreshold(id)
  });
  return mutation;
};

export default useDestroyDeliveriesThreshold;
