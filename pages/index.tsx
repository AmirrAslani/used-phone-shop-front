import { useEffect, useState } from "react";
import Button from "@/lib/components/base/Button";
import Input from "@/lib/components/base/Input";
import { Search } from "@/assets/common/icons";
import Link from "next/link";
import { getAllPhones } from "@/services/single/singleService";
import { IProducts } from "@/interface/components/shop.interface";
import { addToFavorites, checkFavorite, removeFavorite, getFavorites } from '@/services/favorites/favoritesService';
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { FaHeart } from 'react-icons/fa';
import { IPhone } from '@/interface/components/shop.interface';
import { FullScreenSpinner } from "@/assets/common/icons";
import Carousel from "@/lib/components/base/Carousel";
import { ProductCarousel } from "@/lib/components/shop/productCarousel/ProductCarousel";

const banners = [
  {
    src: "/images/banner2.jpg",
    alt: "بنر ۱",
    title: "محصول ویژه",
    subtitle: "همین حالا خرید کنید و تخفیف بگیرید",
    ctaText: "مشاهده محصول",
    ctaLink: "",
  },
  {
    src: "/images/banner1.jpg",
    alt: "بنر ۲",
    title: "جدیدترین گوشی‌ها",
    subtitle: "با قیمت عالی و گارانتی معتبر",
    ctaText: "خرید کنید",
    ctaLink: "",
  },
  {
    src: "/images/banner3.jpg",
    alt: "بنر ۳",
    title: "پیشنهاد ویژه امروز",
    subtitle: "فقط تا پایان شب",
    ctaText: "بزن بریم",
    ctaLink: "",
  },
];

export default function PhonesPage() {
  const router = useRouter();

  const [products, setProducts] = useState<IProducts[]>([]);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<IPhone[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState<{ [key: string]: boolean }>({});
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>({});

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

  const filteredProducts = products.filter(product =>
    product.model.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleFavorite = async (phoneId: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.warn("برای افزودن به علاقه مندی وارد شوید");
      router.push("/shop/login");
      return;
    }

    setLikeLoading((prev) => ({ ...prev, [phoneId]: true }));

    try {
      const res = await checkFavorite(phoneId);
      const isFavorite = res.isFavorite ?? res;

      if (isFavorite) {
        await removeFavorite(phoneId);
        setFavorites((prev) => prev.filter((item) => item.id !== phoneId));
      } else {
        await addToFavorites(phoneId);
        setFavorites((prev: IPhone[]) => [...prev, { id: phoneId } as IPhone]);
        toast.success("محصول به علاقه مندی ها اضافه شد");
      }
    } catch (err) {
      toast.error("خطا در بروزرسانی علاقه مندی ها");
      console.error(err);
    } finally {
      setLikeLoading((prev) => ({ ...prev, [phoneId]: false }));
    }
  };


  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await getFavorites();
      setFavorites(res.data);
    } catch (err) {
      console.error("خطا در گرفتن علاقه‌ مندی‌ها:", err);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <FullScreenSpinner />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-2 md:px-4">

      <div className="max-w-7xl mx-auto space-y-10">
        <div>
          <Carousel images={banners} autoPlay={true} interval={7000} />
        </div>
        <div>
          <div className="mb-2">
            <Input
              name="Search"
              label="جستجو"
              value={search}
              placeholder="نام کالا، مدل..."
              icon={<Search />}
              onChange={(e) => setSearch(e.target.value)}
              inputClassName="bg-gray-50"
            />
          </div>

          <div
            className={`me-1 px-2 py-4
    ${products.length >= 5 ? "overflow-y-scroll h-[600px] md:h-[950px]" : "overflow-y-auto md:overflow-visible"}`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate__animated animate__fadeInDown"
                  onClick={() => router.push(`/shop/single/${product.id}`)}
                >
                  {/* تصویر */}
                  <div className="overflow-hidden relative w-full h-72 bg-gray-50">
                    {!imageLoaded[product.id] && (
                      <div className="absolute inset-0 animate-pulse bg-gray-300 rounded-md"></div>
                    )}
                    <img
                      src={`https://used-phone-shop-production.up.railway.app${product.image}`}
                      alt={product.model}
                      className={`w-full h-full transition-transform duration-300 hover:scale-105 ${imageLoaded[product.id] ? "opacity-100" : "opacity-0"
                        }`}
                      onLoad={() =>
                        setImageLoaded((prev) => ({ ...prev, [product.id]: true }))
                      }
                    />
                  </div>

                  {/* محتوا */}
                  <div className="p-3 sm:p-4 md:p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 tracking-tight">
                          {product.brand}
                        </h2>

                        <div
                          className={`text-lg sm:text-xl cursor-pointer ${likeLoading[product.id]
                            ? "opacity-80 pointer-events-none"
                            : "text-red-600"
                            }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!likeLoading[product.id]) handleToggleFavorite(product.id);
                          }}
                          title="افزودن به علاقه‌مندی"
                        >
                          {likeLoading[product.id] ? (
                            <div className="w-4.5 h-4.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                          ) : (
                            <FaHeart
                              color={
                                favorites.some((fav) => fav.id === product.id)
                                  ? "red"
                                  : "lightgray"
                              }
                            />
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 line-clamp-2">
                        {product.model}
                      </p>

                      <div className="flex items-center mt-3 sm:mt-4 space-x-2">
                        <span className="text-xs sm:text-sm md:text-base text-gray-600">
                          قیمت:
                        </span>
                        <p className="text-lg sm:text-xl md:text-2xl text-blue-500">
                          {product.price.toLocaleString("fa-IR")} تومان
                        </p>
                      </div>
                    </div>

                    <Link href={`/shop/single/${product.id}`}>
                      <Button
                        text="مشاهده و خرید"
                        className="mt-4 sm:mt-5 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-2 sm:py-2.5 md:py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-sm sm:text-base md:text-lg"
                      />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            {filteredProducts.length === 0 && (
              <p className="text-center text-gray-500 mt-5">هیچ کالایی یافت نشد</p>
            )}
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-lg md:text-2xl font-semibold mb-3">محصولات پیشنهادی</h2>
          <div className="bg-gray-200 p-4 rounded-xl">
            <ProductCarousel products={products} />
          </div>
        </div>

      </div>
    </div>
  );
}
