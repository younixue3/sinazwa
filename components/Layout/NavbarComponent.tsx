"use client"
import React, {Component} from "react";
import Image from "next/image";
import Link from "next/link";
import ButtonComponent from "components/Button/ButtonComponent";

interface NavbarComponentState {
    toggle: boolean
}

export default class NavbarComponent extends Component<{}, NavbarComponentState> {
    constructor(props:any) {
        super(props);
        this.state = {
            toggle: false
        }
        this.toggleOpenMenu = this.toggleOpenMenu.bind(this)
    }

    async toggleOpenMenu() {
        if (this.state.toggle) {
            this.setState({toggle: false})
        } else {
            this.setState({toggle: true})
        }
    }

    render() {
        return (
            <nav className={"bg-white sm:bg-transparent z-50"}>
                <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                            <button onClick={this.toggleOpenMenu} type="button"
                                    className="relative inline-flex items-center justify-center rounded-md p-2 bg-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                    aria-controls="mobile-menu" aria-expanded="false">
                                <span className="absolute -inset-0.5"></span>
                                <span className="sr-only">Open main menu</span>
                                <svg className="block h-6 w-6" fill="none"
                                     stroke="currentColor" aria-hidden="true">
                                    <path
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                                </svg>
                                <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24"
                                     stroke="currentColor" aria-hidden="true">
                                    <path d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-between">
                            <Link href={''}
                                  className="flex flex-shrink-0 items-center font-bold text-2xl text-green-800">
                                Pia Nazwa
                            </Link>
                            <div className="hidden sm:ml-6 sm:flex">
                                <div className="flex m-auto space-x-4">
                                    <a href="#"
                                       className="text-white hover:text-yellow-400 rounded-md px-3 py-2 font-medium"
                                       aria-current="page">Beranda</a>
                                    <a href="#"
                                       className="text-white hover:text-yellow-400 rounded-md px-3 py-2 font-medium">Tentang</a>
                                    <a href="#"
                                       className="text-white hover:text-yellow-400 rounded-md px-3 py-2 font-medium">Kontak</a>
                                </div>
                            </div>
                            <div className={"hidden sm:flex gap-2"}>
                                <Link className={'m-auto'} href={'/auth/login'}>
                                    <ButtonComponent text={"Login"} color={'bg-primary'}/>
                                </Link>
                                <Link className={'m-auto'} href={'/auth/daftar'}>
                                    <ButtonComponent text={"Daftar"} color={'bg-clear'}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={'sm:hidden absolute bg-white w-full transition-all ease-in-out overflow-hidden z-50 ' + (this.state.toggle ? 'h-60' : 'h-0')}
                    id="mobile-menu">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        <a href="#"
                           className="text-green-900 hover:bg-primary  block rounded-md px-3 py-2 text-base font-medium"
                           aria-current="page">Dashboard</a>
                        <a href="#"
                           className="text-green-900 hover:bg-primary block rounded-md px-3 py-2 text-base font-medium">Team</a>
                        <a href="#"
                           className="text-green-900 hover:bg-primary block rounded-md px-3 py-2 text-base font-medium">Projects</a>
                        <a href="#"
                           className="text-green-900 hover:bg-primary block rounded-md px-3 py-2 text-base font-medium">Calendar</a>
                        <div className={'flex justify-center gap-3 pt-2'}>
                            <Link href={'/auth/login'}>
                                <ButtonComponent text={"Login"} color={'bg-primary'}/>
                            </Link>
                            <Link href={'/auth/daftar'}>
                                <ButtonComponent text={"Daftar"} color={'bg-transparent border-2 border-emerald-800'}/>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}