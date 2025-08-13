// pages/cart.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function CartPage() {
    const [cart, setCart] = useState<any>(null);
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            router.push('/')
        }
        axios.get("http://localhost:3000/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => setCart(res.data))
            .catch(err => console.error(err));
    }, []);

    const updateQuantity = (itemId: string, newQuantity: number) => {
        setCart((prev: any) => ({
            ...prev,
            items: prev.items.map((item: any) =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            ),
        }));
    };

    const removeItem = (itemId: string) => {
        setCart((prev: any) => ({
            ...prev,
            items: prev.items.filter((item: any) => item.id !== itemId),
        }));
    };

    const totalPrice = cart?.items.reduce(
        (total: number, item: any) => total + item.phone.price * item.quantity,
        0
    );

    if (!cart) return <div className="p-4">در حال بارگذاری...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">سبد خرید</h1>
            <div className="space-y-4">
                {cart.items.map((item: any) => (
                    <div key={item.id} className="flex items-center bg-white shadow p-4 rounded-lg">
                        <img
                            src={`http://localhost:3000${item.phone.image}`}
                            alt={item.phone.model}
                            className="w-24 h-24 object-cover rounded"
                        />
                        <div className="flex-1 ml-4">
                            <h2 className="font-semibold">{item.phone.model}</h2>
                            <p className="text-gray-500">{item.phone.brand}</p>
                            <p className="mt-1 text-sm text-gray-600">{item.phone.description}</p>
                            <p className="mt-2 font-bold">
                                قیمت واحد: {item.phone.price.toLocaleString()} تومان
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="flex items-center border rounded">
                                <button
                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    className="px-2 py-1"
                                >
                                    -
                                </button>
                                <span className="px-3">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-2 py-1"
                                >
                                    +
                                </button>
                            </div>
                            <p className="mt-2 font-bold">
                                جمع: {(item.phone.price * item.quantity).toLocaleString()} تومان
                            </p>
                            <button
                                onClick={() => removeItem(item.id)}
                                className="mt-2 text-red-500 hover:underline"
                            >
                                حذف
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-between items-center">
                <p className="text-xl font-bold">
                    جمع کل: {totalPrice.toLocaleString()} تومان
                </p>
                <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
                    ادامه خرید
                </button>
            </div>
        </div>
    );
}
