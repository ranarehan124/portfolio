import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { SpotLight } from 'three';

export default function HeroLights() {
  const purpleLightRef = useRef<SpotLight>(null);
  const blueLightRef = useRef<SpotLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (purpleLightRef.current) {
      purpleLightRef.current.position.x = Math.sin(t * 0.3) * 2;
      purpleLightRef.current.position.z = Math.cos(t * 0.3) * 2;
    }

    if (blueLightRef.current) {
      blueLightRef.current.position.x = Math.cos(t * 0.25) * 2.5;
      blueLightRef.current.position.z = Math.sin(t * 0.25) * 1.5;
    }
  });

  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.15} color="#1a1a2e" />

      {/* Key light - soft white from front-top */}
      <directionalLight
        position={[2, 4, 5]}
        intensity={0.8}
        color="#e8e0ff"
        castShadow={false}
      />

      {/* Purple rim light - dramatic from behind-left */}
      <spotLight
        ref={purpleLightRef}
        position={[-3, 2, -3]}
        intensity={3}
        color="#8B5CF6"
        angle={0.5}
        penumbra={0.8}
        decay={2}
        distance={15}
      />

      {/* Blue fill light - from right side */}
      <spotLight
        ref={blueLightRef}
        position={[4, 1, 2]}
        intensity={2}
        color="#60A5FA"
        angle={0.6}
        penumbra={0.9}
        decay={2}
        distance={12}
      />

      {/* Subtle purple ground bounce */}
      <pointLight
        position={[0, -1, 2]}
        intensity={0.5}
        color="#8B5CF6"
        distance={6}
        decay={2}
      />

      {/* Cool top accent */}
      <pointLight
        position={[0, 5, 0]}
        intensity={0.3}
        color="#a78bfa"
        distance={10}
        decay={2}
      />
    </>
  );
}