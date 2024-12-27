import { useQuery } from 'react-query';
import { getDetailOutlet } from 'utils/api/outlet/outletApi';
import { getDetailJob } from './jobApi';

const useGetDetailJob = params => {
  const query = useQuery({
    queryKey: useGetDetailJob.keys(params),
    queryFn: ({ queryKey }) => {
      const [, params]: any = queryKey;
      return getDetailJob(params);
    },
    enabled: !!params.id
  });
  return query;
};

useGetDetailJob.keys = ({ id }) => ['get-detail-job', { id }];

export default useGetDetailJob;
