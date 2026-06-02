"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, Float, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function SpinningGem() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.35;
    ref.current.rotation.x += dt * 0.12;
  });
  return (
    <mesh ref={ref} scale={1.1}>
      <octahedronGeometry args={[1, 0]} />
      <MeshTransmissionMaterial
        backside
        samples={6}
        thickness={1.4}
        roughness={0}
        transmission={1}
        ior={2.4}
        chromaticAberration={0.08}
        color="#f3d77a"
        attenuationDistance={0.7}
        attenuationColor="#d4af37"
      />
    </mesh>
  );
}

export default function GemBackdrop() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 4], fov: 40 }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 3]} intensity={1.4} color="#fff1c4" />
      <pointLight position={[-3, -2, 2]} intensity={0.8} color="#d4af37" />

      <Suspense fallback={null}>
        <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
          <SpinningGem />
        </Float>
        <Sparkles count={40} size={2} scale={[4, 4, 4]} speed={0.4} color="#f3d77a" opacity={0.7} />
        <Environment preset="studio" environmentIntensity={1.1} />
      </Suspense>

      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom intensity={1.1} luminanceThreshold={0.55} luminanceSmoothing={0.4} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
