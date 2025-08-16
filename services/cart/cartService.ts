import http from "../helper/http";

export const getCart = async () => {
    const res = await http.get(`/cart`);
    return res;
};

export const updateCart = async (itemId: string, quantity: number) => {
  try {
    const res = await http.patch(`/cart/item/${itemId}`, { quantity });
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const clearCart = async () => {
    try {
      const res = await http.delete("/cart/clear");
      return res.data;
    } catch (err) {
      throw err;
    }
  };

export const removeOneItem = async (itemId: string) => {
    try {
      const res = await http.delete(`/cart/remove/${itemId}`, {
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  };
  