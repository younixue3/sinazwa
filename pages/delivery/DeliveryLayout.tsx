import { TopNavComponent } from 'components/Layout/TopNavComponent';
import { BotNavComponent } from 'components/Layout/BotNavComponent';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export default function DeliveryLayout({ children }: any) {
  const router = useRouter();

  useEffect(() => {
    if (!Cookies.get('auth_token')) {
      router.push('/login');
    }
  });

  return (
    <>
      <div className={'h-full min-h-screen overflow-hidden background'}>
        <TopNavComponent title={'Delivery'}>Delivery</TopNavComponent>
        <BotNavComponent
          page={[
            { url: '/delivery', icon: 'faHouse', title: 'Delivery' },
            {
              url: '/delivery/antar-kue',
              icon: 'faRightToBracket',
              title: 'Antar Kue'
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