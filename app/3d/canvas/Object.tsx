"use client";
import { useRef, useEffect } from "react";
import { Group, Box3, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import { proxy } from "valtio";

const state = proxy({
  current: null,
  items: {
    wallpanel_kanan: "#ffffff",
    wallpanel_kiri: "#ffffff",
    dinding: "#ffffff",
    lantai: "#ffffff",
    uv_board: "#ffffff",
  },
});

export function Model(props: any) {
  const { nodes, materials } = useGLTF('/yang menar.glb');
  const groupRef = useRef<Group>(null);

  const handleClick = (e: any) => {
    console.log(e);
  };
  const width = parseInt(localStorage.getItem("width"))
  const hight = parseInt(localStorage.getItem("hight"))
  const length = parseInt(localStorage.getItem("length"))

  const originalWidth = 1.502;
  const originalLength = 1.501;
  const originalHight = 0.014;
  const originalWall = 1.045;
  const maxScale = 3;
  const minScale = 0.1;
  const minScaleHight = 0.0;
  const minScaleWall = 0.1;

  const scaleFactor = Math.min(maxScale, Math.max(minScale, (props.data.width || width / 3) * originalWidth));
  const scaleFactorLength = Math.min(maxScale, Math.max(minScale, (props.data.length || length / 3) * originalLength));
  const scaleFactorHight = Math.min(maxScale, Math.max(minScaleHight, (props.data.hight || hight/ 3) * originalHight));
  const scaleFactorWall = Math.min(maxScale, Math.max(minScaleWall, (props.data.hight || hight/ 3) * originalWall));

  let roundedNumber = 1.502;
  let roundedNumberLength = 1.501;
  let roundedNumberHight = 0.014;
  let roundedNumberWall = 1.501;

  if (width || hight || length) {
    roundedNumber = parseFloat(scaleFactor.toFixed(3));
    roundedNumberLength = parseFloat(scaleFactorLength.toFixed(3));
    roundedNumberHight = parseFloat(scaleFactorHight.toFixed(3));
    roundedNumberWall = parseFloat(scaleFactorWall.toFixed(3));
  }

  const newScaleZ = roundedNumberLength;

  useEffect(() => {
    if (groupRef.current) {
      const box = new Box3().setFromObject(groupRef.current);
      const center = box.getCenter(new Vector3());

      // Adjust the group's position to center it
      groupRef.current.position.x -= center.x;
      groupRef.current.position.y -= center.y;
      groupRef.current.position.z -= center.z;
    }
  }, [groupRef.current]);

  const wallHeightOffset = roundedNumberHight / 2;
const panelHeightOffset = roundedNumberWall / 2;

const wallPanelYPosition = 1.875 + wallHeightOffset - panelHeightOffset;
  return (
    <group ref={groupRef} {...props} dispose={null}>
      <mesh
        onClick={() => handleClick("dinding")}
        castShadow
        receiveShadow
        geometry={nodes.dinding.geometry}
        material={materials.Material}
        position={[1.117, 1.879, -0.799]}
        scale={[roundedNumber, roundedNumberHight, 1.502]}
      />
      <mesh
        onClick={() => handleClick("lantai")}
        castShadow
        receiveShadow
        geometry={nodes.lantai.geometry}
        material={materials['Material.004']}
        position={[1.117, 1.897, -2.300 + newScaleZ]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[roundedNumberLength, 1, roundedNumber]}
      />
      {/* <mesh
        onClick={() => handleClick("uv")}
        castShadow
        receiveShadow
        geometry={nodes.uv_board.geometry}
        material={materials['Material.003']}
        position={[1.111, 2.929, -2.286]}
        scale={[0.563, 0.499, 0.319]}
      /> */}
      <mesh
        onClick={() => handleClick("wallpanel kanan")}
        castShadow
        receiveShadow
        geometry={nodes.wallpanel_kanan.geometry}
        material={materials[`${props.data.color}`]}
        position={[1.041 + roundedNumber, 1.875 + roundedNumberWall, -2.295]}
        scale={[1.502, roundedNumberWall, 1.502]}
      />
      {Array.from({ length: props.data.count }).map((_, index) => (
        <mesh
          key={`wallpanel_kiri_${index}`}
          onClick={() => handleClick("wallpanel kiri")}
          castShadow
          receiveShadow
          geometry={nodes.wallpanel_kanan001.geometry}
          material={materials[`${props.data.color}`]}
          position={[
            1.200 - roundedNumber + index * 0.155,
            1.875 + roundedNumberWall,
            -2.295
          ]}
          scale={[1.502, roundedNumberWall, 1]}
        />
      ))}
    </group>
  );
}

useGLTF.preload('/yang menar.glb');

export default function Object(props: any) {
  const groups = useRef<Group>(null);
  return (
    <group ref={groups}>
      <Model item={props.ini} data={props.data} />
    </group>
  );
}
