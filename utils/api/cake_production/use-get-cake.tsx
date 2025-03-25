import { useQuery } from 'react-query';
import { getCake } from 'utils/api/cake_production/cakeProductionAPI';

const useGetCake = props => {
  const query = useQuery({
    queryKey: useGetCake.keys(),
    queryFn: getCake,
    select: ({ data }) => {
      if (props.isSelect) {
        return data.map(item => ({
          label: item.category_cake.name,
          value: item.id
        }));
      } else {
        return data.map((cake, index) => ({
          no: index + 1,
          id: cake.id,
          category_cake_id: cake.category_cake_id,
          name: cake.category_cake.name,
          price: cake.price,
          box: cake.box,
          qty: cake.qty_production,
          description: cake.description
        }));
      }
    }
  });
  console.log(query);
  return query;
};

useGetCake.keys = () => ['get-cake'];

export default useGetCake;
