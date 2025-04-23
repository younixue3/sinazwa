import { useMutation, useQueryClient } from 'react-query';
import { deleteBrokenCake } from './outletApi';

const useDeleteBrokenCake = id => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number | string) => deleteBrokenCake(id),
    onSuccess: () => {
      // You can add invalidation logic here if needed
      // queryClient.invalidateQueries(['get-history-installment']);
    }
  });
  return mutation;
};

export default useDeleteBrokenCake;
