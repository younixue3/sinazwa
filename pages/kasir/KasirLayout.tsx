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
      <div className={'fullscreen top-0 left-0 overflow-auto background'}>
        <div className="fixed top-0 left-0 right-0 z-10">
          <TopNavComponent title={'Kasir'} />
        </div>
        <div className={'h-full pt-14 mb-20'}>{children}</div>
      </div>
    </>
  );
}
