import { useMutation } from 'react-query';
import { updateSale } from 'utils/api/sale/saleApi';

const useUpdateSale = id => {
  const mutation = useMutation({
    mutationFn: payload => updateSale(id, payload)
  });
  return mutation;
};

export default useUpdateSale;
