"use client";
import { Center, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useState } from "react";
import Object from "./Object";
import Button from "../../component/template/Button";

export default function Scene() {
  const [items, setItems] = useState(false);
  const handleClick = () => {
    console.log("ommaleka");
    setItems(!items);
  };
  return (
    <div className="w-full h-[100vh] relative">
      <div className="w-full flex justify-center absolute z-20">
        <Button onClick={handleClick}>ommaleka</Button>
      </div>
      <Canvas>
        <Environment preset="studio" />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <mesh>
          <Center>
            <Suspense>
              <Object ini={items} />
            </Suspense>
          </Center>
        </mesh>
      </Canvas>
    </div>
  );
}
