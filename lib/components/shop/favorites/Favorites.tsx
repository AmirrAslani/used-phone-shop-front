import { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from '@/services/favorites/favoritesService';
import { toast } from 'react-toastify';
import { FaHeart } from 'react-icons/fa';
import { IPhone } from '@/interface/shop.interface';
import { BackArrow, Dots } from '@/assets/common/icons';
import Button from '../../base/Button';
import Link from 'next/link';

export default function Favorites() {
    const [favorites, setFavorites] = useState<IPhone[]>([]);
    const [loading, setLoading] = useState(true);
    const [removeLoading, setRemoveLoading] = useState(false);

    useEffect(() => {
        getFavorites()
            .then((res) => {
                setFavorites(res.data);
            })
            .catch((err) => {
                toast.error('خطا در دریافت علاقه‌مندی‌ها');
                console.error(err);
            }).finally(() => setLoading(false));
    }, []);

    const handleRemoveFavorite = async (phoneId: string) => {
        try {
            setRemoveLoading(true)
            await removeFavorite(phoneId);
            setFavorites((prev) => prev.filter((item) => item.id !== phoneId));
            setRemoveLoading(false)
            toast.success("محصول از علاقه مندی حذف شد");
        } catch (err) {
            console.error("Error to delete favorite:", err);
            setRemoveLoading(false)
            toast.error("خطا در حذف علاقه مندی");
        }
    };

    if (loading || removeLoading) {
        return <Dots />
    }

    return (
        <div className='min-h-screen'>
            {Array.isArray(favorites) && favorites.length > 0 ? (
                <div className="p-4 max-w-7xl m-auto">
                     <div className="flex justify-between items-center">
                    <span className="pb-2 text-sm md:text-lg lg:text-xl">
                        علاقه مندی ها
                    </span>
                    <div className="pb-2 cursor-pointer hover:text-gray-500">
                        <Link className="flex gap-1 items-center" href="/">
                            <span className="font-medium text-sm md:text-base">بازگشت</span>
                            <BackArrow />
                        </Link>
                    </div>
                </div>
                <div className="border-t border-gray-200 mb-8"></div>
                    {favorites.length === 0 ? (
                        <p className="text-gray-600 text-lg font-semibold text-center mt-5">هیچ محصولی در لیست علاقه‌مندی‌ها وجود ندارد.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((item) => (
                                <div key={item.id} className="shadow-lg border border-gray-200 rounded-xl shadow px-4 pb-2 bg-white animate__animated animate__bounceInUp">
                                    <div className="w-full my-4 flex justify-between">
                                        <img
                                            src={item.image}
                                            alt={item.model}
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                        <Button className='cursor-pointer size-5 mt-1' onClick={() => handleRemoveFavorite(item.id)} disabled={removeLoading} icon={<FaHeart color='red' size={40} />} />
                                    </div>
                                    <h3 className="font-semibold text-xl mb-1">{item.brand.toLocaleUpperCase()}</h3>
                                    <h3 className="font-medium text-lg mb-1">{item.model}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-lg text-gray-700 font-semibold pt-4 text-center">هیچ محصولی در لیست علاقه‌مندی‌ها وجود ندارد.</p>
            )}
        </div>
    );
};