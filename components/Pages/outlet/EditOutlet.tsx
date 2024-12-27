import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import InputComponent from 'components/Form/InputComponent';
import ButtonComponent from 'components/Button/ButtonComponent';
import useUpdateOutlet from 'utils/api/outlet/use-update-outlet';
import useGetOutlet from 'utils/api/outlet/use-get-outlet';

export function EditOutlet({ GetDetailOutlet, queryClient }) {
  const initialValue = GetDetailOutlet?.data?.data;
  const UpdateOutlet = useUpdateOutlet(initialValue?.id);

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
  } = useForm({ values: initialValue, resolver: yupResolver(schema) });

  const onSubmit = form => {
    const payload = {
      ...form
    };

    UpdateOutlet.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries(useGetOutlet.keys());

        Swal.fire({
          title: 'Berhasil!',
          text: 'Outlet berhasil di ubah.',
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
        <ButtonComponent text={'Submit'} color={'btn-primary text-xs w-full'} />
      </div>
    </form>
  );
}
