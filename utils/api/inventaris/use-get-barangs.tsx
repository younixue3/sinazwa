import { useQuery } from 'react-query';
import { getBarangs } from 'utils/api/inventaris/inventarisApi';

const useGetBarangs = params => {
  const query = useQuery({
    queryKey: useGetBarangs.keys(),
    queryFn: getBarangs,
    select: ({ data }) => {
      if (params.isSelect) {
        return data.map(barang => ({
          value: barang.id,
          label: barang.name
        }));
      }
      return data.map((barang, index) => ({
        no: index + 1,
        id: barang.id,
        name: barang.name,
        qty: barang.qty,
        description: barang.description
      }));
    }
  });
  return query;
};

useGetBarangs.keys = () => ['get-barangs'];

export default useGetBarangs;
