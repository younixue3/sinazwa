import { useMutation } from 'react-query';
import { deleteOutlet } from 'utils/api/outlet/outletApi';

const useDeleteOutlet = id => {
  const mutation = useMutation({
    mutationFn: () => deleteOutlet(id)
  });
  return mutation;
};

export default useDeleteOutlet;
