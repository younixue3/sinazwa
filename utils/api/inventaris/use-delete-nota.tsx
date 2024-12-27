import { useMutation } from 'react-query';
import { deleteComeItem } from 'utils/api/inventaris/inventarisApi';

const useDeleteNota = id => {
  const mutation = useMutation({
    mutationFn: () => deleteComeItem(id)
  });
  return mutation;
};

export default useDeleteNota;
