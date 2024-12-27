import { useMutation } from 'react-query';
import { storeUser } from './userApi';

const useStoreUser = () => {
  const mutation = useMutation({
    mutationFn: payload => storeUser(payload)
  });
  return mutation;
};

export default useStoreUser;
