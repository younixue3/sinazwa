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
import useGetDelivery from 'utils/api/delivery/use-get-delivery';
import useGetCategoryCakes from 'utils/api/category_cake/use-get-category-cakes';
import useStoreBrokenCake from 'utils/api/outlet/use-store-broken-cake';

export function CreateAdjustment() {
  const queryClient = useQueryClient();
  const cakeCategoryRef = useRef();
  const StoreBrokenCake = useStoreBrokenCake();

  const schema = yup.object({
    quantity_adjustment: yup.string().nullable(),
    category_cake_id: yup.object().required('Kue harus di pilih.'),
    description: yup.string()
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

  const cakeCategory = useGetCategoryCakes({ isSelect: true });

  const onSubmit = form => {
    let payload = {
      ...form,
      category_cake_id: form.category_cake_id.value,
      qty_broken: form.qty_broken || 0,
      qty_raw_cake: form.qty_raw_cake || 0,
      qty_cooking_cake: form.qty_cooking_cake || 0,
      quantity_adjustment: form.quantity_adjustment || 0
    };
    StoreBrokenCake.mutate(payload, {
      onSuccess: data => {
        queryClient.invalidateQueries(useGetDelivery.keys());

        Swal.fire({
          title: 'Berhasil!',
          text: 'Penyesuaian berhasil di buat.',
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
      text={'Input Penyesuaian'}
      title={'Input Penyesuaian'}
      color={'btn-success text-xs w-full'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={'grid grid-cols-1 gap-3'}>
          <div className={'flex w-full flex-col'}>
            <label className={'text-sm'}>Kategori Kue</label>
            <Controller
              control={control}
              name="category_cake_id"
              render={({ field }) => (
                <Select
                  className={'text-black'}
                  {...field}
                  instanceId="category_cake_id"
                  options={cakeCategory.data || []}
                  onChange={input => {
                    setValue('category_cake_id', input);
                    clearErrors('category_cake_id');
                  }}
                  ref={cakeCategoryRef}
                  isDisabled={cakeCategory.isLoading}
                />
              )}
            />
            <p className={'text-red-500 text-xs'}>
              {errors.category_cake_id?.message}
            </p>
          </div>
          <InputComponent
            label={'Deskripsi'}
            placeholder={'Masukkan Deskripsi'}
            error={errors.description?.message}
            register={register('description')}
          />
          <InputComponent
            label={'Jumlah Penyesuaian'}
            type={'number'}
            placeholder={'Masukkan Jumlah Penyesuaian'}
            error={errors.quantity_adjustment?.message}
            register={register('quantity_adjustment')}
          />
          <ButtonComponent
            text={'Submit'}
            color={'btn-primary text-xs w-full'}
          />
        </div>
      </form>
    </ModalComponent>
  );
}
