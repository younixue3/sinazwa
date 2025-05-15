import { TopNavComponent } from 'components/Layout/TopNavComponent';
import { BotNavComponent } from 'components/Layout/BotNavComponent';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { AUTH_ROLE } from 'utils/constants/cookies-keys';

export default function ProduksiLayout({ children }: any) {
  const router = useRouter();
  const [role, setRole] = useState<string>();

  useEffect(() => {
    if (!Cookies.get('auth_token')) {
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    const authRole = decodeURI(Cookies.get(AUTH_ROLE) || '');
    setRole(authRole);
  }, []);

  return (
    <>
      <div className={'h-full min-h-screen overflow-hidden background'}>
        <TopNavComponent title={'Produksi'}>Produksi</TopNavComponent>
        <BotNavComponent
          page={[
            { url: '/produksi', icon: 'faHouse', title: 'Produksi' },
            ...(role !== 'delivery'
              ? [
                  {
                    url: '/produksi/kue-masuk',
                    icon: 'faRightToBracket',
                    title: 'Kue Masuk'
                  }
                ]
              : [])
          ]}
          icon={''}
        >
          <div className={'h-full pb-20 md:pb-0'}>{children}</div>
        </BotNavComponent>
      </div>
    </>
  );
}
