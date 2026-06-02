"use client";

/**
 * GlobalScene — a fixed-viewport, full-page Three.js layer.
 *
 * Sits above all section backgrounds via `position: fixed` and
 * `mix-blend-mode: screen`, so only the bright gold pixels of the floating
 * gems show through, never darkening text or images.
 *
 * Camera flies through a tall field of drifting gold diamonds as the user
 * scrolls the page — making the whole document feel like one continuous 3D
 * experience instead of a list of separated sections.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

const GEM_COUNT = 44;

export default function GlobalScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    // Don't run on coarse-pointer devices where mix-blend perf is poor and
    // the effect is less rewarding; mobile gets the per-section scenes only.
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // ---------- Renderer ----------
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    // Fixed, full viewport, in front of section backgrounds but behind nav,
    // mix-blend: screen so only bright gold shows on top of dark page.
    renderer.domElement.style.cssText = [
      "position:fixed",
      "inset:0",
      "width:100%",
      "height:100%",
      "display:block",
      "pointer-events:none",
      "mix-blend-mode:screen",
      "z-index:4",
    ].join(";");
    mount.appendChild(renderer.domElement);

    // ---------- Scene + camera ----------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    camera.position.set(0, 0, 8);

    // ---------- Lights ----------
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));

    const key = new THREE.DirectionalLight(0xfff1c4, 1.4);
    key.position.set(4, 6, 5);
    scene.add(key);

    const rim = new THREE.PointLight(0xd4af37, 1.2);
    rim.position.set(-4, 2, -3);
    scene.add(rim);

    const warmFill = new THREE.PointLight(0xffd27a, 0.8);
    warmFill.position.set(0, -3, 2);
    scene.add(warmFill);

    // ---------- Floating gold gems ----------
    type Gem = {
      mesh: THREE.Mesh;
      originX: number;
      originY: number;
      originZ: number;
      tumbleSpeedX: number;
      tumbleSpeedY: number;
      driftSeed: number;
      driftAmp: number;
    };

    const gems: Gem[] = [];
    const gemGeo = new THREE.OctahedronGeometry(1, 0);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 1,
      roughness: 0.18,
      envMapIntensity: 1.5,
      emissive: 0x4a3a10,
      emissiveIntensity: 0.4,
    });
    const diamondMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      transmission: 1,
      thickness: 0.6,
      ior: 2.4,
      iridescence: 0.4,
      attenuationDistance: 0.6,
      attenuationColor: 0xfff7d6,
      emissive: 0xfff1c4,
      emissiveIntensity: 0.2,
    });

    // Distribute gems across a tall column matching the page height feel.
    // Y ranges from +12 (top of column) to about -32 (bottom).
    for (let i = 0; i < GEM_COUNT; i++) {
      // Mix of gold + diamond gems
      const isDiamond = i % 3 === 0;
      const mat = isDiamond ? diamondMat : goldMat;
      const mesh = new THREE.Mesh(gemGeo, mat);

      const x = (Math.random() - 0.5) * 16;
      const y = 12 - (i / GEM_COUNT) * 44 + (Math.random() - 0.5) * 1.5;
      const z = -2 - Math.random() * 6;
      const scale = 0.09 + Math.random() * 0.22;
      mesh.scale.setScalar(scale);
      mesh.position.set(x, y, z);

      gems.push({
        mesh,
        originX: x,
        originY: y,
        originZ: z,
        tumbleSpeedX: 0.2 + Math.random() * 0.5,
        tumbleSpeedY: 0.3 + Math.random() * 0.6,
        driftSeed: Math.random() * Math.PI * 2,
        driftAmp: 0.2 + Math.random() * 0.4,
      });
      scene.add(mesh);
    }

    // ---------- Postprocessing — gentle bloom on the gold ----------
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.7, // strength
      0.5, // radius
      0.5 // threshold
    );
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    // ---------- Mouse parallax ----------
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMouseMove);

    // ---------- Animation loop ----------
    const clock = new THREE.Clock();
    let rafId = 0;
    let running = true;
    let smoothScroll = 0;
    let camTargetX = 0;
    const lookTarget = new THREE.Vector3(0, 0, 0);

    const animate = () => {
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();

      // ---- Page scroll progress: 0 (top) → 1 (bottom of document) ----
      const docHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const target = Math.max(0, Math.min(1, window.scrollY / docHeight));
      smoothScroll += (target - smoothScroll) * 0.07;

      // Camera flies down through the gem column.
      // Y goes from 0 (top of page) to roughly -32 (bottom),
      // so the gems streaming past correspond to the user's scroll position.
      const camY = -smoothScroll * 32;

      // Mouse parallax on X + subtle scroll-driven X waver
      const tx = mouseX * 0.6 + Math.sin(t * 0.18) * 0.15;
      camTargetX += (tx - camTargetX) * 0.05;
      camera.position.x = camTargetX;
      camera.position.y = camY;
      // Z gently rocks back and forth so the field feels alive even at rest
      camera.position.z = 8 + Math.sin(t * 0.25) * 0.4 + mouseY * 0.3;

      // Look slightly into the field, biased by mouse
      lookTarget.set(camTargetX * 0.4, camY + mouseY * 0.5, 0);
      camera.lookAt(lookTarget);

      // ---- Tumble + drift each gem ----
      for (const g of gems) {
        g.mesh.rotation.y += dt * g.tumbleSpeedY;
        g.mesh.rotation.x += dt * g.tumbleSpeedX * 0.4;
        // Lazy horizontal drift around origin so the field isn't static
        g.mesh.position.x = g.originX + Math.sin(t * 0.25 + g.driftSeed) * g.driftAmp;
        g.mesh.position.z = g.originZ + Math.cos(t * 0.2 + g.driftSeed) * g.driftAmp * 0.5;
      }

      composer.render();
      if (running) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    // ---------- Resize ----------
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloom.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ---------- Pause on tab hidden ----------
    const onVisibility = () => {
      running = !document.hidden;
      if (running) rafId = requestAnimationFrame(animate);
      else cancelAnimationFrame(rafId);
    };
    document.addEventListener("visibilitychange", onVisibility);

    // ---------- Cleanup ----------
    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      gemGeo.dispose();
      goldMat.dispose();
      diamondMat.dispose();
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} aria-hidden />;
}
