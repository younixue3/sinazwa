import { useMutation } from 'react-query';
import { updateBarang } from 'utils/api/inventaris/inventarisApi';

const useUpdateBarang = id => {
  const mutation = useMutation({
    mutationFn: payload => updateBarang(id, payload)
  });
  return mutation;
};

export default useUpdateBarang;
