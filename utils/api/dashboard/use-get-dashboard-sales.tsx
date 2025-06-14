import { useQuery } from 'react-query';
import { getDashboardSales } from 'utils/api/dashboard/dashboardAPI';

const useGetDashboardSales = (period: 'week' | 'month' | 'year' = 'week') => {
  const query = useQuery({
    queryKey: useGetDashboardSales.keys(period),
    queryFn: async () => {
      const response = await getDashboardSales({ period });
      return response;
    },
    select: response => {
      if (!response.data || !Array.isArray(response.data)) {
        return { dates: [], totalSelling: [] };
      }

      return {
        dates: response.data.map(item => item.date),
        totalSelling: response.data.map(item => Number(item.total_selling) || 0)
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    refetchOnWindowFocus: false
  });

  return query;
};

useGetDashboardSales.keys = (period: 'week' | 'month' | 'year' = 'week') => [
  'get-dashboard-sales',
  period
];

export default useGetDashboardSales;
