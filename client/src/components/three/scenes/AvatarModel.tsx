import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMouse } from '@/hooks';

// import.meta.env.BASE_URL automatically becomes "/portfolio/" in production
// and "/" in local dev — this fixes the old 404 issue permanently.
const MODEL_PATH = `${import.meta.env.BASE_URL}models/avatar.glb`;

export default function AvatarModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATH);
  const { normalizedX, normalizedY } = useMouse();
  const mouseRef = useRef({ x: 0, y: 0 });

  useFrame(() => {
    mouseRef.current.x = THREE.MathUtils.lerp(mouseRef.current.x, normalizedX, 0.05);
    mouseRef.current.y = THREE.MathUtils.lerp(mouseRef.current.y, normalizedY, 0.05);

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouseRef.current.x * 0.15,
        0.05,
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouseRef.current.y * 0.05,
        0.05,
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]} scale={2.5}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);