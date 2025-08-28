import { useState } from "react";
import LoginForm from "@/lib/components/shop/login/LoginForm";
import RegisterForm from "@/lib/components/shop/Register/RegisterForm";
import { ReactElement } from "react";
import { ToastContainer } from "react-toastify";
import { withAuth } from "@/utils/withAuth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-300 to-red-400 flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 cursor-pointer">
          {isLogin ? "ورود به حساب" : "ثبت‌ نام"}
        </h2>

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-purple-600 hover:underline cursor-pointer"
          >
            {isLogin
              ? "حساب ندارید؟ ثبت‌ نام کنید"
              : "حساب دارید؟ وارد شوید"}
          </button>
        </div>
      </div>
    </div>
  );
}

AuthPage.getLayout = function PageLayout(page: ReactElement) {
  return (
    <>
      <ToastContainer/>
      {page}
    </>
  )
}

export const getServerSideProps = withAuth(
  async () => {
    return { props: {} };
  },
  {
    destination: "/",
    permanent: true,
    redirectIf: (token) => !!token
  }
);

