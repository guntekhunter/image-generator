"use client";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

export default function ModalStyle({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute w-full h-full bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-50 px-[5rem] pb-[5rem]">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-black font-bold">
            X
          </button>
        </div>
        <div className="w-full flex justify-center mb-[2rem]">
          <h1 className="font-bold txt-center">Silahkan Pilih Style</h1>
        </div>
        <div className="grid grid-cols-3 gap-10">
          <div className="rounded-full overflow-hidden bg-red-200 w-[15rem] h-[15rem] relative">
            <div className="absolute text-center w-full h-full flex items-center justify-center">
              <p className="font-bold text-white">Japandi</p>
            </div>
            <Image
              src="/japandi.jfif"
              width={500}
              height={500}
              className="w-full"
            />
          </div>
          <div className="rounded-full overflow-hidden bg-red-200 w-[15rem] h-[15rem] relative">
            <div className="absolute text-center w-full h-full flex items-center justify-center">
              <p className="font-bold text-white">Industrial</p>
            </div>
            <Image
              src="/industrial.jfif"
              width={500}
              height={500}
              className="w-full"
            />
          </div>
          <div className="rounded-full overflow-hidden bg-red-200 w-[15rem] h-[15rem] relative">
            <div className="absolute text-center w-full h-full flex items-center justify-center">
              <p className="font-bold text-white">Modern</p>
            </div>
            <Image
              src="/modern.jfif"
              width={500}
              height={500}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
