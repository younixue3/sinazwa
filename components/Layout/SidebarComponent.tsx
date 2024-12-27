import { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faClapperboard,
  faCookie,
  faPiggyBank,
  faShop,
  faTruck,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface SidebarProps {
  children?: any;
}

export class SidebarComponent extends Component<SidebarProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className={'flex relative h-screen w-screen overflow-hidden pb-14'}>
        <aside
          id="default-sidebar"
          className="w-64 z-0 h-full transition-transform -translate-x-full sm:translate-x-0"
          aria-label="Sidenav"
        >
          <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin"
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                  </svg>
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/kue"
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <FontAwesomeIcon
                    className={
                      'w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                    }
                    icon={faCookie}
                  />
                  <span className="ml-3">Kue</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/outlet"
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <FontAwesomeIcon
                    className={
                      'w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                    }
                    icon={faShop}
                  />
                  <span className="ml-3">Outlet</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/dropship"
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <FontAwesomeIcon
                    className={
                      'w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                    }
                    icon={faTruck}
                  />
                  <span className="ml-3">Dropship</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/inventaris"
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <FontAwesomeIcon
                    className={
                      'w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                    }
                    icon={faBox}
                  />
                  <span className="ml-3">Inventaris</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/karyawan"
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <FontAwesomeIcon
                    className={
                      'w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                    }
                    icon={faUsers}
                  />
                  <span className="ml-3">Karyawan</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/job"
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <FontAwesomeIcon
                    className={
                      'w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                    }
                    icon={faUsers}
                  />
                  <span className="ml-3">Job</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/laporan"
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <FontAwesomeIcon
                    className={
                      'w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                    }
                    icon={faClapperboard}
                  />
                  <span className="ml-3">Laporan</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/cicilan"
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <FontAwesomeIcon
                    className={
                      'w-6 h-6 text-gray-400 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                    }
                    icon={faPiggyBank}
                  />
                  <span className="ml-3">Cicilan Karyawan</span>
                </Link>
              </li>
            </ul>
          </div>
        </aside>
        <div className={'w-full h-full overflow-y-scroll'}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
