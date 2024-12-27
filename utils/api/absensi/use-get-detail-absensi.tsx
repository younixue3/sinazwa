import { useQuery } from 'react-query';
import { getDetailAbsensi } from 'utils/api/absensi/absensiApi';

const useGetDetailAbsensi = params => {
  const query = useQuery({
    queryKey: useGetDetailAbsensi.keys(params),
    queryFn: ({ queryKey }) => {
      const [, params]: any = queryKey;
      return getDetailAbsensi(params);
    },
    enabled: !!params.id
  });
  return query;
};

useGetDetailAbsensi.keys = ({ id }) => ['get-detail-absensi', { id }];

export default useGetDetailAbsensi;
