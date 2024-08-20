"use client";
import { useSnapshot } from "valtio";
// import state from "../../function/state";
import { useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { Group } from "three";
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

export function Model(props:any) {
  const { nodes, materials } = useGLTF('/yang menar.glb')
  const handleClick = (e:any) => {
    console.log(e)
  }

  const originalWidth = 1.502; // Assuming this is the original width of the model in meters
  const originalLength = 1.501; // Assuming this is the original width of the model in meters
  const originalHight = 0.014; // Assuming this is the original width of the model in meters
  const originalWall = 1.045; // Assuming this is the original width of the model in meters
  const maxScale = 3;
  const minScale = 0.1; 
  const minScaleHight = 0.0; 
  const minScaleWall = 0.1; 
  const scaleFactor = Math.min(maxScale, Math.max(minScale, (props.data.width / 3 ) * originalWidth));
  const scaleFactorLength = Math.min(maxScale, Math.max(minScale, (props.data.length / 3 ) * originalLength));
  const scaleFactorHight = Math.min(maxScale, Math.max(minScaleHight, (props.data.hight / 3 ) * originalHight));
  const scaleFactorWall = Math.min(maxScale, Math.max(minScaleWall, (props.data.hight / 3 ) * originalWall));

  let roundedNumber = 1.502
  let roundedNumberLength = 1.501
  let roundedNumberHight = 0.014
  let roundedNumberWall = 1
  if(props.data.width ||props.data.hight || props.data.length ){
    roundedNumber = parseFloat(scaleFactor.toFixed(3));
    roundedNumberLength = parseFloat(scaleFactorLength.toFixed(3));
    roundedNumberHight = parseFloat(scaleFactorHight.toFixed(3));
    roundedNumberWall = parseFloat(scaleFactorWall.toFixed(3));
  }else{
    roundedNumber = 1.502;
    roundedNumberLength = 1.501;
    roundedNumberHight = 0.014;
    roundedNumberWall = 1;
  }

  const newScaleZ = roundedNumberLength;
  console.log("ini nilainya", )
  console.log("ini lebarnya", props.data.count)
  return (
    <group {...props} dispose={null}>
      <mesh
      onClick={() => handleClick("dinding")}
        castShadow
        receiveShadow
        geometry={nodes.dinding.geometry}
        material={materials.Material}
        position={[1.117, 1.879, -0.799]}
        scale={[roundedNumber, roundedNumberHight , 1.502]}
      />
      <mesh
      onClick={() => handleClick("lantai")}
        castShadow
        receiveShadow
        geometry={nodes.lantai.geometry}
        material={materials['Material.004']}
        position={[1.117 , 1.897, -2.300 + newScaleZ]}
        scale={[roundedNumber,1.501,roundedNumberLength]}
      />
      {/* <mesh
      onClick={() => handleClick("uv")}
        castShadow
        receiveShadow
        geometry={nodes.uv_board.geometry}
        material={materials['Material.003']}
        position={[1.111, 2.929, -2.286]}
        scale={[0.763, 0.499, 0.319]}
      /> */}
      <mesh
      onClick={() => handleClick("wallpanel kanan")}
        castShadow
        receiveShadow
        geometry={nodes.wallpanel_kanan.geometry}
        material={materials['Material.005']}
        position={[1.041 + roundedNumber, 1.875 + roundedNumberWall, -2.295]}
        scale={[1, roundedNumberWall, 1]}
      />
      {Array.from({ length: props.data.count }).map((_, index) => (
        <mesh
          key={`wallpanel_kiri_${index}`}
          onClick={() => handleClick("wallpanel kiri")}
          castShadow
          receiveShadow
          geometry={nodes.wallpanel_kanan001.geometry}
          material={materials['Material.006']}
          position={[
            1.041 - roundedNumber + index * 0.155, 
            1.875 + roundedNumberWall, 
            -2.295
          ]}
          scale={[-1, roundedNumberWall, 1]}
        />
      ))}
    </group>
  )
}

useGLTF.preload('/yang menar.glb')

export default function Object(props: any) {
  const groups = useRef<Group>(null);
  return (
    <group ref={groups}>
      <Model item={props.ini} data={props.data}/>
    </group>
  );
}
