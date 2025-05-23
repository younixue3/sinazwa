import { useQuery } from 'react-query';
import { getSale } from 'utils/api/sale/saleApi';

const useGetSale = () => {
  const query = useQuery({
    queryKey: useGetSale.keys(),
    queryFn: getSale,
    select: ({ data }) => {
      return data.map((sale, index) => ({
        no: index + 1,
        id: sale.sale_id,
        destination: sale.destination,
        destination_id: sale.destination_id,
        cakes_available: sale.cakes_available,
        cakes: sale.cakes.map((cake) => ({
          cake_id: cake.cake_id,
          category_name: cake.category_name,
          price: cake.price,
          qty: cake.qty
        }))
      }));
    },
    refetchInterval: 3000, // <- Tambahkan ini (dalam milidetik, contoh: 3000ms = 3 detik)
    refetchOnWindowFocus: true, // Optional: refetch saat window di-focus kembali
  });

  return query;
};

useGetSale.keys = () => ['get-sale'];

export default useGetSale;