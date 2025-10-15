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
import useGetJob from 'utils/api/job/use-get-job';
import useStoreUser from 'utils/api/user/use-store-user';
import useGetDestination from 'utils/api/destination/use-get-destination';
import useGetUser from 'utils/api/user/use-get-user';

export function CreateUser() {
  const queryClient = useQueryClient();
  const destinationRef = useRef();
  const jobRef = useRef();
  const StoreUser = useStoreUser();

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
    job_id: yup.object().required('Job haru di isi.')
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

  const destination = useGetDestination({ isSelect: true });
  const outlet = destination.data;
  // console.log(outlet);
  if (outlet) {
    outlet.unshift({ label: 'Tidak ada', value: null });
  }
  const job = useGetJob({ isSelect: true });
  const role = [
    { value: 'seller', label: 'Seller' },
    { value: 'produksi', label: 'Produksi' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'inventory', label: 'Inventory' }
  ];

  const onSubmit = form => {
    const payload = {
      ...form,
      destination_id: form.destination_id?.value || null,
      job_id: form.job_id.value,
      role: form.role.value
    };

    StoreUser.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(useGetUser.keys());

        Swal.fire({
          title: 'Berhasil!',
          text: 'Karyawan berhasil di tambah.',
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
      text={'Tambah User'}
      title={'Tambah User'}
      color={'btn-success text-xs w-full'}
    >
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
              {errors.role && errors.role?.message}
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
                  options={outlet || []}
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
              {errors.destination_id?.message}
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
              {errors.job_id?.message}
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
