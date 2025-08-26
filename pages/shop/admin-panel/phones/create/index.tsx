import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createPhone } from "@/services/admin-panel/phoneService";
import { toast } from "react-toastify";

interface Specs {
    cpu?: string;
    ram?: string;
    rom?: string;
    battery?: string;
    cameraRear?: string;
    cameraFront?: string;
    displaySize?: string;
}

interface PhoneForm {
    brand: string;
    model: string;
    price: number;
    description: string;
    image: File | null;
    quantity: number;
    specs?: Specs;
}

const CreatePhone: React.FC = () => {
    const formik = useFormik<PhoneForm>({
        initialValues: {
            brand: "",
            model: "",
            price: 0,
            description: "",
            image: null,
            quantity: 0,
            specs: {
                cpu: "",
                ram: "",
                rom: "",
                battery: "",
                cameraRear: "",
                cameraFront: "",
                displaySize: "",
            },
        },
        validationSchema: Yup.object({
            brand: Yup.string().required("برند الزامی است"),
            model: Yup.string().required("مدل الزامی است"),
            price: Yup.number().required("قیمت الزامی است").min(1),
            description: Yup.string().required("توضیحات الزامی است"),
            image: Yup.string().required("آدرس تصویر الزامی است"),
            quantity: Yup.number().required("تعداد الزامی است").min(0),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const formData = new FormData();
                formData.append("brand", values.brand);
                formData.append("model", values.model);
                formData.append("price", String(values.price));
                formData.append("description", values.description);
                formData.append("quantity", String(values.quantity));

                if (values.image) {
                    formData.append("image", values.image); // ارسال فایل
                }

                // اگر specs پر شده بود
                formData.append("specs", JSON.stringify(values.specs));

                const res = await createPhone(formData);
                toast.success("محصول با موفقیت ایجاد شد ✅");
                console.log("response:", res);
                resetForm();
            } catch (err) {
                console.error("خطا در ساخت محصول:", err);
                toast.error("خطا در ساخت محصول ❌");
            }
        },
    });

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">ایجاد محصول جدید</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Brand */}
                <div>
                    <input
                        type="text"
                        name="brand"
                        placeholder="برند"
                        value={formik.values.brand}
                        onChange={formik.handleChange}
                        className="w-full border rounded p-2"
                    />
                    {formik.touched.brand && formik.errors.brand && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.brand}</p>
                    )}
                </div>

                {/* Model */}
                <div>
                    <input
                        type="text"
                        name="model"
                        placeholder="مدل"
                        value={formik.values.model}
                        onChange={formik.handleChange}
                        className="w-full border rounded p-2"
                    />
                    {formik.touched.model && formik.errors.model && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.model}</p>
                    )}
                </div>

                {/* Price */}
                <div>
                    <input
                        type="number"
                        name="price"
                        placeholder="قیمت"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        className="w-full border rounded p-2"
                    />
                    {formik.touched.price && formik.errors.price && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <textarea
                        name="description"
                        placeholder="توضیحات"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        className="w-full border rounded p-2"
                    />
                    {formik.touched.description && formik.errors.description && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
                    )}
                </div>

                {/* File Uploader */}
                <div>
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(event) => {
                            const file = event.currentTarget.files?.[0] || null;
                            formik.setFieldValue("image", file);
                        }}
                        className="w-full border rounded p-2"
                    />
                    {formik.values.image && (
                        <p className="text-sm text-gray-600">
                            فایل انتخاب شد: {formik.values.image.name}
                        </p>
                    )}
                    {formik.touched.image && formik.errors.image && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.image}</p>
                    )}
                </div>

                {/* Quantity */}
                <div>
                    <input
                        type="number"
                        name="quantity"
                        placeholder="تعداد"
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                        className="w-full border rounded p-2"
                    />
                    {formik.touched.quantity && formik.errors.quantity && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.quantity}</p>
                    )}
                </div>

                {/* Specs */}
                {formik.values.specs &&
                    <div className="mt-4 border-t pt-4">
                        <h3 className="font-semibold mb-2">مشخصات (اختیاری)</h3>
                        {(
                            Object.keys(formik.values.specs) as Array<keyof Specs>
                        ).map((key) => (
                            <div key={key}>
                                <input
                                    type="text"
                                    name={`specs.${key}`}
                                    placeholder={key}
                                    value={formik.values.specs?.[key] ?? ""}
                                    onChange={formik.handleChange}
                                    className="w-full border rounded p-2 mb-2"
                                />
                            </div>
                        ))}
                    </div>
                }
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    ذخیره محصول
                </button>
            </form>
        </div>
    );
};

export default CreatePhone;
