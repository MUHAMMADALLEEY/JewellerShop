"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Ring from "./Ring";
import Necklace from "./Necklace";
import Earring from "./Earring";

export type ViewerPiece = "ring-diamond" | "ring-emerald" | "necklace" | "earring";

const piecePresets: Record<
  ViewerPiece,
  { camera: [number, number, number]; fov: number }
> = {
  "ring-diamond": { camera: [0, 0.4, 3.6], fov: 38 },
  "ring-emerald": { camera: [0, 0.4, 3.6], fov: 38 },
  necklace: { camera: [0, 0.0, 4.4], fov: 42 },
  earring: { camera: [0, 0.0, 3.4], fov: 40 },
};

function Piece({ piece }: { piece: ViewerPiece }) {
  switch (piece) {
    case "ring-diamond":
      return <Ring spin={false} metal="gold" gem="diamond" />;
    case "ring-emerald":
      return <Ring spin={false} metal="gold" gem="emerald" />;
    case "necklace":
      return <Necklace spin={false} />;
    case "earring":
      return <Earring spin={false} />;
  }
}

export default function ProductViewer({ piece }: { piece: ViewerPiece }) {
  const preset = piecePresets[piece];
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <PerspectiveCamera makeDefault position={preset.camera} fov={preset.fov} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 5, 3]} intensity={1.3} color="#fff1c4" />
      <directionalLight position={[-4, 2, -3]} intensity={0.7} color="#d4af37" />
      <pointLight position={[0, -2, 2]} intensity={0.5} color="#ffd27a" />

      <Suspense fallback={null}>
        <Piece piece={piece} />
        <Environment preset="studio" environmentIntensity={1} />
      </Suspense>

      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.45}
        scale={5}
        blur={2.5}
        far={2.5}
        color="#000000"
      />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2.2}
        maxDistance={6}
        autoRotate
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.6}
      />

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.7}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
