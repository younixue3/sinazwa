import hitApi from 'utils/http';

const getDailyReporting = async params => {
  const result = await hitApi()
    .get('/daily-report-sales', {
      params: params,
      responseType: 'blob'
    })
    .then(response => {
      window.open(URL.createObjectURL(response.data));
    });
};

const getDateReporting = async params => {
  const result = await hitApi()
    .get('/report-sales', {
      params: params,
      responseType: 'blob'
    })
    .then(response => {
      window.open(URL.createObjectURL(response.data));
    });
};

const getDeliveryExcel = async params => {
  const result = await hitApi()
    .get('/export-delivery-excel', {
      params: params,
      responseType: 'blob'
    })
    .then(response => {
      window.open(URL.createObjectURL(response.data));
    });
};

const getExcelReporting = async payload => {
  const result = await hitApi().get('/reports/sale/excle', payload);
  return result.data;
};

export {
  getDailyReporting,
  getDateReporting,
  getExcelReporting,
  getDeliveryExcel
};
