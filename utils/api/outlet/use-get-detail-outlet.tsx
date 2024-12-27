import { useQuery } from 'react-query';
import { getDetailOutlet } from 'utils/api/outlet/outletApi';

const useGetDetailOutlet = params => {
  const query = useQuery({
    queryKey: useGetDetailOutlet.keys(params),
    queryFn: ({ queryKey }) => {
      const [, params]: any = queryKey;
      return getDetailOutlet(params);
    },
    enabled: !!params.id
  });
  return query;
};

useGetDetailOutlet.keys = ({ id }) => ['get-detail-outlet', { id }];

export default useGetDetailOutlet;
