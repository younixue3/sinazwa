
import Image from "next/image";
import {TopNavComponent} from "components/Layout/TopNavComponent";
import {Layout} from "components/Layout/Layout";
import {useRouter} from "next/router";

export default function Notification() {
    const router = useRouter();
    return (
        <Layout router={router}>
            <TopNavComponent title={'Notification'}>
                <div className={'font-semibold text-blue-400 m-auto text-xxs'}>Mark all as read</div>
            </TopNavComponent>
            <div className={'flex h-full overflow-y-scroll no-scrollbar divide-y-2 flex-col'}>
                <div className={'flex gap-4 p-4 bg-blue-200 dark:bg-blue-200/40'}>
                    <div className={'w-32'}>
                        <Image alt={'sip lk'} width={200} height={200}
                               src={'/asset/sip-lk.png'}/>
                    </div>
                    <div>
                        <h3 className={'font-semibold text-sm'}>Lorem Ipsum Dolor sit amet</h3>
                        <p className={'text-xs h-8 overflow-clip'}>Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed condimentum vehicula dui non placerat. Donec id enim bibendum, lobortis ante in,
                            eleifend purus.</p>
                        <div className={'mt-3 text-xxs'}>
                            SIP-LK | Yesterday, 19.00
                        </div>
                    </div>
                </div>
                <div className={'flex gap-4 p-4 bg-blue-200 dark:bg-blue-200/40'}>
                    <div className={'w-32'}>
                        <Image alt={'si hrd'} width={200} height={200}
                               src={'/asset/si-hrd.png'}/>
                    </div>
                    <div>
                        <h3 className={'font-semibold text-sm'}>Lorem Ipsum Dolor sit amet</h3>
                        <p className={'text-xs h-8 overflow-clip'}>Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed condimentum vehicula dui non placerat. Donec id enim bibendum, lobortis ante in,
                            eleifend purus.</p>
                        <div className={'mt-3 text-xxs'}>
                            SI HRD | Yesterday, 19.00
                        </div>
                    </div>
                </div>
                <div className={'flex gap-4 p-4 bg-white dark:bg-white/20'}>
                    <div className={'w-32'}>
                        <Image alt={'berkas'} width={200} height={200}
                               src={'/asset/berkas.png'}/>
                    </div>
                    <div>
                        <h3 className={'font-semibold text-sm'}>Lorem Ipsum Dolor sit amet</h3>
                        <p className={'text-xs h-8 overflow-clip'}>Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed condimentum vehicula dui non placerat. Donec id enim bibendum, lobortis ante in,
                            eleifend purus.</p>
                        <div className={'mt-3 text-xxs'}>
                            Berkas | Yesterday, 19.00
                        </div>
                    </div>
                </div>
                <div className={'flex gap-4 p-4 bg-blue-200 dark:bg-blue-200/40'}>
                    <div className={'w-32'}>
                        <Image alt={'sip lk'} width={200} height={200}
                               src={'/asset/sip-lk.png'}/>
                    </div>
                    <div>
                        <h3 className={'font-semibold text-sm'}>Lorem Ipsum Dolor sit amet</h3>
                        <p className={'text-xs h-8 overflow-clip'}>Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed condimentum vehicula dui non placerat. Donec id enim bibendum, lobortis ante in,
                            eleifend purus.</p>
                        <div className={'mt-3 text-xxs'}>
                            SIP-LK | Yesterday, 19.00
                        </div>
                    </div>
                </div>
                <div className={'flex gap-4 p-4 bg-blue-200 dark:bg-blue-200/40'}>
                    <div className={'w-32'}>
                        <Image alt={'si hrd'} width={200} height={200}
                               src={'/asset/si-hrd.png'}/>
                    </div>
                    <div>
                        <h3 className={'font-semibold text-sm'}>Lorem Ipsum Dolor sit amet</h3>
                        <p className={'text-xs h-8 overflow-clip'}>Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed condimentum vehicula dui non placerat. Donec id enim bibendum, lobortis ante in,
                            eleifend purus.</p>
                        <div className={'mt-3 text-xxs'}>
                            SI HRD | Yesterday, 19.00
                        </div>
                    </div>
                </div>
                <div className={'flex gap-4 p-4 bg-white dark:bg-white/20'}>
                    <div className={'w-32'}>
                        <Image alt={'berkas'} width={200} height={200}
                               src={'/asset/berkas.png'}/>
                    </div>
                    <div>
                        <h3 className={'font-semibold text-sm'}>Lorem Ipsum Dolor sit amet</h3>
                        <p className={'text-xs h-8 overflow-clip'}>Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed condimentum vehicula dui non placerat. Donec id enim bibendum, lobortis ante in,
                            eleifend purus.</p>
                        <div className={'mt-3 text-xxs'}>
                            Berkas | Yesterday, 19.00
                        </div>
                    </div>
                </div>
                <div className={'flex gap-4 p-4 bg-blue-200 dark:bg-blue-200/40'}>
                    <div className={'w-32'}>
                        <Image alt={'sip lk'} width={200} height={200}
                               src={'/asset/sip-lk.png'}/>
                    </div>
                    <div>
                        <h3 className={'font-semibold text-sm'}>Lorem Ipsum Dolor sit amet</h3>
                        <p className={'text-xs h-8 overflow-clip'}>Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed condimentum vehicula dui non placerat. Donec id enim bibendum, lobortis ante in,
                            eleifend purus.</p>
                        <div className={'mt-3 text-xxs'}>
                            SIP-LK | Yesterday, 19.00
                        </div>
                    </div>
                </div>
                <div className={'flex gap-4 p-4 bg-blue-200 dark:bg-blue-200/40'}>
                    <div className={'w-32'}>
                        <Image alt={'si hrd'} width={200} height={200}
                               src={'/asset/si-hrd.png'}/>
                    </div>
                    <div>
                        <h3 className={'font-semibold text-sm'}>Lorem Ipsum Dolor sit amet</h3>
                        <p className={'text-xs h-8 overflow-clip'}>Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed condimentum vehicula dui non placerat. Donec id enim bibendum, lobortis ante in,
                            eleifend purus.</p>
                        <div className={'mt-3 text-xxs'}>
                            SI HRD | Yesterday, 19.00
                        </div>
                    </div>
                </div>
                <div className={'flex gap-4 p-4 bg-white dark:bg-white/20'}>
                    <div className={'w-32'}>
                        <Image alt={'berkas'} width={200} height={200}
                               src={'/asset/berkas.png'}/>
                    </div>
                    <div>
                        <h3 className={'font-semibold text-sm'}>Lorem Ipsum Dolor sit amet</h3>
                        <p className={'text-xs h-8 overflow-clip'}>Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Sed condimentum vehicula dui non placerat. Donec id enim bibendum, lobortis ante in,
                            eleifend purus.</p>
                        <div className={'mt-3 text-xxs'}>
                            Berkas | Yesterday, 19.00
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}