import { useQuery } from 'react-query';
import { getSale } from 'utils/api/sale/saleApi';

const useGetSale = () => {
  const query = useQuery({
    queryKey: useGetSale.keys(),
    queryFn: getSale,
    select: ({ data }) => {
      return data[0].sales.map((sale, index) => ({
        no: index + 1,
        id: sale.id,
        cake_production: sale.cake_production,
        cakes_available: sale.cakes_available
      }));
    }
  });
  return query;
};

useGetSale.keys = () => ['get-sale'];

export default useGetSale;
