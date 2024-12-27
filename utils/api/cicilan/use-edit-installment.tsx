import { useMutation } from 'react-query';
import { editInstallment } from 'utils/api/cicilan/installmentApi';

const useEditInstallment = id => {
  const mutation = useMutation({
    mutationFn: payload => editInstallment(id, payload)
  });
  return mutation;
};
useEditInstallment;
export default useEditInstallment;
