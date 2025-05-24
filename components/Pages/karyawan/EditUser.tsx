import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import InputComponent from 'components/Form/InputComponent';
import ButtonComponent from 'components/Button/ButtonComponent';
import useGetJob from 'utils/api/job/use-get-job';
import useUpdateUser from 'utils/api/user/use-update-user';
import { useEffect, useRef, useState } from 'react';
import useGetDestination from 'utils/api/destination/use-get-destination';
import useGetUser from 'utils/api/user/use-get-user';
import Select from 'react-select';

export function EditUser({ GetDetailUser, queryClient }) {
  const initialValue = GetDetailUser?.data?.data;
  console.log(initialValue);
  const UpdateUser = useUpdateUser(initialValue?.id);
  const destinationRef = useRef();
  const jobRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
  const job = useGetJob({ isSelect: true });
  const role = [
    { value: 'seller', label: 'Seller' },
    { value: 'produksi', label: 'Produksi' },
    { value: 'delivery', label: 'Delivery' }
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
        <div className={'flex w-full flex-col'}>
          <label className={'text-sm'}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder={'Masukkan Password'}
              className={`border rounded-lg p-3 text-black text-sm w-full ${errors.password ? 'border-red-600' : 'border-gray-200'}`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
          <p className={'text-red-500 text-xs'}>{errors.password?.message?.toString() || ''}</p>
        </div>
        <div className={'flex w-full flex-col'}>
          <label className={'text-sm'}>Konfirmasi Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('password_confirmation')}
              placeholder={'Konfirmasi Password'}
              className={`border rounded-lg p-3 text-black text-sm w-full ${errors.password_confirmation ? 'border-red-600' : 'border-gray-200'}`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
          <p className={'text-red-500 text-xs'}>{errors.password_confirmation?.message?.toString() || ''}</p>
        </div>
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
