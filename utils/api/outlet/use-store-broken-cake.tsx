import { useMutation } from 'react-query';
import { storeBrokenCake, storeOutlet } from 'utils/api/outlet/outletApi';

const useStoreBrokenCake = () => {
  const mutation = useMutation({
    mutationFn: payload => storeBrokenCake(payload)
  });
  return mutation;
};

export default useStoreBrokenCake;
