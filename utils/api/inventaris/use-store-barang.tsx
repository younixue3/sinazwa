import { useMutation } from 'react-query';
import { storeBarang } from 'utils/api/inventaris/inventarisApi';

const useStoreBarang = () => {
  const mutation = useMutation({
    mutationFn: payload => storeBarang(payload)
  });
  return mutation;
};

export default useStoreBarang;
