"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ICarouselProps } from "@/interface/base.interface";
import Link from "next/link";

export default function Carousel({ images, autoPlay = true, interval = 7000 }: ICarouselProps) {
    return (
        <div className="relative w-full">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={
                    autoPlay
                        ? {
                            delay: interval,
                            disableOnInteraction: false,
                        }
                        : false
                }
                pagination={{ clickable: true }}
                navigation={{
                    nextEl: ".swiper-button-next-custom",
                    prevEl: ".swiper-button-prev-custom",
                }}
                className="rounded-2xl shadow-lg"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-55 sm:h-70 md:h-[370px] lg:h-[430px]">
                            <img
                                src={img.src}
                                alt={img.alt}
                                className="w-full h-full rounded-2xl"
                            />
                            {/* Overlay متن */}
                            {(img.title || img.subtitle || img.ctaText) && (
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white rounded-2xl p-4 space-y-1 md:space-y-3">
                                    {img.title && <h2 className="text-xl md:text-4xl font-bold">{img.title}</h2>}
                                    {img.subtitle && <p className="md:text-lg">{img.subtitle}</p>}
                                    {img.ctaText && (
                                        <Link
                                            href={img.ctaLink || "/"}
                                            className="mt-3 md:mt-4 text-sm md:text-lg bg-gradient-to-r from-[#008ECC] to-blue-600 hover:from-blue-600 hover:to-[#008ECC] hover:scale-103 transition text-white px-4 md:px-6 py-2 rounded-full shadow-lg"
                                        >
                                            {img.ctaText}
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* دکمه‌های سفارشی قبلی/بعدی */}
            <div className="swiper-button-prev-custom absolute top-7/9 md:top-7/8 right-16 md:right-27 z-10 size-8 md:size-10 bg-black/50 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-black/70 transition">
                ❯
            </div>
            <div className="swiper-button-next-custom absolute top-7/9 md:top-7/8 right-6 md:right-14 z-10 size-8 md:size-10 bg-black/50 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-black/70 transition">
                ❮
            </div>
        </div>
    );
}
