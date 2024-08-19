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

export function Model(props: any) {
  const { nodes, materials } = useGLTF("/wallpanel and uv.glb");

  const handleClick = (name: string) => {
    console.log("ommaleka", name);
  };

  console.log(props.ini);
  return (
    <group {...props} dispose={null}>
      {nodes.lantai && (
        <mesh
          onClick={() => handleClick("lantai")}
          castShadow
          receiveShadow
          geometry={nodes.lantai.geometry}
          material={materials["Material.004"]}
          position={[0, 0.058, 0]}
          scale={4.705}
        />
      )}
      {nodes.wallpanel_kiri && (
        <mesh
          onClick={() => handleClick("wallpanel kiri")}
          castShadow
          receiveShadow
          geometry={nodes.wallpanel_kiri.geometry}
          material={materials["Material.001"]}
          position={[3.708, 2.808, -4.709]}
        />
      )}
      {nodes.uv_board && (
        <mesh
          onClick={() => handleClick("uv board")}
          castShadow
          receiveShadow
          geometry={nodes.uv_board.geometry}
          material={materials["Material.003"]}
          position={[0, 2.777, -4.711]}
        />
      )}
      {props.item && (
        <mesh
          onClick={() => handleClick("wallpanel_kanan")}
          castShadow
          receiveShadow
          geometry={nodes.wallpanel_kanan.geometry}
          material={materials["Material.002"]}
          position={[-3.662, 2.808, -4.709]}
          scale={[-1, 1, 1]}
        />
      )}
      <mesh
        onClick={() => handleClick("dinding")}
        material-color="#f234ff"
        castShadow
        receiveShadow
        geometry={nodes.dinding.geometry}
        material={materials.Material}
        scale={[4.709, 0.043, 4.709]}
      />
    </group>
  );
}

useGLTF.preload("/kotak.glb");

export default function Object(props: any) {
  const groups = useRef<Group>(null);

  console.log(props.ini);
  return (
    <group ref={groups}>
      <Model item={props.ini} />
    </group>
  );
}
