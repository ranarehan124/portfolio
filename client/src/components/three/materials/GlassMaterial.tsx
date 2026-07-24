import { useMemo } from 'react';
import * as THREE from 'three';

export function useGlassMaterial(
  color = '#8B5CF6',
  opacity = 0.3,
  roughness = 0.05,
  metalness = 0.8,
  transmission = 0.9,
  ior = 1.5,
  thickness = 0.5,
): THREE.MeshPhysicalMaterial {
  return useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(color),
        roughness,
        metalness,
        transmission,
        ior,
        thickness,
        transparent: true,
        opacity,
        envMapIntensity: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        reflectivity: 0.9,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [color, opacity, roughness, metalness, transmission, ior, thickness],
  );
}

export default useGlassMaterial;