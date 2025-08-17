import http from "../helper/http";

export const getFavorites = async () => {
    const res = await http.get('/favorites');
    return res;
};

export const addToFavorites = async (phoneId: string) => {
    try {
      const res = await http.post(`/favorites/${phoneId}`, {
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  export const checkFavorite = async (phoneId: string) => {
    try {
      const res = await http.get(`/favorites/${phoneId}/check`, {
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  export const removeFavorite = async (phoneId: string) => {
    try {
      const res = await http.delete(`/favorites/${phoneId}`, {
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  };