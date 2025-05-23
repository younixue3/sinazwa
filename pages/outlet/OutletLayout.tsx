import { TopNavComponent } from 'components/Layout/TopNavComponent';
import { BotNavComponent } from 'components/Layout/BotNavComponent';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export default function OutletLayout({ children }: any) {
  const router = useRouter();

  useEffect(() => {
    if (!Cookies.get('auth_token')) {
      router.push('/login');
    }
  });

  return (
    <>
      <div className={'h-full min-h-screen overflow-hidden background'}>
        <TopNavComponent title={'Outlet'} />
        <BotNavComponent
          page={[
            { url: '/outlet', icon: 'faHouse', title: 'Outlet' },
            {
              url: '/outlet/kue-datang',
              icon: 'faRightToBracket',
              title: 'Kue Datang'
            },
            {
              url: '/outlet/kue-rusak',
              icon: 'faRightFromBracket',
              title: 'Rekap Harian'
            },
            {
              url: '/outlet/penyesuaian',
              icon: 'faRightFromBracket',
              title: 'Penyesuaian'
            }
          ]}
          icon={''}
        >
          <div className={'h-full pb-20 md:pb-0'}>{children}</div>
        </BotNavComponent>
      </div>
    </>
  );
}
