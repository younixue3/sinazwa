import { useMutation } from 'react-query';
import { barangKeluar, storeBarang } from 'utils/api/inventaris/inventarisApi';

const useBarangKeluar = () => {
  const mutation = useMutation({
    mutationFn: payload => barangKeluar(payload)
  });
  return mutation;
};

export default useBarangKeluar;
