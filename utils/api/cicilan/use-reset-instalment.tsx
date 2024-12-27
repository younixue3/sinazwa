import { useQuery } from 'react-query';
import { resetInstallments } from 'utils/api/cicilan/installmentApi';

const useResetInstallment = () => {
  const query = useQuery({
    queryKey: useResetInstallment.keys(),
    queryFn: resetInstallments,
    select: ({ data }) => {
      return data;
    }
  });
  return query;
};

useResetInstallment.keys = () => ['get-reset-installment'];

export default useResetInstallment;
