import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
  count?: number;
  color?: string;
  size?: number;
  spread?: number;
  speed?: number;
}

export default function FloatingParticles({
  count = 80,
  color = '#8B5CF6',
  size = 2,
  spread = 8,
  speed = 0.3,
}: FloatingParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particleData = useMemo(() => {
    const data = Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 0.6,
      ),
      speed: Math.random() * speed + speed * 0.5,
      offset: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.5 + 0.5,
    }));
    return data;
  }, [count, spread, speed]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();

    for (let i = 0; i < particleData.length; i++) {
      const p = particleData[i]!;
      const t = time * p.speed + p.offset;

      dummy.position.set(
        p.position.x + Math.sin(t * 0.7) * 0.3,
        p.position.y + Math.sin(t) * 0.4,
        p.position.z + Math.cos(t * 0.5) * 0.2,
      );

      dummy.scale.setScalar(size * 0.01 * p.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.6}
        depthWrite={false}
      />
    </instancedMesh>
  );
}