import { useQuery } from 'react-query';
import { getInstallment } from 'utils/api/cicilan/installmentApi';

const useGetInstallment = () => {
  const query = useQuery({
    queryKey: useGetInstallment.keys(),
    queryFn: getInstallment,
    select: ({ data }) => {
      return data.map((installment, index) => ({
        no: index + 1,
        id: installment.id,
        daily_installment: installment.daily_installments,
        remaining_yesterday: installment.remaining_yesterday,
        user: installment.user.name,
        aktif: installment.aktif,
      }));
    }
  });
  return query;
};

useGetInstallment.keys = () => ['get-installment'];

export default useGetInstallment;

const data = [
  {
    id: 1,
    cake_production_id: 12,
    cakes_available: 30,
    destination_id: 3,

    cake_production: [
      {
        id: 12,
        category_cake_id: 13,
        qty_production: 54,
        description: 'Pia Coklat',
        price: 3000,
        slug: 'pia-coklat-zcAFDL01UO',
        category_cake: {
          id: 13,
          name: 'Pia Coklat',
          price: 0,
          qty_max_box: 50,
          slug: 'pia-coklat-dcmqr'
        }
      },
      {
        id: 10,
        category_cake_id: 3,
        qty_production: -7,
        description:
          'Quidem eligendi dolores enim molestiae dolorem et quaerat.',
        price: 33653,
        slug: 'atque-saepe-velit',
        category_cake: {
          id: 3,
          name: 'ipsam',
          price: 0,
          qty_max_box: 50,
          slug: 'necessitatibus'
        }
      }
    ],
    destination: {
      id: 3,
      name: 'Pia Nazwa Kadrie Oening',
      address: 'Jl. Kadrie Oening',
      no_hp: '012321323',
      slug: 'pia-nazwa-kadrie-oening-AHIqPlpYAq',
      created_at: '2024-06-21T15:44:36.000000Z',
      updated_at: '2024-06-21T15:44:36.000000Z'
    }
  },
  {
    id: 3,
    cake_production_id: 10,
    cakes_available: 28,
    destination_id: 3,
    cake_production: {
      id: 10,
      category_cake_id: 3,
      qty_production: -7,
      description: 'Quidem eligendi dolores enim molestiae dolorem et quaerat.',
      price: 33653,
      slug: 'atque-saepe-velit',
      category_cake: {
        id: 3,
        name: 'ipsam',
        price: 0,
        qty_max_box: 50,
        slug: 'necessitatibus'
      }
    },
    destination: {
      id: 3,
      name: 'Pia Nazwa Kadrie Oening',
      address: 'Jl. Kadrie Oening',
      no_hp: '012321323',
      slug: 'pia-nazwa-kadrie-oening-AHIqPlpYAq',
      created_at: '2024-06-21T15:44:36.000000Z',
      updated_at: '2024-06-21T15:44:36.000000Z'
    }
  }
];
