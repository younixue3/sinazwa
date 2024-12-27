import { useMutation } from 'react-query';
import { storeCake } from 'utils/api/cake_production/cakeProductionAPI';

const useStoreCake = () => {
  const mutation = useMutation({
    mutationFn: payload => storeCake(payload)
  });
  return mutation;
};

export default useStoreCake;
