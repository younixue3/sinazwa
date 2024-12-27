import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function SplashScreen() {
  const router = useRouter();
  setTimeout(() => {
    if (Cookies.get('auth_token')) {
      router.push('/login');
    } else {
      router.push('/home');
    }
  }, 5000);
  return (
    <>
      <div className={'h-screen background flex flex-col'}>
        <div className={'m-auto'}>
          <div>Selamat Datang</div>
        </div>
        <p className={'text-center text-sm text-gray-400 mb-5'}>
          Copyright Pia Nazwa&copy;2024
        </p>
      </div>
    </>
  );
}
