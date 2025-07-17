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
import { useState } from 'react';

export function ReportLaporan({ DestinationId }) {
  const [isLoading, setIsLoading] = useState(false);
  const schema = yup.object({
    start_date: yup.date().required('Tanggal Mulai harus di isi.'),
    end_date: yup.date().required('Tanggal Akhir harus di isi.'),
    download: yup.string().oneOf(['pdf', 'excel'], 'Format download harus dipilih')
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

  const onSubmit = async form => {
    setIsLoading(true);
    try {
      const payload = {
        ...form,
        start_date: formatDate(form.start_date),
        end_date: formatDate(form.end_date),
        destination_id: DestinationId
      };
      await getDateReporting(payload);
    } catch (error) {
      console.error('Error downloading report:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal mengunduh laporan',
        text: 'Terjadi kesalahan saat mengunduh laporan'
      });
    } finally {
      setIsLoading(false);
    }
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
          disabled={isLoading}
        />
        <InputComponent
          label={'Tanggal Berakhir'}
          type={'date'}
          placeholder={'Masukkan Tanggal Berakhir'}
          error={errors.end_date?.message}
          register={register('end_date')}
          disabled={isLoading}
        />
        
        {/* Format Download Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Format Download
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="pdf"
                {...register('download')}
                className="mr-2"
                disabled={isLoading}
              />
              PDF
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="excel"
                {...register('download')}
                className="mr-2"
                disabled={isLoading}
              />
              Excel
            </label>
          </div>
          {errors.download && (
            <p className="text-red-500 text-xs mt-1">
              {errors.download.message}
            </p>
          )}
        </div>
        
        <ButtonComponent 
          text={isLoading ? 'Mengunduh...' : 'Submit'} 
          color={'btn-primary text-xs w-full'} 
          disabled={isLoading} 
        />
        
        {isLoading && (
          <div className="flex items-center justify-center mt-2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary mr-2"></div>
            <p className="text-sm">Sedang mengunduh laporan...</p>
          </div>
        )}
      </div>
    </form>
  );
}
