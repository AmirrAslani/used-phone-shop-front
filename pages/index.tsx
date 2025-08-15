import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@/lib/components/base/Button";
import Input from "@/lib/components/base/Input";
import { Search } from "@/assets/common/icons";
import Link from "next/link";
import { getAllPhones } from "@/services/single/singleService";
import { IProducts } from "@/interface/components/shop.interface";


export default function PhonesPage() {
  const [products, setProducts] = useState<IProducts[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllPhones()
      .then((res) => {
        setProducts(res.data);
      })
      .catch(console.error);
  }, []);

  // فیلتر کردن بر اساس مدل
  const filteredProducts = products.filter(product =>
    product.model.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* بخش جستجو */}
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

        {/* نمایش کارت‌ها */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((products) => (
             <Link href={`/shop/single/${products.id}`} key={products.id}>
            <div
              key={products.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="overflow-hidden">
                <img
                  src={`http://localhost:3000${products.image}`}
                  alt={products.model}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="p-5 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                    {products.brand}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {products.model}
                  </p>
                  <p className="text-xl font-bold text-green-600 mt-3">
                    {products.price.toLocaleString("fa-IR")} تومان
                  </p>
                </div>

                <Button
                  onClick={() => { }}
                  text="سفارش"
                  className="mt-5 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                />
              </div>
            </div>
            </Link>
          ))}
        </div>

        {/* وقتی نتیجه‌ای پیدا نشد */}
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500 mt-6">هیچ کالایی یافت نشد</p>
        )}
      </div>
    </div>
  );
}
