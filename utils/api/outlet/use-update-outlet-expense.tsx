import { updateOutletExpenses } from 'utils/api/outlet/outletApi';
import useGetOutletExpenses from './use-get-oulet-expense';
import { useMutation, useQueryClient } from 'react-query';

const useUpdateOutletExpense = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: any }) => 
      updateOutletExpenses(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useGetOutletExpenses.keys() });
    }
  });
  
  return mutation;
};

export default useUpdateOutletExpense;