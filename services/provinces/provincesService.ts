import http from "../helper/http";

export const getProvinces = async () => {
    const res = await http.get("/provinces");
    return res;
  };
