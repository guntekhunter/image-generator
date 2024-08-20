"use client";
import { Center, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useState } from "react";
import Object from "./Object";
import Button from "../../component/template/Button";
import Input from "../../component/template/Input";
import Image from "next/image";

export default function Scene() {
  const [items, setItems] = useState(false);
  const [theData, setTheData] = useState({
    width: 0,
    length:0,
    hight:0
  })
  
  const handleClick = () => {
    console.log("ommaleka");
    setItems(!items);
  };
  
  const handleInput = (e:any) => {
    setTheData({ ...theData, [e.target.name]: parseFloat(e.target.value) });
  }

  console.log(theData)

  return (
    <div className="w-full h-[100vh] relative">
      <div className="absolute z-20 top-2 left-1/2 transform -translate-x-1/2">
        <div className="bg-red-200">
          <div className="px-[1rem] py-[.5rem] rounded-md">
            ksd
          </div>
        </div>
      </div>
      <div className="w-[20%] flex justify-start absolute z-10">
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
        </div>
      </div>
      
      <Canvas style={{backgroundColor: "#FDFDFD"}}>
        <Environment preset="city" />
        <OrbitControls />
        {/* <ambientLight intensity={3} /> */}
        <directionalLight intensity={3} position={[0, 3, 2]}/>
        <mesh>
          <Center>
            <Suspense>
              <Object ini={items} data={theData}/>
            </Suspense>
          </Center>
        </mesh>
      </Canvas>
    </div>
  );
}
