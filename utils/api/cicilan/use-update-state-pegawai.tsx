import { useMutation } from 'react-query';
import { statusPegawai } from 'utils/api/cicilan/installmentApi';

const useUpdateStatusPegawai = () => {
  return useMutation(async ({ id, payload }: { id: number; payload: { aktif: number } }) =>
    await statusPegawai(id, payload)
  );
};

export default useUpdateStatusPegawai;