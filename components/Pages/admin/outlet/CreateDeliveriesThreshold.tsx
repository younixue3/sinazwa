import { yupResolver } from '@hookform/resolvers/yup';
import ButtonComponent from 'components/Button/ButtonComponent';
import InputComponent from 'components/Form/InputComponent';
import { ModalComponent } from 'components/Modal/ModalComponent';
import SwalErrors from 'helper/swal-errors';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useQueryClient } from 'react-query';
import useGetCake from 'utils/api/cake_production/use-get-cake';
import useStoreDeliveriesThreshold from 'utils/api/DeliveryThreshold/use-store-deliveries-threshold';
import useGetDestination from 'utils/api/destination/use-get-destination';
import * as yup from 'yup';
import useGetDeliveryThreshold from 'utils/api/DeliveryThreshold/use-get-deliveries-threshold';

export function CreateDeliveriesThreshold() {
  const queryClient = useQueryClient();
  const cakeProductionRef = useRef();
  const destinationRef = useRef();

  const cakeProduction = useGetCake({ isSelect: true });
  const destinationDelivery = useGetDestination({ isSelect: true });
  const StoreDeliveriesThreshold = useStoreDeliveriesThreshold();

  const schema = yup.object({
    destination_id: yup.object().required('Destinasi harus di pilih.'),
    cake_production_id: yup.object().required('Kue harus di pilih.'),
    threshold: yup
      .number()
      .typeError('Threshold harus berupa angka')
      .required('Threshold wajib diisi')
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = form => {
    const payload = {
      ...form,
      category_cake_id: form.cake_production_id.value,
      destination_id: form.destination_id.value,
      threshold: Number(form.threshold)
    };

    StoreDeliveriesThreshold.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(useGetDeliveryThreshold.keys());

        Swal.fire({
          title: 'Success!',
          text: 'Threshold has been created successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });

        reset();
      },
      onError: (err: any) => {
        const errors = err.response?.data;
        SwalErrors({ errors });
      }
    });
  };

  return (
    <ModalComponent
      text="Buat Target Antaran"
      title="Buat Target Antaran"
      color="btn-primary w-48 border border-primary"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
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
            label="Target Antaran"
            type="number"
            placeholder="Masukkan Target Antaran"
            error={errors.threshold?.message}
            register={register('threshold')}
          />
        </div>
        <div className="flex justify-end">
          <ButtonComponent
            type="submit"
            text="Add New Threshold"
            color="btn-primary w-48 border border-primary"
          />
        </div>
      </form>
    </ModalComponent>
  );
}

export default CreateDeliveriesThreshold;
