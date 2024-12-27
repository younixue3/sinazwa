import { useMutation } from 'react-query';
import { storeOutlet } from 'utils/api/outlet/outletApi';
import { storeJob } from './jobApi';

const useStoreJob = () => {
  const mutation = useMutation({
    mutationFn: payload => storeJob(payload)
  });
  return mutation;
};

export default useStoreJob;
