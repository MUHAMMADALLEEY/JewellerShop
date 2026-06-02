"use client";

import { Suspense, useRef, useMemo, type MutableRefObject } from "react";
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
import { useCanvasActive } from "@/lib/useCanvasActive";
import { useScrollFactor, easeOutScroll } from "@/lib/useScrollFactor";

const ORBIT_OFFSET: [number, number, number] = [0, 0.4, 0];
const SPARKLE_SCALE: [number, number, number] = [7, 5, 7];

type ScrollProps = { scrollFactor: MutableRefObject<number> };

function ScrollDrift({ scrollFactor }: ScrollProps) {
  const ref = useRef<THREE.PerspectiveCamera>(null);
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0.45, 0), []);
  useFrame(({ mouse, clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const sp = easeOutScroll(scrollFactor.current);
    const tx = mouse.x * 0.4 + Math.sin(t * 0.2) * 0.06;
    // Scroll-driven dolly-in + tilt-up
    const ty = 0.55 + mouse.y * 0.22 + Math.cos(t * 0.24) * 0.04 + sp * 0.45;
    ref.current.position.x += (tx - ref.current.position.x) * 0.05;
    ref.current.position.y += (ty - ref.current.position.y) * 0.05;
    ref.current.position.z = 4.0 - sp * 1.2; // closer to the gem when in view
    lookTarget.y = 0.45 + sp * 0.25;
    ref.current.lookAt(lookTarget);
  });
  return <PerspectiveCamera ref={ref} makeDefault position={[0, 0.55, 4.0]} fov={36} />;
}

/** Scrolling the section spins + scales the halo ring. */
function ScrolledHaloRing({ scrollFactor }: ScrollProps) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (!groupRef.current) return;
    const sp = easeOutScroll(scrollFactor.current);
    groupRef.current.rotation.y += dt * (0.22 + sp * 1.8);
    groupRef.current.rotation.x = sp * 0.3;
    groupRef.current.scale.setScalar(1 + sp * 0.3);
  });
  return (
    <group ref={groupRef}>
      <Float speed={0.9} rotationIntensity={0.18} floatIntensity={0.45}>
        <HaloRing spin speed={0.22} />
      </Float>
    </group>
  );
}

export default function SignatureScene() {
  const { ref, frameloop } = useCanvasActive();
  const scrollFactor = useScrollFactor(ref);

  return (
    <div ref={ref} className="absolute inset-0">
      <Canvas
        frameloop={frameloop}
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="!absolute inset-0"
      >
        <ScrollDrift scrollFactor={scrollFactor} />

        {/* Lights — slightly warmer, more dramatic than Hero */}
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[4, 6, 5]}
          intensity={1.6}
          color="#fff1c4"
          castShadow
          shadow-mapSize={[1024, 1024]}
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
          <ScrolledHaloRing scrollFactor={scrollFactor} />

          {/* Outer orbital gems at a wider radius */}
          <group position={ORBIT_OFFSET}>
            <OrbitalGems count={8} />
          </group>

          {/* Sparkle field — leaner count, still dense feel */}
          <Sparkles
            count={60}
            size={2.4}
            scale={SPARKLE_SCALE}
            position={ORBIT_OFFSET}
            speed={0.35}
            color="#f3d77a"
            opacity={0.8}
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

        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom intensity={1} luminanceThreshold={0.58} luminanceSmoothing={0.4} mipmapBlur />
          <Vignette eskil={false} offset={0.2} darkness={0.78} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
