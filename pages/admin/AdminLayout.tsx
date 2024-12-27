import { TopNavComponent } from 'components/Layout/TopNavComponent';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { SidebarComponent } from 'components/Layout/SidebarComponent';

export default function AdminLayout({ children }: any) {
  const router = useRouter();

  useEffect(() => {
    if (!Cookies.get('auth_token')) {
      router.push('/login');
    }
  });

  return (
    <>
      <div className={'fullscreen top-0 left-0 overflow-hidden background'}>
        <TopNavComponent title={'Admin'} />
        <SidebarComponent>{children}</SidebarComponent>
      </div>
    </>
  );
}
