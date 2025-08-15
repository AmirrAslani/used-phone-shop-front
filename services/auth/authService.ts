import http from "../helper/http";

export const getProfile = async () => {
    const res = await http.get(`/profile`);
    return res;
  };
  