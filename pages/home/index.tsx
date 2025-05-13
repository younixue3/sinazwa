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

interface MenuItemProps {
  href: string;
  icon: any;
  color: string;
  label: string;
}

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState<string>();
  const { data: lastInstallmentData } = useLastInstallment();

  useEffect(() => {
    const today = new Date();
    const lastInstallmentDate = lastInstallmentData?.updated_at;

    if (!lastInstallmentDate) return;

    const lastInstallment = new Date(lastInstallmentDate);
    if (lastInstallment.toDateString() !== today.toDateString()) {
      resetInstallments().then(() => {
        queryClient.invalidateQueries('get-last-installment');
      });
    }
  }, [lastInstallmentData]);

  useEffect(() => {
    const authRole = decodeURI(Cookies.get(AUTH_ROLE) || '');
    setRole(authRole);
  }, []);

  const MenuItem = ({ href, icon, color, label }: MenuItemProps) => (
    <Link href={href} className="flex flex-col group">
      <div className="h-14 w-14 flex text-center dark:bg-gray-600 bg-white rounded-md dark:border-gray-400 border-2 shadow-md group-focus:border-green-400 m-auto p-2">
        <FontAwesomeIcon
          className={`m-auto text-2xl text-${color}`}
          icon={icon}
        />
      </div>
      <p className="text-xs text-center w-full h-8 mt-1 leading-4">{label}</p>
    </Link>
  );

  const adminMenuItems = [
    {
      href: '/inventaris',
      icon: faBox,
      color: 'green-500',
      label: 'Inventaris'
    },
    {
      href: '/produksi',
      icon: faCookieBite,
      color: 'blue-500',
      label: 'Produksi'
    },
    { href: '/delivery', icon: faTruck, color: 'red-500', label: 'Dropship' },
    {
      href: '/outlet',
      icon: faHouseChimney,
      color: 'amber-500',
      label: 'Outlet'
    },
    {
      href: '/kasir',
      icon: faCashRegister,
      color: 'indigo-500',
      label: 'Kasir'
    },
    { href: '/admin', icon: faUserTie, color: 'purple-500', label: 'Admin' }
  ];

  const sellerMenuItems = [
    {
      href: '/outlet',
      icon: faHouseChimney,
      color: 'amber-500',
      label: 'Outlet'
    },
    {
      href: '/kasir',
      icon: faCashRegister,
      color: 'indigo-500',
      label: 'Kasir'
    }
  ];

  const AuthMenu = () => {
    if (!role) return null;

    switch (role) {
      case 'admin':
        return (
          <>
            {adminMenuItems.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
          </>
        );
      case 'produksi':
        return (
          <>
            <MenuItem
              href="/produksi"
              icon={faCookieBite}
              color="blue-500"
              label="Produksi"
            />
             <MenuItem
              href="/delivery"
              icon={faTruck}
              color="blue-500"
              label="Delivery"
            />
          </>
        );
      case 'seller':
        return (
          <>
            {sellerMenuItems.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Layout router={router}>
      <div>
        <CtaComponent />
      </div>
      <div className="grid grid-cols-4 gap-x-4 px-5">
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
