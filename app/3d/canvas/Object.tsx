"use client";
import { useRef, useEffect, useState } from "react";
import { Group, Box3, Vector3 } from "three";
import { useGLTF } from "@react-three/drei";

export function Model(props: any) {
  const { nodes, materials } = useGLTF('/inimi.glb');
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

  console.log("width", width)
  console.log("length", length)
  console.log("length", wallpanelCount)

  const wallpanelCountReal = width / 0.16 + 1

  const color = props?.data?.color; // Safely accessing color
  console.log(color);

  const meshRef = useRef(null);

  useEffect(() => {
    if (meshRef.current) {
      // Compute bounding box for the geometry and center it
      const bbox = new Box3().setFromObject(meshRef.current);
      const center = new Vector3();
      bbox.getCenter(center);

      // Translate the mesh so that its center is at (0, 0, 0)
      meshRef.current.position.sub(center);
    }
  }, [meshRef]);

  return (
    <group {...props} dispose={null} ref={meshRef}>
      {
        Array.from({ length: wallpanelCountReal }).map((_, index) => (
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.wallpanel_kiri.geometry}
            material={materials[`${props.data.wallpanel}`]}
            position={[0.15 - width + index * 0.313, 0, 0.020]}
            rotation={[0, 0, -Math.PI]}
            scale={[2, hight, 1]}
          >
            <meshStandardMaterial
              attach="material"
              color={props.color}
              roughness={6} // Set roughness directly here
            />
          </mesh>
        ))
      }
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.uv.geometry}
        material={materials['Material.010']}
        position={[0, 0, 0.05]}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      />
      <mesh geometry={nodes.partisi_tv.geometry} material={materials['Material.012']} position={[4 - width, 4 - hight, length - 3.74]} scale={[width - 2, 0.05, 0.19]} />
      <group position={[4 - width, 1 - hight, length - 3.74]} scale={[width - 2, .4, 0.211]}>
        <mesh geometry={nodes.Cube012.geometry} material={materials['Material.003']} />
        <mesh geometry={nodes.Cube012_1.geometry} material={materials['Material.007']} />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.plafon_flat.geometry}
        material={materials.putih}
        position={[-0.136, 3.747, 0.008]}
      />
      <group position={[0, hight, 0 + length]}
        scale={[width / 1.5, 2, length / 1.5]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube003.geometry}
          material={materials['Material.001']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube003_1.geometry}
          material={materials[`${props.data.plafon1}`]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube003_2.geometry}
          material={materials['NP - 029']}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.lantai.geometry}
        material={materials[`${props.data.vinyl}`]}
        position={[0, 0 - hight, 0 + length]}
        scale={[width, 0.017, length]}
      />
      <mesh
        castShadow
        receiveShadow
        material-color={props.color}
        geometry={nodes.dinding_depan.geometry}
        material={materials['Material.001']}
        position={[0, 0, 0]} // Adjusted position
        rotation={[Math.PI / 2, 0, 0]}
        scale={[width, 0.017, hight]} // Adjust scale
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.dinding_kanan.geometry}
        material={materials['Material.001']}
        position={[0 + width, 0, 0 + length]} // Adjusted position
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        scale={[length, 0.017, hight]} // Adjust scale
      >
        <meshStandardMaterial
          attach="material"
          color={props.color}
          roughness={6} // Set roughness directly here
        />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.wallpanel_kiri001.geometry}
        material={materials[`${props.data.color}`]}
        position={[-0.02 + width, 0, 0.16]}
        rotation={[Math.PI, -Math.PI / 2, 0]}
        scale={[2, hight, 1]}
      />
    </group>
  );
}

useGLTF.preload('/inimi.glb')

export default function Object(props: any) {
  const groups = useRef<Group>(null);
  return (
    <group ref={groups}>
      <Model item={props.ini} data={props.data} color={props.color} clicked={props.clicked} />
    </group>
  );
}
