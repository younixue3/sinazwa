import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import InputComponent from 'components/Form/InputComponent';
import ButtonComponent from 'components/Button/ButtonComponent';
import useUpdateJob from 'utils/api/job/use-update-job';
import useGetJob from 'utils/api/job/use-get-job';

export function EditJob({ GetDetailJob, queryClient }) {
  const initialValue = GetDetailJob?.data?.data;
  const UpdateJob = useUpdateJob(initialValue?.id);

  const schema = yup.object({
    job: yup.string().required('Nama Barang harus di isi.'),
    salary: yup.number().required('Gaji harus di isi.'),
    table_money: yup.number().required('Uang Harian harus di isi.')
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ values: initialValue, resolver: yupResolver(schema) });

  const onSubmit = form => {
    const payload = {
      ...form
    };

    UpdateJob.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(useGetJob.keys());

        Swal.fire({
          title: 'Berhasil!',
          text: 'Job berhasil di ubah.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        reset();
      },
      onError: (err: any) => {
        const errors = err.response.data;
        SwalErrors({ errors });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={'grid grid-cols-1 gap-3'}>
        <InputComponent
          label={'Nama Job'}
          placeholder={'Masukkan Nama Job'}
          error={errors.job?.message}
          register={register('job')}
        />
        <InputComponent
          label={'Jumlah Gaji'}
          type={'number'}
          placeholder={'Masukkan Jumlah Gaji'}
          error={errors.salary?.message}
          register={register('salary')}
        />
        <InputComponent
          label={'Jumlah Uang Harian'}
          type={'number'}
          placeholder={'Masukkan Jumlah Uang Harian'}
          error={errors.table_money?.message}
          register={register('table_money')}
        />
        <ButtonComponent text={'Submit'} color={'btn-primary text-xs w-full'} />
      </div>
    </form>
  );
}
