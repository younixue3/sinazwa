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
      <div className={'h-screen relative min-h-screen max-h-screen background'}>
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
              title: 'Kue Rusak'
            },
            {
              url: '/outlet/penyesuaian',
              icon: 'faRightFromBracket',
              title: 'Penyesuaian'
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
