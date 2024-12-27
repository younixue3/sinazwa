import { useMutation } from 'react-query';
import { updateUser } from './userApi';

const useUpdateUser = id => {
  const mutation = useMutation({
    mutationFn: payload => updateUser(id, payload)
  });
  return mutation;
};

export default useUpdateUser;
