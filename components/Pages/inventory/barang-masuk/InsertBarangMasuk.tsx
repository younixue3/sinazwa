import { useEffect, useRef } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useGetCategoryCakes from 'utils/api/category_cake/use-get-category-cakes';
import useGetBarangs from 'utils/api/inventaris/use-get-barangs';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import InputComponent from 'components/Form/InputComponent';
import ButtonComponent from 'components/Button/ButtonComponent';
import useUpdateBarang from 'utils/api/inventaris/use-update-barang';

export function InsertBarangMasuk({ GetDetailBarang, queryClient }) {
  const initialValue = GetDetailBarang?.data?.data;
  const UpdateBarang = useUpdateBarang(initialValue?.id);

  const schema = yup.object({
    qty: yup.number().required('Jumlah Barang harus di isi.')
  });
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({ values: initialValue, resolver: yupResolver(schema) });

  useEffect(() => {
    setValue(
      'category_cake_id',
      initialValue?.category_cake.map(category => ({
        value: category.id,
        label: category.name
      }))
    );
  }, [setValue, initialValue]);

  const onSubmit = form => {
    const payload = {
      ...form,
      category_cake_id: form.category_cake_id.map(category => category.value)
    };

    UpdateBarang.mutate(payload, {
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={'grid grid-cols-1 gap-3'}>
        <InputComponent
          label={'Jumlah Barang'}
          type={'number'}
          placeholder={'Masukkan Jumlah Barang'}
          error={errors.qty?.message}
          register={register('qty')}
        />
        <ButtonComponent text={'Submit'} color={'btn-primary text-xs w-full'} />
      </div>
    </form>
  );
}
