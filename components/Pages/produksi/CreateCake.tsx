import InputComponent from 'components/Form/InputComponent';
import { useForm } from 'react-hook-form';
import ButtonComponent from 'components/Button/ButtonComponent';
import { ModalComponent } from 'components/Modal/ModalComponent';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import { useQueryClient } from 'react-query';
import useStoreCake from 'utils/api/cake_production/use-store-cake';
import useStoreCategoryCake from 'utils/api/category_cake/use-store-category-cake';
import useGetCake from 'utils/api/cake_production/use-get-cake';

export function CreateCake() {
  const queryClient = useQueryClient();
  const StoreCake = useStoreCake();
  const StoreCategoryCake = useStoreCategoryCake();

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
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = form => {
    let payload = {
      ...form
    };
    StoreCategoryCake.mutate(payload, {
      onSuccess: data => {
        payload = {
          ...payload,
          category_cake_id: data.data.id
        };
        StoreCake.mutate(payload, {
          onSuccess: () => {
            queryClient.invalidateQueries(useGetCake.keys());

            Swal.fire({
              title: 'Berhasil!',
              text: 'Kue berhasil di tambah.',
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
      },
      onError: (err: any) => {
        const errors = err.response.data;
        SwalErrors({ errors });
      }
    });
  };

  return (
    <ModalComponent
      text={'Tambah Kue'}
      title={'Tambah Kue'}
      color={'btn-success text-xs w-full'}
    >
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
          <ButtonComponent
            text={'Submit'}
            color={'btn-primary text-xs w-full'}
          />
        </div>
      </form>
    </ModalComponent>
  );
}
