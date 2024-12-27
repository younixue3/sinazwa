import ButtonComponent from 'components/Button/ButtonComponent';
import CardComponent from 'components/Card/CardComponent';
import { Each } from 'helper/Each';
import AbsensiLayout from 'pages/absensi/AbsensiLayout';
import useGetAbsensi from 'utils/api/absensi/use-get-absensi';

export default function RiwayatAbsensi() {
  const GetAbsensi = useGetAbsensi();

  return (
    <AbsensiLayout>
      <div className="grid grid-cols-1 gap-3 p-3">
        {GetAbsensi.data?.length > 0 && (
          <Each
            of={GetAbsensi.data || []}
            render={(item: any) => (
              <CardComponent>
                <div className={'grid grid-cols-6 gap-2 p-3'}>
                  <ButtonComponent
                    color={item.absen == 'MASUK' ? 'btn-success' : 'btn-danger'}
                    text={item.absen}
                  />
                  <div className={'col-span-6'}>Description : </div>
                  <p className={'col-span-6 text-sm'}>{item.description}</p>
                </div>
              </CardComponent>
            )}
          />
        )}
      </div>
    </AbsensiLayout>
  );
}
