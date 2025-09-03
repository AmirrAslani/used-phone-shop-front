import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import Card from "../../base/Card";

type Product = {
  id: string;
  brand: string;
  model: string;
  price: number;
  image: string;
  description: string
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
            <Card
              title={product.description}
              image={product.image}
              price={product.price}
              oldPrice={8999999}
              discount={35}
            />
          </SwiperSlide>
        ))}
      </Swiper>

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
