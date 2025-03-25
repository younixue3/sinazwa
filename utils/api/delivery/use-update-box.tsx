import { useMutation } from 'react-query';
import { updateBox } from 'utils/api/delivery/deliveryAPI';

const useUpdateBox = id => {
  const mutation = useMutation({
    mutationFn: payload => updateBox(id, payload)
  });
  return mutation;
};

export default useUpdateBox;
