import { useEffect, useRef } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import InputComponent from 'components/Form/InputComponent';
import ButtonComponent from 'components/Button/ButtonComponent';
import useGetCake from 'utils/api/cake_production/use-get-cake';
import useUpdateCake from 'utils/api/cake_production/use-update-cake';
import useUpdateCategoryCake from '../../../utils/api/category_cake/use-update-category-cake';
import queryClient from 'helper/queryClient';
import useGetDetailCake from 'utils/api/cake_production/use-get-detail-cake';

export function UpdateCake({ GetDetailCake }) {
  const initialValue = GetDetailCake?.data?.data;
  const categoryCakesRef = useRef();
  const modalRef = useRef();
  const UpdateCake = useUpdateCake(initialValue?.id);
  const UpdateCategoryCake = useUpdateCategoryCake(
    initialValue?.category_cake.id
  );

  const schema = yup.object({
    name: yup.string().required('Nama harus di isi.'),
    qty_production: yup.number().required('Jumlah Kue harus di isi.'),
    price: yup.number().required('Harga harus di isi'),
    description: yup.string().required('Deskripsi harus di isi.'),
    qty_max_box: yup.number().min(1).required('Jumlah per Box harus di isi.')
  });
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ values: initialValue, resolver: yupResolver(schema) });

  useEffect(() => {
    setValue('name', initialValue?.category_cake.name);
    setValue('qty_max_box', initialValue?.category_cake.qty_max_box);
  }, [initialValue]);

  const onSubmit = form => {
    const payload = {
      ...form
    };

    UpdateCake.mutate(payload, {
      onSuccess: () => {
        UpdateCategoryCake.mutate(payload, {
          onSuccess: () => {
            queryClient.invalidateQueries(useGetCake.keys());

            Swal.fire({
              title: 'Berhasil!',
              text: 'Kue berhasil di ubah.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });

            reset();
          }
        });
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
          label={'Nama Kue'}
          placeholder={'Masukkan Nama Kue'}
          error={errors.name?.message}
          register={register('name')}
        />
        <InputComponent
          label={'Jumlah Kue'}
          placeholder={'Masukkan Jumlah Kue'}
          error={errors.qty_production?.message}
          register={register('qty_production')}
        />
        <InputComponent
          label={'Harga Kue'}
          type={'number'}
          placeholder={'Masukkan Harga Kue'}
          error={errors.price?.message}
          register={register('price')}
        />
        <InputComponent
          label={'Deskripsi'}
          placeholder={'Masukkan Deskripsi'}
          error={errors.description?.message}
          register={register('description')}
        />
        <InputComponent
          label={'Jumlah per Box'}
          placeholder={'Masukkan Jumlah per Box'}
          error={errors.qty_max_box?.message}
          register={register('qty_max_box')}
        />
        <ButtonComponent text={'Submit'} color={'btn-primary text-xs w-full'} />
      </div>
    </form>
  );
}
