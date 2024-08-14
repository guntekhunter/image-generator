import axios from "axios";

export const createProduct = async (data: any) => {
  try {
    const res = await axios.post("api/create-product", data);
    return res;
  } catch (error) {
    console.log(error);
  }
};
