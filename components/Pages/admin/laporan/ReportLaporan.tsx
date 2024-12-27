import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Swal from 'sweetalert2';
import SwalErrors from 'helper/swal-errors';
import InputComponent from 'components/Form/InputComponent';
import ButtonComponent from 'components/Button/ButtonComponent';
import useGetJob from 'utils/api/job/use-get-job';
import queryClient from 'helper/queryClient';
import { getDateReporting } from 'utils/api/reporting/reportingApi';

export function ReportLaporan({ DestinationId }) {
  const schema = yup.object({
    start_date: yup.date().required('Gaji harus di isi.'),
    end_date: yup.date().required('Tanggal Akhir harus di isi.'),
    download: yup.boolean()
  });
  const {
    register,
    handleSubmit,
    reset,
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
      ...form,
      start_date: formatDate(form.start_date),
      end_date: formatDate(form.end_date),
      destination_id: DestinationId,
      download: form.download && 'pdf'
    };
    getDateReporting(payload);
  };

  return (
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
        <InputComponent
          label={'Download PDF'}
          type={'checkbox'}
          error={errors.download?.message}
          register={register('download')}
        />
        <ButtonComponent text={'Submit'} color={'btn-primary text-xs w-full'} />
      </div>
    </form>
  );
}
