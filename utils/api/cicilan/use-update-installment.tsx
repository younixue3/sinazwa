import { useMutation } from 'react-query';
import { updateInstallment } from 'utils/api/cicilan/installmentApi';

const useUpdateInstallment = id => {
  const mutation = useMutation({
    mutationFn: payload => updateInstallment(id, payload)
  });
  return mutation;
};

export default useUpdateInstallment;
