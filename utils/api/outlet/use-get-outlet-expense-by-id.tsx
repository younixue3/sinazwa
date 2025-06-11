import { useQuery } from 'react-query';
import { getOutletExpensesById } from 'utils/api/outlet/outletApi';

const useGetOutletExpenseById = (id: string | number) => {
  const query = useQuery({
    queryKey: useGetOutletExpenseById.keys(id),
    queryFn: () => getOutletExpensesById(id),
    enabled: !!id,
    select: ({ data }) => {
      return {
        id: data.id,
        name_inventory: data.name_inventory,
        qty: data.qty,
        description: data.description,
        price: data.price,
        destination_id: data.destination_id,
        created_at: data.created_at,
      };
    }
  });

  return query;
};

useGetOutletExpenseById.keys = (id: string | number) => ['get-outlet-expense-by-id', id];

export default useGetOutletExpenseById;