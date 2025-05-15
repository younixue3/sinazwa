import { useEffect, useRef } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import InputComponent from 'components/Form/InputComponent';
import ButtonComponent from 'components/Button/ButtonComponent';
import useGetCake from 'utils/api/cake_production/use-get-cake';
// import useUpdateCake from 'utils/api/cake_production/use-update-cake';
// import useUpdateOutlet from 'utils/api/outlet/use-update-outlet';
// import useGetOutlet from 'utils/api/outlet/use-get-outlet';
import Select from 'react-select';
// import useUpdateDelivery from 'utils/api/delivery/use-update-delivery';
// import { useQueryClient } from 'react-query';
import useGetDestination from 'utils/api/destination/use-get-destination';
import useGetDelivery from 'utils/api/delivery/use-get-delivery';
import useUpdateBox from 'utils/api/delivery/use-update-box';

export function EditDelivery({ GetDetailDelivery, queryClient }) {
  const initialValue = GetDetailDelivery?.data?.data;
  const UpdateDelivery = useUpdateBox(initialValue?.id);
  const cakeProductionRef = useRef();
  const destinationRef = useRef();

  const cakeProduction = useGetCake({ isSelect: true });

  const destinationDelivery = useGetDestination({ isSelect: true });

  const schema = yup.object({
    box: yup.number().required('Jumlah Kue harus di isi.'),
    cake_production_id: yup.object().required('Kue harus di pilih.'),
    destination_id: yup.object().required('Destinasi harus di pilih.')
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

  useEffect(() => {
    setValue('cake_production_id', {
      value: initialValue?.cake_production.category_cake.id,
      label: initialValue?.cake_production.category_cake.name
    });
    setValue('destination_id', {
      value: initialValue?.destination.id,
      label: initialValue?.destination.name
    });
  }, [initialValue, setValue]);

  const onSubmit = form => {
    let payload = {
      ...form,
      cake_production_id: form.cake_production_id.value,
      destination_id: form.destination_id.value
    };

    UpdateDelivery.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(useGetDelivery.keys());

        Swal.fire({
          title: 'Berhasil!',
          text: 'Delivery berhasil di ubah.',
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
            {`${errors.cake_production_id?.message}`}
          </p>
        </div>
        <InputComponent
          label={'Jumlah Kue'}
          type={'number'}
          placeholder={'Masukkan Jumlah Kue'}
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
            {`${errors.destination_id?.message}`}
          </p>
        </div>
        <ButtonComponent text={'Submit'} color={'btn-primary text-xs w-full'} />
      </div>
    </form>
  );
}
