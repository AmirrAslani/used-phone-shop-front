import { useEffect, useState } from "react";
import { RightArrow } from "@/assets/common/icons";
import { getAllPhones } from "@/services/single/singleService";
import { IProducts } from "@/interface/components/shop.interface";
import { addToFavorites, checkFavorite, removeFavorite, getFavorites } from '@/services/favorites/favoritesService';
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { IPhone } from '@/interface/components/shop.interface';
import { FullScreenSpinner } from "@/assets/common/icons";
import Carousel from "@/lib/components/base/Carousel";
import { SwiperWrapper } from "@/lib/components/shop/swiper/Swiper";
import { SwiperSlide } from "swiper/react";
import { useCookies } from "react-cookie";
import Dropdown from "@/lib/components/base/Dropdown";
import Card from "@/lib/components/base/Card";

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

export const categories = [
  {
    label: "لوازم خانگی",
    items: [
      { label: "مبلمان", href: "/category/home-kitchen/furniture" },
      { label: "لوازم آشپزخانه", href: "/category/home-kitchen/kitchen" },
      { label: "دکوراسیون", href: "/category/home-kitchen/decor" },
    ],
  },
  {
    label: "مواد غذایی",
    items: [
      { label: "میوه‌ها", href: "/category/groceries/fruits" },
      { label: "سبزیجات", href: "/category/groceries/vegetables" },
      { label: "تنقلات", href: "/category/groceries/snacks" },
      { label: "نوشیدنی‌ها", href: "/category/groceries/drinks" },
    ],
  },
  {
    label: "الکترونیک",
    items: [
      { label: "موبایل", href: "/category/electronics/mobiles" },
      { label: "لپ‌تاپ", href: "/category/electronics/laptops" },
      { label: "تلویزیون", href: "/category/electronics/tvs" },
    ],
  },
  {
    label: "مد و پوشاک",
    items: [
      { label: "مردانه", href: "/category/fashion/men" },
      { label: "زنانه", href: "/category/fashion/women" },
      { label: "بچگانه", href: "/category/fashion/kids" },
    ],
  },
  {
    label: "بهبود خانه",
    items: [
      { label: "ابزارآلات", href: "/category/home-improvement/tools" },
      { label: "روشنایی", href: "/category/home-improvement/lighting" },
      { label: "ایمنی", href: "/category/home-improvement/safety" },
    ],
  },
  {
    label: "لوازم ورزشی",
    items: [
      { label: "ورزشی", href: "/category/sports-toys/sports" },
      { label: "اسباب‌بازی", href: "/category/sports-toys/toys" },
      { label: "چمدان", href: "/category/sports-toys/luggage" },
    ],
  },
];

export default function PhonesPage() {
  const router = useRouter();
  const [cookies] = useCookies(["accessToken"]);
  const [products, setProducts] = useState<IProducts[]>([]);
  const [favorites, setFavorites] = useState<IPhone[]>([]);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState<{ [key: string]: boolean }>({});

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

  const handleToggleFavorite = async (phoneId: string) => {
    const token = cookies.accessToken;
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
    <>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="border-y border-gray-200 py-3 px-1 md:p-6">
            <div className="grid grid-cols-12 items-center max-w-4xl gap-2 m-auto">
              {categories.map((cat) => (
                <div key={cat.label} className="col-span-4 md:col-span-4 lg:col-span-2 flex justify-center">
                  <Dropdown
                    label={cat.label}
                    items={cat.items}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="px-2 md:px-4">
            <div>
              <Carousel images={banners} autoPlay={true} interval={7000} />
            </div>
            
            <div className="mt-12 px-3 md:px-0">
              <div className="flex justify-between items-center">
                <span className="border-b border-b-[3px] border-[#008ECC] pb-2 text-sm md:text-lg lg:text-xl font-bold">
                  بهترین قیمت <span className="text-[#008ECC]"> گوشی هوشمند</span> را از ما بخواهید
                </span>
                <div className="flex gap-1 items-center pb-2 cursor-pointer">
                  <span className="font-medium text-sm md:text-base">مشاهد همه</span>
                  <span className="rotate-180"><RightArrow /></span>
                </div>
              </div>
              <div className="border-t border-gray-200"></div>
              <SwiperWrapper pagination={{ clickable: true }} autoplay={{ delay: 5000 }}>
                {products.map((product) => (
                  <SwiperSlide key={product.id} className="py-10">
                    <Card
                      id={product.id}
                      onClick={() => router.push(`/shop/single/${product.id}`)}
                      brand={product.brand}
                      title={product.model}
                      image={product.image}
                      price={product.price}
                      newPrice={63799000}
                      discount={19}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={favorites.some((fav) => fav.id === product.id)}
                      isLoading={likeLoading[product.id]}
                    />
                  </SwiperSlide>
                ))}
              </SwiperWrapper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}