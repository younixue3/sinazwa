import hitApi from 'utils/http';

const getDeliveriesThreshold = async () => {
  const result = await hitApi().get('/deliveries-threshold');
  return result.data;
};

const getDeliveriesThresholdByDestinationId = async (params: {
  destination_id: string;
}) => {
  const result = await hitApi().get(
    `/deliveries-threshold/${params.destination_id}`
  );
  return result.data;
};

const storeDeliveriesThreshold = async payload => {
  const result = await hitApi().post('/deliveries-threshold', payload);
  return result.data;
};

const updateDeliveriesThreshold = async (id, payload) => {
  const result = await hitApi().put(`/deliveries-threshold/${id}`, payload);
  return result.data;
};

const destroyDeliveriesThreshold = async id => {
  const result = await hitApi().delete(`/deliveries-threshold/${id}`);
  return result.data;
};

export {
  getDeliveriesThreshold,
  getDeliveriesThresholdByDestinationId,
  storeDeliveriesThreshold,
  updateDeliveriesThreshold,
  destroyDeliveriesThreshold
};
