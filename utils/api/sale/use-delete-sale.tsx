import { useMutation } from 'react-query';
import { deleteSale } from 'utils/api/sale/saleApi';

const useDeleteSale = id => {
  const mutation = useMutation({
    mutationFn: () => deleteSale(id)
  });
  return mutation;
};

export default useDeleteSale;
