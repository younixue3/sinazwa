import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import InputComponent from 'components/Form/InputComponent';
import ButtonComponent from 'components/Button/ButtonComponent';
import useGetCake from 'utils/api/cake_production/use-get-cake';
import useUpdateDailyInstallment from 'utils/api/installment/use-update-daily-installment';
import Select from 'react-select';
import { useRef } from 'react';
import useGetUser from 'utils/api/user/use-get-user';

export function EditCake({ GetDetailCake, queryClient }) {
  const initialValue = GetDetailCake?.data?.data;
  const UpdateDailyInstallment = useUpdateDailyInstallment();
  const GetUser = useGetUser({ isSelect: true, role: 'produksi' });
  const userRef = useRef();

  const schema = yup.object({
    user_id: yup.object().required('User harus dipilih.'),
    finish: yup.number().required('Jumlah Kue harus di isi.')
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

  const onSubmit = async form => {
    const userName = form.user_id?.label || '-';
    const jumlahKue = form.finish;
    const categoryCake = initialValue.category_cake.name || '-';
    const result = await Swal.fire({
      title: 'Konfirmasi',
      html: `<div>Nama Kue: <b>${categoryCake}</b></div><div>Staff: <b>${userName}</b></div><div>Jumlah Kue: <b>${jumlahKue}</b></div><div class='mt-2'>Apakah Anda yakin akan input jumlah stock kue?</div>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Input!',
      cancelButtonText: 'Batal'
    });
    if (!result.isConfirmed) return;

    const payload = {
      ...form,
      category_cake_id: initialValue.category_cake_id,
      user_id: form.user_id.value
    };

    UpdateDailyInstallment.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(useGetCake.keys());

        Swal.fire({
          title: 'Berhasil!',
          text: 'Kue berhasil di input.',
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
        <div className={'flex w-full flex-col'}>
          <label className={'text-sm'}>Staff Memasak</label>
          <Controller
            control={control}
            name="user_id"
            render={({ field, fieldState: { error } }) => (
              <>
                <Select
                  className={'text-black'}
                  {...field}
                  instanceId="user_id"
                  options={GetUser.data || []}
                  onChange={input => {
                    setValue('user_id', input);
                    clearErrors('user_id');
                  }}
                  ref={userRef}
                  isDisabled={GetUser.isLoading}
                />
                <p className={'text-red-500 text-xs'}>{error?.message}</p>
              </>
            )}
          />
        </div>
        <InputComponent
          label={'Jumlah Kue'}
          placeholder={'Masukkan Jumlah Kue'}
          error={errors.finish?.message}
          register={register('finish')}
        />
        <ButtonComponent text={'Submit'} color={'btn-primary text-xs w-full'} />
      </div>
    </form>
  );
}
