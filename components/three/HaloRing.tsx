"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * The Arshad Signature — a halo solitaire with an eternity band beneath it.
 * Procedurally generated, no GLB required.
 */
export default function HaloRing({
  spin = true,
  speed = 0.25,
}: {
  spin?: boolean;
  speed?: number;
}) {
  const group = useRef<THREE.Group>(null);

  // Halo diamonds — 14 small brilliants around the centre stone
  const haloDiamonds = useMemo(() => {
    const pts: { pos: [number, number, number]; rot: [number, number, number] }[] = [];
    const count = 14;
    const radius = 0.42;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      pts.push({
        pos: [Math.cos(a) * radius, 0.55, Math.sin(a) * radius],
        rot: [Math.PI / 6, a, 0],
      });
    }
    return pts;
  }, []);

  // Eternity band diamonds — small diamonds set into the lower band
  const eternityDiamonds = useMemo(() => {
    const pts: { pos: [number, number, number] }[] = [];
    const count = 20;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      pts.push({ pos: [Math.cos(a) * 1.0, -0.32, Math.sin(a) * 1.0] });
    }
    return pts;
  }, []);

  // Crown prongs (4 prongs holding centre stone)
  const prongPositions = useMemo(() => {
    const pts: [number, number, number][] = [];
    const r = 0.2;
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      pts.push([Math.cos(a) * r, 0.55, Math.sin(a) * r]);
    }
    return pts;
  }, []);

  useFrame((_, dt) => {
    if (spin && group.current) {
      group.current.rotation.y += dt * speed;
    }
  });

  return (
    <group ref={group}>
      {/* Main band — wider and more dramatic */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <torusGeometry args={[1, 0.18, 64, 256]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={1}
          roughness={0.16}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Inner band hairline */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <torusGeometry args={[1, 0.183, 32, 128]} />
        <meshStandardMaterial
          color="#b8943a"
          metalness={1}
          roughness={0.3}
          envMapIntensity={1.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Eternity band below — thinner band with diamonds */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.32, 0]}>
        <torusGeometry args={[1, 0.07, 32, 128]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={1}
          roughness={0.2}
          envMapIntensity={1.6}
        />
      </mesh>

      {/* Eternity band diamonds */}
      {eternityDiamonds.map((d, i) => (
        <mesh key={`eternity-${i}`} position={d.pos} scale={0.055}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.2}
            roughness={0.04}
            envMapIntensity={2.6}
          />
        </mesh>
      ))}

      {/* Crown — wider cushion-shaped setting beneath gem */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.32, 0.45, 0.18, 8]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={1}
          roughness={0.18}
          envMapIntensity={1.6}
        />
      </mesh>

      {/* Halo plate — flat gold ring holding the halo diamonds */}
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.05, 16, 64]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={1}
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Halo diamonds */}
      {haloDiamonds.map((d, i) => (
        <mesh key={`halo-${i}`} position={d.pos} rotation={d.rot} scale={0.09}>
          <octahedronGeometry args={[1, 0]} />
          <MeshTransmissionMaterial
            samples={3}
            thickness={0.4}
            roughness={0}
            transmission={1}
            ior={2.4}
            chromaticAberration={0.05}
            color="#ffffff"
            attenuationDistance={0.5}
          />
        </mesh>
      ))}

      {/* Prongs holding centre stone */}
      {prongPositions.map((p, i) => (
        <mesh key={`prong-${i}`} position={p}>
          <cylinderGeometry args={[0.04, 0.06, 0.42, 12]} />
          <meshStandardMaterial
            color="#d4af37"
            metalness={1}
            roughness={0.18}
            envMapIntensity={1.5}
          />
        </mesh>
      ))}

      {/* CENTRE STONE — large brilliant */}
      <group position={[0, 0.78, 0]}>
        {/* upper crown of brilliant */}
        <mesh scale={[0.6, 0.45, 0.6]}>
          <octahedronGeometry args={[0.6, 0]} />
          <MeshTransmissionMaterial
            backside
            samples={5}
            thickness={1.6}
            roughness={0}
            transmission={1}
            ior={2.42}
            chromaticAberration={0.08}
            anisotropy={0.3}
            distortion={0.08}
            distortionScale={0.4}
            color="#ffffff"
            attenuationDistance={0.5}
            attenuationColor="#ffffff"
          />
        </mesh>
        {/* sparkle core */}
        <mesh scale={0.05}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}
