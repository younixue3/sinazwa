import { useQuery } from 'react-query';
import { getComeItems } from 'utils/api/inventaris/inventarisApi';

interface CategoryCake {
  id: number;
  name: string;
  price: number;
  qty_max_box: number;
  slug: string;
}

interface Inventory {
  id: number;
  category_cake_id: number;
  name: string;
  qty: number;
  description: string;
  category_cake: CategoryCake[];
}

interface NotaItem {
  id: number;
  code_nota: string;
  expired_date: string;
  quantity: number;
  status_payment: string;
  description: string | null;
  inventory: Inventory;
}

interface NotaData {
  id: number;
  code_nota: string;
  delivery_date: string;
  created_at: string;
  expired_date: string;
  total: number;
  quantity: number;
  status_payment: string;
  description: string | null;
  inventory: Inventory;
  items: NotaItem[];
}

const useGetNota = () => {
  const query = useQuery({
    queryKey: useGetNota.keys(),
    queryFn: getComeItems,
    select: ({ data }: { data: NotaData[] }) => {
      return data.map((nota, index) => {
        return {
          no: index + 1,
          id: nota.id,
          code_nota: nota.code_nota,
          created_at: nota.delivery_date,
          expired_date: nota.expired_date,
          total: nota.total,
          quantity: nota.quantity,
          status_payment: nota.status_payment,
          description: nota.description,
          inventory: nota.inventory
        };
      });
    }
  });
  return query;
};

useGetNota.keys = () => ['get-nota'];

export default useGetNota;
