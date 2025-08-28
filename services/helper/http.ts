import axios from "axios";
import Cookies from "js-cookie";

// ساخت instance اختصاصی axios
const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://used-phone-shop-production.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

// اضافه کردن توکن به هر درخواست
http.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// مدیریت پاسخ‌ها
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("توکن معتبر نیست یا منقضی شده");
      Cookies.remove("accessToken");
    }
    return Promise.reject(error);
  }
);

export default http;
