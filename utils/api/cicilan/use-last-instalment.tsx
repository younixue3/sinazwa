import { useQuery } from 'react-query';
import { getLastInstallment } from 'utils/api/cicilan/installmentApi';

const useLastInstallment = () => {
  const query = useQuery({
    queryKey: useLastInstallment.keys(),
    queryFn: getLastInstallment,
    select: ({ data }) => {
      return data;
    }
  });
  return query;
};

useLastInstallment.keys = () => ['get-last-installment'];

export default useLastInstallment;
