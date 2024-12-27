import { useMutation } from 'react-query';
import { storeOutlet } from 'utils/api/outlet/outletApi';

const useStoreOutlet = () => {
  const mutation = useMutation({
    mutationFn: payload => storeOutlet(payload)
  });
  return mutation;
};

export default useStoreOutlet;
