import { useQuery } from 'react-query';
import { getDestination } from 'utils/api/destination/destinationAPI';

const useGetDestination = props => {
  const query = useQuery({
    queryKey: useGetDestination.keys(),
    queryFn: getDestination,
    select: ({ data }) => {
      if (props.isSelect) {
        return data.map(item => ({
          label: item.name,
          value: item.id
        }));
      } else {
        return data.map((destination, index) => ({
          no: index + 1,
          id: destination.id,
          name: destination.name,
          address: destination.address,
          no_hp: destination.no_hp
        }));
      }
    }
  });
  return query;
};

useGetDestination.keys = () => ['get-destination'];

export default useGetDestination;
