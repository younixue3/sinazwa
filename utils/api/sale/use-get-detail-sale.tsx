import { useQuery } from 'react-query';
import { getDetailSale } from 'utils/api/sale/saleApi';

const useGetDetailSale = params => {
  const query = useQuery({
    queryKey: useGetDetailSale.keys(params),
    queryFn: ({ queryKey }) => {
      const [, params]: any = queryKey;
      return getDetailSale(params);
    },
    enabled: !!params.id
  });
  return query;
};

useGetDetailSale.keys = ({ id }) => ['get-detail-sale', { id }];

export default useGetDetailSale;
