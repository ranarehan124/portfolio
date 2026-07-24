import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { SpotLight } from 'three';

export default function PhysicsLights() {
  const purpleSpotRef = useRef<SpotLight>(null);
  const blueSpotRef = useRef<SpotLight>(null);
  const rimLightRef = useRef<SpotLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (purpleSpotRef.current) {
      purpleSpotRef.current.position.x = Math.sin(t * 0.2) * 4;
      purpleSpotRef.current.position.z = Math.cos(t * 0.2) * 4;
    }
    if (blueSpotRef.current) {
      blueSpotRef.current.position.x = Math.cos(t * 0.15) * 5;
      blueSpotRef.current.position.z = Math.sin(t * 0.15) * 3;
    }
    if (rimLightRef.current) {
      rimLightRef.current.position.x = Math.sin(t * 0.25 + 2) * 3;
      rimLightRef.current.position.z = Math.cos(t * 0.25 + 2) * 3;
    }
  });

  return (
    <>
      <ambientLight intensity={0.12} color="#1a1a2e" />
      <directionalLight
        position={[3, 5, 4]}
        intensity={0.6}
        color="#e8e0ff"
        castShadow={false}
      />
      <spotLight
        ref={purpleSpotRef}
        position={[-4, 3, -3]}
        intensity={4}
        color="#8B5CF6"
        angle={0.5}
        penumbra={0.8}
        decay={2}
        distance={20}
      />
      <spotLight
        ref={blueSpotRef}
        position={[5, 2, 3]}
        intensity={2.5}
        color="#60A5FA"
        angle={0.6}
        penumbra={0.9}
        decay={2}
        distance={15}
      />
      <spotLight
        ref={rimLightRef}
        position={[0, 4, -5]}
        intensity={3}
        color="#a78bfa"
        angle={0.4}
        penumbra={0.7}
        decay={2}
        distance={18}
      />
      <pointLight position={[0, -2, 3]} intensity={0.4} color="#8B5CF6" distance={8} decay={2} />
      <pointLight position={[0, 6, 0]} intensity={0.25} color="#60A5FA" distance={12} decay={2} />
    </>
  );
}