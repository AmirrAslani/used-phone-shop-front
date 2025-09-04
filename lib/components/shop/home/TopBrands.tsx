import { SwiperWrapper } from "@/lib/components/base/Swiper";
import { SwiperSlide } from "swiper/react";
import { RightArrow } from "@/assets/common/icons";

const topBrands = [
    {
        src: "/images/group-50.png",
    },
    {
        src: "/images/group-51.png",
    },
    {
        src: "/images/group-52.png",
    },
];

export default function TopBrands() {

    return (
        <>
            <div className="px-1 md:px-0">
                <div className="flex justify-between items-center">
                    <span className="border-b border-b-[3px] border-[#008ECC] pb-3 text-sm md:text-lg lg:text-xl font-semibold">
                        برترین <span className="text-primary-500">برندهای الکترونیک</span>
                    </span>
                    <div className="flex gap-1 items-center pb-3 cursor-pointer">
                        <span className="font-medium text-sm md:text-base">مشاهد همه</span>
                        <span className="rotate-180"><RightArrow /></span>
                    </div>
                </div>
                <div className="border-t border-gray-200"></div>
                <SwiperWrapper pagination={{ clickable: true }} dots={true} autoplay={{delay: 7000 }} breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 15 },
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    768: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 25 },
                    1280: { slidesPerView: 3, spaceBetween: 25 },
                }}>
                    {topBrands.map((brand, index) => (
                        <SwiperSlide className="py-10" key={index}>
                            <div className="rounded-xl px-2 md:px-0 bg-transparent md:bg-gray-100 cursor-pointer hover:scale-103 transition flex items-center justify-center">
                                <img
                                    src={brand.src}
                                    alt="image"
                                    className="w-[100%] h-50"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </SwiperWrapper>
            </div>
        </>
    )
}