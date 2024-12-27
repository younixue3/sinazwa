import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import InputComponent from 'components/Form/InputComponent';
import ButtonComponent from 'components/Button/ButtonComponent';
import { useEffect, useRef } from 'react';
import useGetUser from 'utils/api/user/use-get-user';
import Select from 'react-select';
import useUpdateInstallment from 'utils/api/cicilan/use-update-installment';
import useGetInstallment from 'utils/api/cicilan/use-get-instalment';

export function EditInstallment({
  GetDetailUser: GetDetailInstallment,
  queryClient
}) {
  const initialValue = GetDetailInstallment?.data?.data;
  const UpdateInstallment = useUpdateInstallment(initialValue?.id);
  const userRef = useRef();
  console.log(initialValue);

  const schema = yup.object({
    daily_installments: yup.number().required('Cicilan Harian harus di isi.'),
    user_id: yup.object().required('Karyawan harus dipilih.')
  });
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm({ values: initialValue, resolver: yupResolver(schema) });

  const user = useGetUser({ isSelect: true });

  useEffect(() => {
    setValue('user_id', {
      value: initialValue?.user.id,
      label: initialValue?.user.name
    });
  }, [setValue, initialValue]);

  const onSubmit = form => {
    const payload = {
      ...form,
      user_id: form.user_id.value
    };

    UpdateInstallment.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(useGetInstallment.keys());

        Swal.fire({
          title: 'Berhasil!',
          text: 'Cicilan berhasil di ubah.',
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
          label={'Cicilan Harian'}
          placeholder={'Masukkan Cicilan Harian'}
          error={errors.daily_installments?.message}
          register={register('daily_installments')}
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
          <span className="text-red-600 text-sm">{`${errors.user_id?.message}`}</span>
        </div>
        <ButtonComponent text={'Submit'} color={'btn-primary text-xs w-full'} />
      </div>
    </form>
  );
}
