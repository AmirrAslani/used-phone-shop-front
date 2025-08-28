// pages/cart.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { clearCart, getCart } from "@/services/cart/cartService";
import { removeOneItem } from "@/services/cart/cartService";
import { toast } from "react-toastify";
import { updateCart } from "@/services/cart/cartService";
import { ICart, ICartItem } from "@/interface/components/shop.interface";
import { Dots } from "@/assets/common/icons";
import { useCookies } from "react-cookie";
import { withAuth } from "@/utils/withAuth";

export default function CartPage() {
    const [cart, setCart] = useState<ICart>({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);
    const [clearLoading, setClearLoading] = useState(false);
    const [removeLoading, setRemoveLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [cookies] = useCookies(["accessToken"]);
    const router = useRouter()

    useEffect(() => {
        if (typeof window === "undefined") return;
    
        const token = cookies.accessToken;
        if (!token) {
            return;
        }
    
        getCart()
            .then(res => {
                setCart({
                    items: res.data.items || [],
                    total: res.data.total || 0
                });
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [router]);
    

    const updateQuantity = async (itemId: string, quantity: number) => {
        setUpdateLoading(true)
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
        setUpdateLoading(false)
    };

    const handleUpdate = (item: ICartItem) => {
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
            setRemoveLoading(true)
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
            setRemoveLoading(false)
        } catch (error) {
            console.error("خطا در حذف:", error);
            setRemoveLoading(false)
        }
    };

    const handleClearCart = async () => {
        try {
            setClearLoading(true)
            await clearCart();
            setCart((prev) => ({
                ...prev,
                items: [],
                total: 0,
            }));
            setClearLoading(false)
            toast.success("سبد خرید شما خالی شد");
        } catch (error) {
            console.error("خطا در حذف:", error);
            setClearLoading(false)
            toast.error("مشکلی در پاک‌ سازی سبد خرید پیش آمد");
        }
    };

    const handleGoToCheckout = () => {
        if (cart.items.length) {
            router.push('/shop/checkout');
        } else {
            toast.error('سبد خرید شما خالی است');
        }
    };

    if (loading) {
        return <Dots />
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="max-w-4xl mx-auto p-4">
                {cart.items && cart.items.length > 0 ? (
                    <div className="space-y-4">

                        {cart.items.map((item) => (
                            <div key={item.id} className="md:flex items-center text-center md:text-right bg-white shadow p-4 rounded-lg animate__animated animate__fadeInRight">
                                <img
                                    src={item.phone.image}
                                    alt={item.phone.model}
                                    className="w-24 h-24 object-cover rounded m-auto"
                                />
                                <div className="flex-1 ml-4">
                                    <h2 className="font-semibold">{item.phone.model}</h2>
                                    <p className="text-gray-500">{item.phone.brand}</p>
                                    <p className="mt-1 text-sm text-gray-600">{item.phone.description}</p>
                                    <p className="mt-2 md:text-lg font-bold">
                                        قیمت واحد: {item.phone.price.toLocaleString()} تومان
                                    </p>
                                </div>
                                <div className="flex flex-col items-center mt-2 md:mt-0">
                                    <div className="flex items-center border rounded">
                                        <button disabled={updateLoading}
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="px-2 py-1 cursor-pointer hover:scale-140"
                                        >
                                            -
                                        </button>
                                        <span className="px-3">{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdate(item)}
                                            disabled={item.quantity >= item.phone.quantity || updateLoading}
                                            className="px-2 py-1 cursor-pointer hover:scale-140"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="mt-2 font-bold md:text-lg">
                                        جمع: {(item.phone.price * item.quantity).toLocaleString()} تومان
                                    </p>
                                    <button disabled={removeLoading}
                                        onClick={() => removeItem(item.id)}
                                        className="mt-2 md:text-lg text-red-500 hover:text-red-700 cursor-pointer"
                                    >
                                        حذف
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center md:text-lg text-gray-700 font-semibold">سبد خرید شما خالی است</p>
                )}
                {cart.total !== 0 &&
                    <>
                        <div className="mt-6 flex justify-between items-center">
                            <p className="md:text-xl font-bold">
                                جمع کل: {cart?.total.toLocaleString()} تومان
                            </p>
                            
                            <button onClick={handleGoToCheckout} className="bg-blue-500 text-white text-sm md:text-normal px-3 md:px-6 py-2 rounded-md md:rounded-lg hover:bg-blue-600 cursor-pointer">
                                ادامه خرید
                            </button>
                        </div>

                        <div className="mt-2">
                            <button disabled={clearLoading} onClick={handleClearCart} className="bg-red-700 text-white text-sm md:text-normal px-3 md:px-6 py-2 rounded-md md:rounded-lg hover:bg-red-800 cursor-pointer">
                                خالی کردن سبد
                            </button>
                        </div>
                    </>
                }
            </div>
        </div>
    );
}

export const getServerSideProps = withAuth(
    async () => {
      return { props: {} };
    },
    {
      destination: "/",
      permanent: false,
      redirectIf: (token) => !token
    }
);