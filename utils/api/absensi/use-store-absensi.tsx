import { useMutation } from 'react-query';
import { storeAbsensi } from 'utils/api/absensi/absensiApi';

const useStoreAbsensi = () => {
  const mutation = useMutation({
    mutationFn: payload => storeAbsensi(payload)
  });
  return mutation;
};

export default useStoreAbsensi;
