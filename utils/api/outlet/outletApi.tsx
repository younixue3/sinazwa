import hitApi from 'utils/http';

const getOutlet = async () => {
  const result = await hitApi().get('/destinations');
  return result.data;
};

const getDetailOutlet = async ({ id }) => {
  const result = await hitApi().get(`/edit-destination/${id}`);
  return result.data;
};

const storeOutlet = async payload => {
  const result = await hitApi().post('/create-destination', payload);
  return result.data;
};

const getBrokenCake = async payload => {
  const result = await hitApi().get('/broken-cake', payload);
  return result.data;
};

const storeBrokenCake = async payload => {
  const result = await hitApi().post('/create-broken-cake', payload);
  return result.data;
};

const updateOutlet = async (id, payload) => {
  const result = await hitApi().put(`/update-destination/${id}`, payload);
  return result.data;
};

const deleteOutlet = async id => {
  const result = await hitApi().delete(`/delete-destination/${id}`);
  return result.data;
};

const deleteBrokenCake = async id => {
  const result = await hitApi().delete(`/delete-broken-cake/${id}`);
  return result.data;
};
export {
  getOutlet,
  deleteOutlet,
  getDetailOutlet,
  storeOutlet,
  getBrokenCake,
  storeBrokenCake,
  updateOutlet,
  deleteBrokenCake,
};
