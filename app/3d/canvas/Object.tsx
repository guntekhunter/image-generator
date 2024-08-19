"use client";
import { useSnapshot } from "valtio";
// import state from "../../function/state";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";

useGLTF.preload("/kotak.glb");
export default function Object() {
  const groups = useRef<Group>(null);
  const { nodes, materials, scene } = useGLTF("/kotak.glb");

  return (
    <group ref={groups}>
      <primitive object={scene} />
    </group>
  );
}
