import { useMutation } from 'react-query';
import { updateOutlet } from 'utils/api/outlet/outletApi';

const useUpdateOutlet = id => {
  const mutation = useMutation({
    mutationFn: payload => updateOutlet(id, payload)
  });
  return mutation;
};

export default useUpdateOutlet;
