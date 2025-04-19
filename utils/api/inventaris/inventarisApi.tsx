import hitApi from 'utils/http';
import { id } from 'postcss-selector-parser';

const getBarangs = async () => {
  const result = await hitApi().get('/inventory');
  return result.data;
};

const getDetailBarang = async ({ id }) => {
  const result = await hitApi().get(`/edit-inventory/${id}`);
  return result.data;
};

const storeBarang = async payload => {
  const result = await hitApi().post('/create-inventory', payload);
  return result.data;
};

const updateBarang = async (id, payload) => {
  const result = await hitApi().put(`/update-inventory/${id}`, payload);
  return result.data;
};

const barangKeluar = async payload => {
  const result = await hitApi().post('/create-item', payload);
  return result.data;
};

const getHistoryBarang = async () => {
  const result = await hitApi().get('/items');
  return result.data;
};

const deleteBarang = async id => {
  const result = await hitApi().delete(`/delete-inventory/${id}`);
  return result.data;
};

const barangMasuk = async payload => {
  const result = await hitApi().post('/create-come-item', payload);
  return result.data;
};

const getComeItems = async () => {
  const result = await hitApi().get('/come-items');
  return result.data;
};

const deleteComeItem = async id => {
  const result = await hitApi().delete(`/delete-come-item/${id}`);
  return result.data;
};

const updateStatusPayment = async payload => {
  const result = await hitApi().post(`/update-status-payment`, payload);
  return result.data;
};


const detailHistoryItem = async () => {
  const result = await hitApi().get('/detail-history-item')
  return result.data
}

export {
  getBarangs,
  getDetailBarang,
  storeBarang,
  updateBarang,
  deleteBarang,
  barangKeluar,
  getHistoryBarang,
  barangMasuk,
  getComeItems,
  updateStatusPayment,
  deleteComeItem,
  detailHistoryItem
};
