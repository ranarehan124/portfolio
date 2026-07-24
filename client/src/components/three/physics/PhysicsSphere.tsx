import { useRef } from 'react';
import { RigidBody, BallCollider, type RapierRigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type SphereMaterialType = 'glass' | 'chrome' | 'purple-emissive' | 'transparent';

interface PhysicsSphereProps {
  position: [number, number, number];
  radius: number;
  material: SphereMaterialType;
}

const MATERIALS: Record<SphereMaterialType, { color: string; emissive?: string; metalness: number; roughness: number; opacity: number; transmission?: number; ior?: number }> = {
  glass: {
    color: '#c4b5fd',
    metalness: 0.1,
    roughness: 0.05,
    opacity: 0.35,
    transmission: 0.9,
    ior: 1.5,
  },
  chrome: {
    color: '#e0e0e0',
    metalness: 1.0,
    roughness: 0.05,
    opacity: 1.0,
  },
  'purple-emissive': {
    color: '#8B5CF6',
    emissive: '#8B5CF6',
    metalness: 0.3,
    roughness: 0.2,
    opacity: 0.85,
  },
  transparent: {
    color: '#60A5FA',
    metalness: 0.0,
    roughness: 0.0,
    opacity: 0.15,
    transmission: 0.95,
    ior: 1.45,
  },
};

export default function PhysicsSphere({ position, radius, material: materialType }: PhysicsSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<RapierRigidBody>(null);
  const mat = MATERIALS[materialType] ?? MATERIALS.glass;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    if (materialType === 'purple-emissive') {
      const intensity = 0.4 + Math.sin(t * 2 + position[0] * 10) * 0.3;
      (meshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }

    if (materialType === 'glass' || materialType === 'transparent') {
      const hueShift = Math.sin(t * 0.5 + position[0] * 5) * 0.05;
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity = mat.opacity + hueShift;
    }
  });

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      position={position}
      restitution={0.65}
      friction={0.3}
      linearDamping={0.85}
      angularDamping={0.9}
      gravityScale={1.2}
      enabledRotations={[true, true, true]}
      mass={radius * radius * radius * 2}
    >
      <BallCollider args={[radius]} />
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[radius, materialType === 'glass' || materialType === 'transparent' ? 32 : 24, 24]} />
        {materialType === 'glass' || materialType === 'transparent' ? (
          <meshPhysicalMaterial
            color={mat.color}
            metalness={mat.metalness}
            roughness={mat.roughness}
            opacity={mat.opacity}
            transparent
            transmission={mat.transmission ?? 0.9}
            ior={mat.ior ?? 1.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={1.5}
            depthWrite={false}
          />
        ) : materialType === 'chrome' ? (
          <meshStandardMaterial
            color={mat.color}
            metalness={mat.metalness}
            roughness={mat.roughness}
            opacity={mat.opacity}
            envMapIntensity={2.0}
          />
        ) : (
          <meshStandardMaterial
            color={mat.color}
            emissive={mat.emissive ?? mat.color}
            emissiveIntensity={0.5}
            metalness={mat.metalness}
            roughness={mat.roughness}
            opacity={mat.opacity}
            transparent={mat.opacity < 1}
          />
        )}
      </mesh>
    </RigidBody>
  );
}