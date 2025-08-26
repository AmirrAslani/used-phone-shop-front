import http from "../helper/http";

export const createPhone = async (formData: FormData) => {
    try {
        const res = await http.post('/phones/create', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
              },
        });
        return res.data;
    } catch (err) {
        throw err;
    }
};

export const updatePhone = async (id: string, formData: FormData) => {
    try {
      const res = await http.patch(`/phones/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    } catch (err) {
      throw err;
    }
  };
 