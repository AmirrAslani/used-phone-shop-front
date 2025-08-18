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
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-blue-100'>
            <div className="p-4 max-w-7xl m-auto">
                {favorites.length !== 0 &&
                    <h2 className="text-2xl font-bold mb-4">علاقه‌مندی‌ها</h2>
                }
                {favorites.length === 0 ? (
                    <p className="text-gray-600 text-lg font-semibold text-center mt-5">هیچ محصولی در لیست علاقه‌مندی‌ها وجود ندارد.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((item) => (
                            <div key={item.id} className="shadow-lg border border-gray-200 rounded-xl shadow px-4 pb-2 bg-white">
                                <div className="w-full my-4 flex justify-between">
                                    <img
                                        src={`http://localhost:3001${item.image}`}
                                        alt={item.model}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                    <div onClick={() => handleRemoveFavorite(item.id)} className="text-red-500 text-xl cursor-pointer size-5 mt-1">
                                        <FaHeart />
                                    </div>
                                </div>
                                <h3 className="font-semibold text-xl mb-1">{item.brand.toLocaleUpperCase()}</h3>
                                <h3 className="font-medium text-lg mb-1">{item.model}</h3>
                                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};