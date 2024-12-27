import { useMutation } from 'react-query';
import { barangMasuk } from 'utils/api/inventaris/inventarisApi';

const useStoreComeItem = () => {
  const mutation = useMutation({
    mutationFn: payload => barangMasuk(payload)
  });
  return mutation;
};

export default useStoreComeItem;
