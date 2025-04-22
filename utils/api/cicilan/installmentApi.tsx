import hitApi from 'utils/http';

const getInstallment = async () => {
  const result = await hitApi().get('/instalment');
  return result.data;
};

const getDetailInstallment = async ({ id }) => {
  const result = await hitApi().get(`/edit-instalment/${id}`);
  return result.data;
};

const storeInstallment = async payload => {
  const result = await hitApi().post('/create-instalment', payload);
  return result.data;
};

const updateInstallment = async (id, payload) => {
  const result = await hitApi().put(`/update-instalment/${id}`, payload);
  return result.data;
};

const editInstallment = async (id, payload) => {
  const result = await hitApi().post(`/edit-instalment/${id}`, payload);
  return result.data;
};

const deleteInstallment = async id => {
  const result = await hitApi().delete(`/delete-instalment/${id}`);
  return result.data;
};

const getLastInstallment = async () => {
  const result = await hitApi().get('/last-instalment');
  return result;
};

const resetInstallments = () => {
  const result = hitApi().get('/reset-instalment');
  return result;
};

const statusPegawai = async (id, payload ) => {
  const result = await hitApi().put(`/status-pegawai/${id}`, payload);
  return result.data;
};

const getHistoryInstallment = async () => {
  const result = await hitApi().get('/history-instalment');
  return result.data;
}

export {
  getInstallment,
  getDetailInstallment,
  storeInstallment,
  updateInstallment,
  editInstallment,
  deleteInstallment,
  getLastInstallment,
  resetInstallments,
  statusPegawai,
  getHistoryInstallment
};
