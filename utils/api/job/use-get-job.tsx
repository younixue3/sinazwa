import { useQuery } from 'react-query';
import { getCake } from 'utils/api/cake_production/cakeProductionAPI';
import { getOutlet } from 'utils/api/outlet/outletApi';
import { getJobs } from './jobApi';

const useGetJob = props => {
  const query = useQuery({
    queryKey: useGetJob.keys(),
    queryFn: getJobs,
    select: ({ data }) => {
      if (props.isSelect) {
        return data.map(item => ({
          label: item.job,
          value: item.id
        }));
      } else {
        return data.map((job, index) => ({
          no: index + 1,
          id: job.id,
          job: job.job,
          salary: job.salary,
          table_money: job.table_money
        }));
      }
    }
  });
  return query;
};

useGetJob.keys = () => ['get-job'];

export default useGetJob;
