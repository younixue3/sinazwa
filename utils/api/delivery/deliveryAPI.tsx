import hitApi from 'utils/http';

const getDelivery = async () => {
  const result = await hitApi().get('/deliveries');
  return result.data;
};

const getDetailDelivery = async ({ id }) => {
  const result = await hitApi().get(`/edit-delivery/${id}`);
  return result.data;
};

const storeDelivery = async payload => {
  const result = await hitApi().post('/create-delivery', payload);
  return result.data;
};

const updateDelivery = async (id, payload) => {
  const result = await hitApi().put(`/update-delivery/${id}`, payload);
  return result.data;
};

const deleteDelivery = async id => {
  const result = await hitApi().delete(`/delete-delivery/${id}`);
  return result.data;
};

export {
  getDelivery,
  getDetailDelivery,
  storeDelivery,
  updateDelivery,
  deleteDelivery
};
