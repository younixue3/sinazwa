import { TopNavComponent } from 'components/Layout/TopNavComponent';
import { BotNavComponent } from 'components/Layout/BotNavComponent';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export default function ProduksiLayout({ children }: any) {
  const router = useRouter();

  useEffect(() => {
    if (!Cookies.get('auth_token')) {
      router.push('/login');
    }
  }, []);

  return (
    <>
      <div className={'h-full min-h-screen overflow-hidden background'}>
        <TopNavComponent title={'Produksi'}>Produksi</TopNavComponent>
        <BotNavComponent
          page={[
            { url: '/produksi', icon: 'faHouse', title: 'Produksi' },
            {
              url: '/produksi/kue-masuk',
              icon: 'faRightToBracket',
              title: 'Kue Masuk'
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
