import { useMutation } from 'react-query';
import { storeSale } from 'utils/api/sale/saleApi';

const useStoreSale = () => {
  const mutation = useMutation({
    mutationFn: payload => storeSale(payload)
  });
  return mutation;
};

export default useStoreSale;
