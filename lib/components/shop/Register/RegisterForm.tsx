import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios, {AxiosError} from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface RegisterFormValues {
    email: string;
    password: string;
    name: string;
    confirmPassword: string
  }
  
export default function RegisterForm() {
    const router = useRouter();

    const initialValues = { name: "", email: "", password: "", confirmPassword: "" };

    const validationSchema = Yup.object({
        name: Yup.string().min(3, "نام باید حداقل 3 کاراکتر باشد").max(20, "نام باید حداکثر 20 کاراکتر باشد").required("نام الزامی است"),
        email: Yup.string().email("ایمیل معتبر نیست").min(10, "ایمیل باید حداقل 10 کاراکتر باشد").max(40, "ایمیل باید حداکثر 40 کاراکتر باشد").required("ایمیل الزامی است"),
        password: Yup.string().min(6, "حداقل 6 کاراکتر").max(16, "رمز عبور باید حداکثر 16 کاراکتر باشد").required("رمز عبور الزامی است"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'رمز عبور و تایید آن باید یکسان باشند')
            .required("تایید رمز عبور الزامی است"),
    });

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: FormikHelpers<RegisterFormValues>) => {
        try {
            // Only send name, email, and password to backend (exclude confirmPassword)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...submitData } = values;
            
            // مرحله 1: ثبت‌نام
            await axios.post(
                "https://used-phone-shop-production.up.railway.app/api/auth/register",
                submitData
            );
            toast.success("ثبت‌ نام موفق!");

            // مرحله 2: لاگین خودکار
            const { data } = await axios.post(
                "https://used-phone-shop-production.up.railway.app/api/auth/login",
                submitData
            );

            if (data.access_token) {
                localStorage.setItem("accessToken", data.access_token);
                toast.success("خوش اومدین یاشاسین");
                router.push("/");
            }
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            toast.error(error.response?.data?.message || "خطا در ثبت‌ نام");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
                <Form className="space-y-4" dir="ltr">
                    <div>
                        <Field
                            type="text"
                            name="name"
                            placeholder="نام"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-right text-left"
                        />
                        <ErrorMessage name="name" component="div" className="text-red-500 text-sm text-right mt-[1px]" />
                    </div>
                    <div>
                        <Field
                            type="email"
                            name="email"
                            placeholder="ایمیل"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-right text-left"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm text-right mt-[1px]" />
                    </div>
                    <div>
                        <Field
                            type="password"
                            name="password"
                            placeholder="رمز عبور"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-right text-left"
                        />
                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm text-right mt-[1px]" />
                    </div>
                    <div>
                        <Field
                            type="password"
                            name="confirmPassword"
                            placeholder="تایید رمز عبور"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-right text-left"
                        />
                        <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm text-right mt-[1px]" />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 cursor-pointer"
                    >
                        {isSubmitting ? "در حال ثبت‌ نام..." : "ثبت‌ نام"}
                    </button>
                </Form>
            )}
        </Formik>
    );
}
