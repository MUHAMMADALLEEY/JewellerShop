"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function Earring({ spin = true, speed = 0.4 }: { spin?: boolean; speed?: number }) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (spin && group.current) {
      group.current.rotation.y += dt * speed;
    }
  });

  return (
    <group ref={group}>
      {/* Hook */}
      <mesh position={[0, 0.7, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.22, 0.025, 16, 64, Math.PI * 1.3]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.18} envMapIntensity={1.6} />
      </mesh>

      {/* Dangling chain links */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i} position={[0, 0.35 - i * 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.05, 0.012, 12, 24]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} envMapIntensity={1.5} />
        </mesh>
      ))}

      {/* Main pendant gem */}
      <mesh position={[0, -0.55, 0]} scale={[0.32, 0.55, 0.32]}>
        <octahedronGeometry args={[0.6, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={1.4}
          roughness={0}
          transmission={1}
          ior={2.4}
          chromaticAberration={0.07}
          color="#ffffff"
          attenuationDistance={0.6}
        />
      </mesh>
    </group>
  );
}
