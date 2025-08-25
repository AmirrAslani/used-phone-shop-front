import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addToOrders } from "@/services/orders/ordersService";
import { toast } from 'react-toastify';
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { getProvinces } from "@/services/provinces/provincesService";
import { Spinner } from "@/assets/common/icons";

export default function CheckoutPage() {
    const router = useRouter()
    const [provinces, setProvinces] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProvinces()
            .then(res => {
                setProvinces(res.data);
            })
            .catch(err => {
                toast.error('خطا در دریافت استان ها');
                console.error(err);
            })
            .finally(() => setLoading(false))
    }, []);


    const formik = useFormik({
        initialValues: {
            provinceId: "",
            address: "",
            phoneNumber: "",
            note: "",
            postalCode: "",
        },
        validationSchema: Yup.object({
            address: Yup.string().required("آدرس الزامی است").min(10, "آدرس حداقل باید 10 کاراکتر باشد").max(80, "آدرس حداکثر باید 80 کاراکتر باشد"),
            provinceId: Yup.string().required("استان را انتخاب کنید"),
            phoneNumber: Yup.string()
                .matches(/^09\d{9}$/, "شماره موبایل معتبر وارد کنید")
                .required("شماره موبایل الزامی است"),
            note: Yup.string().min(10, "یادداشت حداقل باید 10 کاراکتر باشد").max(180, "یادداشت حداکثر باید 180 کاراکتر باشد").notRequired(),
            postalCode: Yup.string().required("کد پستی الزامی است").min(10, "کد پستی باید 10 رقم باشد").max(10, "کد پستی باید 10 رقم باشد"),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const formData = new FormData();
                formData.append("address", values.address);
                formData.append("provinceId", values.provinceId);
                formData.append("phoneNumber", values.phoneNumber);
                formData.append("note", values.note);
                formData.append("postalCode", values.postalCode);

                await addToOrders(formData);
                toast.success("سفارش شما با موفقیت ثبت شد");
                resetForm();
                router.push('/shop/orders')
            } catch (err) {
                console.error("خطا در ثبت سفارش:", err);
                if (err instanceof AxiosError) {
                    console.error("خطا در ثبت سفارش:", err);

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
                    <select
                        name="provinceId"
                        className="w-full border rounded-md p-2"
                        value={formik.values.provinceId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="">{loading ? 'در حال بارگذاری...': 'انتخاب کنید'}</option>

                        {provinces.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    {formik.touched.provinceId && formik.errors.provinceId && (
                        <p className="text-red-500 text-sm">{formik.errors.provinceId}</p>
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
                <div>
                    <label className="block mb-1 font-medium">کد پستی</label>
                    <input
                        type="text"
                        name="postalCode"
                        className="w-full border rounded-md p-2"
                        value={formik.values.postalCode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.postalCode && formik.errors.postalCode && (
                        <p className="text-red-500 text-sm">{formik.errors.postalCode}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition cursor-pointer"
                >
                    {formik.isSubmitting ? <Spinner customClassName="!size-6"/> : "ثبت سفارش"}
                </button>
            </form>
        </div>
    );
}
