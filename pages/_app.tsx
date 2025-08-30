import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import "animate.css/animate.css";
import { CookiesProvider } from "react-cookie";
import AuthPage from "./shop/login";
import MainLayout from "@/layouts/mainLayout/MainLayout";
import AdminLayout from "@/layouts/adminLayout/AdminLayout";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const isAdminRoute = router.pathname.startsWith("/shop/admin");
  const isLoginRoute = router.pathname.startsWith("/shop/login");

  const getLayout = (page: React.ReactNode) => {
    if (isAdminRoute) {
      return (
        <AdminLayout>
          <ToastContainer rtl className="z-9999" />
          {page}
        </AdminLayout>
      );
    } else if (isLoginRoute){
      return <AuthPage/>
    }

    return (
      <MainLayout>
        <ToastContainer rtl className="z-9999" />
        {page}
      </MainLayout>
    );
  };

  return (
    <CookiesProvider
      defaultSetOptions={{
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      }}
    >
      {getLayout(<Component {...pageProps} />)}
    </CookiesProvider>
  );
}
