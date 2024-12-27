import InputComponent from 'components/Form/InputComponent';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import ButtonComponent from 'components/Button/ButtonComponent';
import { ModalComponent } from 'components/Modal/ModalComponent';
import { useRef } from 'react';
import useStoreBarang from 'utils/api/inventaris/use-store-barang';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useGetCategoryCakes from 'utils/api/category_cake/use-get-category-cakes';
import useGetBarangs from 'utils/api/inventaris/use-get-barangs';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import { useQueryClient } from 'react-query';

export function CreateInventory() {
  const queryClient = useQueryClient();
  const categoryCakesRef = useRef();
  const StoreBarang = useStoreBarang();

  const schema = yup.object({
    name: yup.string().required('Nama Barang harus di isi.'),
    qty: yup.number().required('Jumlah Barang harus di isi.'),
    description: yup.string().required('Deskripsi harus di isi.')
    // category_cake_id: yup.array().required('Category Cake haru di isi.')
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

  const categoryCakes = useGetCategoryCakes({ isSelect: true });

  const onSubmit = form => {
    const payload = {
      ...form
      // category_cake_id: form.category_cake_id.map(category => category.value)
    };

    StoreBarang.mutate(payload, {
      onSuccess: () => {
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
    <ModalComponent
      text={'Tambah Barang'}
      title={'Tambah Barang'}
      color={'btn-success text-xs w-full'}
    >
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
          {/* <div className={'flex w-full flex-col'}>
            <label className={'text-sm'}>Kategori Kue</label>
            <Controller
              control={control}
              name="category_cake_id"
              render={({ field }) => (
                <Select
                  className={'text-black'}
                  {...field}
                  isMulti
                  instanceId="category_cake_id"
                  options={categoryCakes.data || []}
                  onChange={(input: any) => {
                    setValue('category_cake_id', input);
                    clearErrors('category_cake_id');
                  }}
                  ref={categoryCakesRef}
                  isDisabled={categoryCakes.isLoading}
                />
              )}
            />
            <span className="text-red-600 text-sm">
              {errors.category_cake_id?.message}
            </span>
          </div> */}
          <ButtonComponent
            text={'Submit'}
            color={'btn-primary text-xs w-full'}
          />
        </div>
      </form>
    </ModalComponent>
  );
}
