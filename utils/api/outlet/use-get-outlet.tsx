import { useQuery } from 'react-query';
import { getCake } from 'utils/api/cake_production/cakeProductionAPI';
import { getOutlet } from 'utils/api/outlet/outletApi';

const useGetOutlet = props => {
  const query = useQuery({
    queryKey: useGetOutlet.keys(),
    queryFn: getOutlet,
    select: ({ data }) => {
      if (props.isSelect) {
        return data.map(item => ({
          label: item.name,
          value: item.id
        }));
      } else {
        return data.map((destiation, index) => ({
          no: index + 1,
          id: destiation.id,
          name: destiation.name,
          no_hp: destiation.no_hp,
          address: destiation.address
        }));
      }
    }
  });
  return query;
};

useGetOutlet.keys = () => ['get-outlet'];

export default useGetOutlet;
