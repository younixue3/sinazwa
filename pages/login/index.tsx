import { useRouter } from 'next/router';
import InputComponent from 'components/Form/InputComponent';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonComponent from 'components/Button/ButtonComponent';
import useLoginUser from 'utils/api/login/use-login-user';
import Cookies from 'js-cookie';
import SwalErrors from 'helper/swal-errors';
import { getProfile } from 'utils/api/login/authApi';
import Swal from 'sweetalert2';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // atau import dari fontawesome jika kamu pakai itu

export default function Login() {
  const router = useRouter();
  const LoginUser = useLoginUser();
  const [showPassword, setShowPassword] = useState(false);

  const schema = yup.object({
    email: yup.string().required('Email wajib diisi'),
    password: yup.string().required('Password wajib diisi')
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = form => {
    const payload = { ...form };
    LoginUser.mutate(payload, {
      onSuccess: data => {
        Cookies.set('auth_token', data.token, { expires: 2 });
        getProfile(payload).then(() => {
          router.push('/home');
        });
      },
      onError: (err: any) => {
        const message =
          err?.response?.data?.message || 'Email atau password salah';
        Swal.fire({
          icon: 'error',
          title: 'Login Gagal',
          text: message
        });
      }
    });
  };

  return (
    <div className={'h-screen background flex flex-col'}>
      <div className={'m-auto'}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={
              'border rounded-lg grid grid-cols-2 gap-3 shadow-xl w-64 p-3'
            }
          >
            <div className={'col-span-2'}>
              <InputComponent
                label={'Email'}
                error={errors.email}
                register={register('email')}
              />
            </div>

            <div className={'col-span-2 relative'}>
              <InputComponent
                label={'Password'}
                type={showPassword ? 'text' : 'password'}
                error={errors.password}
                register={register('password')}
              />
              <div
                className="absolute right-3 top-9 cursor-pointer"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <div className={'col-span-2'}>
              <ButtonComponent text={'Login'} color={'btn-success w-full'} />
            </div>
          </div>
        </form>
      </div>
      <p className={'text-center text-sm text-gray-400 mb-5'}>
        Copyright Pia Nazwa&copy;2024
      </p>
    </div>
  );
}