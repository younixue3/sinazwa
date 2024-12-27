import { useMutation } from 'react-query';
import { updateCategoryCake } from 'utils/api/category_cake/categoryCakeAPI';

const useUpdateCategoryCake = id => {
  const mutation = useMutation({
    mutationFn: payload => updateCategoryCake(id, payload)
  });
  return mutation;
};

export default useUpdateCategoryCake;
