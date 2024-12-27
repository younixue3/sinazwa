import {Component} from "react";
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBell, faUser} from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";

export default class MenuBarComponent extends Component {
    render() {
        return (
            <>
                <div className={'flex h-14 dark:bg-gray-800 dark:text-white bg-white justify-between px-3'}>
                    <span className="font-bold text-green-900 dark:text-white my-auto">Pia Nazwa</span>
                    <div className={'flex gap-3 text-xl'}>
                        <Link className={'m-auto'} href={'/notification'}>
                            <FontAwesomeIcon icon={faBell}/>
                        </Link>
                        <Link className={'m-auto'} href={'/profile'}>
                            <FontAwesomeIcon className={'m-auto'} icon={faUser}/>
                        </Link>
                    </div>
                </div>
            </>
        );
    }
}