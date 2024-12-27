import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import {
  faGear,
  faHouse,
  faIdCardClip,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { TopNavComponent } from 'components/Layout/TopNavComponent';
import ButtonComponent from 'components/Button/ButtonComponent';
import { Layout } from 'components/Layout/Layout';
import { useRouter } from 'next/router';
import { logoutUser } from 'utils/api/login/authApi';
import Cookies from 'js-cookie';
import { AUTH_EMAIL, AUTH_NAME, AUTH_ROLE } from 'utils/constants/cookies-keys';

export default function Profile() {
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();
  const [authName, setAuthName] = useState();
  const [authRole, setAuthRole] = useState();
  const [authEmail, setAuthEmail] = useState();

  useEffect(() => {
    setAuthName(Cookies.get(AUTH_NAME));
    setAuthRole(Cookies.get(AUTH_ROLE));
    setAuthEmail(Cookies.get(AUTH_EMAIL));
  }, [authName, authEmail, authRole]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (isChecked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const onClickLogout = async () => {
    const response = await logoutUser();
    if (response.status) {
      router.push('/login');
    }
  };
  return (
    <Layout router={router}>
      <TopNavComponent title={'Profile'} />
      <div
        className={
          'overflow-y-scroll no-scrollbar flex flex-col gap-3 divide-y'
        }
      >
        <div className={'flex justify-start gap-3 px-3 pt-3'}>
          <Image
            className={
              'rounded-full bg-gray-200 h-14 w-14 border-2 border-white object-cover'
            }
            width={50}
            height={50}
            src={''}
            alt={''}
          />
          <div className={'flex'}>
            <div className={'m-auto'}>
              <h3 className={'font-bold m-auto'}>{authName}</h3>
              <p className={'text-xs font-medium'}>{authRole}</p>
            </div>
          </div>
        </div>
        <div>
          <ul className={'text-xs font-medium px-3'}>
            <li className={'mt-1'}>
              <FontAwesomeIcon className={'w-4 mr-2'} icon={faAddressCard} />
              {authName}
            </li>
            <li className={'mt-1'}>
              <FontAwesomeIcon className={'w-4 mr-2'} icon={faEnvelope} />
              {authEmail}
            </li>
          </ul>
        </div>
        <div>
          <button
            className={'flex w-full py-0 px-0'}
            onClick={handleCheckboxChange}
          >
            <label
              htmlFor="toggleTwo"
              className="flex items-center cursor-pointer w-10 h-10 select-none text-dark dark:text-white"
            >
              <div className="relative m-auto">
                <input
                  type="checkbox"
                  id="toggleTwo"
                  checked={isChecked}
                  className="peer sr-only"
                />
                <div className="block h-4 rounded-full bg-black dark:bg-white w-6"></div>
                <div
                  className={
                    'absolute w-2 h-2 transition bg-white rounded-full dot dark:bg-primary left-1 top-1 peer-checked:translate-x-full'
                  }
                ></div>
              </div>
            </label>
            <div className={'my-auto font-medium text-xs'}>Dark Mode</div>
          </button>
          <button className={'flex w-full py-0 px-0'}>
            <FontAwesomeIcon className={'w-10'} icon={faGear} />
            <div className={'my-auto font-medium text-xs'}>Settings</div>
          </button>
        </div>
      </div>
      <div className={'p-4'}>
        <span
          className={'w-full'}
          onClick={() => {
            onClickLogout();
          }}
        >
          <ButtonComponent
            color={'btn-danger w-full text-xs font-bold'}
            text={'Logout'}
          />
        </span>
      </div>
    </Layout>
  );
}
