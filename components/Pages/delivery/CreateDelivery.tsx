import InputComponent from 'components/Form/InputComponent';
import { Controller, useForm } from 'react-hook-form';
import ButtonComponent from 'components/Button/ButtonComponent';
import { ModalComponent } from 'components/Modal/ModalComponent';
import { useRef } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import { useQueryClient } from 'react-query';
import Select from 'react-select';
import useGetCake from 'utils/api/cake_production/use-get-cake';
import useGetDestination from 'utils/api/destination/use-get-destination';
import useStoreDelivery from 'utils/api/delivery/use-store-delivery';
import useGetDelivery from 'utils/api/delivery/use-get-delivery';

export function CreateDelivery() {
  const queryClient = useQueryClient();
  const cakeProductionRef = useRef();
  const destinationRef = useRef();
  const StoreDelivery = useStoreDelivery();

  const schema = yup.object({
    box: yup.number().required('Jumlah Box harus di isi.'),
    cake_production_id: yup.object().required('Kue harus di pilih.'),
    destination_id: yup.object().required('Destinasi harus di pilih.')
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

  const cakeProduction = useGetCake({ isSelect: true });

  const destinationDelivery = useGetDestination({ isSelect: true });

  const onSubmit = form => {
    let payload = {
      ...form,
      cake_production_id: form.cake_production_id.value,
      destination_id: form.destination_id.value
    };
    StoreDelivery.mutate(payload, {
      onSuccess: data => {
        queryClient.invalidateQueries(useGetDelivery.keys());

        Swal.fire({
          title: 'Berhasil!',
          text: 'Delivery berhasil di buat.',
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
      text={'Antar Kue'}
      title={'Antar Kue'}
      color={'btn-success text-xs w-full'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={'grid grid-cols-1 gap-3'}>
          <div className={'flex w-full flex-col'}>
            <label className={'text-sm'}>Kategori Kue</label>
            <Controller
              control={control}
              name="cake_production_id"
              render={({ field }) => (
                <Select
                  className={'text-black'}
                  {...field}
                  instanceId="cake_production_id"
                  options={cakeProduction.data || []}
                  onChange={input => {
                    setValue('cake_production_id', input);
                    clearErrors('cake_production_id');
                  }}
                  ref={cakeProductionRef}
                  isDisabled={cakeProduction.isLoading}
                />
              )}
            />
            <p className={'text-red-500 text-xs'}>
              {errors.cake_production_id?.message}
            </p>
          </div>
          <InputComponent
            label={'Jumlah Box'}
            type={'number'}
            placeholder={'Masukkan Jumlah Box'}
            error={errors.box?.message}
            register={register('box')}
          />
          <div className={'flex w-full flex-col'}>
            <label className={'text-sm'}>Destinasi Antar</label>
            <Controller
              control={control}
              name="destination_id"
              render={({ field }) => (
                <Select
                  className={'text-black'}
                  {...field}
                  instanceId="destination_id"
                  options={destinationDelivery.data || []}
                  onChange={input => {
                    setValue('destination_id', input);
                    clearErrors('destination_id');
                  }}
                  ref={destinationRef}
                  isDisabled={destinationDelivery.isLoading}
                />
              )}
            />
            <p className={'text-red-500 text-xs'}>
              {errors.destination_id?.message}
            </p>
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
