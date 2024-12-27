import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import InputComponent from 'components/Form/InputComponent';
import ButtonComponent from 'components/Button/ButtonComponent';
import useGetJob from 'utils/api/job/use-get-job';
import useUpdateUser from 'utils/api/user/use-update-user';
import { useEffect, useRef } from 'react';
import useGetDestination from 'utils/api/destination/use-get-destination';
import useGetUser from 'utils/api/user/use-get-user';
import Select from 'react-select';

export function EditUser({ GetDetailUser, queryClient }) {
  const initialValue = GetDetailUser?.data?.data;
  console.log(initialValue);
  const UpdateUser = useUpdateUser(initialValue?.id);
  const destinationRef = useRef();
  const jobRef = useRef();

  const schema = yup.object({
    name: yup.string().required('Nama harus di isi.'),
    email: yup.string().required('Email harus di isi.'),
    password: yup
      .string()
      .nullable()
      .test(
        'min-length',
        'Password minimal 8 karakter.',
        value => !value || value.length >= 8
      ),
    password_confirmation: yup
      .string()
      .nullable()
      .test('passwords-match', 'Passwords harus sama', function (value) {
        return !this.parent.password || this.parent.password === value;
      }),
    role: yup.object().required('Role harus di isi.'),
    destination_id: yup.object(),
    job_id: yup.object()
  });
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    clearErrors,
    formState: { errors }
  } = useForm({
    values: { ...initialValue, password: '' },
    resolver: yupResolver(schema)
  });

  const destination = useGetDestination({ isSelect: true }).data;
  destination.unshift({ label: 'Tidak ada', value: null });
  const job = useGetJob({ isSelect: true });
  const role = [
    { value: 'seller', label: 'Seller' },
    { value: 'produksi', label: 'Produksi' }
  ];

  useEffect(() => {
    setValue('destination_id', {
      value: initialValue?.destination?.id,
      label: initialValue?.destination?.name
    });
    setValue('job_id', {
      value: initialValue?.job?.id,
      label: initialValue?.job?.job
    });
    setValue('role', {
      value: initialValue?.role,
      label:
        initialValue?.role.charAt(0).toUpperCase() + initialValue?.role.slice(1)
    });
    // setValue('job_id', {
    //   value: initialValue?.job?.id,
    //   label: initialValue?.job?.name
    // });
  }, [setValue, initialValue]);

  const onSubmit = form => {
    const payload = {
      ...form,
      destination_id: form.destination_id?.value || null,
      job_id: form.job_id.value,
      role: form.role.value
    };

    UpdateUser.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(useGetUser.keys());

        Swal.fire({
          title: 'Berhasil!',
          text: 'User berhasil di ubah.',
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
          label={'Nama Lengkap'}
          placeholder={'Masukkan Nama Lengkap'}
          error={errors.name?.message}
          register={register('name')}
        />
        <InputComponent
          label={'Email'}
          placeholder={'Masukkan Email'}
          error={errors.email?.message}
          register={register('email')}
        />
        <InputComponent
          label={'Password'}
          type={'password'}
          placeholder={'Masukkan Password'}
          error={errors.password?.message}
          register={register('password')}
        />
        <InputComponent
          label={'Konfirmasi Password'}
          type={'password'}
          placeholder={'Konfirmasi Password'}
          error={errors.password?.message}
          register={register('password_confirmation')}
        />
        <div className={'flex w-full flex-col'}>
          <label className={'text-sm'}>Role</label>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select
                className={'text-black'}
                {...field}
                instanceId="role"
                // @ts-ignore
                options={role || []}
                onChange={(input: any) => {
                  setValue('role', input);
                  clearErrors('role');
                }}
              />
            )}
          />
          <span className="text-red-600 text-sm">
            {errors.role?.message.toString() || ''}
          </span>
        </div>
        <div className={'flex w-full flex-col'}>
          <label className={'text-sm'}>Outlet</label>
          <Controller
            control={control}
            name="destination_id"
            render={({ field }) => (
              <Select
                className={'text-black'}
                {...field}
                instanceId="destination_id"
                options={destination || []}
                onChange={(input: any) => {
                  setValue('destination_id', input);
                  clearErrors('destination_id');
                }}
                ref={destinationRef}
                isDisabled={destination.isLoading}
              />
            )}
          />
          <span className="text-red-600 text-sm">
            {errors.destination_id?.message.toString() || ''}
          </span>
        </div>
        <div className={'flex w-full flex-col'}>
          <label className={'text-sm'}>Job</label>
          <Controller
            control={control}
            name="job_id"
            render={({ field }) => (
              <Select
                className={'text-black'}
                {...field}
                instanceId="job_id"
                options={job.data || []}
                onChange={(input: any) => {
                  setValue('job_id', input);
                  clearErrors('job_id');
                }}
                ref={jobRef}
                isDisabled={job.isLoading}
              />
            )}
          />
          <span className="text-red-600 text-sm">
            {errors.job_id?.message.toString() || ''}
          </span>
        </div>
        <ButtonComponent text={'Submit'} color={'btn-primary text-xs w-full'} />
      </div>
    </form>
  );
}
