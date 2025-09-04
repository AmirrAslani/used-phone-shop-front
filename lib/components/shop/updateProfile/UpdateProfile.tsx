import { useFormik } from 'formik';
import { useState, useRef } from 'react';
import { updateProfile } from '@/services/profile/profileService';
import Image from 'next/image';
import * as Yup from "yup";
import { Sending, Camera, AvatarPlaceholder, Spinner } from '@/assets/common/icons';
import { toast } from "react-toastify";

interface ProfileFormValues {
  name: string;
  avatar: File | null;
}

export default function UpdateProfileForm() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues: ProfileFormValues = {
    name: '',
    avatar: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "نام باید حداقل 3 کاراکتر باشد")
      .max(20, "نام باید حداکثر 20 کاراکتر باشد")
      .notRequired(),
    avatar: Yup.mixed()
      .test('fileType', 'فقط تصاویر مجاز هستند', (value) => {
        if (!value) return true;
        return ['image/jpeg', 'image/png', 'image/gif'].includes((value as File).type);
      })
      .test('fileSize', 'حجم تصویر باید کمتر از 2MB باشد', (value) => {
        if (!value) return true;
        return (value as File).size <= 2 * 1024 * 1024;
      })
      .notRequired(),
  });


  const handleSubmit = async (values: ProfileFormValues) => {
    // اگر هیچکدام پر نشده بودند
    if (!values.name && !values.avatar) {
      toast.error('لطفاً حداقل نام یا عکس پروفایل را وارد کنید');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (values.name) formData.append('name', values.name);
      if (values.avatar) formData.append('avatar', values.avatar);

      await updateProfile(formData);
      toast.success('پروفایل با موفقیت به‌روزرسانی شد!');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      formik.setFieldValue('avatar', file);
      formik.setFieldTouched('avatar', true, false);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='px-2'>
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
        <div className="text-center mb-6">
          <h4 className="text-2xl font-semibold">بروزرسانی پروفایل</h4>
          <p className="text-primary-500 mt-2">اطلاعات شخصی خود را ویرایش کنید</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Preview"
                  width={120}
                  height={120}
                  className="rounded-full w-32 h-32 object-cover border-4 border-indigo-100"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <AvatarPlaceholder />
                </div>
              )}
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-primary-500 text-white rounded-full p-2 hover:bg-primary-600 transition cursor-pointer"
              >
                <Camera />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              {formik.touched.avatar && formik.errors.avatar && (
                <div className="text-red-500 text-sm text-center mt-2">
                  {formik.errors.avatar}
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              نام
            </label>
            <input
              id="name"
              type="text"
              {...formik.getFieldProps('name')}
              className={`w-full px-4 py-2 border ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="نام خود را وارد کنید"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-primary-500 hover:bg-primary-600 cursor-pointer ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner customClassName="!size-6" />
                </span>
              ) : (
                'ذخیره تغییرات'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}