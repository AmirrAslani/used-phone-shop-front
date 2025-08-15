// src/services/phoneService.ts
import http from "../helper/http";

export const getPhoneById = async (id: string) => {
  const res = await http.get(`/phones/${id}`);
  return res;
};

export const getAllPhones = async () => {
  const res = await http.get(`/phones`);
  return res;
};


export const addToCart = async (phoneId: string, quantity = 1) => {
  try {
    const res = await http.post("/cart/add", { phoneId, quantity });
    return res.data;
  } catch (err) {
    throw err;
  }
};