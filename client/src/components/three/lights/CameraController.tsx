import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useMouse } from '@/hooks';
import { lerp } from '@/utils/helpers';

export default function CameraController() {
  const { normalizedX, normalizedY } = useMouse();
  const mouseTarget = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });

  useFrame(({ camera, clock }) => {
    const time = clock.getElapsedTime();

    mouseTarget.current.x = normalizedX * 0.15;
    mouseTarget.current.y = normalizedY * 0.1;

    currentRotation.current.x = lerp(
      currentRotation.current.x,
      mouseTarget.current.y + Math.sin(time * 0.2) * 0.02,
      0.05,
    );
    currentRotation.current.y = lerp(
      currentRotation.current.y,
      mouseTarget.current.x + Math.cos(time * 0.15) * 0.03,
      0.05,
    );

    camera.rotation.x = currentRotation.current.x;
    camera.rotation.y = currentRotation.current.y;
  });

  return null;
}