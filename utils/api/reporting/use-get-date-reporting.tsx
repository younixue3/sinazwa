import { useQuery } from 'react-query';
import { getDateReporting } from 'utils/api/reporting/reportingApi';

const useGetDateReporting = params => {
  const query = useQuery({
    queryKey: useGetDateReporting.keys(params),
    queryFn: () => {
      return getDateReporting(params);
    },
    select: ({ data }: any) => {
      return data;
    }
  });
  return query;
};

useGetDateReporting.keys = ({
  destination_id,
  start_date,
  end_date,
  download
}) => [
  'get-date-reporting',
  { destination_id, start_date, end_date, download }
];

export default useGetDateReporting;
