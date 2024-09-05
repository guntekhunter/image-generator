"use client";
import { useRef, useEffect, useState } from "react";
import { Group, Box3, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";
import { proxy } from "valtio";
import * as THREE from 'three';

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
  const wallpanelCount = parseInt(localStorage.getItem("wallpanel-count"))
  const isVinyl = localStorage.getItem("isvinyl")
  const isPlafon = localStorage.getItem("isplafon")

  const handleClick = (e: any) => {
    console.log(e);
  };
  const width = parseInt(localStorage.getItem("width"))
  const hight = parseInt(localStorage.getItem("hight"))
  const length = parseInt(localStorage.getItem("length"))


  const originalWidth = 1.502;
  const originalLength = 1.501;
  const originalHight = 1.522;
  const originalWall = 1.045;
  const maxScale = 3;
  const minScale = 0.1;
  const minScaleHight = 0.0;
  const minScaleWall = 0.1;

  const scaleFactor = Math.min(maxScale, Math.max(minScale, (props.data.width || width / 3) * originalWidth));
  const scaleFactorLength = Math.min(maxScale, Math.max(minScale, (props.data.length || length / 3) * originalLength));
  const scaleFactorHight = Math.min(maxScale, Math.max(minScaleHight, (props.data.hight || hight / 3) * originalHight));
  const scaleFactorWall = Math.min(maxScale, Math.max(minScaleWall, (props.data.hight || hight / 3) * originalWall));

  let roundedNumber = 6.502;
  let roundedNumberLength = 1.501;
  let roundedNumberHight = 1.522;
  let roundedNumberWall = 1;

  if (width || hight || length) {
    roundedNumber = parseFloat(scaleFactor.toFixed(3));
    roundedNumberLength = parseFloat(scaleFactorLength.toFixed(3));
    roundedNumberHight = parseFloat(scaleFactorHight.toFixed(3));
    roundedNumberWall = parseFloat(scaleFactorWall.toFixed(3));
  }

  const newScaleZ = roundedNumberLength;
  const newScaleY = roundedNumberHight;

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

  console.log(props.data.color)

  return (
    <group {...props} dispose={null} ref={groupRef}>
      {
        wallpanelCount && (
          <>
            {Array.from({ length: wallpanelCount + 1 }).map((_, index) => (<mesh
              castShadow
              receiveShadow
              geometry={nodes.wallpanel_kiri.geometry}
              position={[-0.1 - roundedNumber + index * 0.155, 0 + newScaleY, -1.484]}
              scale={[1, roundedNumberHight, 1]}
              material={materials['Material.014']}
              rotation={[0, 0, -Math.PI]}
            />
            ))}
          </>
        )
      }

      <mesh
        castShadow
        receiveShadow
        geometry={nodes.uv.geometry}
        material={materials['Material.010']}
        position={[0.551, 1.499, -1.502]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={[0.763, 0.499, 0.319]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.plafon_flat.geometry}
        material={materials.putih}
        position={[-0.136, 3.747, 0.008]}
      />
      <group position={[-0.16, 3.159, 0.008]} scale={[3, 3, 3]} >
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube003.geometry}
          material={materials['Material.014']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube003_1.geometry}
          material={materials['Material.001']}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.lantai.geometry}
        material={materials['Material.006']}
        position={[-0.161, -0.001, -1.500 + newScaleZ]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[roundedNumberLength, 0.01, roundedNumber]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.dinding_depan.geometry}
        material={nodes.dinding_depan.material}
        position={[-0.161, 0 + newScaleY, -1.502]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[roundedNumber, 0.017, roundedNumberHight]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.dinding_kanan.geometry}
        material={nodes.dinding_kanan.material}
        position={[-0.15 + roundedNumber, 0 + newScaleY, -1.500 + newScaleZ]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={[roundedNumberLength, 0.017, roundedNumberHight]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.wallpanel_kiri001.geometry}
        material={materials['Material.005']}
        position={[-0.168 + roundedNumber, 1.519, -1.406]}
        // position={[0 + roundedNumber, 0 + roundedNumberWall, -3]}
        rotation={[Math.PI, -Math.PI / 2, 0]}
        scale={[1, 1.521, 1]}
      />
    </group>
    // <group ref={groupRef} {...props} dispose={null}>
    //   <mesh
    //     onClick={() => handleClick("dinding")}
    //     castShadow
    //     receiveShadow
    //     material-color={props.color}
    //     geometry={nodes.dinding.geometry}
    //     material={materials.Material}
    //     position={[1.117, 1, -0.799]}
    //     scale={[roundedNumber, roundedNumberHight, 1.502]}
    //   />
    //   <mesh
    //     onClick={() => handleClick("lantai")}
    //     geometry={nodes.lantai.geometry}
    //     material={materials['Material.004']}
    //     position={[1.117, 1, -2.300 + newScaleZ]}
    //     rotation={[0, Math.PI / 2, 0]}
    //     scale={[roundedNumberLength, 1, roundedNumber]}
    //   />
    //   <mesh
    //     castShadow
    //     receiveShadow
    //     geometry={nodes.wallpanel_kanan002.geometry}
    //     material={materials['Material.002']}
    //     position={[1.117 + roundedNumber, 1 + roundedNumberWall, -2.198]}
    //     rotation={[Math.PI, Math.PI / 2, 0]}
    //     scale={[-1, roundedNumberWall, -1]}
    //   />
    //   {/* <mesh
    //     onClick={() => handleClick("uv")}
    //     castShadow
    //     receiveShadow
    //     geometry={nodes.uv_board.geometry}
    //     material={materials['Material.003']}
    //     position={[1.111, 2.029, -2.286]}
    //     scale={[0.563, 0.499, 0.319]}
    //   /> */}
    //   <mesh
    //     castShadow
    //     receiveShadow
    //     material-color={props.color}
    //     geometry={nodes.dinding001.geometry}
    //     material={materials['Material.001']}
    //     position={[2.652 + roundedNumber, 1, -2.310 + newScaleZ]}
    //     rotation={[0, Math.PI / 2, 0]}
    //     scale={[roundedNumberLength, roundedNumberHight, 1.502]}
    //   />

    //   {/* <mesh
    //     onClick={() => handleClick("wallpanel kanan")}
    //     castShadow
    //     receiveShadow
    //     geometry={nodes.wallpanel_kanan.geometry}
    //     material={materials[`${props.data.color}`]}
    //     position={[1.041 + roundedNumber, 1 + roundedNumberWall, -2.295]}
    //     scale={[1, roundedNumberWall, 1]}
    //   /> */}
    //   {
    //     wallpanelCount && (
    //       <>
    //         {Array.from({ length: wallpanelCount + 1 }).map((_, index) => (
    //           <mesh
    //             key={`wallpanel_kiri_${index}`}
    //             onClick={() => handleClick("wallpanel kiri")}
    //             castShadow
    //             receiveShadow
    //             geometry={nodes.wallpanel_kiri.geometry}
    //             material={materials[`${props.data.color}`]}
    //             position={[
    //               1.200 - roundedNumber + index * 0.155,
    //               .99 + roundedNumberWall,
    //               -2.295
    //             ]}
    //             scale={[1, roundedNumberWall, 1]}
    //           />
    //         ))}
    //       </>
    //     )
    //   }
    //   <mesh
    //     castShadow
    //     receiveShadow
    //     geometry={nodes.Cube.geometry}
    //     material={nodes.Cube.material}
    //     position={[1.122, 1 + ((roundedNumberWall * 100) / 50.6), -2.300 + newScaleZ]}
    //     scale={[roundedNumber, 0.015, roundedNumberLength]}
    //   />
    // </group>
  );
}

useGLTF.preload('/yang menar.glb');

export default function Object(props: any) {
  const groups = useRef<Group>(null);
  return (
    <group ref={groups}>
      <Model item={props.ini} data={props.data} color={props.color} />
    </group>
  );
}
