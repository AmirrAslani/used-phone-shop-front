import React, { ReactNode } from "react";
import { Swiper } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { SwiperOptions } from "swiper/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

type SwiperWrapperProps = {
  children: ReactNode;
  spaceBetween?: number;
  slidesPerView?: number;
  pagination?: object | boolean;
  autoplay?: object | boolean;
  breakpoints?: {
    [width: number]: SwiperOptions;
  };
  dots?: boolean;
}

export function SwiperWrapper({
  children,
  spaceBetween = 8,
  slidesPerView = 1,
  pagination = false,
  autoplay = false,
  breakpoints,
  dots,
}: SwiperWrapperProps) {
  return (
    <div className="w-full product-carousel">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        pagination={pagination}
        autoplay={autoplay}
        breakpoints={breakpoints || {
          320: { slidesPerView: 1, spaceBetween: 10 },
          640: { slidesPerView: 2, spaceBetween: 15 },
          768: { slidesPerView: 3, spaceBetween: 15 },
          1024: { slidesPerView: 4, spaceBetween: 18 },
          1280: { slidesPerView: 5, spaceBetween: 18 },
        }}
      >
        {children}
      </Swiper>

      <style>
        {`
          .product-carousel .swiper-pagination {
            bottom: -1px !important;
            ${dots ? '' : 'display: none' }
          }
        `}
      </style>
    </div>
  );
}
