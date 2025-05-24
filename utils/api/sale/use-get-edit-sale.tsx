import { useQuery } from 'react-query';
import { getSaleById } from './saleApi';

const useGetSaleById = params => {
  const query = useQuery({
    queryKey: useGetSaleById.keys(params),
    queryFn: ({ queryKey }) => {
      const [, params]: any = queryKey;
      return getSaleById(params);
    },
    enabled: !!params.id
  });
  return query;
};

useGetSaleById.keys = ({ id }) => ['get-sale-id', { id }];

export default useGetSaleById;
