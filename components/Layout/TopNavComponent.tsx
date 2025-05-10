import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Component } from 'react';
import Link from 'next/link';

interface TopNavComponentProps {
  title: string;
  children?: any;
}

export class TopNavComponent extends Component<TopNavComponentProps> {
  render() {
    return (
      <div
        className={
          'flex h-[7%] dark:bg-gray-800 dark:text-white bg-white gap-5 justify-between px-3 shadow-lg'
        }
      >
        <div className={'text-xl flex'}>
          <Link className={'m-auto'} href={'/home'}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </div>
        <div className={'w-full m-auto'}>{this.props.title}</div>
        <div className={'flex w-32'}>
          <div className={'m-auto'}>{this.props.children}</div>
        </div>
      </div>
    );
  }
}
