import axios from "axios";

// ساخت instance اختصاصی axios
const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://4051558bfe55.ngrok-free.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// اضافه کردن توکن به هر درخواست
http.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
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
      // console.warn("توکن معتبر نیست یا منقضی شده");
      localStorage.removeItem("accessToken")
    }
    return Promise.reject(error);
  }
);

export default http;
