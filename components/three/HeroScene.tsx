"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Float,
  PerspectiveCamera,
  Sparkles,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import Ring from "./Ring";
import OrbitalGems from "./OrbitalGems";
import { useCanvasActive } from "@/lib/useCanvasActive";

const CA_OFFSET = new THREE.Vector2(0.0008, 0.0008);
const SPARKLE_SCALE: [number, number, number] = [6, 4, 6];

function CameraDrift() {
  const ref = useRef<THREE.PerspectiveCamera>(null);
  // Allocate scratch vector once so useFrame doesn't churn the GC.
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0.4, 0), []);
  useFrame(({ mouse, clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const targetX = mouse.x * 0.25 + Math.sin(t * 0.18) * 0.05;
    const targetY = 0.6 + mouse.y * 0.18 + Math.cos(t * 0.22) * 0.04;
    ref.current.position.x += (targetX - ref.current.position.x) * 0.04;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.04;
    ref.current.lookAt(lookTarget);
  });
  return <PerspectiveCamera ref={ref} makeDefault position={[0, 0.6, 4.2]} fov={38} />;
}

export default function HeroScene() {
  const { ref, frameloop } = useCanvasActive();

  return (
    <div ref={ref} className="absolute inset-0">
      <Canvas
        frameloop={frameloop}
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="!absolute inset-0"
      >
        <CameraDrift />

        {/* Lights */}
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[5, 6, 4]}
          intensity={1.4}
          color="#fff1c4"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, 3, -4]} intensity={0.9} color="#d4af37" />
        <pointLight position={[0, -2, 2]} intensity={0.6} color="#ffd27a" />
        <pointLight position={[2, 1.5, 1]} intensity={0.5} color="#f3d77a" />

        <Suspense fallback={null}>
          <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
            <Ring spin speed={0.32} metal="gold" gem="diamond" />
          </Float>

          {/* Orbiting diamonds around the ring */}
          <OrbitalGems count={7} />

          {/* 3D sparkle dust around the scene */}
          <Sparkles
            count={40}
            size={2.2}
            scale={SPARKLE_SCALE}
            position={[0, 0.4, 0]}
            speed={0.3}
            color="#f3d77a"
            opacity={0.8}
          />

          <Environment preset="studio" environmentIntensity={0.95} />
        </Suspense>

        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.55}
          scale={6}
          blur={2.5}
          far={2.5}
          color="#000000"
        />

        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.62}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={CA_OFFSET}
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette eskil={false} offset={0.18} darkness={0.72} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
