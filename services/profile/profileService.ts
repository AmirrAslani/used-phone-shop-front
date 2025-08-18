import http from "../helper/http";

export const getProfile = async () => {
    const res = await http.get(`/profile`);
    return res;
  };

  export const updateProfile = async (formData: FormData) => {
    try {
      const res = await http.patch(`/profile/update`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  };
 