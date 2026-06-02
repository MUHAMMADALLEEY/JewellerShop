"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Float,
  Sparkles,
  PerspectiveCamera,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import HaloRing from "./HaloRing";
import OrbitalGems from "./OrbitalGems";

function ScrollDrift() {
  const ref = useRef<THREE.PerspectiveCamera>(null);
  useFrame(({ mouse, clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const tx = mouse.x * 0.4 + Math.sin(t * 0.2) * 0.06;
    const ty = 0.55 + mouse.y * 0.22 + Math.cos(t * 0.24) * 0.04;
    ref.current.position.x += (tx - ref.current.position.x) * 0.05;
    ref.current.position.y += (ty - ref.current.position.y) * 0.05;
    ref.current.lookAt(0, 0.45, 0);
  });
  return <PerspectiveCamera ref={ref} makeDefault position={[0, 0.55, 4.0]} fov={36} />;
}

export default function SignatureScene() {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <ScrollDrift />

      {/* Lights — slightly warmer, more dramatic than Hero */}
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.6}
        color="#fff1c4"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight position={[-5, 2, -3]} intensity={1.1} color="#d4af37" />
      <pointLight position={[0, -2, 3]} intensity={0.7} color="#ffd27a" />
      <pointLight position={[3, 2, -2]} intensity={0.6} color="#f3d77a" />
      <spotLight
        position={[0, 4, 2]}
        angle={0.4}
        penumbra={1}
        intensity={1.2}
        color="#fff7d6"
      />

      <Suspense fallback={null}>
        <Float speed={0.9} rotationIntensity={0.18} floatIntensity={0.45}>
          <HaloRing spin speed={0.22} />
        </Float>

        {/* Outer orbital gems at a wider radius */}
        <group position={[0, 0.4, 0]}>
          <OrbitalGems count={11} />
        </group>

        {/* Dense sparkle field */}
        <Sparkles
          count={110}
          size={2.6}
          scale={[7, 5, 7]}
          position={[0, 0.4, 0]}
          speed={0.4}
          color="#f3d77a"
          opacity={0.85}
        />

        <Environment preset="studio" environmentIntensity={1.05} />
      </Suspense>

      <ContactShadows
        position={[0, -1.4, 0]}
        opacity={0.55}
        scale={7}
        blur={2.8}
        far={3}
        color="#000000"
      />

      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom intensity={1.05} luminanceThreshold={0.55} luminanceSmoothing={0.4} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.78} />
      </EffectComposer>
    </Canvas>
  );
}
