import { useQuery } from 'react-query';
import { getBrokenCake, getOutletExpenses } from 'utils/api/outlet/outletApi';

const useGetOutletExpenses = () => {
  const query = useQuery({
    queryKey: useGetOutletExpenses.keys(),
    queryFn: getOutletExpenses,
    select: ({ data }) => {
      return data.map((data, index) => ({
        id: data.id, // Tambahkan field id yang hilang
        no: index + 1,
        name_inventory: data.name_inventory,
        qty: data.qty,
        description: data.description,
        price: data.price,
        destination_id: data.destination.id,
        created_at: data.created_at,
        destination_name: data.destination.name,
      }));
    }
  });

  return query;
};

useGetOutletExpenses.keys = () => ['get-outlet-expenses'];

export default useGetOutletExpenses;
