import hitApi from 'utils/http';

const getCategoryCakes = async () => {
  const result = await hitApi().get('/category-cake');
  return result.data;
};

const storeCategoryCake = async payload => {
  const result = await hitApi().post('/create-category-cake', payload);
  return result.data;
};

const updateCategoryCake = async (id, payload) => {
  const result = await hitApi().put(`/update-category-cake/${id}`, payload);
  return result.data;
};

const deleteCategoryCake = async id => {
  const result = await hitApi().delete(`/delete-category-cake/${id}`);
  return result.data;
};

export {
  getCategoryCakes,
  storeCategoryCake,
  updateCategoryCake,
  deleteCategoryCake
};
