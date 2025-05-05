import { useQuery } from 'react-query';
import { historySaleCake } from 'utils/api/outlet/outletApi';

const useGetHistoryCakeSale = () => {
  const query = useQuery({
    queryKey: useGetHistoryCakeSale.keys(),
    queryFn: historySaleCake,
    select: ({ data }) => {
      return data.map((detail_sale, index) => ({
        no: index + 1,
        category_cake: detail_sale?.category_cake.name ?? '-',
        total_price: detail_sale?.price_selling ?? 0,
        total_cake: detail_sale?.cake_selling ?? 0,
        time_selling: detail_sale?.time_selling ?? '-',
      }));
    }
  });
  return query;
};

useGetHistoryCakeSale.keys = () => ['history-sale-cake'];

export default useGetHistoryCakeSale;