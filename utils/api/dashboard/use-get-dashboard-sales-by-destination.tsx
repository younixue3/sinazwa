import { useQuery } from 'react-query';
import { getDashboardSalesByDestination } from 'utils/api/dashboard/dashboardAPI';

const useGetDashboardSalesByDestination = (
  period: 'week' | 'month' | 'year' = 'week'
) => {
  const query = useQuery({
    queryKey: useGetDashboardSalesByDestination.keys(period),
    queryFn: async () => {
      const response = await getDashboardSalesByDestination({ period });
      return response;
    },
    select: response => {
      if (!response.data || !Array.isArray(response.data)) {
        return {
          dates: []
        };
      }

      // // Get unique categories across all dates
      // const uniqueCategories = [
      //   ...new Set(
      //     response.data.flatMap(item =>
      //       item.categories.map(cat => cat.category)
      //     )
      //   )
      // ];

      const dashboardData = {
        dates: response.data.map(item => item.date)
      };

      // Get unique categories across all dates
      const uniqueCategories = [
        //@ts-ignore
        ...new Set(
          response.data.flatMap(item =>
            item.destinations.map(cat => cat.destination)
          )
        )
      ];

      // Initialize category arrays in dashboardData
      uniqueCategories.forEach(destination => {
        dashboardData[destination] = [];
      });

      // Populate category arrays with total_price values
      response.data.forEach(dateItem => {
        // For each date, check all possible categories
        uniqueCategories.forEach(destination => {
          // Find the category in current date's data
          const categoryData = dateItem.destinations.find(
            cat => cat.destination === destination
          );
          // Push the total_price if category exists, or 0 if it doesn't
          dashboardData[destination].push(
            categoryData ? categoryData.total_price : 0
          );
        });
      });

      return dashboardData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    refetchOnWindowFocus: false
  });

  return query;
};

useGetDashboardSalesByDestination.keys = (
  period: 'week' | 'month' | 'year' = 'week'
) => ['get-dashboard-sales-by-destination', period];

export default useGetDashboardSalesByDestination;
