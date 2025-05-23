import { Component } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';

export default class MenuBarComponent extends Component {
  render() {
    return (
      <>
        <div
          className={
            'flex h-14 dark:bg-gray-800 dark:text-white bg-white justify-between px-3'
          }
        >
          <div className='flex'>
            <Image
              src={'/logo.png'}
              width={100}
              height={100}
              alt="logo"
              className="h-14 w-14 mt-2"
            />
            {/* <span className='mt-5 font '>Pia Nazwa</span> */}
          </div>
          <div className={'flex gap-3 text-xl'}>
            <Link className={'m-auto'} href={'/notification'}>
              <FontAwesomeIcon icon={faBell} />
            </Link>
            <Link className={'m-auto'} href={'/profile'}>
              <FontAwesomeIcon className={'m-auto'} icon={faUser} />
            </Link>
          </div>
        </div>
      </>
    );
  }
}
