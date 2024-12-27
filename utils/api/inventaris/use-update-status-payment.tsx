import { useMutation } from 'react-query';
import { updateStatusPayment } from 'utils/api/inventaris/inventarisApi';

const useUpdateStatusPayment = () => {
  const mutation = useMutation({
    mutationFn: payload => updateStatusPayment(payload)
  });
  return mutation;
};

export default useUpdateStatusPayment;
