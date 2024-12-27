import { useQuery } from 'react-query';
import { getDetailBarang } from 'utils/api/inventaris/inventarisApi';

const useGetDetailBarang = params => {
  const query = useQuery({
    queryKey: useGetDetailBarang.keys(params),
    queryFn: ({ queryKey }) => {
      const [, params]: any = queryKey;
      return getDetailBarang(params);
    },
    enabled: !!params.id
  });
  return query;
};

useGetDetailBarang.keys = ({ id }) => ['get-detail-barang', { id }];

export default useGetDetailBarang;
