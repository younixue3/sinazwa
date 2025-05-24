import hitApi from 'utils/http';

const getSale = async () => {
  const result = await hitApi().get('/sales');
  return result.data;
};

const getDetailSale = async ({ id }) => {
  const result = await hitApi().get(`/edit-sale/${id}`);
  return result.data;
};

const storeSale = async payload => {
  const result = await hitApi().post('/create-sale', payload.payload, {
    headers: { 'Content-Type': 'application/json' }
  });
  return result.data;
};

const getSaleById = async id => {
  const result = await hitApi().get(`/edit-sale/${id}`);
  return result.data;
};

const updateSale = async (id, payload) => {
  const result = await hitApi().put(`/update-sale/${id}`, payload);
  return result.data;
};

const deleteSale = async id => {
  const result = await hitApi().delete(`/delete-sale/${id}`);
  return result.data;
};

export { getSale, getDetailSale, storeSale, updateSale, deleteSale, getSaleById };
