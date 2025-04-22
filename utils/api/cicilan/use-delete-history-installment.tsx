import { useMutation, useQueryClient } from 'react-query';
import { deleteHistoryInstallment } from './installmentApi';

const useDeleteHistoryInstallment = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (id: number | string) => deleteHistoryInstallment(id),
    onSuccess: () => {
      // You can add invalidation logic here if needed
      // queryClient.invalidateQueries(['get-history-installment']);
    }
  });
  
  return mutation;
};

export default useDeleteHistoryInstallment;
