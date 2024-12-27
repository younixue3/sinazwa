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

export default function Login() {
  const router = useRouter();
  const LoginUser = useLoginUser();

  const schema = yup.object({
    email: yup.string().required(),
    password: yup.string().required()
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = form => {
    const payload = {
      ...form
    };
    LoginUser.mutate(payload, {
      onSuccess: data => {
        Cookies.set('auth_token', data.token, { expires: 2 });
        getProfile(payload).then(() => {
          router.push('/home');
        });
      },
      onError: (err: any) => {
        const { errors } = err.response.data.data;
        SwalErrors({ errors });
      }
    });
  };
  return (
    <>
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
              <div className={'col-span-2'}>
                <InputComponent
                  label={'Password'}
                  type={'password'}
                  error={errors.password}
                  register={register('password')}
                />
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
    </>
  );
}
