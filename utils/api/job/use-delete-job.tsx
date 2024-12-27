import { useMutation } from 'react-query';
import { deleteOutlet } from 'utils/api/outlet/outletApi';
import { deleteJob } from './jobApi';

const useDeleteJob = id => {
  const mutation = useMutation({
    mutationFn: () => deleteJob(id)
  });
  return mutation;
};

export default useDeleteJob;
