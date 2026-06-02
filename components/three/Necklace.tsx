"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function Necklace({ spin = true, speed = 0.25 }: { spin?: boolean; speed?: number }) {
  const group = useRef<THREE.Group>(null);

  const chainCurve = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const segments = 80;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const a = (t - 0.5) * Math.PI * 1.05;
      const x = Math.sin(a) * 1.1;
      // U-shape: dip in the middle
      const y = -Math.cos(a) * 0.9 + 0.65 - Math.pow(Math.abs(t - 0.5) * 2, 2.4) * 0.18;
      pts.push(new THREE.Vector3(x, y, 0));
    }
    return new THREE.CatmullRomCurve3(pts, false);
  }, []);

  useFrame((_, dt) => {
    if (spin && group.current) {
      group.current.rotation.y += dt * speed;
    }
  });

  return (
    <group ref={group}>
      {/* Chain — tube along curve */}
      <mesh>
        <tubeGeometry args={[chainCurve, 200, 0.025, 12, false]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.22} envMapIntensity={1.6} />
      </mesh>

      {/* Chain beads — small spheres along curve */}
      {Array.from({ length: 40 }).map((_, i) => {
        const t = i / 39;
        const p = chainCurve.getPointAt(t);
        return (
          <mesh key={i} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[0.038, 12, 12]} />
            <meshStandardMaterial
              color="#d4af37"
              metalness={1}
              roughness={0.2}
              envMapIntensity={1.6}
            />
          </mesh>
        );
      })}

      {/* Pendant frame */}
      <mesh position={[0, -0.78, 0]}>
        <torusGeometry args={[0.18, 0.025, 16, 64]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.18} envMapIntensity={1.6} />
      </mesh>

      {/* Pendant gem */}
      <mesh position={[0, -0.78, 0]} rotation={[0, 0, 0]} scale={[0.26, 0.32, 0.26]}>
        <octahedronGeometry args={[0.6, 0]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={1}
          roughness={0}
          transmission={1}
          ior={2.4}
          chromaticAberration={0.06}
          color="#ffffff"
          attenuationDistance={0.7}
        />
      </mesh>
    </group>
  );
}
