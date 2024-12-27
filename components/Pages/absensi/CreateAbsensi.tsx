import InputComponent from 'components/Form/InputComponent';
import { Controller, useForm } from 'react-hook-form';
import ButtonComponent from 'components/Button/ButtonComponent';
import { useRef } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import { useQueryClient } from 'react-query';
import Select from 'react-select';
import useGetDestination from 'utils/api/destination/use-get-destination';
import useStoreDelivery from 'utils/api/delivery/use-store-delivery';
import useGetDelivery from 'utils/api/delivery/use-get-delivery';
import useStoreAbsensi from 'utils/api/absensi/use-store-absensi';

const Absensi: any = [
  { value: 'MASUK', label: 'MASUK' },
  { value: 'TIDAK MASUK', label: 'TIDAK MASUK' },
  { value: 'IJIN', label: 'IJIN' },
  { value: 'SAKIT', label: 'SAKIT' }
].map(item => ({
  label: item.label,
  value: item.value
}));

export function CreateAbsensi() {
  const queryClient = useQueryClient();
  const absenRef = useRef();
  const destinationRef = useRef();
  const StoreAbsensi = useStoreAbsensi();

  const schema = yup.object({
    absen: yup.object().required('Absen harus di isi.'),
    description: yup.string().nullable()
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
    let payload = {
      ...form,
      absen: form.absen.value
    };
    StoreAbsensi.mutate(payload, {
      onSuccess: data => {
        Swal.fire({
          title: 'Berhasil!',
          text: 'Absen berhasil di buat.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        reset();
      },
      onError: (err: any) => {
        const errors = err.response.data.data;
        SwalErrors({ errors });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={'grid grid-cols-1 gap-3'}>
        <div className={'flex w-full flex-col'}>
          <label className={'text-sm'}>Absen</label>
          <Controller
            control={control}
            name="absen"
            render={({ field }) => (
              <Select
                className={'text-black'}
                {...field}
                instanceId="absen"
                options={Absensi}
                onChange={input => {
                  setValue('absen', input);
                  clearErrors('absen');
                }}
                ref={absenRef}
              />
            )}
          />
          <p className={'text-red-500 text-xs'}>{errors.absen?.message}</p>
        </div>
        <InputComponent
          label={'Description'}
          placeholder={'Masukkan Description'}
          error={errors.description?.message}
          register={register('description')}
        />
        <ButtonComponent text={'Submit'} color={'btn-primary text-xs w-full'} />
      </div>
    </form>
  );
}
