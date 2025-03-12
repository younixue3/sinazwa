import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useGetBarangs from 'utils/api/inventaris/use-get-barangs';
import Swal from 'sweetalert2';
import InputComponent from 'components/Form/InputComponent';
import ButtonComponent from 'components/Button/ButtonComponent';
import useBarangKeluar from 'utils/api/inventaris/use-barang-keluar';
import useGetCategoryCakes from 'utils/api/category_cake/use-get-category-cakes';
import { useRef } from 'react';
// import Select from 'react-select/dist/declarations/src/Select';
import Select from 'react-select';

export function InsertBarangKeluar({ GetDetailBarang, queryClient }) {
  const initialValue = GetDetailBarang?.data?.data;
  const categoryCakesRef = useRef();
  const BarangKeluar = useBarangKeluar();

  const schema = yup.object({
    qty_item: yup.number().required('Jumlah Barang harus di isi.'),
    category_cake_id: yup.object().required('Category Cake'),
    description: yup.string().required('Deskripsi harus di isi.')
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


  const categoryCakes = useGetCategoryCakes({ isSelect: true });


  const onSubmit = form => {
    const payload = {
      ...form,
      inventory_id: initialValue.id,
      category_cake_id: form.category_cake_id.value,
      tipe_riwayat: 2
    };

    BarangKeluar.mutate(payload, {
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
        Swal.fire({
          title: 'Error!',
          text: err.response?.data?.Message || 'Terjadi kesalahan',
          icon: 'error',
          timer: 1500,
          showConfirmButton: false
        });
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
          error={errors.qty_item?.message}
          register={register('qty_item')}
        />
        <InputComponent
          label={'Deskripsi'}
          placeholder={'Masukkan Deskripsi'}
          error={errors.description?.message}
          register={register('description')}
        />
        <div className={'flex w-full flex-col'}>
          <label className={'text-sm'}>Kategori Kue</label>
          <Controller
            control={control}
            name="category_cake_id"
            render={({ field }) => (
              <Select
                className={'text-black'}
                inputValue={field.value ? field.value.label : ''}
                onInputChange={() => {}}
                onMenuOpen={() => {}}
                onMenuClose={() => {}}
                {...field}
                instanceId="category_cake_id"
                options={categoryCakes.data || []}
                onChange={(input) => {
                  field.onChange(input);
                  setValue('category_cake_id', input);
                  clearErrors('category_cake_id');
                }}
                isDisabled={categoryCakes.isLoading}
              />
            )}
          />
          {errors.category_cake_id && (
            <span className="text-xs text-red-500">
              {errors.category_cake_id.message.toString()}
            </span>
          )}
        </div>
        <ButtonComponent
          type={'submit'}
          text={'Submit'}
          color={'btn-primary text-xs w-full'}
        />
      </div>
    </form>
  );
}
