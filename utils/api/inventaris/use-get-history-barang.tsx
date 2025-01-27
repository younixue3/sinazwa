import { useQuery } from 'react-query';
import {
  getBarangs,
  getHistoryBarang
} from 'utils/api/inventaris/inventarisApi';

const useGetHistoryBarang = () => {
  const query = useQuery({
    queryKey: useGetHistoryBarang.keys(),
    queryFn: getHistoryBarang,
    select: ({ data }) => {
      return data.map((history, index) => ({
        no: index + 1,
        qty_item: history.qty_item,
        tipe_riwayat: history.tipe_riwayat,
        inventory: history.inventory,
        description: history.description,
        created_at: history.created_at
      }));
    }
  });
  return query;
};

useGetHistoryBarang.keys = () => ['get-history-barang'];

export default useGetHistoryBarang;
