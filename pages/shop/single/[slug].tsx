import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

interface Phone {
  id: string;
  brand: string;
  model: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
  specs: {
    cpu: string;
    ram: string;
    rom: string;
    battery: string;
    cameraRear: string;
    cameraFront: string;
    displaySize: string;
  };
}

export default function PhoneDetails() {
  const router = useRouter();
  const { slug } = router.query;
  const [phone, setPhone] = useState<Phone | null>(null);

  useEffect(() => {
    if (!router.isReady) return; // منتظر بمون تا slug لود بشه

    const token = localStorage.getItem("accessToken");

    axios
      .get<Phone>(`http://localhost:3000/api/phones/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPhone(res.data);
        console.log("singleData", res.data);
      })
      .catch((err) =>
        console.error("Error fetching phone details:", err)
      );
  }, [router.isReady, slug]);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="overflow-hidden rounded-lg">
            <img
              src={`http://localhost:3000${phone?.image}`}
              alt={phone?.model}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {phone?.brand}
            </h1>
            <p className="mt-2 text-gray-700">{phone?.model}</p>
            <p className="mt-4 text-2xl font-bold text-green-600">
              {phone?.price.toLocaleString("fa-IR")} تومان
            </p>
            <p className="mt-4 text-gray-600">{phone?.description}</p>
            <p className="mt-2 text-sm text-gray-500">
              موجودی: {phone?.quantity} عدد
            </p>

            <div className="mt-6">
              <h2 className="text-lg font-bold mb-3">مشخصات فنی</h2>
              <ul className="space-y-1 text-gray-700">
                <li>پردازنده: {phone?.specs.cpu}</li>
                <li>رم: {phone?.specs.ram}</li>
                <li>حافظه داخلی: {phone?.specs.rom}</li>
                <li>باتری: {phone?.specs.battery}</li>
                <li>دوربین پشت: {phone?.specs.cameraRear}</li>
                <li>دوربین جلو: {phone?.specs.cameraFront}</li>
                <li>اندازه نمایشگر: {phone?.specs.displaySize}</li>
              </ul>
            </div>

            <button className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-medium">
              سفارش
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
