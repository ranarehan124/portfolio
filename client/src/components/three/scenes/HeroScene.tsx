import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, SoftShadows, Preload } from '@react-three/drei';
import AvatarModel from './AvatarModel';
import HeroLights from '@three/lights/HeroLights';
import CameraController from '@three/lights/CameraController';
import FloatingParticles from '@three/effects/FloatingParticles';
import PostProcessing from '@three/effects/PostProcessing';

interface HeroSceneProps {
  isMobile?: boolean;
}

export default function HeroScene({ isMobile = false }: HeroSceneProps) {
  return (
    <Canvas
      className="!absolute inset-0"
      camera={{ position: [0, 0.8, 4], fov: 35 }}
      dpr={isMobile ? [1, 1] : [1, 1.25]}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      style={{ pointerEvents: 'none' }}
      performance={{ min: 0.3 }}
    >
      {!isMobile && <SoftShadows size={20} samples={6} focus={0.5} />}
      <CameraController />
      <HeroLights />

      <Suspense fallback={null}>
        <AvatarModel />
        <Environment preset="night" />
        {!isMobile && (
          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.4}
            scale={8}
            blur={2}
            far={4}
            color="#8B5CF6"
          />
        )}
        <Preload all />
      </Suspense>

      <FloatingParticles
        count={isMobile ? 12 : 40}
        color="#8B5CF6"
        size={2.5}
        spread={8}
        speed={0.2}
      />
      {!isMobile && (
        <FloatingParticles count={20} color="#60A5FA" size={1.5} spread={6} speed={0.15} />
      )}

      {!isMobile && <PostProcessing />}

      <fog attach="fog" args={['#050505', 6, 15]} />
    </Canvas>
  );
}