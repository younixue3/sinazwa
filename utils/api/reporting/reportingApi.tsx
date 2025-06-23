import hitApi from 'utils/http';

const getDailyReporting = async params => {
  try {
    const response = await hitApi().get('/daily-report-sales', {
      params: params,
      responseType: 'blob'
    });
    window.open(URL.createObjectURL(response.data));
    return response;
  } catch (error) {
    console.error('Error downloading daily report:', error);
    throw error;
  }
};

const getDateReporting = async params => {
  try {
    const response = await hitApi().get('/report-sales', {
      params: params,
      responseType: 'blob'
    });
    window.open(URL.createObjectURL(response.data));
    return response;
  } catch (error) {
    console.error('Error downloading date report:', error);
    throw error;
  }
};

const getDeliveryExcel = async params => {
  try {
    const response = await hitApi().get('/export-delivery-excel', {
      params: params,
      responseType: 'blob'
    });
    window.open(URL.createObjectURL(response.data));
    return response;
  } catch (error) {
    console.error('Error downloading delivery excel:', error);
    throw error;
  }
};

const getExcelReporting = async payload => {
  try {
    const result = await hitApi().get('/reports/sale/excle', payload);
    return result.data;
  } catch (error) {
    console.error('Error getting excel report:', error);
    throw error;
  }
};

export {
  getDailyReporting,
  getDateReporting,
  getExcelReporting,
  getDeliveryExcel
};
