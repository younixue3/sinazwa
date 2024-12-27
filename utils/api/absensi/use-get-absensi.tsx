import { useQuery } from 'react-query';
import { getAbsensi } from 'utils/api/absensi/absensiApi';
import { getCake } from 'utils/api/cake_production/cakeProductionAPI';

const useGetAbsensi = () => {
  const query = useQuery({
    queryKey: useGetAbsensi.keys(),
    queryFn: getAbsensi,
    select: ({ data }) => {
      return data.map((absen, index) => ({
        no: index + 1,
        id: absen.id,
        absen: absen.absen,
        description: absen.description,
        date: absen.created_at
      }));
    }
  });
  return query;
};

useGetAbsensi.keys = () => ['get-absensi'];

export default useGetAbsensi;
