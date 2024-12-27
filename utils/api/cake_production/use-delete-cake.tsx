import { useMutation } from 'react-query';
import { deleteCake } from 'utils/api/cake_production/cakeProductionAPI';

const useDeleteCake = id => {
  const mutation = useMutation({
    mutationFn: () => deleteCake(id)
  });
  return mutation;
};

export default useDeleteCake;
