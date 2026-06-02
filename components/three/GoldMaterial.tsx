"use client";

import { MeshStandardMaterial } from "three";

export const goldMaterial = () =>
  new MeshStandardMaterial({
    color: "#d4af37",
    metalness: 1,
    roughness: 0.18,
    envMapIntensity: 1.6,
  });

export const goldRoseMaterial = () =>
  new MeshStandardMaterial({
    color: "#e0a890",
    metalness: 1,
    roughness: 0.22,
    envMapIntensity: 1.4,
  });

export const platinumMaterial = () =>
  new MeshStandardMaterial({
    color: "#e6e6ea",
    metalness: 1,
    roughness: 0.12,
    envMapIntensity: 1.7,
  });
