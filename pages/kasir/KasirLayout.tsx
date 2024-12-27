import { TopNavComponent } from 'components/Layout/TopNavComponent';
import { BotNavComponent } from 'components/Layout/BotNavComponent';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export default function KasirLayout({ children }: any) {
  const router = useRouter();

  useEffect(() => {
    if (!Cookies.get('auth_token')) {
      router.push('/login');
    }
  });

  return (
    <>
      <div className={'fullscreen top-0 left-0 overflow-hidden background'}>
        <TopNavComponent title={'Kasir'} />
        <BotNavComponent
          page={[
            { url: '/kasir', icon: 'faHouse', title: 'Kasir' },
            {
              url: '/kasir/riwayat-transaksi',
              icon: 'faRightToBracket',
              title: 'Riwayat Transaksi'
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
