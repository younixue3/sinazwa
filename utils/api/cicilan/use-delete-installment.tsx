import { useMutation } from 'react-query';
import { deleteInstallment } from 'utils/api/cicilan/installmentApi';

const useDeleteInstallment = id => {
  const mutation = useMutation({
    mutationFn: () => deleteInstallment(id)
  });
  return mutation;
};

export default useDeleteInstallment;
