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

const historySaleCake = async () => {
  const result = await hitApi().get('/history-detail-sale');
  return result.data.data;
};

const storeOutletExpenses = async payload => {
  const result = await hitApi().post('/outlet-expenses', payload);
  return result.data;
};

const getOutletExpenses = async() => {
  const result = await hitApi().get('/outlet-expenses');
  return result.data;
};
const getOutletExpensesById = async id => {
  const result = await hitApi().get(`/edit-outlet-expenses/${id}`);
  return result.data;
};

const updateOutletExpenses = async (id, payload) => {
  const result = await hitApi().put(`/update-outlet-expenses/${id}`, payload);
  return result.data;
}

const deleteOutletExpenses = async id => {
  const result = await hitApi().delete(`/delete-outlet-expenses/${id}`);
  return result.data;
}

export {
  getOutlet,
  deleteOutlet,
  getDetailOutlet,
  storeOutlet,
  getBrokenCake,
  storeBrokenCake,
  updateOutlet,
  deleteBrokenCake,
  historySaleCake,
  storeOutletExpenses,
  getOutletExpenses,
  getOutletExpensesById,
  updateOutletExpenses,
  deleteOutletExpenses
};
