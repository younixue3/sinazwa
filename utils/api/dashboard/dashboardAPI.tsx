import hitApi from 'utils/http';

const getDashboardSales = async (params: {
  period: 'week' | 'month' | 'year';
}) => {
  const result = await hitApi().get('/dashboard-sales', { params });
  return result.data;
};

const getDashboardSalesByCategoryCake = async (params: {
  period: 'week' | 'month' | 'year';
}) => {
  const result = await hitApi().get('/dashboard-sales-by-category-cake', {
    params
  });
  return result.data;
};

const getDashboardSalesByDestination = async (params: {
  period: 'week' | 'month' | 'year';
}) => {
  const result = await hitApi().get('/dashboard-sales-by-destination', {
    params
  });
  return result.data;
};

export {
  getDashboardSales,
  getDashboardSalesByCategoryCake,
  getDashboardSalesByDestination
};
