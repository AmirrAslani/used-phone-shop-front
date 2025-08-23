import http from "../helper/http";

export const getOrders = async () => {
    const res = await http.get('/order');
    return res;
};

export const getOrdersById = async (orderId: string) => {
    try {
        const res = await http.get(`/order/${orderId}`, {
        });
        return res.data;
    } catch (err) {
        throw err;
    }
};

export const addToOrders = async (formData: FormData) => {
    try {
        const res = await http.post('/order/place', formData, {
            headers: {
                'Content-Type': 'application/json',
              },
        });
        return res.data;
    } catch (err) {
        throw err;
    }
};