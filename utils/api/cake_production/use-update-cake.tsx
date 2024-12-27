import { useMutation } from 'react-query';
import { updateCake } from 'utils/api/cake_production/cakeProductionAPI';

const useUpdateCake = id => {
  const mutation = useMutation({
    mutationFn: payload => updateCake(id, payload)
  });
  return mutation;
};

export default useUpdateCake;
