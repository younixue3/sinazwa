import { useQuery } from 'react-query';
import { getHistoryInstallment, getInstallment } from 'utils/api/cicilan/installmentApi';

const useGetHistoryInstallment = () => {
  const query = useQuery({
    queryKey: useGetHistoryInstallment.keys(),
    queryFn: getHistoryInstallment,
    select: ({ data }) => {
      const list = Array.isArray(data) ? data : [];
      return list.map((history: any, index: number) => ({
        no: index + 1,
        id: history?.id ?? null,
        created_at: history?.created_at ?? null,
        user: history?.user?.name ?? null,
        total_installment: history?.total_instalments ?? 0,
        category_cake: history?.category_cake?.name ?? null,
      }));
    }
  });
  return query;
};

useGetHistoryInstallment.keys = () => ['get-history-installment'];

export default useGetHistoryInstallment;
