import { useQuery } from 'react-query';
import { getDetailDelivery } from 'utils/api/delivery/deliveryAPI';

const useGetDetailDelivery = params => {
  const query = useQuery({
    queryKey: useGetDetailDelivery.keys(params),
    queryFn: ({ queryKey }) => {
      const [, params]: any = queryKey;
      return getDetailDelivery(params);
    },
    enabled: !!params.id
  });
  return query;
};

useGetDetailDelivery.keys = ({ id }) => ['get-detail-delivery', { id }];

export default useGetDetailDelivery;
