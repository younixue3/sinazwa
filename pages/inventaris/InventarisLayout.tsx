import { TopNavComponent } from 'components/Layout/TopNavComponent';
import { BotNavComponent } from 'components/Layout/BotNavComponent';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

export default function InventarisLayout({ children }: any) {
  const router = useRouter();

  useEffect(() => {
    if (!Cookies.get('auth_token')) {
      router.push('/login');
    }
  });

  return (
    <>
      <div className={'h-full min-h-screen overflow-hidden background'}>
        <TopNavComponent title={'Inventaris'} />
        <BotNavComponent
          page={[
            { url: '/inventaris', icon: 'faHouse', title: 'Produksi' },
            {
              url: '/inventaris/barang-masuk',
              icon: 'faRightToBracket',
              title: 'Barang Masuk'
            },
            {
              url: '/inventaris/barang-keluar',
              icon: 'faRightFromBracket',
              title: 'Barang Keluar'
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
