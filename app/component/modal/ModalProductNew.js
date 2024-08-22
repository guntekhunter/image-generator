"use client"
import Image from "next/image";
import Button from "../template/Button"
import Input from "../template/Input"
import DropDown from "../template/DropDown"
import { useState } from "react";
import mergeImages from 'merge-images';

export default function ModalProduct({ isOpen, onClose, save, opened }) {
    const [count, setCount] = useState("")
    const [type, setType] = useState("")
    const [width, setWidth] = useState("")
    const [productDetail, setProductDetail] = useState([])
    if (!isOpen) return null;
    const handleChange = (e) => {
        setCount(e.target.value)
        setProductDetail((prev) => ({
            ...prev,
            jumlah_wallpanel: parseInt(e.target.value) // Replace "yourItemHere" with the actual item you want to add
        }));

    };

    const detailProduct = (e) => {
        setWidth(e.target.value)
        if (opened === "wallpanel") {
            setProductDetail((prev) => ({
                ...prev,
                wallpanelWidth: e.target.value // Replace "yourItemHere" with the actual item you want to add
            }));
        } else if (opened === "plafon") {
            console.log(e.target.value)
            setProductDetail((prev) => ({
                ...prev,
                plafonWidth: e.target.value // Replace "yourItemHere" with the actual item you want to add
            }));
        } else if (opened === "vinyl") {
            setProductDetail((prev) => ({
                ...prev,
                vinylWidth: e.target.value // Replace "yourItemHere" with the actual item you want to add
            }));
        } else {
            setProductDetail((prev) => ({
                ...prev,
                uv: e.target.value // Replace "yourItemHere" with the actual item you want to add
            }));
        }
    }
    const handleChangeType = (e) => {
        setType(e.target.value)
    };

    const optionsPlafon = [
        { value: 4, label: '4mm' },
        { value: 6, label: '6mm' },

    ];
    const optionsVinyl = [
        { value: 24, label: '2mm' },
        { value: 36, label: '3mm' },

    ];
    const optionsWallpanel = [
        { value: 16, label: '16cm' },
        { value: 19, label: '19cm' }
    ];
    const options = [
        { value: 1, label: '1 Sisi' },
        { value: 2, label: '2 Sisi' },
        { value: 3, label: '3 Sisi' },
        { value: 4, label: '4 Sisi' },
    ];
    const typeOptions = [
        { value: 'Full', label: 'Full' },
        { value: 'Stengah', label: 'Stengah' },
    ];

    const saveHandle = () => {
        save(true, opened, productDetail)
        onClose()
    }

    const selectPattern = (e) => {
        if (opened === "wallpanel") {
            setProductDetail((prev) => ({
                ...prev,
                wallpanel: e // Replace "yourItemHere" with the actual item you want to add
            }));
        } else if (opened === "plafon") {
            setProductDetail((prev) => ({
                ...prev,
                plafon: e // Replace "yourItemHere" with the actual item you want to add
            }));
        } else if (opened === "vinyl") {
            setProductDetail((prev) => ({
                ...prev,
                vinyl: e // Replace "yourItemHere" with the actual item you want to add
            }));
        } else {
            setProductDetail((prev) => ({
                ...prev,
                uv: e // Replace "yourItemHere" with the actual item you want to add
            }));
        }
    }

    console.log(opened)
    console.log(productDetail)
    return (
        <div className={`w-full h-[100vh] fixed z-10 flex justify-around items-center overflow-hidden bg-black bg-transparent-[.07]`} style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
            <div className="w-[70%] bg-white p-[2rem] rounded-[10px] border border-gray-200 space-y-[1rem] overflow-y-scroll">
                <h2 className="font-semibold text-[1.5rem]">{opened}</h2>
                {
                    opened === "wallpanel" ? (
                        <>
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
                            <DropDown
                                onChange={detailProduct}
                                value={width}
                                name="dropdown"
                                className="custom-dropdown"
                                options={optionsWallpanel}
                            >
                                Tebal Wallpanel
                            </DropDown>
                            <Input name="hight" className={`${type === "Stengah" ? "block" : "hidden"}`}
                                value=""
                            >Tinggi Ruangan (m)</Input>
                        </>
                    ) : opened === "vinyl" ? (
                        <>
                            <div className="grid grid-cols-2 gap-[.8rem]">
                                <DropDown
                                    onChange={detailProduct}
                                    value={width}
                                    name="dropdown"
                                    className="custom-dropdown"
                                    options={optionsVinyl}
                                >
                                    Tebal Lantai
                                </DropDown>

                            </div>
                        </>
                    ) : opened === "plafon" ? (
                        <>
                            <div className="grid grid-cols-2 gap-[.8rem]">
                                <DropDown
                                    onChange={detailProduct}
                                    value={width}
                                    name="dropdown"
                                    className="custom-dropdown"
                                    options={optionsPlafon}
                                >
                                    Panjang Plafon
                                </DropDown>

                            </div>
                        </>
                    ) : (
                        <>
                        </>
                    )
                }
                <div className="flex space-x-[1rem]">
                    <Button onClick={saveHandle}>Simpan</Button>
                    <Button onClick={onClose} >Batal</Button>
                </div>
            </div>
        </div >
    )
}