import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

type Product = {
  id: string;
  brand: string;
  model: string;
  price: number;
  image: string;
};

type ProductCarouselProps = {
  products: Product[];
};

export function ProductCarousel({ products }: ProductCarouselProps) {
  return (
    <div className="w-full product-carousel">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={8}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 10 },
          640: { slidesPerView: 2, spaceBetween: 15 },
          1024: { slidesPerView: 3, spaceBetween: 20 },
          1280: { slidesPerView: 4, spaceBetween: 25 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id} className="px-2 py-4">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              {/* تصویر */}
              <div className="relative w-full h-40 flex items-center justify-center bg-gray-50">
                <img
                  src={`https://used-phone-shop-production.up.railway.app${product.image}`}
                  alt={product.model}
                  className="object-contain h-full w-auto transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* متن */}
              <div className="p-3 flex flex-col gap-2">
                <span className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {product.brand}
                </span>
                <span className="text-xs text-gray-600 line-clamp-2">
                  {product.model}
                </span>
                <span className="text-sm font-bold text-blue-600 mt-1">
                  {product.price.toLocaleString("fa-IR")} تومان
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* استایل برای pagination */}
      <style>
        {`
          .product-carousel .swiper-pagination {
            bottom: -7px !important;
          }
        `}
      </style>
    </div>
  );
}
