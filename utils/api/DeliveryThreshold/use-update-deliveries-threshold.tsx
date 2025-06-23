import { useMutation } from 'react-query';
import { updateDeliveriesThreshold } from 'utils/api/DeliveryThreshold/deliveriesThresholdAPI';

const useUpdateDeliveriesThreshold = id => {
  const mutation = useMutation({
    mutationFn: payload => updateDeliveriesThreshold(id, payload)
  });
  return mutation;
};

export default useUpdateDeliveriesThreshold;
