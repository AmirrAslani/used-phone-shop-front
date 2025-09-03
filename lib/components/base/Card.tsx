import Image from "next/image";

interface CardProps {
  title: string;
  image: string;
  price: number;
  oldPrice: number;
  discount: number;
}

export default function Card({
  title,
  image,
  price,
  oldPrice,
  discount,
}: CardProps) {
  const saveAmount = oldPrice - price;

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden w-64">
      {/* لیبل تخفیف */}
      <div className="absolute top-0 right-0 bg-[#008ECC] text-white text-sm font-semibold px-2 py-5 rounded-bl-xl">
        {discount}% OFF
      </div>

      {/* تصویر */}
      <div className="p-4 flex justify-center bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-[160px] h-[180px]"
        />
      </div>

      {/* محتوا */}
      <div className="bg-white px-4 py-3 border-t border-gray-100">
        {/* نام محصول */}
        <h3 className="text-gray-800 text-base font-medium">{title}</h3>

        {/* قیمت‌ها */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-bold text-black">{price.toLocaleString("fa-IR")}</span>
          <span className="text-gray-400 line-through">{oldPrice.toLocaleString("fa-IR")}</span>
        </div>

        {/* مبلغ ذخیره‌شده */}
        <div className="mt-2 text-sm text-green-600 font-medium border-t border-gray-100 pt-2">
          Save – {saveAmount.toLocaleString("fa-IR")}
        </div>
      </div>
    </div>
  );
}
