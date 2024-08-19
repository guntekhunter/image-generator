"use client";

import Object from "./canvas/Object";
import Backdrop from "./canvas/Backdrop";
import CameraRig from "./canvas/CameraRig";
import { Canvas } from "@react-three/fiber";
import { Center, Environment } from "@react-three/drei";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("../3d/canvas/Scene"));

export default function page() {
  return (
    <div>
      <Scene />
    </div>
  );
}
