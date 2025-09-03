import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getPhoneById } from "@/services/single/singleService";
import { IPhone } from "@/interface/components/shop.interface";
import { addToCart } from "@/services/single/singleService";
import { getCart } from "@/services/cart/cartService";
import { DottedSpinner, WhiteBag, Dots } from "@/assets/common/icons";
import { ProductCarousel } from "@/lib/components/shop/productCarousel/ProductCarousel";
import { IProducts } from "@/interface/components/shop.interface";
import { getAllPhones } from "@/services/single/singleService";
import { useCookies } from "react-cookie";

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
  const [products, setProducts] = useState<IProducts[]>([]);
  const [cookies] = useCookies(["accessToken"]);

  useEffect(() => {
    getAllPhones()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

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
        toast.error('خطا در دریافت محصول');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [router.isReady, slug]);

  const handleAddToCart = async () => {
    const token = cookies.accessToken;
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
    return <Dots />
  }

  return (
    <div className="min-h-screen py-5 md:py-12 px-2 md:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden animate__animated animate__fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2">

            <div className="bg-gray-100 p-3 md:p-6 flex items-center justify-center">
              <img
                src={phone?.image}
                alt={phone?.model}
                className="rounded-xl md:rounded-2xl shadow-md size-[220px] md:size-auto md:w-full max-w-md"
              />
            </div>

            <div className="p-4 md:p-8">
              <h4 className="text-xl md:text-3xl font-extrabold text-gray-900">{phone?.brand.toLocaleUpperCase()}</h4>
              <p className="mt-1 md:text-lg text-gray-700 font-medium">{phone?.model}</p>
              <div className="flex items-center mt-2 md:mt-4 font-semibold space-x-2">
                <span className="md:text-lg text-gray-800">قیمت:</span>
                <p className="text-lg md:text-2xl text-blue-500">
                  {phone?.price.toLocaleString("fa-IR")} تومان
                </p>
              </div>
              <p className="mt-1 md:mt-4 text-sm md:text-normal text-gray-600 leading-relaxed">{phone?.description}</p>

              <div className="mt-1 md:mt-4 text-sm md:text-normal text-gray-500">
                موجودی:{" "}
                <span className="text-gray-800 font-semibold">{phone?.quantity} عدد</span>
              </div>

              <div className="mt-3 md:mt-8 bg-gray-50 border border-gray-200 rounded-xl p-3 md:p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2 md:mb-4">مشخصات فنی</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 text-gray-700 text-sm md:text-normal">
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
                  onClick={() => router.push('/shop/user/cart')}
                  className="mt-4 md:mt-10 flex justify-center items-center w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-700 hover:to-blue-900 text-white py-3 rounded-xl shadow-lg transition-all duration-300 text-lg font-medium cursor-pointer"
                >
                  <span className="me-1">مشاهده سبد خرید </span><WhiteBag />
                </button>
              ) : (
                <button disabled={submitLoading}
                  onClick={handleAddToCart}
                  className="mt-4 md:mt-10 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-700 hover:to-blue-900 text-white py-2 md:py-3 rounded-lg md:rounded-xl shadow-lg transition-all duration-300 md:text-lg font-medium cursor-pointer"
                >
                  {submitLoading ? (
                    <>
                      <DottedSpinner />
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
        <div className="mt-6 md:mt-12">
          <h2 className="text-lg md:text-xl font-semibold mb-3">محصولات پیشنهادی</h2>
          <div className="bg-gray-100 p-4 rounded-xl">
            <ProductCarousel products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}
