import { useMutation } from 'react-query';
import { deleteBarang } from 'utils/api/inventaris/inventarisApi';

const useDeleteBarang = id => {
  const mutation = useMutation({
    mutationFn: () => deleteBarang(id)
  });
  return mutation;
};

export default useDeleteBarang;
