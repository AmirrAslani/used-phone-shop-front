import { FaTelegram, FaYoutube, FaInstagram } from 'react-icons/fa';
import { BsArrowUpCircle } from 'react-icons/bs';
import Link from 'next/link';
import { FooterLogo } from '@/assets/common/icons';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-blue-200 via-blue-900 to-blue-300 text-white pt-12 border-t border-gray-300 pb-5 pt-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">

                    <div className="w-full md:w-1/3 lg:w-1/4 mb-8 md:mb-0">
                        <h3 className="text-xl font-bold mb-3">درباره ما</h3>
                        <p className="mb-5">
                        ما در Used Phone Store با تکیه بر دانش فنی و بومی، فرآیند خرید و فروش گوشی‌های کارکرده را متحول کرده‌ایم. تمرکز ما بر ارائه‌ی محصولاتی با کیفیت، بازرسی شده و مطمئن — همراه با ضمانت معتبر — است تا بهترین تجربه را برای مشتریان ایرانی خود فراهم کنیم.
                        هدف ما تنها فروش یک گوشی نیست؛ بلکه ایجاد آرامش و اعتماد در هر معامله است.
                        </p>
                    </div>

                    <div className="w-full md:w-1/3 lg:w-1/4 mb-3 md:mb-0">
                        <h3 className="text-xl font-bold mb-4">تماس با ما</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                                <span className="ml-2">تهران، خیابان آزادی، کوچه فلان، پلاک ۱۲</span>
                            </li>
                            <li className="flex items-center">
                                <span className="ml-2">info@example.com</span>
                            </li>
                            <li className="flex items-center">
                                <span className="ml-2">۰۲۱-۱۲۳۴۵۶۷۸</span>
                            </li>
                        </ul>
                    </div>

                    <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col items-center md:items-end gap-4">
                        <div className='flex flex-col items-center'>
                            {/* <img src="/images/logo.png" alt="EVT" className='w-[150px] mb-5' /> */}
                            <div className='mb-5'>
                                <FooterLogo/>
                            </div>
                            
                            <div className="flex gap-2">
                                <Link
                                    className='bg-white rounded-md'
                                    href="/"
                                >
                                    <img src="/images/enamad.png" alt="Enamad" className="w-24 h-24 object-contain" />
                                </Link>
                                <Link
                                    className='bg-white rounded-md'
                                    href="/"
                                >
                                    <img src="/images/samandehi.png" alt="Samandehi" className="w-24 h-24 object-contain" />
                                </Link>
                            </div>

                            <div className="flex items-center justify-center space-x-4 rtl:space-x-reverse mt-5">
                                <Link href="/">
                                    <FaYoutube size={27} />
                                </Link>
                                <Link href="/">
                                    <FaTelegram size={27} />
                                </Link>
                                <Link href="/">
                                    <FaInstagram size={27} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white border-opacity-20 pt-3 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-x-3 text-center md:text-right mb-4 md:mb-0">
                        <Link
                            className="cursor-pointer text-blue-600 hover:text-blue-800"
                            href={'/'}
                        >
                            <BsArrowUpCircle className='text-white hover:text-gray-400 transition size-[35px]' />
                        </Link>
                        <div>
                            <span>
                                تمامی حقوق مادی و معنوی این سایت متعلق به شرکت Used Phone Store می‌باشد. USED PHONE - All rights reserved
                            </span>
                            <span>© {new Date().getFullYear()}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center space-x-6 rtl:space-x-reverse space-x-reverse">
                        <Link href="/" className="hover:text-gray-300 transition mb-2 md:mb-0">حریم خصوصی</Link>
                        <Link href="/" className="hover:text-gray-300 transition mb-2 md:mb-0 ms-4">قوانین و شرایط</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}