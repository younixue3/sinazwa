import { useQuery } from 'react-query';
import { getDetailInstallment } from 'utils/api/cicilan/installmentApi';

const useGetDetailInstallment = params => {
  const query = useQuery({
    queryKey: useGetDetailInstallment.keys(params),
    queryFn: ({ queryKey }) => {
      const [, params]: any = queryKey;
      return getDetailInstallment(params);
    },
    enabled: !!params.id
  });
  return query;
};

useGetDetailInstallment.keys = ({ id }) => ['get-detail-installment', { id }];

export default useGetDetailInstallment;
