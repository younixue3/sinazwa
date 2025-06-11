import { useMutation, useQueryClient } from 'react-query';
import { deleteOutletExpenses } from 'utils/api/outlet/outletApi';
import useGetOutletExpenses from './use-get-oulet-expense';

const useDeleteOutletExpense = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (id: string | number) => deleteOutletExpenses(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useGetOutletExpenses.keys() });
    }
  });
  
  return mutation;
};

export default useDeleteOutletExpense;