"use client";
import { Center, Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import Object from "./Object";
import Button from "../../component/template/Button";
import Input from "../../component/template/Input";
import Image from "next/image";
import Backdrop from "./Backdrop";
import { getProduct } from "../../function/fetch/fetch";
import SketchPicker from "react-color";

export default function Scene() {
  const [items, setItems] = useState(false);
  const [isMotif, setIsMotif] = useState(false);
  const [isForniture, setIsForniture] = useState(false);
  const [isWarnaDinding, setIsWarnaDinding] = useState(false);
  const [theData, setTheData] = useState({
    width: 0,
    length: 0,
    hight: 0,
    color: ""
  });
  const [products, setProducts] = useState([]);
  const [color, setColor] = useState("")

  const handleClick = (e: any) => {
    setTheData({ ...theData, "color": e });
  };

  const handleInput = (e: any) => {
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

  const changeColor = (e: any) => {
    setColor(e.hex)
  }

  const scrollRef = useRef<HTMLDivElement>(null);
  let isDragging = false;
  let startX: number;
  let scrollLeft: number;

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging = true;
    scrollRef.current!.classList.add("scrolling");
    startX = e.pageX - scrollRef.current!.offsetLeft;
    scrollLeft = scrollRef.current!.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    isDragging = false;
    scrollRef.current!.classList.remove("scrolling");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current!.offsetLeft;
    const walk = (x - startX) * 1.5; // Adjust scroll speed
    scrollRef.current!.scrollLeft = scrollLeft - walk;
  };
  return (
    <div className="w-full h-[100vh] relative">
      <div className="w-[20%] flex justify-start absolute z-10 bottom-[4rem] left-[1rem] rounded-full py-[.6rem] px-[1rem] bg-gray-200 bg-opacity-50 backdrop-filter backdrop-blur-md border-gray-200 border-[1px] flex justify-around">
        <div className="flex space-x-[2rem] text-[.6rem]">
          <button onClick={() => (setIsMotif(!isMotif), setIsForniture(false), setIsWarnaDinding(false))} className={`hover:text-black transform duration-300 ${isMotif ? "text-black" : "text-gray-400"}`}>Motif</button>
          <button onClick={() => (setIsForniture(!isForniture), setIsWarnaDinding(false), setIsMotif(false))} className="text-gray-400 hover:text-black transform duration-300">Forniture</button>
          <button onClick={() => (setIsWarnaDinding(!isWarnaDinding), setIsMotif(false), setIsForniture(false))} className={`hover:text-black transform duration-300 ${isWarnaDinding ? "text-black" : "text-gray-400"}`}>Warna Dinding</button>
        </div>

      </div>


      {
        isMotif ? (
          <>
            <div className="w-[20%] flex justify-start absolute z-10 top-[1rem] left-[1rem] rounded-full py-[.6rem] px-[1rem] bg-gray-200 bg-opacity-50 backdrop-filter backdrop-blur-md border-gray-200 border-[1px] flex justify-around">
              <div className="flex space-x-[2rem] text-[.6rem]">
                <button className="text-gray-400 hover:text-black transform duration-300">Plafon</button>
                <button className="text-gray-400 hover:text-black transform duration-300">Wallpanel</button>
                <button className="text-gray-400 hover:text-black transform duration-300">Lantai</button>
              </div>
            </div>

            <div className="w-[20%] space-y-[.8rem] text-[.6rem] justify-start absolute z-10 top-[4rem] left-[1rem] py-[.6rem] h-[50vh]">
              <h2>Motif 1</h2>
              <div className="text-[.6rem] w-full overflow-x-auto whitespace-nowrap no-scrollbar scrolling" ref={scrollRef}
                onMouseDown={handleMouseDown}
                // onMouseLeave={handleMouseLeaveOrUp}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}>
                <div className="grid grid-flow-col auto-cols-max w-max gap-[1rem]">
                  {
                    products.map((item: any, key: any) => (
                      <button
                        key={key}
                        onClick={() => handleClick(item.description)}
                        className="p-[1rem] rounded-[10px] w-[5rem] bg-[#FBFBFB] border border-[#EDEDED] space-y-[.5rem] place-items-start cursor-pointer pointer-events-auto bg-white bg-opacity-50 backdrop-filter backdrop-blur-md"
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
                                className="w-[2rem]"
                              />
                            </div>
                          </div>
                        </div>
                      </button>
                    ))
                  }
                </div>
              </div>
            </div>
          </>
        ) : isWarnaDinding && (
          <div className="w-[20%] flex justify-start absolute z-10 top-[1rem] left-[1rem] flex justify-around">
            <div className="text-[.8rem] space-y-[.7rem]">
              <h2>Motif 1</h2>
              <SketchPicker color={color} onChange={(color: any) => changeColor(color)} disableAlpha />
            </div>
          </div>
        )
      }
      {/* <div className="w-[20%] flex justify-start absolute z-10 bg-opacity-50 backdrop-filter backdrop-blur-md">
        <div className="w-full h-[100vh] shadow-md bg-white border border-r-[1px] border-gray-200 px-[1rem] py-[1rem]">
          <div className="grid grid-rows-4 grid-flow-col gap-4">
            nda tau deh
          </div>
          <SketchPicker color={color} onChange={(color: any) => changeColor(color)} disableAlpha />
        </div>
      </div> */}
      {/* <div className="absolute bg-red-200 w-full z-20 flex justify-end bg-transparent pointer-events-none space-x-[1rem] p-[1rem]">
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
      </div> */}
      <Canvas style={{ backgroundColor: "#FDFDFD" }} camera={{ position: [0, 0, 0.5], fov: 75 }} shadows legacy={true}>
        <OrbitControls />
        {/* <Environment
          files="/background.hdr"
          ground={{ height: 5, radius: 40, scale: 20 }}
        /> */}
        {/* <fog attach="fog" args={["#d0d0d0", 8, 35]} /> */}
        <ambientLight intensity={0.4 * Math.PI} />
        {/* <directionalLight color="red" position={[100, 100, 100]} /> */}
        {/* <spotLight position={[10, 10, 10]} angle={0.5} intensity={1} castShadow penumbra={1} /> */}
        <mesh>
          <Center>
            <Suspense>
              <Object ini={items} data={theData} color={color} />
            </Suspense>
          </Center>
        </mesh>
      </Canvas>
    </div >
  );
}
