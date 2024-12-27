import hitApi from 'utils/http';

const getUsers = async () => {
  const result = await hitApi().get('/data-user');
  return result.data;
};

const getDetailUser = async ({ id }) => {
  const result = await hitApi().get(`/edit-user/${id}`);
  return result.data;
};

const storeUser = async payload => {
  const result = await hitApi().post('/create-data-user', payload);
  return result.data;
};

const updateUser = async (id, payload) => {
  const result = await hitApi().put(`/update-user/${id}`, payload);
  return result.data;
};

const deleteUser = async id => {
  const result = await hitApi().delete(`/delete-user/${id}`);
  return result.data;
};

export { getUsers, getDetailUser, storeUser, updateUser, deleteUser };
