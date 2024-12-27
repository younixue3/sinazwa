import { useMutation } from 'react-query';
import { updateDailyInstallment } from 'utils/api/installment/installmentAPI';

const useUpdateDailyInstallment = () => {
  const mutation = useMutation({
    mutationFn: payload => updateDailyInstallment(payload)
  });
  return mutation;
};

export default useUpdateDailyInstallment;
