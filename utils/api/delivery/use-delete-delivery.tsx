import { useMutation } from 'react-query';
import { deleteDelivery } from 'utils/api/delivery/deliveryAPI';

const useDeleteDelivery = id => {
  const mutation = useMutation({
    mutationFn: () => deleteDelivery(id)
  });
  return mutation;
};

export default useDeleteDelivery;
