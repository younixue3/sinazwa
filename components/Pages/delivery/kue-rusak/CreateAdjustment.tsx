import InputComponent from 'components/Form/InputComponent';
import { Controller, useForm } from 'react-hook-form';
import ButtonComponent from 'components/Button/ButtonComponent';
import { ModalComponent } from 'components/Modal/ModalComponent';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import { useQueryClient } from 'react-query';
import Select from 'react-select';
import useGetDelivery from 'utils/api/delivery/use-get-delivery';
import useGetCategoryCakes from 'utils/api/category_cake/use-get-category-cakes';
import useStoreBrokenCake from 'utils/api/outlet/use-store-broken-cake';
import useGetDestination from 'utils/api/destination/use-get-destination';
import Cookies from 'js-cookie';
import { AUTH_ROLE } from 'utils/constants/cookies-keys';

export function CreateAdjustment() {
  const queryClient = useQueryClient();
  const cakeCategoryRef = useRef();
  const destinationRef = useRef();
  const StoreBrokenCake = useStoreBrokenCake();
  const [userRole, setUserRole] = useState('');
  const cakeCategory = useGetCategoryCakes({ isSelect: true });
  const destinationDelivery = useGetDestination({ isSelect: true });

  // Ambil role dari cookies dan update state
  useEffect(() => {
    const role = Cookies.get(AUTH_ROLE) || '';
    setUserRole(role);
  }, []);

  // Gunakan useCallback untuk getSchema agar tidak dibuat ulang pada setiap render
  const getSchema = useCallback(() => {
    const baseSchema = {
      quantity_adjustment: yup.string().nullable(),
      category_cake_id: yup.object().required('Kue harus di pilih.'),
      description: yup.string(),
      destination_id: yup.object().nullable()
    };

    // Jika role admin, tambahkan validasi destination_id
    if (userRole === 'admin') {
      return yup.object({
        ...baseSchema,
        destination_id: yup.object().required('Destinasi harus di pilih.')
      });
    }

    return yup.object(baseSchema);
  }, [userRole]); // Hanya bergantung pada userRole

  // Buat resolver sekali saja saat komponen dimount atau userRole berubah
  const formResolver = useMemo(() => yupResolver(getSchema()), [getSchema]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    reset,
    formState: { errors }
  } = useForm({
    resolver: formResolver,
    mode: 'onChange' // Ini akan memicu validasi saat input berubah
  });

  const onSubmit = form => {
    let payload = {
      ...form,
      category_cake_id: form.category_cake_id.value,
      qty_broken: form.qty_broken || 0,
      qty_raw_cake: form.qty_raw_cake || 0,
      qty_cooking_cake: form.qty_cooking_cake || 0,
      quantity_adjustment: form.quantity_adjustment || 0
    };

    // Tambahkan destination_id ke payload jika role admin
    if (userRole === 'admin' && form.destination_id) {
      payload.destination_id = form.destination_id.value;
    }
    
    StoreBrokenCake.mutate(payload, {
      onSuccess: data => {
        queryClient.invalidateQueries(useGetDelivery.keys());

        Swal.fire({
          title: 'Berhasil!',
          text: 'Penyesuaian berhasil di buat.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Refresh halaman setelah alert ditutup
          window.location.reload();
        });
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

          {/* Tampilkan field destination_id hanya jika role admin */}
          {userRole === 'admin' && (
            <div className={'flex w-full flex-col'}>
              <label className={'text-sm'}>Outlet</label>
              <Controller
                control={control}
                name={"destination_id" as any}
                render={({ field }) => (
                  <Select
                    className={'text-black'}
                    {...field}
                    instanceId="destination_id"
                    options={destinationDelivery.data || []}
                    onChange={input => {
                      setValue('destination_id' as any, input);
                      clearErrors('destination_id' as any);
                    }}
                    ref={destinationRef}
                    isDisabled={destinationDelivery.isLoading}
                  />
                )}
              />
              <p className={'text-red-500 text-xs'}>
                {(errors as any).destination_id?.message}
              </p>
            </div>
          )}
          
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
