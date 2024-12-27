import { useMutation } from 'react-query';
import { updateAbsensi } from 'utils/api/absensi/absensiApi';

const useUpdateAbsensi = id => {
  const mutation = useMutation({
    mutationFn: payload => updateAbsensi(id, payload)
  });
  return mutation;
};

export default useUpdateAbsensi;
