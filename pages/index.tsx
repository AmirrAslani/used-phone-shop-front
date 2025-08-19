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

export default function PhonesPage() {
  const router = useRouter();

  const [products, setProducts] = useState<IProducts[]>([]);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<IPhone[]>([]);

  useEffect(() => {
    getAllPhones()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
        // setProducts(res.data);
        console.log("phones response:", res.data);
      })
      .catch(console.error);
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

    try {
      const res = await checkFavorite(phoneId);
      const isFavorite = res.isFavorite ?? res;

      if (isFavorite) {
        await removeFavorite(phoneId);
        setFavorites((prev) => prev.filter((item) => item.id !== phoneId));
      } else {
        const data = await addToFavorites(phoneId);
        console.log("added item:", data);
        setFavorites((prev: IPhone[]) => [...prev, { id: phoneId } as IPhone]);

        toast.success("محصول به علاقه مندی ها اضافه شد");
      }
    } catch (err) {
      toast.error("خطا در بروزرسانی علاقه مندی ها");
      console.error(err);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="mb-5">
          <Input
            name="Search"
            label="جستجو"
            value={search}
            placeholder="نام کالا، مدل..."
            icon={<Search />}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              onClick={() => router.push(`/shop/single/${product.id}`)}
            >
              <div className="overflow-hidden">
                <img
                  src={`https://used-phone-shop-production.up.railway.app${product.image}`}
                  alt={product.model}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                      {product.brand}
                    </h2>

                    <div
                      className="text-red-500 text-xl cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(product.id)
                      }}
                      title="افزودن به علاقه‌مندی"
                    >
                      <FaHeart
                        color={favorites.some((fav) => fav.id === product.id) ? "red" : "lightgray"}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {product.model}
                  </p>

                  <div className="flex items-center mt-4 space-x-2">
                    <span className="text-gray-600">قیمت:</span>
                    <p className="text-xl text-blue-500">
                      {product.price.toLocaleString("fa-IR")} تومان
                    </p>
                  </div>
                </div>

                <Link href={`/shop/single/${product.id}`}>
                  <Button
                    text="مشاهده و خرید"
                    className="mt-5 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 mt-6">هیچ کالایی یافت نشد</p>
        )}
      </div>
    </div>
  );
}
