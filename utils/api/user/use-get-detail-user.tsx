import { useQuery } from 'react-query';
import { getDetailUser } from './userApi';

const useGetDetailUser = params => {
  const query = useQuery({
    queryKey: useGetDetailUser.keys(params),
    queryFn: ({ queryKey }) => {
      const [, params]: any = queryKey;
      return getDetailUser(params);
    },
    enabled: !!params.id
  });
  return query;
};

useGetDetailUser.keys = ({ id }) => ['get-detail-user', { id }];

export default useGetDetailUser;
