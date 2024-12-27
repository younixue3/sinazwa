import { useMutation } from 'react-query';
import { loginUser } from 'utils/api/login/authApi';

const useLoginUser = () => {
  const mutation = useMutation({
    mutationFn: payload => loginUser(payload)
  });
  return mutation;
};

export default useLoginUser;
