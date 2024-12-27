import hitApi from 'utils/http';

const getInstallments = async () => {
  const result = await hitApi().get('/instalment');
  return result.data;
};

const storeInstallment = async payload => {
  const result = await hitApi().post('/create-instalment', payload);
  return result.data;
};

const updateDailyInstallment = async payload => {
  const result = await hitApi().post(`/update-daily-instalment`, payload);
  return result.data;
};

const deleteInstallment = async id => {
  const result = await hitApi().delete(`/delete-instalment/${id}`);
  return result.data;
};

export {
  getInstallments,
  storeInstallment,
  updateDailyInstallment,
  deleteInstallment
};
