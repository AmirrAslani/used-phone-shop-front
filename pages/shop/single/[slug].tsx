import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getPhoneById } from "@/services/single/singleService";
import { IPhone } from "@/interface/components/shop.interface";
import { addToCart } from "@/services/single/singleService";
import { getCart } from "@/services/cart/cartService";
import { DottedSpinner, WhiteBag, Dots } from "@/assets/common/icons";

export interface ICartItem {
  id: string;
  cartId: string;
  phoneId: string;
  quantity: number;
  phone: IPhone;
}

export interface ICart {
  id: string;
  userId: string;
  createdAt: string;
  items: ICartItem[];
  total: number;
}

export default function PhoneDetails() {
  const router = useRouter();
  const { slug } = router.query;
  const [phone, setPhone] = useState<IPhone | null>(null);
  const [cart, setCart] = useState<null | ICart>(null);
  const isInCart = cart?.items?.some((item) => item.phoneId === slug);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    getCart()
      .then(res => {
        setCart(res.data)
      })
      .catch(err => console.error(err));

    if (!router.isReady) return;

    getPhoneById(slug as string)
      .then((res) => {
        setPhone(res.data);
      })

      .catch(err => {
        toast.error('خطا در دریافت سفارش‌ ها');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [router.isReady, slug]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.warn("برای افزودن به سبد خرید وارد شوید");
      router.push("/shop/login");
      return;
    }

    if (!phone) return;

    try {
      setSubmitLoading(true)
      const data = await addToCart(phone.id, 1);
      const updatedCart = await getCart();
      setCart(updatedCart.data);
      console.log("Added to cart:", data);
      setSubmitLoading(false)
      toast.success("محصول به سبد خرید اضافه شد");
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("خطا در افزودن به سبد خرید");
      setSubmitLoading(false)
    }
  };

  if (loading) {
    return <Dots/>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate__animated animate__fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2">

          <div className="bg-gray-100 p-6 flex items-center justify-center">
            <img
              src={`https://used-phone-shop-production.up.railway.app${phone?.image}`}
              alt={phone?.model}
              className="rounded-2xl shadow-md object-fit w-full h-[400px] max-w-md"
            />
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-extrabold text-gray-900">{phone?.brand.toLocaleUpperCase()}</h1>
            <p className="mt-2 text-lg text-gray-700 font-medium">{phone?.model}</p>
            <div className="flex items-center mt-4 font-semibold space-x-2">
              <span className="text-lg text-gray-800">قیمت:</span>
              <p className="text-2xl text-blue-500">
                {phone?.price.toLocaleString("fa-IR")} تومان
              </p>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">{phone?.description}</p>

            <div className="mt-4 text-sm text-gray-500">
              موجودی:{" "}
              <span className="text-gray-800 font-semibold">{phone?.quantity} عدد</span>
            </div>

            <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">مشخصات فنی</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
                <li><span className="font-medium">پردازنده:</span> {phone?.specs.cpu}</li>
                <li><span className="font-medium">رم:</span> {phone?.specs.ram.toLocaleUpperCase()}</li>
                <li><span className="font-medium">حافظه داخلی:</span> {phone?.specs.rom.toLocaleUpperCase()}</li>
                <li><span className="font-medium">باتری:</span> {phone?.specs.battery}</li>
                <li><span className="font-medium">دوربین پشت:</span> {phone?.specs.cameraRear}</li>
                <li><span className="font-medium">دوربین جلو:</span> {phone?.specs.cameraFront}</li>
                <li><span className="font-medium">اندازه نمایشگر:</span> {phone?.specs.displaySize}</li>
              </ul>
            </div>

            {isInCart ? (
              <button
                onClick={() => router.push('/shop/cart')}
                className="mt-8 flex justify-center items-center w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-700 hover:to-blue-900 text-white py-3 rounded-xl shadow-lg transition-all duration-300 text-lg font-medium cursor-pointer"
              >
                <span className="me-1">مشاهده سبد خرید </span><WhiteBag/>
              </button>
            ) : (
              <button disabled={submitLoading}
                onClick={handleAddToCart}
                className="mt-8 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-700 hover:to-blue-900 text-white py-3 rounded-xl shadow-lg transition-all duration-300 text-lg font-medium cursor-pointer"
              >
                {submitLoading ? (
                  <>
                    <DottedSpinner/>
                  </>
                ) : (
                  <>
                    سفارش محصول
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}
