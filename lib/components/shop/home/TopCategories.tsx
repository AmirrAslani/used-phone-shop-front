import { SwiperWrapper } from "@/lib/components/base/Swiper";
import { SwiperSlide } from "swiper/react";
import { RightArrow } from "@/assets/common/icons";

const topCategories = [
    {
        src: "/images/mobile.png",
        title: "موبایل",
    },
    {
        src: "/images/image-3.png",
        title: "لوازم آرایشی",
    },
    {
        src: "/images/image-4.png",
        title: "مبلمان",
    },
    {
        src: "/images/image-5.png",
        title: "ساعت",
    },
    {
        src: "/images/image-6.png",
        title: "دکور",
    },
    {
        src: "/images/image-7.png",
        title: "لوازم جانبی",
    },
    {
        src: "/images/image-8.png",
        title: "الکترونیک",
    },
];

export default function TopCategories() {

    return (
        <>
            <div className="px-1 md:px-0">
                <div className="flex justify-between items-center">
                    <span className="border-b border-b-[3px] border-[#008ECC] pb-3 text-sm md:text-lg lg:text-xl font-semibold">
                        خرید از <span className="text-[#008ECC]">دسته بندی های برتر</span>
                    </span>
                    <div className="flex gap-1 items-center pb-3 cursor-pointer">
                        <span className="font-medium text-sm md:text-base">مشاهد همه</span>
                        <span className="rotate-180"><RightArrow /></span>
                    </div>
                </div>
                <div className="border-t border-gray-200"></div>
                <SwiperWrapper pagination={{ clickable: true }} breakpoints={{
                    320: { slidesPerView: 2, spaceBetween: 15 },
                    640: { slidesPerView: 4, spaceBetween: 20 },
                    768: { slidesPerView: 5, spaceBetween: 20 },
                    1024: { slidesPerView: 6, spaceBetween: 25 },
                    1280: { slidesPerView: 7, spaceBetween: 25 },
                }}>
                    {topCategories.map((cat, index) => (
                        <SwiperSlide className="py-10" key={index}>
                            <div className="flex flex-col items-center justify-center text-center hover:scale-110 transition">
                                <div className="w-43 h-43 sm:w-35 sm:h-35 rounded-full bg-gray-100 hover:border hover:border-[#008ECC]  cursor-pointer flex items-center justify-center">
                                    <img
                                        src={cat.src}
                                        alt="image"
                                        className="h-25"
                                    />
                                </div>
                                <span className="mt-4 text-center">{cat.title}</span>
                            </div>
                        </SwiperSlide>
                    ))}
                </SwiperWrapper>
            </div>
        </>
    )
}