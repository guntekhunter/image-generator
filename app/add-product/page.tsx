"use client";
import React, { useState } from "react";
import Input from "../component/template/Input";
import DropDown from "../component/template/DropDown";
import { CldUploadWidget } from "next-cloudinary";
import TextArea from "../component/template/TextArea";
import Image from "next/image";

export default function page() {
  const [type, setType] = useState("");
  const handleChange = (e: any) => {
    setType(e.target.value);
  };

  const optionsType = [
    { value: "plafon", label: "plafon" },
    { value: "vinyl", label: "vinyl" },
    { value: "wallpanel", label: "wallpanel" },
    { value: "uv", label: "uv" },
  ];

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
                name="dropdown"
                className="custom-dropdown"
                options={optionsType}
              >
                Tipe Produk
              </DropDown>
              <Input>Kode Motif</Input>
              <div
                className={`w-full h-[11.3rem] rounded-[1rem] border-dashed border-[2px] flex items-center justify-center relative mt-[1rem]
                //   required.includes("hight") ? "border-red-400" : ""
                `}
              >
                <CldUploadWidget
                  uploadPreset="pevesindo"
                  //   onSuccess={(results) => {
                  //     setImageUrlUploaded(results?.info.url);
                  //   }}
                >
                  {({ open }) => {
                    return (
                      <button
                        // className={`button ${
                        //   required.includes("hight") ? "text-red-400" : ""
                        // }`}
                        onClick={() => open()}
                      >
                        Upload Motif
                      </button>
                    );
                  }}
                </CldUploadWidget>
              </div>
              <TextArea>Deskripsi</TextArea>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-[1.5rem] font-semibold py-[1.8rem] text-center">
            Produk {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <div className="w-full grid grid-cols-7 gap-[.8rem]">
            <button
              //   onClick={() => selectPattern("WP-01")}
              className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED] space-y-[.5rem] place-items-start`}
            >
              <p className="text-[1rem]">WP-01</p>
              <div className="w-full justify-center flex">
                <Image
                  src="/uv board/1.png"
                  alt=""
                  width={500}
                  height={500}
                  className="w-[8rem] pb-[2rem]"
                />
              </div>
            </button>
            <button
              //   onClick={() => selectPattern("WP-01")}
              className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED] space-y-[.5rem] place-items-start`}
            >
              <p className="text-[1rem]">WP-02</p>
              <div className="w-full justify-center flex">
                <Image
                  src="/uv board/1.png"
                  alt=""
                  width={500}
                  height={500}
                  className="w-[8rem] pb-[2rem]"
                />
              </div>
            </button>
            <button
              //   onClick={() => selectPattern("WP-01")}
              className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED] space-y-[.5rem] place-items-start`}
            >
              <p className="text-[1rem]">WP-03</p>
              <div className="w-full justify-center flex">
                <Image
                  src="/uv board/1.png"
                  alt=""
                  width={500}
                  height={500}
                  className="w-[8rem] pb-[2rem]"
                />
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
