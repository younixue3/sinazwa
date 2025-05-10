import { FC } from 'react';
import { Each } from 'helper/Each';
import * as FaIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface BotNavComponentProps {
  page: Record<string, any>;
  icon: string;
  children: React.ReactNode;
}

export const BotNavComponent: FC<BotNavComponentProps> = ({
  page,
  icon,
  children
}) => {
  const router = useRouter();
  const currentUrl = router.pathname;

  return (
    <div className={'h-[93%] flex justify flex-col'}>
      <div className={'overflow-y-scroll no-scrollbar h-full'}>{children}</div>
      <div
        className={
          'w-full sm:max-w-[320px] flex h-20 justify-between bg-white border-t border-gray-300 overflow-auto no-scrollbar bottom-0'
        }
      >
        <Each
          of={page}
          render={(item: any) => (
            <Link
              key={item.url}
              href={item.url}
              className={
                'bg-gradient-to-t from-transparent border-t-4 min-w-14 w-full h-20 font-medium rounded-none transition-all text-sm text-center flex ' +
                (item.url === currentUrl
                  ? 'dark:border-white bg-white dark:bg-gray-800 border-blue-900 dark:to-white/10 to-blue-500/30'
                  : 'dark:border-gray-700 bg-white dark:bg-gray-800 to-transparent border-white')
              }
            >
              <div className={'m-auto'}>
                <FontAwesomeIcon icon={FaIcons[item.icon]} />
                <div className={'text-xs font-light'}>{item.title}</div>
              </div>
            </Link>
          )}
        />
      </div>
    </div>
  );
};
