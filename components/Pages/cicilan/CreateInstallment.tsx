import InputComponent from 'components/Form/InputComponent';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import ButtonComponent from 'components/Button/ButtonComponent';
import { ModalComponent } from 'components/Modal/ModalComponent';
import { useRef } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import { useQueryClient } from 'react-query';
import useGetUser from 'utils/api/user/use-get-user';
import useStoreInstallment from 'utils/api/cicilan/use-store-installment';
import useGetInstallment from 'utils/api/cicilan/use-get-instalment';

export function CreateInstallment() {
  const queryClient = useQueryClient();
  const userRef = useRef();
  const StoreInstallment = useStoreInstallment();

  const schema = yup.object({
    daily_installment: yup.number().required('Cicilan Harian harus di isi.'),
    user_id: yup.object().required('Job haru di isi.')
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

  const user = useGetUser({ isSelect: true, role: 'produksi' });

  const onSubmit = form => {
    const payload = {
      ...form,
      user_id: form.user_id.value
    };

    StoreInstallment.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(useGetInstallment.keys());

        Swal.fire({
          title: 'Berhasil!',
          text: 'Cicilan berhasil di tambah.',
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
      text={'Tambah Cicilan'}
      title={'Tambah Cicilan'}
      color={'btn-success text-xs w-full'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={'grid grid-cols-1 gap-3'}>
          <InputComponent
            label={'Cicilan Harian'}
            placeholder={'Masukkan Cicilan Harian'}
            error={errors.daily_installment?.message}
            register={register('daily_installment')}
          />
          <div className={'flex w-full flex-col'}>
            <label className={'text-sm'}>Karyawan</label>
            <Controller
              control={control}
              name="user_id"
              render={({ field }) => (
                <Select
                  className={'text-black'}
                  {...field}
                  instanceId="user_id"
                  // @ts-ignore
                  options={user.data || []}
                  onChange={(input: any) => {
                    setValue('user_id', input);
                    clearErrors('user_id');
                  }}
                  ref={userRef}
                />
              )}
            />
            <span className="text-red-600 text-sm">
              {errors.user_id?.message.toString() || ''}
            </span>
          </div>
          <ButtonComponent
            text={'Submit'}
            color={'btn-primary text-xs w-full'}
          />
        </div>
      </form>
    </ModalComponent>
  );
}
