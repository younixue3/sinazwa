import { useQuery } from 'react-query';
import { getBarangs } from 'utils/api/inventaris/inventarisApi';
import { getCategoryCakes } from 'utils/api/category_cake/categoryCakeAPI';

const useGetCategoryCakes = props => {
  const query = useQuery({
    queryKey: useGetCategoryCakes.keys(),
    queryFn: getCategoryCakes,
    select: ({ data }) => {
      if (props.isSelect) {
        return data.map(item => ({
          label: item.name,
          value: item.id
        }));
      } else {
        return data.map((category_cake, index) => ({
          no: index + 1,
          id: category_cake.id,
          name: category_cake.name,
          price: category_cake.price,
          slug: category_cake.slug
        }));
      }
    }
  });
  return query;
};

useGetCategoryCakes.keys = () => ['get-category-cakes'];

export default useGetCategoryCakes;
