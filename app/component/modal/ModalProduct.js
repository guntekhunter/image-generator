"use client"
import Image from "next/image";
import Button from "../template/Button"
import Input from "../template/Input"
import DropDown from "../template/DropDown"
import { useState } from "react";

export default function ModalProduct({ isOpen, onClose, save, opened }) {
    const [count, setCount] = useState("")
    const [type, setType] = useState("")
    if (!isOpen) return null;
    const handleChange = (e) => {
        setCount(e.target.value)
    };
    const handleChangeType = (e) => {
        setType(e.target.value)
    };

    const options = [
        { value: '1 Sisi', label: '1 Sisi' },
        { value: '2 Sisi', label: '2 Sisi' },
        { value: '3 Sisi', label: '3 Sisi' },
        { value: '4 Sisi', label: '4 Sisi' },
    ];
    const typeOptions = [
        { value: 'Full', label: 'Full' },
        { value: 'Stengah', label: 'Stengah' },
    ];

    const saveHandle = () => {
        save(true)
        onClose()
    }

    return (
        <div className={`w-full h-[100vh] fixed z-10 flex justify-around pt-[1rem] pb-[5rem] overflow-hidden`}>
            <div className="w-[70%] bg-white p-[2rem] rounded-[10px] border border-gray-200 space-y-[1rem] overflow-y-scroll">
                <h2 className="font-semibold text-[1.5rem]">{opened}</h2>
                <div className=" w-full">
                    {
                        opened === "vinyl" ? (
                            <div className="w-full grid grid-cols-4 gap-[.8rem]" id="slider">
                                <button className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED] place-items-start`} >
                                    <p className="text-[1rem]">VN-01</p>
                                    <div className="w-full justify-center flex">
                                        <Image src="/wallpanel-1.png" alt="" width={500} height={500} className="w-[8rem]" />
                                    </div>
                                </button>
                                <button className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED]`} >
                                    <p className="text-[1rem]">VN-02</p>
                                    <div className="w-full justify-center flex">
                                        <Image src="/wallpanel-1.png" alt="" width={500} height={500} className="w-[8rem]" />
                                    </div>
                                </button>
                                <button className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED]`} >
                                    <p className="text-[1rem]">VN-03</p>
                                    <div className="w-full justify-center flex">
                                        <Image src="/wallpanel-1.png" alt="" width={500} height={500} className="w-[8rem]" />
                                    </div>
                                </button>
                                <button className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED] items-first`} >
                                    <p className="text-[1rem]">VN-04</p>
                                    <div className="w-full justify-center flex">
                                        <Image src="/wallpanel-1.png" alt="" width={500} height={500} className="w-[8rem]" />
                                    </div>
                                </button>

                            </div>
                        ) : opened === "wallpanel" ? (
                            <div className="w-full grid grid-cols-4 gap-[.8rem]" id="slider">
                                <button className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED] place-items-start`} >
                                    <p className="text-[1rem]">WP-01</p>
                                    <div className="w-full justify-center flex">
                                        <Image src="/wallpanel-1.png" alt="" width={500} height={500} className="w-[8rem]" />
                                    </div>
                                </button>
                                <button className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED]`} >
                                    <p className="text-[1rem]">WP-02</p>
                                    <div className="w-full justify-center flex">
                                        <Image src="/wallpanel-1.png" alt="" width={500} height={500} className="w-[8rem]" />
                                    </div>
                                </button>
                                <button className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED]`} >
                                    <p className="text-[1rem]">WP-03</p>
                                    <div className="w-full justify-center flex">
                                        <Image src="/wallpanel-1.png" alt="" width={500} height={500} className="w-[8rem]" />
                                    </div>
                                </button>
                                <button className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED] items-first`} >
                                    <p className="text-[1rem]">WP-04</p>
                                    <div className="w-full justify-center flex">
                                        <Image src="/wallpanel-1.png" alt="" width={500} height={500} className="w-[8rem]" />
                                    </div>
                                </button>

                            </div>
                        ) : opened === "plafon" ? (
                            <div className="w-full grid grid-cols-4 gap-[.8rem]" id="slider">
                                <button className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED] place-items-start`} >
                                    <p className="text-[1rem]">WP-01</p>
                                    <div className="w-full justify-center flex">
                                        <Image src="/wallpanel-1.png" alt="" width={500} height={500} className="w-[8rem]" />
                                    </div>
                                </button>
                                <button className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED]`} >
                                    <p className="text-[1rem]">WP-02</p>
                                    <div className="w-full justify-center flex">
                                        <Image src="/wallpanel-1.png" alt="" width={500} height={500} className="w-[8rem]" />
                                    </div>
                                </button>
                                <button className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED]`} >
                                    <p className="text-[1rem]">WP-03</p>
                                    <div className="w-full justify-center flex">
                                        <Image src="/wallpanel-1.png" alt="" width={500} height={500} className="w-[8rem]" />
                                    </div>
                                </button>
                                <button className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED] items-first`} >
                                    <p className="text-[1rem]">WP-04</p>
                                    <div className="w-full justify-center flex">
                                        <Image src="/wallpanel-1.png" alt="" width={500} height={500} className="w-[8rem]" />
                                    </div>
                                </button>

                            </div>
                        ) : (
                            <div className="w-full grid grid-cols-4 gap-[.8rem]" id="slider">
                                <button className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED] place-items-start`} >
                                    <p className="text-[1rem]">WP-01</p>
                                    <div className="w-full justify-center flex">
                                        <Image src="/wallpanel-1.png" alt="" width={500} height={500} className="w-[8rem]" />
                                    </div>
                                </button>
                                <button className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED]`} >
                                    <p className="text-[1rem]">WP-02</p>
                                    <div className="w-full justify-center flex">
                                        <Image src="/wallpanel-1.png" alt="" width={500} height={500} className="w-[8rem]" />
                                    </div>
                                </button>
                                <button className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED]`} >
                                    <p className="text-[1rem]">WP-03</p>
                                    <div className="w-full justify-center flex">
                                        <Image src="/wallpanel-1.png" alt="" width={500} height={500} className="w-[8rem]" />
                                    </div>
                                </button>
                                <button className={`p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED] items-first`} >
                                    <p className="text-[1rem]">WP-04</p>
                                    <div className="w-full justify-center flex">
                                        <Image src="/wallpanel-1.png" alt="" width={500} height={500} className="w-[8rem]" />
                                    </div>
                                </button>

                            </div>
                        )
                    }
                </div>
                <div className="grid grid-cols-2 gap-[.8rem]">
                    <DropDown
                        onChange={handleChange}
                        value={count}
                        name="dropdown"
                        className="custom-dropdown"
                        options={options}
                    >
                        Jumlah Dinding
                    </DropDown>
                    <DropDown
                        onChange={handleChangeType}
                        value={type}
                        name="dropdown"
                        className="custom-dropdown"
                        options={typeOptions}
                    >
                        Type Wallpanel
                    </DropDown>
                </div>
                <Input name="hight" className={`${type === "Stengah" ? "block" : "hidden"}`}
                    value=""
                >Tinggi Ruangan (m)</Input>
                <div className="flex space-x-[1rem]">
                    <Button onClick={saveHandle}>Simpan</Button>
                    <Button onClick={onClose} >Batal</Button>
                </div>
                {/* <Input></Input> */}
            </div>
        </div >
    )
}