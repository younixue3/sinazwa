import { useMutation } from 'react-query';
import { updateDelivery } from 'utils/api/delivery/deliveryAPI';

const useUpdateDelivery = id => {
  const mutation = useMutation({
    mutationFn: payload => updateDelivery(id, payload)
  });
  return mutation;
};

export default useUpdateDelivery;
