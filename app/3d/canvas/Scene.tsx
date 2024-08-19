import { Center, Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import Object from "./Object";

export default function Scene() {
  return (
    <div className="w-full h-[100vh]">
      <Canvas>
        <Environment preset="studio" />
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <mesh>
          <Center>
            <Suspense>
              <meshBasicMaterial color={"red"} />
              <Object />
            </Suspense>
          </Center>
        </mesh>
      </Canvas>
    </div>
  );
}
