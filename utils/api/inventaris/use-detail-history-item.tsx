import { useQuery } from 'react-query';
import { detailHistoryItem, getBarangs } from 'utils/api/inventaris/inventarisApi';

const useDetailHistoryItem = () => {
  const query = useQuery({
    queryKey: useDetailHistoryItem.keys(),
    queryFn: detailHistoryItem,
    select: (response) => {
      const { data } = response;
    
      return data.map((item, index) => ({
        no: index + 1,
        id: item.item_id,
        name: item.inventory,
        qty: item.qty_item,
        created_at: item.created_at,
        description: item.description,
        tipe_riwayat: item.tipe_riwayat,
        category_cake: item.category_cake
      }));
    }
  });
//   console.log(query);
  return query;
};

useDetailHistoryItem.keys = () => ['detail-history-item'];

export default useDetailHistoryItem;
