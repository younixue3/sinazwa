import { useQuery } from 'react-query';
import { getBrokenCake } from 'utils/api/outlet/outletApi';

const useGetBrokenCake = () => {
  const query = useQuery({
    queryKey: useGetBrokenCake.keys(),
    queryFn: getBrokenCake,
    select: ({ data }) => {
      return data.map((broken_cake, index) => ({
        no: index + 1,
        id: broken_cake.id,
        category_cake_id: broken_cake.category_cake_id,
        date: broken_cake.date,
        sales_id: broken_cake.sales_id,
        qty_broken: broken_cake.qty_broken,
        quantity_adjustment: broken_cake.quantity_adjustment,
        qty_raw_cake: broken_cake.qty_raw_cake,
        qty_cooking_cake: broken_cake.qty_cooking_cake,
        destination_id: broken_cake.destination_id,
        description: broken_cake.description,
        destination: broken_cake.destination,
        category_cake: broken_cake.category_cake.name,
      }));
    }
  });
  return query;
};

useGetBrokenCake.keys = () => ['get-broken-cake'];

export default useGetBrokenCake;
