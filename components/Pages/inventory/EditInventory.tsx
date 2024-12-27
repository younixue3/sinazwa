import { useEffect, useRef } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useGetCategoryCakes from 'utils/api/category_cake/use-get-category-cakes';
import useGetBarangs from 'utils/api/inventaris/use-get-barangs';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import InputComponent from 'components/Form/InputComponent';
import Select from 'react-select';
import ButtonComponent from 'components/Button/ButtonComponent';
import useUpdateBarang from 'utils/api/inventaris/use-update-barang';

export function EditInventory({ GetDetailBarang, queryClient }) {
  const initialValue = GetDetailBarang?.data?.data;
  const UpdateBarang = useUpdateBarang(initialValue?.id);

  const schema = yup.object({
    name: yup.string().required('Nama Barang harus di isi'),
    qty: yup.number().required('Jumlah Barang harus di isi.'),
    description: yup.string().required('Deskripsi harus di isi.')
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    reset,
    formState: { errors }
  } = useForm({ values: initialValue, resolver: yupResolver(schema) });

  const categoryCakes = useGetCategoryCakes({ isSelect: true });

  useEffect(() => {}, [setValue, initialValue]);

  const onSubmit = form => {
    const payload = {
      ...form
    };

    UpdateBarang.mutate(payload, {
      onSuccess: data => {
        queryClient.invalidateQueries(useGetBarangs.keys());

        Swal.fire({
          title: 'Berhasil!',
          text: 'Barang berhasil di tambah.',
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
          label={'Nama'}
          placeholder={'Masukkan Nama Barang'}
          error={errors.name?.message}
          register={register('name')}
        />
        <InputComponent
          label={'Jumlah Barang'}
          type={'number'}
          placeholder={'Masukkan Jumlah Barang'}
          error={errors.qty?.message}
          register={register('qty')}
        />
        <InputComponent
          label={'Deskripsi'}
          placeholder={'Masukkan Deskripsi'}
          error={errors.description?.message}
          register={register('description')}
        />
        <ButtonComponent text={'Submit'} color={'btn-primary text-xs w-full'} />
      </div>
    </form>
  );
}
