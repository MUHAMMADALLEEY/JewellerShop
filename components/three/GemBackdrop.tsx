"use client";

import { Suspense, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, Float, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useCanvasActive } from "@/lib/useCanvasActive";
import { useScrollFactor, easeOutScroll } from "@/lib/useScrollFactor";

function SpinningGem({ scrollFactor }: { scrollFactor: MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const sp = easeOutScroll(scrollFactor.current);
    // Spin accelerates and the gem grows + tumbles as you scroll the section
    ref.current.rotation.y += dt * (0.35 + sp * 2.2);
    ref.current.rotation.x += dt * (0.12 + sp * 0.8);
    const s = 1.1 + sp * 0.6;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref} scale={1.1}>
      <octahedronGeometry args={[1, 0]} />
      <MeshTransmissionMaterial
        backside
        samples={4}
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
  const { ref, frameloop } = useCanvasActive();
  const scrollFactor = useScrollFactor(ref);

  return (
    <div ref={ref} className="absolute inset-0">
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 4], fov: 40 }}
        className="!absolute inset-0"
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 3]} intensity={1.4} color="#fff1c4" />
        <pointLight position={[-3, -2, 2]} intensity={0.8} color="#d4af37" />

        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
            <SpinningGem scrollFactor={scrollFactor} />
          </Float>
          <Sparkles count={24} size={2} scale={[4, 4, 4]} speed={0.4} color="#f3d77a" opacity={0.7} />
          <Environment preset="studio" environmentIntensity={1.1} />
        </Suspense>

        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom intensity={1.1} luminanceThreshold={0.55} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
