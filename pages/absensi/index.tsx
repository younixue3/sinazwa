import AbsensiLayout from 'pages/absensi/AbsensiLayout';
import { CreateAbsensi } from 'components/Pages/absensi/CreateAbsensi';

export default function Absensi() {
  return (
    <AbsensiLayout>
      <section className={'grid gap-5 p-3'}>
        <CreateAbsensi />
      </section>
    </AbsensiLayout>
  );
}
