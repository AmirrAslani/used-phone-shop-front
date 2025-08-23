import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addToOrders } from "@/services/orders/ordersService";
import { toast } from 'react-toastify';
import { AxiosError } from "axios";
import { useRouter } from "next/router";

export default function CheckoutPage() {
    const router = useRouter()

    const formik = useFormik({
        initialValues: {
            address: "",
            phoneNumber: "",
            note: "",
        },
        validationSchema: Yup.object({
            address: Yup.string().required("آدرس الزامی است"),
            phoneNumber: Yup.string()
                .matches(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید")
                .required("شماره موبایل الزامی است"),
            note: Yup.string().min(10, "یادداشت حداقل باید 10 کاراکتر باشد").max(90, "یادداشت حداکثر باید 90 کاراکتر باشد").notRequired(),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const formData = new FormData();
                formData.append("address", values.address);
                formData.append("phoneNumber", values.phoneNumber);
                formData.append("note", values.note);

                await addToOrders(formData);
                toast.success("سفارش شما با موفقیت ثبت شد");
                resetForm();
                router.push('/shop/orders')
            } catch (err) {
                console.error("خطا در ثبت سفارش:", err);
                if (err instanceof AxiosError) {
                    console.error("خطا در ثبت سفارش:", err);

                    if (err.response?.status === 400) {
                        toast.error("سبد خرید شما خالی است!");
                    }
                } else {
                    console.error("خطای ناشناخته:", err);
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md my-10">
            <h4 className="text-xl font-bold mb-4 text-center">ثبت سفارش</h4>

            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">آدرس</label>
                    <textarea
                        name="address"
                        className="w-full border rounded-md p-2"
                        rows={3}
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.address && formik.errors.address && (
                        <p className="text-red-500 text-sm">{formik.errors.address}</p>
                    )}
                </div>

                <div>
                    <label className="block mb-1 font-medium">یادداشت</label>
                    <textarea
                        name="note"
                        className="w-full border rounded-md p-2"
                        rows={2}
                        value={formik.values.note}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.note && formik.errors.note && (
                        <p className="text-red-500 text-sm">{formik.errors.note}</p>
                    )}
                </div>

                <div>
                    <label className="block mb-1 font-medium">شماره موبایل</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        className="w-full border rounded-md p-2"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                        <p className="text-red-500 text-sm">{formik.errors.phoneNumber}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
                >
                    {formik.isSubmitting ? "در حال انجام..." : "ثبت سفارش"}
                </button>
            </form>
        </div>
    );
}
