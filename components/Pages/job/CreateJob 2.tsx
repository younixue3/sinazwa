import InputComponent from 'components/Form/InputComponent';
import { Controller, useForm } from 'react-hook-form';
import ButtonComponent from 'components/Button/ButtonComponent';
import { ModalComponent } from 'components/Modal/ModalComponent';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import { useQueryClient } from 'react-query';
import useStoreJob from 'utils/api/job/use-store-job';
import useGetJob from 'utils/api/job/use-get-job';

export function CreateJob() {
  const queryClient = useQueryClient();
  const StoreJob = useStoreJob();

  const schema = yup.object({
    job: yup.string().required('Nama Barang harus di isi.'),
    salary: yup.number().required('Gaji harus di isi.'),
    table_money: yup.number().required('Uang Harian harus di isi.')
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = form => {
    const payload = {
      ...form
    };

    StoreJob.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(useGetJob.keys());

        Swal.fire({
          title: 'Berhasil!',
          text: 'Job berhasil di tambah.',
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
    <ModalComponent
      text={'Tambah Job'}
      title={'Tambah Job'}
      color={'btn-success text-xs w-full'}
    >
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
          <ButtonComponent
            text={'Submit'}
            color={'btn-primary text-xs w-full'}
          />
        </div>
      </form>
    </ModalComponent>
  );
}
