import { useQuery } from 'react-query';
import { getHistoryInstallment, getInstallment } from 'utils/api/cicilan/installmentApi';

const useGetHistoryInstallment = () => {
  const query = useQuery({
    queryKey: useGetHistoryInstallment.keys(),
    queryFn: getHistoryInstallment,
    select: ({ data }) => {
      return data.map((history, index) => ({
        no: index + 1,
        id: history.id,
        created_at: history.created_at,
        user: history.user.name,
        total_installment: history.total_instalments,
        category_cake: history.category_cake.name,
      }));
    }
  });
  return query;
};

useGetHistoryInstallment.keys = () => ['get-history-installment'];

export default useGetHistoryInstallment;
