import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PhysicsSphere from './PhysicsSphere';

type SphereMaterialType = 'glass' | 'chrome' | 'purple-emissive' | 'transparent';

interface SphereConfig {
  position: [number, number, number];
  radius: number;
  material: SphereMaterialType;
}

export default function PhysicsSphereField() {
  const groupRef = useRef<THREE.Group>(null);

  const spheres: SphereConfig[] = useMemo(() => {
    const configs: SphereConfig[] = [];
    const materials: SphereMaterialType[] = [
      'glass', 'glass', 'glass', 'glass', 'glass', 'glass',
      'chrome', 'chrome', 'chrome', 'chrome',
      'purple-emissive', 'purple-emissive', 'purple-emissive', 'purple-emissive',
      'transparent', 'transparent', 'transparent', 'transparent',
    ];

    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };

    for (let i = 0; i < 18; i++) {
      const mat = materials[i] ?? 'glass';

      let radius: number;
      if (mat === 'glass') {
        radius = 0.15 + seededRandom(i * 7 + 1) * 0.25;
      } else if (mat === 'chrome') {
        radius = 0.12 + seededRandom(i * 7 + 2) * 0.2;
      } else if (mat === 'purple-emissive') {
        radius = 0.2 + seededRandom(i * 7 + 3) * 0.35;
      } else {
        radius = 0.25 + seededRandom(i * 7 + 4) * 0.4;
      }

      const spreadX = 5.5 - radius;
      const spreadY = 3.5;
      const x = (seededRandom(i * 13 + 5) - 0.5) * 2 * spreadX;
      const y = seededRandom(i * 17 + 6) * spreadY + radius + 0.5;
      const z = (seededRandom(i * 19 + 7) - 0.5) * 3;

      configs.push({
        position: [x, y, z],
        radius: Math.max(0.1, radius),
        material: mat,
      });
    }

    return configs;
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t * 0.05) * 0.03;
  });

  return (
    <group ref={groupRef}>
      {spheres.map((sphere, i) => (
        <PhysicsSphere
          key={`sphere-${i}`}
          position={sphere.position}
          radius={sphere.radius}
          material={sphere.material}
        />
      ))}
    </group>
  );
}