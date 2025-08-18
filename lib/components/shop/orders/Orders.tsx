import React, { useEffect, useState } from 'react';
import { getOrders } from '@/services/orders/ordersService';
import { format } from 'date-fns-jalali';
import { toast } from 'react-toastify';
import { IOrder } from '@/interface/components/shop.interface';

export default function Orders() {
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOrders()
            .then(res => {
                setOrders(res.data);
            })
            .catch(err => {
                toast.error('خطا در دریافت سفارش‌ ها');
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'text-green-600';
            case 'pending':
                return 'text-yellow-500';
            case 'shipped':
                return 'text-blue-500';
            case 'cancelled':
                return 'text-red-500';
            default:
                return 'text-gray-600';
        }
    };

    if (loading) {
        return <div className="text-center text-lg mt-10">در حال بارگذاری سفارش‌ها...</div>;
    }

    if (orders.length === 0) {
        return <div className="text-center text-gray-500 mt-10">هیچ سفارشی یافت نشد.</div>;
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-blue-100'>
            <div className="grid gap-6 p-4 pt-10 max-w-7xl m-auto">
                {orders.map(order => (
                    <div
                        key={order.id}
                        className="border border-gray-200 rounded-xl shadow-lg p-5 transition hover:shadow-2xl bg-white"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">شماره سفارش {order.id.slice(0, 8)}...</h2>
                            <span className={`text-sm font-semibold ${getStatusColor(order.status)}`}>
                                وضعیت: {order.status === 'paid' ? 'پرداخت‌ شده' : order.status === 'pending' ? 'در انتظار' : order.status === 'shipped' ? 'ارسال‌شده' : 'لغو شده'}
                            </span>
                        </div>

                        <div className="text-sm text-gray-500 mb-2">
                            تاریخ ثبت: {format(new Date(order.createdAt), 'yyyy/MM/dd - HH:mm')}
                        </div>

                        <div className="text-sm text-gray-700 mb-4">مبلغ کل: {order.total.toLocaleString()} تومان</div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {order.items.map(item => (
                                <div
                                    key={item.phoneId}
                                    className="flex items-center gap-4 p-3 border border-blue-300 rounded-lg bg-gray-50"
                                >
                                    <img
                                        src={`http://localhost:3001${item.phone.image}`}
                                        alt={item.phone.model}
                                        className="w-16 h-16 object-contain rounded"
                                    />
                                    <div>
                                        <div className="font-medium">{item.phone.brand}</div>
                                        <div className="text-sm text-gray-600 line-clamp-1">{item.phone.model}</div>
                                        <div className="text-xs text-gray-400">تعداد: {item.quantity}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
