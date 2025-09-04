import { FaHeart } from "react-icons/fa";

interface CardProps {
  id: string;
  brand: string;
  title: string;
  image: string;
  price: number;
  newPrice: number;
  discount: number;
  onClick?: () => void;
  onToggleFavorite?: (id: string) => void; // ← فانکشن از بیرون میاد
  isFavorite?: boolean; // ← وضعیت علاقه‌مندی
  isLoading?: boolean;  // ← وضعیت لودینگ برای همون آیتم
}

export default function Card({
  id,
  brand,
  title,
  image,
  price,
  newPrice,
  discount,
  onClick,
  onToggleFavorite,
  isFavorite = false,
  isLoading = false,
}: CardProps) {

  const saveAmount = price - newPrice;

  return (
    <div onClick={onClick} className="relative bg-white rounded-xl border border-gray-200 hover:border-[#008ECC] hover:shadow-lg hover:scale-108 transition shadow-sm overflow-hidden m-auto sm:w-full cursor-pointer">
      {/* لیبل تخفیف */}
      <div className="flex flex-col text-center absolute top-0 right-0 bg-[#008ECC] text-white text-sm px-3 py-1 rounded-bl-xl">
        <span>{discount}% </span>
        <span>OFF</span>
      </div>

      {/* تصویر */}
      <div className="p-3 flex justify-center bg-gray-100">
        <img
          src={image}
          alt={title}
          className="h-[190px]"
        />
      </div>

      {/* محتوا */}
      <div className="bg-white p-3 pt-2 border-t border-gray-200">

        <div className="flex justify-between items-center">
          <h3 className="font-bold">{brand}</h3>

          {/* آیکون علاقه‌مندی */}
          <div
            className={`text-lg sm:text-xl cursor-pointer ${isLoading ? "opacity-80 pointer-events-none" : "text-red-600"
              }`}
            onClick={(e) => {
              e.stopPropagation();
              if (!isLoading && onToggleFavorite) {
                onToggleFavorite(id);
              }
            }}
            title="افزودن به علاقه‌مندی"
          >
            {isLoading ? (
              <div className="w-4.5 h-4.5 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              <FaHeart color={isFavorite ? "red" : "lightgray"} />
            )}
          </div>
        </div>
        {/* نام محصول */}
        <h4 className="text-sm font-semibold line-clamp-1 mb-1">{title}</h4>

        {/* قیمت‌ها */}
        <div className="flex items-center gap-2 mt-1">
          <span className="font-semibold text-black">{price.toLocaleString("fa-IR")}</span>
          <span className="text-gray-400 line-through">{newPrice.toLocaleString("fa-IR")}</span>
        </div>

        <div className="mt-2 text-sm text-green-600 font-medium border-t border-gray-200 pt-2">
          تخفیف: {saveAmount.toLocaleString("fa-IR")}
        </div>
      </div>
    </div>
  );
}

// {!imageLoaded[product.id] && (
//   <div className="absolute inset-0 animate-pulse bg-gray-300 rounded-md"></div>
// )}
// <img
//   src={product.image}
//   alt={product.model}
//   className={`w-full h-full transition-transform duration-300 hover:scale-105 ${imageLoaded[product.id] ? "opacity-100" : "opacity-0"
//     }`}
//   onLoad={() =>
//     setImageLoaded((prev) => ({ ...prev, [product.id]: true }))
//   }
// />