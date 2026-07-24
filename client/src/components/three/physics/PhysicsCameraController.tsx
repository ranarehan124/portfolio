import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface PhysicsCameraControllerProps {
  scrollProgress?: number;
}

export default function PhysicsCameraController({ scrollProgress = 0 }: PhysicsCameraControllerProps) {
  const { camera, pointer } = useThree();
  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  useFrame(() => {
    mouseTarget.current.x = pointer.x * 0.1;
    mouseTarget.current.y = pointer.y * 0.06;

    currentRotation.current.x = THREE.MathUtils.lerp(
      currentRotation.current.x,
      mouseTarget.current.y + Math.sin(Date.now() * 0.0003) * 0.015 + scrollProgress * 0.2,
      0.04,
    );
    currentRotation.current.y = THREE.MathUtils.lerp(
      currentRotation.current.y,
      mouseTarget.current.x + Math.cos(Date.now() * 0.00025) * 0.02 + scrollProgress * 0.15,
      0.04,
    );

    camera.rotation.x = currentRotation.current.x;
    camera.rotation.y = currentRotation.current.y;
  });

  return null;
}