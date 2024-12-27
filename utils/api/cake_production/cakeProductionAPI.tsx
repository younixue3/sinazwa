import hitApi from 'utils/http';

const getCake = async () => {
  const result = await hitApi().get('/cake-products');
  return result.data;
};

const getDetailCake = async ({ id }) => {
  const result = await hitApi().get(`/edit-cake-production/${id}`);
  return result.data;
};

const storeCake = async payload => {
  const result = await hitApi().post('/create-cake-production', payload);
  return result.data;
};

const updateCake = async (id, payload) => {
  const result = await hitApi().put(`/update-cake-production/${id}`, payload);
  return result.data;
};

const deleteCake = async id => {
  const result = await hitApi().delete(`/delete-cake-production/${id}`);
  return result.data;
};

export { getCake, getDetailCake, storeCake, updateCake, deleteCake };
