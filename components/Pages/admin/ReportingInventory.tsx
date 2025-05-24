import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputComponent from 'components/Form/InputComponent';
import ButtonComponent from 'components/Button/ButtonComponent';
import { ModalComponent } from 'components/Modal/ModalComponent';
import hitApi from 'utils/http';

export function ReportingInventory() {
  const schema = yup.object({
    start_date: yup.date().required('Tanggal Mulai harus di isi.'),
    end_date: yup.date().required('Tanggal Akhir harus di isi.')
  });
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) });

  function formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  const onSubmit = form => {
    const payload = {
      start_date: formatDate(form.start_date),
      end_date: formatDate(form.end_date)
    };
    
    // Panggil API reporting-inventory
    hitApi()
      .get('/reporting-inventory', {
        params: payload,
        responseType: 'blob'
      })
      .then(response => {
        // Buka file Excel yang didownload
        window.open(URL.createObjectURL(response.data));
      })
      .catch(error => {
        console.error('Error downloading report:', error);
        alert('Terjadi kesalahan saat mengunduh laporan.');
      });
  };

  return (
    <ModalComponent
      color={'bg-green-600 hover:bg-green-500 active:bg-green-300 hover:scale-105 text-white text-sm font-bold'}
      text={'Download Laporan Inventory'}
      title="Laporan Inventory"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={'grid grid-cols-1 gap-3'}>
          <InputComponent
            label={'Tanggal Mulai'}
            placeholder={'Masukkan Tanggal Mulai'}
            error={errors.start_date?.message}
            type={'date'}
            register={register('start_date')}
          />
          <InputComponent
            label={'Tanggal Berakhir'}
            type={'date'}
            placeholder={'Masukkan Tanggal Berakhir'}
            error={errors.end_date?.message}
            register={register('end_date')}
          />
          <ButtonComponent
            text={'Download'}
            color={'bg-blue-600 hover:bg-blue-500 active:bg-blue-300 hover:scale-105 text-white text-sm font-bold w-full'}
          />
        </div>
      </form>
    </ModalComponent>
  );
}