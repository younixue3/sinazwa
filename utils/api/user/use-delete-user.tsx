import { useMutation } from 'react-query';
import { deleteUser } from './userApi';

const useDeleteUser = id => {
  const mutation = useMutation({
    mutationFn: () => deleteUser(id)
  });
  return mutation;
};

export default useDeleteUser;
