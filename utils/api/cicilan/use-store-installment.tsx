import { useMutation } from 'react-query';
import { storeInstallment } from 'utils/api/cicilan/installmentApi';

const useStoreInstallment = () => {
  const mutation = useMutation({
    mutationFn: payload => storeInstallment(payload)
  });
  return mutation;
};

export default useStoreInstallment;
