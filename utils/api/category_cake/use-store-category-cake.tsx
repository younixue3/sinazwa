import { useMutation } from 'react-query';
import { storeCategoryCake } from 'utils/api/category_cake/categoryCakeAPI';

const useStoreCategoryCake = () => {
  const mutation = useMutation({
    mutationFn: payload => storeCategoryCake(payload)
  });
  return mutation;
};

export default useStoreCategoryCake;
