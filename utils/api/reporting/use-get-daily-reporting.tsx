import { useQuery } from 'react-query';
import { getDailyReporting } from 'utils/api/reporting/reportingApi';

const useGetDailyReporting = params => {
  const query = useQuery({
    queryKey: useGetDailyReporting.keys(params),
    queryFn: () => {
      return getDailyReporting(params);
    },
    enabled: !!params.destination_id,
    select: ({ data }: any) => {
      return data;
    }
  });
  return query;
};

useGetDailyReporting.keys = ({ destination_id, date, download }) => [
  'get-daily-reporting',
  { destination_id, date, download }
];

export default useGetDailyReporting;
