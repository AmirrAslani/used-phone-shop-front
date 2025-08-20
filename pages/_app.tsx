import "@/styles/globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import type { AppProps } from "next/app";
import Navbar from "@/layouts/navbar/Navbar";
import { NextComponentType } from 'next';
import 'animate.css/animate.css'
import Footer from "@/layouts/footer/Footer";
type PageWithLayout = {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextComponentType & PageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => (
    <>
      <ToastContainer rtl className="z-99"/>
      <Navbar />
        {page}
      <Footer/>
    </>
  ));

  return getLayout(<Component {...pageProps} />);
}