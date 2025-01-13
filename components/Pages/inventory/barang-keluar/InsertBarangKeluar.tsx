import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useGetBarangs from 'utils/api/inventaris/use-get-barangs';
import Swal from 'sweetalert2';
import InputComponent from 'components/Form/InputComponent';
import ButtonComponent from 'components/Button/ButtonComponent';
import useBarangKeluar from 'utils/api/inventaris/use-barang-keluar';

export function InsertBarangKeluar({ GetDetailBarang, queryClient }) {
  const initialValue = GetDetailBarang?.data?.data;
  const BarangKeluar = useBarangKeluar();

  const schema = yup.object({
    qty_item: yup.number().required('Jumlah Barang harus di isi.'),
    description: yup.string().required('Deskripsi harus di isi.')
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ values: initialValue, resolver: yupResolver(schema) });

  const onSubmit = form => {
    const payload = {
      ...form,
      inventory_id: initialValue.id
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
        <ButtonComponent
          type={'submit'}
          text={'Submit'}
          color={'btn-primary text-xs w-full'}
        />
      </div>
    </form>
  );
}
