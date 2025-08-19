// pages/cart.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { clearCart, getCart } from "@/services/cart/cartService";
import { removeOneItem } from "@/services/cart/cartService";
import { toast } from "react-toastify";
import { updateCart } from "@/services/cart/cartService";
import { addToOrders } from "@/services/orders/ordersService";
import { ICart, ICartItem } from "@/interface/components/shop.interface";

export default function CartPage() {
    const [cart, setCart] = useState<ICart>({ items: [], total: 0 });
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            router.push('/')
        }
        getCart()
            .then(res => {
                setCart({
                    items: res.data.items || [],
                    total: res.data.total || 0
                });
                console.log(res.data)
            })
            .catch(err => console.error(err));
    }, [router]);

    const updateQuantity = async (itemId: string, quantity: number) => {
        await updateCart(itemId, quantity);

        setCart((prev) => {
            if (!prev) return prev;

            const updatedItems =
                quantity < 1
                    ? prev.items.filter((item) => item.id !== itemId)
                    : prev.items.map((item) =>
                        item.id === itemId ? { ...item, quantity } : item
                    );

            const newTotal = updatedItems.reduce(
                (acc, item) => acc + item.phone.price * item.quantity,
                0
            );

            return {
                ...prev,
                items: updatedItems,
                total: newTotal,
            };
        });
    };

    const handleIncrease = (item: ICartItem) => {
        const newQuantity = item.quantity + 1;

        if (newQuantity > item.phone.quantity) return;

        // اگر دقیقا برابر با موجودی شد، هشدار بده
        if (newQuantity === item.phone.quantity) {
            toast.warn("آخرین موجودی");
        }

        updateQuantity(item.id, newQuantity);
    };

    const removeItem = async (itemId: string) => {
        try {
            await removeOneItem(itemId);

            setCart((prev) => {
                if (!prev) return prev;

                const updatedItems = prev.items.filter((item) => item.id !== itemId);

                const newTotal = updatedItems.reduce(
                    (acc, item) => acc + item.phone.price * item.quantity,
                    0
                );

                return {
                    ...prev,
                    items: updatedItems,
                    total: newTotal,
                };
            });
        } catch (error) {
            console.error("خطا در حذف:", error);
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCart();
            setCart((prev) => ({
                ...prev,
                items: [],
                total: 0,
            }));
            toast.success("سبد خرید شما خالی شد");
        } catch (error) {
            console.error("خطا در حذف:", error);
            toast.error("مشکلی در پاک‌ سازی سبد خرید پیش آمد");
        }
    };

    const handleAddToOrders = async () => {
        try {
            await addToOrders();
            router.push('/shop/orders')
        } catch (error) {
            console.error("خطا:", error);
            toast.error("مشکلی پیش آمده");
        }
    };

    if (!cart) return <div className="p-4">در حال بارگذاری...</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="max-w-4xl mx-auto p-4">

                {/* {cart.total !== 0 ? (
                    <h4 className="text-2xl text-gray-800 font-semibold mb-6">سبد خرید</h4>
                ) : (
                    <h4 className="text-xl text-gray-600 font-semibold mt-6 text-center">سبد خرید شما خالی است</h4>
                )} */}
                {cart.items && cart.items.length > 0 ? (
                    <div className="space-y-4">

                        {cart.items.map((item) => (
                            <div key={item.id} className="flex items-center bg-white shadow p-4 rounded-lg animate__animated animate__fadeInRight">
                                <img
                                    src={`http://localhost:3001${item.phone.image}`}
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
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="px-2 py-1"
                                        >
                                            -
                                        </button>
                                        <span className="px-3">{item.quantity}</span>
                                        <button
                                            onClick={() => handleIncrease(item)}
                                            disabled={item.quantity >= item.phone.quantity}
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
                ) : (
                    <p className="text-center text-lg text-gray-700 font-semibold">سبد خرید شما خالی است</p>
                )}
                {cart.total !== 0 &&
                    <>
                        <div className="mt-6 flex justify-between items-center">
                            <p className="text-xl font-bold">
                                جمع کل: {cart?.total.toLocaleString()} تومان
                            </p>
                            <button onClick={handleAddToOrders} className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 cursor-pointer">
                                ادامه خرید
                            </button>
                        </div>

                        <div className="mt-2">
                            <button onClick={handleClearCart} className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 cursor-pointer">
                                خالی کردن سبد
                            </button>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}
