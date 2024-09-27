"use client";
import React, { useEffect, useState } from "react";
import Input from "../component/template/Input";
import DropDown from "../component/template/DropDown";
import { CldUploadWidget } from "next-cloudinary";
import TextArea from "../component/template/TextArea";
import Image from "next/image";
import Button from "../component/template/Button";
import { createProduct, deleteTheProduct, getProduct } from "../function/fetch/fetch";

export default function page() {
  const [type, setType] = useState("");
  const [imageUrlUploaded, setImageUrlUploaded] = useState<any>("");
  const [data, setData] = useState({
    name: "",
    image: "",
    description: "",
    type: "",
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setType(e.target.value);
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const optionsType = [
    { value: "plafon", label: "plafon" },
    { value: "vinyl", label: "vinyl" },
    { value: "wallpanel", label: "wallpanel" },
    { value: "uv", label: "uv" },
  ];

  const handleProductDetail = (e: any) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const getImage = (e: any) => {
    setData((prevData) => ({ ...prevData, ["image"]: e.url }));
  };

  const addProduct = async () => {
    setLoading(true);
    try {
      const res = await createProduct(data);
      setProducts(res?.data.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    setProducts([]);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProduct();
        setProducts(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (id: any) => {
    try {
      const res = await deleteTheProduct(id)
      console.log("ommaleka", res)
      setProducts(res.data.data);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex justify-around relative scroll-smooth md:scroll-auto">
      <div className="w-[98%] z-1">
        <section>
          <h2 className="text-[1.5rem] font-semibold py-[1.8rem] text-center">
            Tambah Produk
          </h2>
          <div className="flex space-x-[1rem]">
            <div className="w-full grid grid-cols-2 gap-[1rem]">
              <DropDown
                onChange={handleChange}
                value={type}
                name="type"
                className="custom-dropdown"
                options={optionsType}
              >
                Tipe Produk
              </DropDown>
              <Input onChange={handleProductDetail} name="name">
                Kode Motif
              </Input>
              <div
                className={`w-full h-[11.3rem] rounded-[1rem] border-dashed border-[2px] flex items-center justify-center relative mt-[1rem]
                //   required.includes("hight") ? "border-red-400" : ""
                `}
              >
                <CldUploadWidget
                  uploadPreset="pevesindo"
                  onSuccess={(results) => {
                    getImage(results?.info);
                  }}
                >
                  {({ open }) => {
                    return <button onClick={() => open()}>Upload Motif</button>;
                  }}
                </CldUploadWidget>
              </div>
              <TextArea onChange={handleProductDetail} name="description">
                Deskripsi
              </TextArea>
            </div>
          </div>
          <Button
            className="w-full mt-[1rem]"
            onClick={addProduct}
            loading={loading}
          >
            Tambah Produk
          </Button>
        </section>
        <section>
          <h2 className="text-[1.5rem] font-semibold py-[1.8rem] text-center">
            Produk {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <div className="w-full grid grid-cols-7 gap-[.8rem]">
            {products.map((item: any, key: any) => (
              <>
                {item.type === data.type && (
                  <button
                    key={key}
                    className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED] space-y-[.5rem] place-items-start relative`}
                  >
                    <div className="flex justify-between">
                      <p className="text-[.7rem] align-center items-center flex">{item.name}</p>
                      <div className="flex justify-around p-[.5rem] bg-red-200 rounded-md border-red-300 border-[1px]" onClick={() => deleteProduct(item.id)}>
                        <Image src="/delete.png" alt="" width={500} height={500} className="w-[1rem]" />
                      </div>
                    </div>
                    <div className="w-full justify-center flex h-[10rem]">
                      <Image
                        src={item.image}
                        alt=""
                        width={500}
                        height={500}
                        className="w-[8rem] pb-[2rem]"
                      />
                    </div>
                  </button>
                )}
              </>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
