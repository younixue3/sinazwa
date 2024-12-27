import InputComponent from 'components/Form/InputComponent';
import { useForm } from 'react-hook-form';
import ButtonComponent from 'components/Button/ButtonComponent';
import { ModalComponent } from 'components/Modal/ModalComponent';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import { useQueryClient } from 'react-query';
import useGetOutlet from 'utils/api/outlet/use-get-outlet';
import useStoreOutlet from 'utils/api/outlet/use-store-outlet';

export function CreateOutlet() {
  const queryClient = useQueryClient();
  const StoreOutlet = useStoreOutlet();

  const schema = yup.object({
    name: yup.string().required('Nama harus di isi.'),
    address: yup.string().required('Alamat harus di isi.'),
    no_hp: yup.string().required('Nomor Handphone harus di isi.')
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
    StoreOutlet.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(useGetOutlet.keys());

        Swal.fire({
          title: 'Berhasil!',
          text: 'Outlet berhasil di tambah.',
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
      text={'Tambah Outlet'}
      title={'Tambah Outlet'}
      color={'btn-success text-xs w-full'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={'grid grid-cols-1 gap-3'}>
          <InputComponent
            label={'Nama Outlet'}
            placeholder={'Masukkan Nama Outlet'}
            error={errors.name?.message}
            register={register('name')}
          />
          <InputComponent
            label={'Alamat'}
            placeholder={'Masukkan Alamat Outlet'}
            error={errors.address?.message}
            register={register('address')}
          />
          <InputComponent
            label={'Nomor Handphone'}
            placeholder={'Masukkan Nomor Handphone Outlet'}
            error={errors.no_hp?.message}
            register={register('no_hp')}
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
