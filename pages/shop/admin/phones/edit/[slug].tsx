import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { deletePhone, editPhone } from "@/services/admin/phoneService";
import { getPhoneById } from "@/services/single/singleService";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IPhone } from "@/interface/shop.interface";
import Image from "next/image";
import { Spinner } from "@/assets/common/icons";

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
    // image: File | string | null;
    image: (typeof window extends undefined ? never : File) | string | null;
    quantity: number;
    specs?: Specs;
}

const EditPhone: React.FC = () => {
    const router = useRouter();
    const { slug } = router.query;
    const [phone, setPhone] = useState<IPhone | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [removeLoading, setRemoveLoading] = useState(false);

    useEffect(() => {
        if (!slug) return;

        getPhoneById(slug as string)
            .then((res) => {
                setPhone(res.data);
                console.log('phone', res.data);
            })
            .catch(err => {
                toast.error('خطا در دریافت محصول');
                console.error(err);
            });
    }, [slug]);

    const formik = useFormik<PhoneForm>({
        enableReinitialize: true,
        initialValues: {
            brand: phone?.brand || "",
            model: phone?.model || "",
            price: phone?.price || 0,
            description: phone?.description || "",
            image: phone?.image || null,
            quantity: phone?.quantity || 0,
            specs: {
                cpu: phone?.specs.cpu || "",
                ram: phone?.specs.ram || "",
                rom: phone?.specs.rom || "",
                battery: phone?.specs.battery || "",
                cameraRear: phone?.specs.cameraRear || "",
                cameraFront: phone?.specs.cameraFront || "",
                displaySize: phone?.specs.displaySize || "",
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
                if (!slug || Array.isArray(slug)) {
                    return;
                }
                const res = await editPhone(slug, formData);
                setPhone(res);
                toast.success("محصول با موفقیت ویرایش شد ✅");
                console.log("response:", res);
                resetForm();
            } catch (err) {
                console.error("خطا در ویرایش محصول:", err);
                toast.error("خطا در ویرایش محصول ❌");
            }
        },
    });

    useEffect(() => {
        if (formik.values.image instanceof File) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(formik.values.image);
        } else {
            setPreviewImage(null);
        }
    }, [formik.values.image]);

    const handleDelete = async (slug: string) => {
        try {
            setRemoveLoading(true)
            await deletePhone(slug);
            setRemoveLoading(false)
            router.push('/shop/admin/phones/list')
            toast.success("محصول حذف شد");
        } catch (err) {
            console.error("Error to delete product:", err);
            setRemoveLoading(false)
            toast.error("خطا در حذف محصول");
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">ویرایش محصول</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                {/* Brand */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-6">
                        <label>Brand</label>
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
                    <div className="col-span-12 md:col-span-6">
                        <label>Model</label>
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
                    <div className="col-span-12 md:col-span-6">
                        <label>Price</label>
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
                    <div className="col-span-12 md:col-span-6">
                        <label>Description</label>
                        <input
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
                </div>

                {/* File Uploader */}
                <div>
                    {/* {previewImage ? (
                        <Image
                            src={previewImage}
                            alt="Preview"
                            width={80}
                            height={80}
                            className="rounded-lg shadow-md mb-2"
                        />
                    ) : (
                        <img
                            src={phone?.image}
                            alt={phone?.model}
                            width={80}
                            height={80}
                            className="rounded-lg shadow-md size-[80px] mb-2"
                        />
                    )}

                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(event) => {
                            const file = event.currentTarget.files?.[0] || null;
                            if (file) {
                                formik.setFieldValue("image", file);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    setPreviewImage(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                            } else {
                                setPreviewImage(null);
                            }
                        }}
                        className="w-full border rounded p-2 cursor-pointer"
                    />
                    {typeof window !== "undefined" && formik.values.image instanceof File && (
                        <p className="text-sm text-gray-600">
                            فایل انتخاب شد: {formik.values.image.name}
                        </p>
                    )}
                    {formik.touched.image && formik.errors.image && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.image}</p>
                    )} */}

                    {previewImage ? (
                        <Image
                            src={previewImage}
                            alt="Preview"
                            width={80}
                            height={80}
                            className="rounded-lg shadow-md mb-2"
                        />
                    ) : (
                        <img
                            src={phone?.image}
                            alt={phone?.model}
                            width={80}
                            height={80}
                            className="rounded-lg shadow-md size-[80px] mb-2"
                        />
                    )}

                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={(event) => {
                            const file = event.currentTarget.files?.[0] || null;
                            formik.setFieldValue("image", file);
                        }}
                        className="w-full border rounded p-2 cursor-pointer"
                    />

                    {typeof window !== "undefined" && formik.values.image instanceof File && (
                        <p className="text-sm text-gray-600">
                            فایل انتخاب شد: {(formik.values.image as File).name}
                        </p>
                    )}
                    {formik.touched.image && formik.errors.image && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.image}</p>
                    )}

                </div>

                {/* Quantity */}
                <div className="col-span-12 md:col-span-6">
                    <label>Quantity</label>
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
                    <div className="mt-4">
                        <h3 className="font-semibold mb-2">مشخصات</h3>
                        <div className="grid grid-cols-12 gap-4">
                            {(
                                Object.keys(formik.values.specs) as Array<keyof Specs>
                            ).map((key) => (
                                <div key={key} className="col-span-12 md:col-span-6">
                                    {key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}
                                    <input
                                        type="text"
                                        name={`specs.${key}`}
                                        placeholder={key}
                                        value={formik.values.specs?.[key]}
                                        onChange={formik.handleChange}
                                        className="w-full border rounded p-2 mb-2"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                }
                <div className="flex gap-x-4">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                    >
                        ویرایش
                    </button>
                    <button
                        disabled={removeLoading}
                        onClick={() => {
                            if (typeof slug === "string") {
                                handleDelete(slug);
                            }
                        }}
                        type="button"
                        className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 cursor-pointer"
                    >
                        {removeLoading ? <Spinner customClassName="border-white size-6" /> : 'حذف'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPhone;