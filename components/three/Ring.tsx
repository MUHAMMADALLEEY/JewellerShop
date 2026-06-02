"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

type RingProps = {
  spin?: boolean;
  speed?: number;
  metal?: "gold" | "rose" | "platinum";
  gem?: "diamond" | "emerald" | "ruby" | "sapphire";
};

const metals: Record<string, { color: string; roughness: number }> = {
  gold: { color: "#d4af37", roughness: 0.18 },
  rose: { color: "#e0a890", roughness: 0.22 },
  platinum: { color: "#e6e6ea", roughness: 0.12 },
};

const gems: Record<string, string> = {
  diamond: "#ffffff",
  emerald: "#0fa66c",
  ruby: "#c0103a",
  sapphire: "#1a4cb8",
};

export default function Ring({
  spin = true,
  speed = 0.35,
  metal = "gold",
  gem = "diamond",
}: RingProps) {
  const group = useRef<THREE.Group>(null);
  const m = metals[metal];
  const gemColor = gems[gem];

  const prongPositions = useMemo(() => {
    const pts: [number, number, number][] = [];
    const r = 0.34;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      pts.push([Math.cos(a) * r, 0.46, Math.sin(a) * r]);
    }
    return pts;
  }, []);

  // Pavé — tiny diamonds set along the upper half of the band
  const pavePositions = useMemo(() => {
    const pts: { pos: [number, number, number]; size: number }[] = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      // arc across top half of the band
      const a = Math.PI - t * Math.PI;
      const x = Math.cos(a) * 1.0;
      const y = Math.sin(a) * 1.0;
      pts.push({ pos: [x, y, 0.18], size: 0.045 });
      pts.push({ pos: [x, y, -0.18], size: 0.045 });
    }
    return pts;
  }, []);

  useFrame((_, dt) => {
    if (spin && group.current) {
      group.current.rotation.y += dt * speed;
    }
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* The band */}
      <mesh castShadow receiveShadow rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.16, 64, 256]} />
        <meshStandardMaterial
          color={m.color}
          metalness={1}
          roughness={m.roughness}
          envMapIntensity={1.6}
        />
      </mesh>

      {/* Inner band detail (subtle hairline) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.165, 32, 128]} />
        <meshStandardMaterial
          color={m.color}
          metalness={1}
          roughness={m.roughness + 0.15}
          envMapIntensity={1.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Setting / crown beneath gem */}
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.34, 0.42, 0.22, 24]} />
        <meshStandardMaterial
          color={m.color}
          metalness={1}
          roughness={m.roughness}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Pavé diamonds along the band */}
      {pavePositions.map((p, i) => (
        <mesh key={`pave-${i}`} position={p.pos} scale={p.size}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.2}
            roughness={0.05}
            envMapIntensity={2.4}
          />
        </mesh>
      ))}

      {/* Prongs holding the gem */}
      {prongPositions.map((p, i) => (
        <mesh key={i} position={p}>
          <cylinderGeometry args={[0.035, 0.05, 0.35, 12]} />
          <meshStandardMaterial
            color={m.color}
            metalness={1}
            roughness={m.roughness}
            envMapIntensity={1.4}
          />
        </mesh>
      ))}

      {/* The gem — brilliant cut via octahedron */}
      <group position={[0, 0.62, 0]} rotation={[0, 0, 0]}>
        <mesh scale={[0.46, 0.62, 0.46]}>
          <octahedronGeometry args={[0.6, 0]} />
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={1.2}
            roughness={0}
            transmission={1}
            ior={2.4}
            chromaticAberration={0.06}
            anisotropy={0.3}
            distortion={0.08}
            distortionScale={0.4}
            color={gemColor}
            attenuationDistance={0.6}
            attenuationColor={gemColor}
          />
        </mesh>
        {/* Subtle gem sparkle (small bright sphere inside) */}
        <mesh scale={0.05}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}
