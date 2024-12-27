import hitApi from 'utils/http';

const getAbsensi = async () => {
  const result = await hitApi().get('/absensi');
  return result.data;
};

const getDetailAbsensi = async ({ id }) => {
  const result = await hitApi().get(`/edit-absensi/${id}`);
  return result.data;
};

const storeAbsensi = async payload => {
  const result = await hitApi().post('/create-absensi', payload);
  return result.data;
};

const updateAbsensi = async (id, payload) => {
  const result = await hitApi().put(`/update-absensi/${id}`, payload);
  return result.data;
};

const deleteAbsensi = async id => {
  const result = await hitApi().delete(`/delete-absensi/${id}`);
  return result.data;
};

export {
  getAbsensi,
  getDetailAbsensi,
  storeAbsensi,
  updateAbsensi,
  deleteAbsensi
};
