import { useMutation } from 'react-query';
import { storeDelivery } from 'utils/api/delivery/deliveryAPI';

const useStoreDelivery = () => {
  const mutation = useMutation({
    mutationFn: payload => storeDelivery(payload)
  });
  return mutation;
};

export default useStoreDelivery;
