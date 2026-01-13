import { useQuery } from 'react-query';
import { historySaleCake } from 'utils/api/outlet/outletApi';

const useGetHistoryCakeSale = (params?: { page?: number; perPage?: number; outletId?: string | number }) => {
  const query = useQuery({
    queryKey: useGetHistoryCakeSale.keys(params),
    queryFn: ({ queryKey }) => {
      const [, p]: any = queryKey;
      const apiParams = {
        page: p?.page ?? 1,
        per_page: p?.perPage ?? 10,
        outlet_id: p?.outletId ?? undefined
      };
      return historySaleCake();
    },
    select: (response: any) => {
      const list = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];
      const items = list.map((detail_sale: any, index: number) => ({
        no: index + 1,
        category_cake: detail_sale?.category_cake?.name ?? '-',
        total_price: detail_sale?.price_selling ?? 0,
        total_cake: detail_sale?.cake_selling ?? 0,
        time_selling: detail_sale?.time_selling ?? '-'
      }));
      const meta =
        response?.meta ||
        response?.pagination || {
          current_page: params?.page ?? 1,
          per_page: params?.perPage ?? 10,
          total: items.length,
          last_page: undefined
        };
      return { items, meta };
    }
  });
  return query;
};

useGetHistoryCakeSale.keys = (params?: any) => ['history-sale-cake', params];

export default useGetHistoryCakeSale;
