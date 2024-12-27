import hitApi from 'utils/http';

const getJobs = async () => {
  const result = await hitApi().get('/job');
  return result.data;
};

const storeJob = async payload => {
  const result = await hitApi().post('/create-job', payload);
  return result.data;
};

const getDetailJob = async ({ id }) => {
  const result = await hitApi().get(`/edit-job/${id}`);
  return result.data;
};

const updateJob = async (id, payload) => {
  const result = await hitApi().put(`/update-job/${id}`, payload);
  return result.data;
};

const deleteJob = async id => {
  const result = await hitApi().delete(`/delete-job/${id}`);
  return result.data;
};

export { getJobs, getDetailJob, storeJob, updateJob, deleteJob };
