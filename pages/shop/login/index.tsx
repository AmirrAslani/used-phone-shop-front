import { useState } from "react";
import LoginForm from "@/lib/components/shop/login/LoginForm";
import RegisterForm from "@/lib/components/shop/Register/RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-blue-300 to-primary-700 flex items-center justify-center px-3">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h4 className="text-2xl font-semibold text-center mb-6 cursor-pointer">
          {isLogin ? "ورود به حساب" : "ثبت‌ نام"}
        </h4>

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary-500 hover:text-primary-600 hover:underline transition cursor-pointer"
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

