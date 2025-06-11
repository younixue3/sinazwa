import { useMutation } from 'react-query';
import { storeOutletExpenses } from 'utils/api/outlet/outletApi';

const useStoreOutletExpenses = () => {
  const mutation = useMutation({
    mutationFn: payload => storeOutletExpenses(payload)
  });
  return mutation;
};

export default useStoreOutletExpenses;