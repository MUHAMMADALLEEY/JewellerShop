"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

type Orbital = {
  radius: number;
  speed: number;
  phase: number;
  tilt: number;
  size: number;
  hue: string;
  yOffset: number;
};

export default function OrbitalGems({ count = 7 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);

  const orbitals = useMemo<Orbital[]>(() => {
    const palette = ["#ffffff", "#f3d77a", "#d4af37", "#ffe9b5", "#ffffff", "#f3d77a", "#fff7d6"];
    return Array.from({ length: count }, (_, i) => ({
      radius: 1.6 + (i % 3) * 0.45 + Math.random() * 0.2,
      speed: 0.18 + Math.random() * 0.18,
      phase: (i / count) * Math.PI * 2 + Math.random() * 0.6,
      tilt: (Math.random() - 0.5) * 0.4,
      size: 0.06 + Math.random() * 0.07,
      hue: palette[i % palette.length],
      yOffset: (Math.random() - 0.5) * 0.4,
    }));
  }, [count]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const o = orbitals[i];
      if (!o) return;
      const angle = t * o.speed + o.phase;
      child.position.x = Math.cos(angle) * o.radius;
      child.position.z = Math.sin(angle) * o.radius;
      child.position.y = o.yOffset + Math.sin(angle * 1.4) * 0.18 + Math.cos(t * 0.6 + o.phase) * 0.05;
      child.rotation.x = angle * 1.2;
      child.rotation.y = angle;
      child.rotation.z = o.tilt + Math.sin(angle) * 0.3;
    });
  });

  return (
    <group ref={group}>
      {orbitals.map((o, i) => (
        <mesh key={i} scale={o.size}>
          <octahedronGeometry args={[1, 0]} />
          <MeshTransmissionMaterial
            samples={4}
            thickness={0.6}
            roughness={0}
            transmission={1}
            ior={2.4}
            chromaticAberration={0.05}
            color={o.hue}
            attenuationDistance={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}
