import { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from '@/services/favorites/favoritesService';
import { toast } from 'react-toastify';
import { FaHeart } from 'react-icons/fa';
import { IPhone } from '@/interface/components/shop.interface';

export default function Favorites() {
    const [favorites, setFavorites] = useState<IPhone[]>([]);

    useEffect(() => {
        getFavorites()
            .then((res) => {
                setFavorites(res.data);
            })
            .catch((err) => {
                toast.error('خطا در دریافت علاقه‌مندی‌ها');
                console.error(err);
            });
    }, []);

    const handleRemoveFavorite = async (phoneId: string) => {
        try {
            await removeFavorite(phoneId);
            setFavorites((prev) => prev.filter((item) => item.id !== phoneId));
            toast.success("محصول از علاقه مندی حذف شد");
        } catch (err) {
            console.error("Error to delete favorite:", err);
            toast.error("خطا در حذف علاقه مندی");
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">علاقه‌مندی‌ها</h2>
            {favorites.length === 0 ? (
                <p className="text-gray-600">هیچ محصولی در لیست علاقه‌مندی‌ها وجود ندارد.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((item) => (
                        <div key={item.id} className="border rounded-xl shadow p-4 relative bg-white">
                            {/* آیکون قلب */}
                            <div onClick={() => handleRemoveFavorite(item.id)} className="text-red-500 text-xl cursor-pointer size-5">
                                <FaHeart />
                            </div>

                            {/* تصویر */}
                            <div className="w-full h-48 relative mb-4">
                                <img
                                    src={`http://localhost:3000${item.image}`}
                                    alt={item.model}
                                    className="w-24 h-24 object-cover rounded"
                                />
                            </div>

                            {/* اطلاعات محصول */}
                            <h3 className="font-semibold text-lg mb-1">{item.model}</h3>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};