"use client";
import { Center, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useState } from "react";
import Object from "./Object";
import Button from "../../component/template/Button";
import Input from "../../component/template/Input";
import Image from "next/image";
import Backdrop from "./Backdrop";
import { getProduct } from "../../function/fetch/fetch";
import SketchPicker from "react-color";

export default function Scene() {
  const [items, setItems] = useState(false);
  const [theData, setTheData] = useState({
    width: 0,
    length:0,
    hight:0,
    color:""
  });
  const [products, setProducts] = useState([]);
  const [color, setColor] = useState("")
  
  const handleClick = (e:any) => {
    setTheData({ ...theData, "color": e });
  };
  
  const handleInput = (e:any) => {
    setTheData({ ...theData, [e.target.name]: parseFloat(e.target.value) });
  }

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

  const changeColor = (e:any) => {
    setColor(e.hex)
  }
  return (
    <div className="w-full h-[100vh] relative">
      <div className="w-[20%] flex justify-start absolute z-10 bg-opacity-50 backdrop-filter backdrop-blur-md">
        <div className="w-full h-[100vh] shadow-md bg-white border border-r-[1px] border-gray-200 px-[1rem] py-[1rem]">
          <div className="grid grid-rows-4 grid-flow-col gap-4">
            <div>
              <label>Panjang</label>
              <input onChange={handleInput} name="width"/>
            </div>
            <div>
              <label>Lebar</label>
              <input onChange={handleInput} name="length"/>
            </div>
            <div>
              <label>Tinggi</label>
              <input onChange={handleInput} name="hight"/>
            </div>
            <div>
              <label>Jumlah Wallpanel</label>
              <input onChange={handleInput} name="count"/>
            </div>
          </div>
          <SketchPicker color={color} onChange={(color:any) => changeColor(color)} disableAlpha/>
        </div>
      </div>
      <div className="absolute bg-red-200 w-full z-20 flex justify-end bg-transparent pointer-events-none space-x-[1rem] p-[1rem]">
        {
          products.map((item: any, key: any) => (
             <button
             key={key}
               onClick={() => handleClick(item.description)}
               className="p-[1rem] rounded-[10px] bg-[#FBFBFB] border border-[#EDEDED] space-y-[.5rem] place-items-start cursor-pointer pointer-events-auto bg-white bg-opacity-50 backdrop-filter backdrop-blur-md"
             >
               <div className="w-full justify-center flex">
                <div>
                  <p>{item.name}</p>
                  <div className="flex justify-center">
                   <Image
                     src={item.image}
                     alt=""
                     width={500}
                     height={500}
                     className="w-[3rem]"
                   />
                  </div>
                  </div>
                </div>
             </button>
          ))
        }
      </div>
      <Canvas style={{backgroundColor: "#FDFDFD"}}>
        <Environment preset="city" />
        <OrbitControls />
        {/* <ambientLight intensity={3} /> */}
        <directionalLight intensity={3} position={[35, 1, 10]}/>
        <mesh>
          <Center>
            <Suspense>
              <Object ini={items} data={theData} color={color}/>
            </Suspense>
          </Center>
        </mesh>
      </Canvas>
    </div>
  );
}
