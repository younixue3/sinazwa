import { useMutation } from 'react-query';
import { updateOutlet } from 'utils/api/outlet/outletApi';
import { updateJob } from './jobApi';

const useUpdateJob = id => {
  const mutation = useMutation({
    mutationFn: payload => updateJob(id, payload)
  });
  return mutation;
};

export default useUpdateJob;
