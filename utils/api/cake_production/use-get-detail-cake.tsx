import { useQuery } from 'react-query';
import { getDetailCake } from 'utils/api/cake_production/cakeProductionAPI';

const useGetDetailCake = params => {
  const query = useQuery({
    queryKey: useGetDetailCake.keys(params),
    queryFn: ({ queryKey }) => {
      const [, params]: any = queryKey;
      return getDetailCake(params);
    },
    enabled: !!params.id
  });
  return query;
};

useGetDetailCake.keys = ({ id }) => ['get-detail-cake', { id }];

export default useGetDetailCake;
