import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputComponent from 'components/Form/InputComponent';
import ButtonComponent from 'components/Button/ButtonComponent';
import { getDeliveryExcel } from 'utils/api/reporting/reportingApi';
import { ModalComponent } from 'components/Modal/ModalComponent';

export function LaporanInventory() {
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
    getDeliveryExcel(payload);
  };

  return (
    <ModalComponent
      color={'btn-success text-xs w-full'}
      text={'Laporan Delivery'}
      title="Laporan Delivery"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={'grid grid-cols-1 gap-3'}>
          <InputComponent
            label={'Tanggal Mulai'}
            placeholder={'Masukkan Tanggal Mulai'}
            error={errors.start_date?.message}
            type="date"
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
            text={'Submit'}
            color={'btn-primary text-xs w-full'}
          />
        </div>
      </form>
    </ModalComponent>
  );
}
