import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface LoginFormValues {
    email: string;
    password: string;
  }

export default function LoginForm() {
    const router = useRouter();

    const initialValues: LoginFormValues  = { email: "", password: "" };

    const validationSchema = Yup.object({
        email: Yup.string().email("ایمیل معتبر نیست").required("ایمیل الزامی است"),
        password: Yup.string().min(6, "حداقل 6 کاراکتر").required("رمز عبور الزامی است"),
    });

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: FormikHelpers<LoginFormValues>) => {
        try {
            const { data } = await axios.post(
                "http://localhost:3001/api/auth/login",
                values
            );

            if (data.access_token) {
                localStorage.setItem("accessToken", data.access_token);
                toast.success("خوش اومدین یاشاسین");
                router.push("/");
            }
        } catch (err: unknown) {
            const error = err as AxiosError<{ message: string }>;
            toast.error(error.response?.data?.message || "خطا در ورود");
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
                            type="email"
                            name="email"
                            placeholder="ایمیل"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-right text-left"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm text-right mt-[1px]" />
                    </div>
                    <div>
                        <Field
                            type="password"
                            name="password"
                            placeholder="رمز عبور"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-right text-left"
                        />
                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm text-right mt-[1px]" />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 cursor-pointer"
                    >
                        {isSubmitting ? "در حال ورود..." : "ورود"}
                    </button>
                </Form>
            )}
        </Formik>
    );
}
