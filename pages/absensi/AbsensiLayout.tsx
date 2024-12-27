import { TopNavComponent } from 'components/Layout/TopNavComponent';
import { BotNavComponent } from 'components/Layout/BotNavComponent';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export default function AbsensiLayout({ children }: any) {
  const router = useRouter();

  useEffect(() => {
    if (!Cookies.get('auth_token')) {
      router.push('/login');
    }
  }, []);

  return (
    <>
      <div className={'h-full min-h-screen overflow-hidden background'}>
        <TopNavComponent title={'Absensi'}>Absensi</TopNavComponent>
        <BotNavComponent
          page={[
            { url: '/absensi', icon: 'faHouse', title: 'Absensi' },
            {
              url: '/absensi/riwayat-absensi',
              icon: 'faRightToBracket',
              title: 'Riwayat Absensi'
            }
          ]}
          icon={''}
        >
          <div className={'h-full'}>{children}</div>
        </BotNavComponent>
      </div>
    </>
  );
}
