import { useQuery } from 'react-query';
import { getUsers } from './userApi';

const useGetUser = props => {
  const query = useQuery({
    queryKey: useGetUser.keys(),
    queryFn: getUsers,
    select: ({ data }) => {
      if (props.isSelect) {
        return data
          .filter(item => !props.role || item.role === props.role)
          .map(item => ({
            label: item.name,
            value: item.id
          }));
      } else {
        return data.map((user, index) => ({
          no: index + 1,
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          destination: user.destination
        }));
      }
    }
  });
  return query;
};

useGetUser.keys = () => ['get-user'];

export default useGetUser;
