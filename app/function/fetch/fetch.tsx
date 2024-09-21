import axios from "axios";

export const createProduct = async (data: any) => {
  try {
    const res = await axios.post("api/create-product", data);
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const getProduct = async () => {
  try {
    const res = await axios.get("/api/create-product");
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const deleteTheProduct = async (id: any) => {
  try {
    const res = await axios.post("/api/delete-product", id);
    return res;
  } catch (error) {
    console.log(error);
  }
};
