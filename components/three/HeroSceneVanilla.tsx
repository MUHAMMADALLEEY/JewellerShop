"use client";

/**
 * Vanilla Three.js port of HeroScene.tsx.
 *
 * No @react-three/fiber, no @react-three/drei, no @react-three/postprocessing.
 * Just `three` and the helpers shipped under `three/examples/jsm/*`.
 *
 * Mounts a single <div ref={mountRef}> and imperatively builds the scene
 * inside a useEffect. All Three.js resources are disposed on unmount.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export default function HeroSceneVanilla() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ---------- Renderer ----------
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.domElement.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;display:block;";
    mount.appendChild(renderer.domElement);

    // ---------- Scene ----------
    const scene = new THREE.Scene();

    // ---------- Camera ----------
    const camera = new THREE.PerspectiveCamera(
      38,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.6, 4.2);

    // ---------- Environment (HDR-ish reflections from RoomEnvironment) ----------
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    const envTexture = pmrem.fromScene(envScene, 0.04).texture;
    scene.environment = envTexture;

    // ---------- Lights ----------
    const ambient = new THREE.AmbientLight(0xffffff, 0.25);

    const keyLight = new THREE.DirectionalLight(0xfff1c4, 1.4);
    keyLight.position.set(5, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;

    const rimLight = new THREE.DirectionalLight(0xd4af37, 0.9);
    rimLight.position.set(-5, 3, -4);

    const fillLight1 = new THREE.PointLight(0xffd27a, 0.6);
    fillLight1.position.set(0, -2, 2);

    const fillLight2 = new THREE.PointLight(0xf3d77a, 0.5);
    fillLight2.position.set(2, 1.5, 1);

    scene.add(ambient, keyLight, rimLight, fillLight1, fillLight2);

    // ---------- The ring ----------
    const ringGroup = new THREE.Group();

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 1,
      roughness: 0.18,
      envMapIntensity: 1.6,
    });

    // Band — torus rotated to lie flat
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.16, 64, 256),
      goldMaterial
    );
    band.rotation.x = Math.PI / 2;
    band.castShadow = true;
    ringGroup.add(band);

    // Crown — tapered cylinder under the gem
    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.42, 0.22, 24),
      goldMaterial
    );
    crown.position.y = 0.18;
    crown.castShadow = true;
    ringGroup.add(crown);

    // 6 prongs holding the gem
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const prong = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.05, 0.35, 12),
        goldMaterial
      );
      prong.position.set(Math.cos(a) * 0.34, 0.46, Math.sin(a) * 0.34);
      ringGroup.add(prong);
    }

    // Pavé — 28 tiny diamonds on each side of the band's top arc
    const paveMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.2,
      roughness: 0.05,
      envMapIntensity: 2.4,
    });
    const paveGeo = new THREE.OctahedronGeometry(1, 0);
    for (let i = 0; i < 28; i++) {
      const t = i / 27;
      const a = Math.PI - t * Math.PI;
      const x = Math.cos(a);
      const y = Math.sin(a);
      const pFront = new THREE.Mesh(paveGeo, paveMaterial);
      pFront.scale.setScalar(0.045);
      pFront.position.set(x, y, 0.18);
      const pBack = pFront.clone();
      pBack.position.set(x, y, -0.18);
      ringGroup.add(pFront, pBack);
    }

    // Centre stone — Three.js's MeshPhysicalMaterial with transmission gives
    // the same glass/diamond look that drei's MeshTransmissionMaterial
    // wraps around. Less control, but standard and fast.
    const diamondMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0,
      transmission: 1,
      thickness: 1.2,
      ior: 2.4,
      iridescence: 0.3,
      iridescenceIOR: 1.5,
      attenuationColor: 0xffffff,
      attenuationDistance: 0.6,
      envMapIntensity: 1.4,
    });
    const diamond = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.6, 0),
      diamondMaterial
    );
    diamond.scale.set(0.46, 0.62, 0.46);
    diamond.position.y = 0.62;
    ringGroup.add(diamond);

    // Sparkle core — tiny bright sphere inside the gem
    const sparkleCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    sparkleCore.position.y = 0.62;
    ringGroup.add(sparkleCore);

    scene.add(ringGroup);

    // ---------- Orbital gems (replacing drei's <OrbitalGems> + <Sparkles>) ----------
    type Orbital = {
      mesh: THREE.Mesh;
      radius: number;
      speed: number;
      phase: number;
      yOffset: number;
    };
    const orbitals: Orbital[] = [];
    const orbitalGeo = new THREE.OctahedronGeometry(1, 0);
    for (let i = 0; i < 7; i++) {
      const mat = diamondMaterial.clone();
      mat.attenuationColor = new THREE.Color(0xf3d77a);
      const mesh = new THREE.Mesh(orbitalGeo, mat);
      const size = 0.06 + Math.random() * 0.07;
      mesh.scale.setScalar(size);
      orbitals.push({
        mesh,
        radius: 1.6 + (i % 3) * 0.45 + Math.random() * 0.2,
        speed: 0.18 + Math.random() * 0.18,
        phase: (i / 7) * Math.PI * 2 + Math.random() * 0.6,
        yOffset: (Math.random() - 0.5) * 0.4,
      });
      scene.add(mesh);
    }

    // Sparkles — 40 small white points drifting in a 6x4x6 box
    const sparkleCount = 40;
    const sparklePositions = new Float32Array(sparkleCount * 3);
    const sparkleSeeds = new Float32Array(sparkleCount);
    for (let i = 0; i < sparkleCount; i++) {
      sparklePositions[i * 3] = (Math.random() - 0.5) * 6;
      sparklePositions[i * 3 + 1] = (Math.random() - 0.5) * 4 + 0.4;
      sparklePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
      sparkleSeeds[i] = Math.random() * Math.PI * 2;
    }
    const sparkleGeo = new THREE.BufferGeometry();
    sparkleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(sparklePositions, 3)
    );
    const sparkleMat = new THREE.PointsMaterial({
      color: 0xf3d77a,
      size: 0.04,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const sparklePoints = new THREE.Points(sparkleGeo, sparkleMat);
    scene.add(sparklePoints);

    // ---------- Contact shadow (just a soft circle decal under the ring) ----------
    const shadowTexture = createSoftShadowTexture();
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      shadowMat
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.2;
    scene.add(shadowPlane);

    // ---------- Postprocessing: Bloom ----------
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    composer.setSize(mount.clientWidth, mount.clientHeight);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(mount.clientWidth, mount.clientHeight),
      0.9, // strength
      0.4, // radius
      0.62 // threshold
    );
    composer.addPass(bloom);
    composer.addPass(new OutputPass());

    // ---------- Mouse tracking for camera drift ----------
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMouseMove);

    // ---------- Scroll tracking — drives ring/camera/bloom ----------
    // Progress is 0 when the hero fills the viewport (page at top) and 1
    // when the hero has fully scrolled past. Read inside RAF, not on every
    // scroll event, to avoid layout thrash and to play nicely with Lenis.
    let scrollProgress = 0;
    const readScroll = () => {
      const rect = mount.getBoundingClientRect();
      // -rect.top / rect.height gives 0 → 1 across the hero scroll-out
      const p = -rect.top / Math.max(rect.height, 1);
      scrollProgress = Math.max(0, Math.min(1, p));
    };

    // ---------- Animation loop ----------
    const clock = new THREE.Clock();
    let rafId = 0;
    let running = true;
    let camDriftX = 0;
    let camDriftY = 0.6;
    // Lerped scroll value so jumps are smoothed; lookTarget moves with scroll
    let smoothScroll = 0;
    const lookTarget = new THREE.Vector3(0, 0.4, 0);
    // Easing helper — ease-out so most action happens near the start of scroll
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 2.4);

    const animate = () => {
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();

      // Pull fresh scroll progress and smooth it
      readScroll();
      smoothScroll += (scrollProgress - smoothScroll) * 0.12;
      const sp = easeOut(smoothScroll); // 0 → 1, eased

      // Ring spin — big boost so the ring is clearly accelerating.
      // Without scroll: ~0.3 rad/s · scroll at full: ~5 rad/s (≈ 0.8 turns/s)
      ringGroup.rotation.y += dt * (0.32 + sp * 4.8);

      // Whole ring tilts forward and SCALES UP into the camera as you scroll,
      // so even brief scrolls feel responsive
      ringGroup.position.y = Math.sin(t * 1.2) * 0.1 - sp * 0.4;
      ringGroup.rotation.x = Math.sin(t * 0.8) * 0.08 + sp * 1.1;
      ringGroup.rotation.z = Math.cos(t * 0.7) * 0.05 + sp * 0.5;
      const scrollScale = 1 + sp * 0.45;
      ringGroup.scale.setScalar(scrollScale);

      // Orbital gems
      for (const o of orbitals) {
        const a = t * o.speed + o.phase;
        o.mesh.position.x = Math.cos(a) * o.radius;
        o.mesh.position.z = Math.sin(a) * o.radius;
        o.mesh.position.y =
          o.yOffset + Math.sin(a * 1.4) * 0.18 + Math.cos(t * 0.6 + o.phase) * 0.05;
        o.mesh.rotation.x = a * 1.2;
        o.mesh.rotation.y = a;
      }

      // Sparkle drift — vertical bob via position attribute
      const positions = sparkleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < sparkleCount; i++) {
        positions[i * 3 + 1] += Math.sin(t * 0.5 + sparkleSeeds[i]) * 0.001;
      }
      sparkleGeo.attributes.position.needsUpdate = true;

      // Camera — mouse drift + scroll-driven dolly-in.
      // Z pulls *closer* (4.2 → 2.6) so the gem fills frame, Y rises
      const tx = mouseX * 0.25 + Math.sin(t * 0.18) * 0.05;
      const ty = 0.6 + mouseY * 0.18 + Math.cos(t * 0.22) * 0.04 + sp * 0.5;
      camDriftX += (tx - camDriftX) * 0.04;
      camDriftY += (ty - camDriftY) * 0.04;
      camera.position.x = camDriftX;
      camera.position.y = camDriftY;
      camera.position.z = 4.2 - sp * 1.6;
      // Look target rises with scroll, focusing on the gem at the top
      lookTarget.y = 0.4 + sp * 0.3;
      camera.lookAt(lookTarget);

      // Bloom *intensifies* as you scroll — the gem flares brighter
      bloom.strength = 0.9 + sp * 1.2;

      composer.render();
      if (running) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    // ---------- Resize ----------
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloom.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ---------- Pause when tab hidden ----------
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

      // Dispose geometries
      ringGroup.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          (obj as THREE.Mesh).geometry.dispose();
        }
      });
      sparkleGeo.dispose();
      orbitalGeo.dispose();
      shadowPlane.geometry.dispose();

      // Dispose materials
      goldMaterial.dispose();
      paveMaterial.dispose();
      diamondMaterial.dispose();
      sparkleMat.dispose();
      shadowMat.dispose();
      orbitals.forEach((o) => (o.mesh.material as THREE.Material).dispose());

      // Dispose textures
      envTexture.dispose();
      shadowTexture.dispose();

      // Dispose helpers
      pmrem.dispose();
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}

/** Generate a soft radial shadow texture in a canvas — used as a contact-shadow decal. */
function createSoftShadowTexture(): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
  g.addColorStop(0, "rgba(0,0,0,0.85)");
  g.addColorStop(0.4, "rgba(0,0,0,0.4)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  return tex;
}
