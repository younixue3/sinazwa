import CtaComponent from 'components/Cta/CtaComponent';
import Link from 'next/link';
import { Layout } from 'components/Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faCashRegister,
  faCookieBite,
  faHouseChimney,
  faPerson,
  faTruck,
  faUserTie
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { AUTH_ROLE } from 'utils/constants/cookies-keys';
import { useEffect, useState } from 'react';
import useLastInstallment from 'utils/api/cicilan/use-last-instalment';
import { resetInstallments } from 'utils/api/cicilan/installmentApi';
import queryClient from 'helper/queryClient';

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState();
  const GetLastInstallment = useLastInstallment();
  useEffect(() => {
    const today = new Date();
    const lastInstallmentData = GetLastInstallment.data?.updated_at;

    if (!lastInstallmentData) return;

    const lastInstallment = new Date(lastInstallmentData);

    if (lastInstallment.toDateString() !== today.toDateString()) {
      resetInstallments().then(() => {
        queryClient.invalidateQueries('get-last-installment');
      });
    }
  }, [GetLastInstallment.data]);

  useEffect(() => {
    const authRole: any = decodeURI(Cookies.get(AUTH_ROLE));
    setRole(authRole);
  }, []);

  const AuthMenu = () => {
    return (
      role == 'admin' && (
        <Link href={'/admin'} className={`flex flex-col group`}>
          <div
            className={
              'h-14 w-14 flex text-center dark:bg-gray-600 bg-white rounded-md dark:border-gray-400 border-2 shadow-md group-focus:border-green-400 m-auto p-2'
            }
          >
            <FontAwesomeIcon
              className={'m-auto text-2xl text-purple-500'}
              icon={faUserTie}
            />
          </div>
          <p className={'text-xs text-center w-full h-8 mt-1 leading-4'}>
            Admin
          </p>
        </Link>
      )
    );
  };

  return (
    <Layout router={router}>
      <div>
        <CtaComponent />
      </div>
      <div className={'grid grid-cols-4 gap-x-4 px-5'}>
        <Link href={'/inventaris'} className={'flex flex-col group'}>
          <div
            className={
              'h-14 w-14 flex text-center dark:bg-gray-600 bg-white rounded-md dark:border-gray-400 border-2 shadow-md group-focus:border-green-400 m-auto p-2'
            }
          >
            <FontAwesomeIcon
              className={'m-auto text-2xl text-green-500'}
              icon={faBox}
            />
          </div>
          <p className={'text-xs text-center w-full h-8 mt-1 leading-4'}>
            Inventaris
          </p>
        </Link>
        <Link href={'/produksi'} className={'flex flex-col group'}>
          <div
            className={
              'h-14 w-14 flex text-center dark:bg-gray-600 bg-white rounded-md dark:border-gray-400 border-2 shadow-md group-focus:border-green-400 m-auto p-2'
            }
          >
            <FontAwesomeIcon
              className={'m-auto text-2xl text-blue-500'}
              icon={faCookieBite}
            />
          </div>
          <p className={'text-xs text-center w-full h-8 mt-1 leading-4'}>
            Produksi
          </p>
        </Link>
        <Link href={'/delivery'} className={'flex flex-col group'}>
          <div
            className={
              'h-14 w-14 flex text-center dark:bg-gray-600 bg-white rounded-md dark:border-gray-400 border-2 shadow-md group-focus:border-green-400 m-auto p-2'
            }
          >
            <FontAwesomeIcon
              className={'m-auto text-2xl text-red-500'}
              icon={faTruck}
            />
          </div>
          <p className={'text-xs text-center w-full h-8 mt-1 leading-4'}>
            Dropship
          </p>
        </Link>
        <Link href={'/outlet'} className={'flex flex-col group'}>
          <div
            className={
              'h-14 w-14 flex text-center dark:bg-gray-600 bg-white rounded-md dark:border-gray-400 border-2 shadow-md group-focus:border-green-400 m-auto p-2'
            }
          >
            <FontAwesomeIcon
              className={'m-auto text-2xl text-amber-500'}
              icon={faHouseChimney}
            />
          </div>
          <p className={'text-xs text-center w-full h-8 mt-1 leading-4'}>
            Outlet
          </p>
        </Link>
        <Link href={'/kasir'} className={'flex flex-col group'}>
          <div
            className={
              'h-14 w-14 flex text-center dark:bg-gray-600 bg-white rounded-md dark:border-gray-400 border-2 shadow-md group-focus:border-green-400 m-auto p-2'
            }
          >
            <FontAwesomeIcon
              className={'m-auto text-2xl text-indigo-500'}
              icon={faCashRegister}
            />
          </div>
          <p className={'text-xs text-center w-full h-8 mt-1 leading-4'}>
            Kasir
          </p>
        </Link>
        {/* <Link href={'/absensi'} className={'flex flex-col group'}>
          <div
            className={
              'h-14 w-14 flex text-center dark:bg-gray-600 bg-white rounded-md dark:border-gray-400 border-2 shadow-md group-focus:border-green-400 m-auto p-2'
            }
          >
            <FontAwesomeIcon
              className={'m-auto text-2xl text-sky-500'}
              icon={faPerson}
            />
          </div>
          <p className={'text-xs text-center w-full h-8 mt-1 leading-4'}>
            Absensi
          </p>
        </Link> */}
        <AuthMenu />
      </div>
    </Layout>
  );
}
