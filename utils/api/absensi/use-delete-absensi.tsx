import { useMutation } from 'react-query';
import { deleteAbsensi } from 'utils/api/absensi/absensiApi';

const useDeleteAbsensi = id => {
  const mutation = useMutation({
    mutationFn: () => deleteAbsensi(id)
  });
  return mutation;
};

export default useDeleteAbsensi;
