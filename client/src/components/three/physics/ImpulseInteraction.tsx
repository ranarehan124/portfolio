import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { RapierRigidBody } from '@react-three/rapier';

interface ImpulseInteractionProps {
  strength?: number;
  radius?: number;
  bodies: React.RefObject<(RapierRigidBody | null)[]>;
}

export default function ImpulseInteraction({
  strength = 20,
  radius = 6,
  bodies,
}: ImpulseInteractionProps) {
  const { pointer, camera } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouseWorld = useRef(new THREE.Vector3());
  const prevMouseWorld = useRef(new THREE.Vector3());
  const mouseVelocity = useRef(new THREE.Vector3());

  useFrame(() => {
    raycaster.current.setFromCamera(pointer, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectPoint = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(plane, intersectPoint);

    if (intersectPoint) {
      prevMouseWorld.current.copy(mouseWorld.current);
      mouseWorld.current.copy(intersectPoint);
      mouseVelocity.current.subVectors(mouseWorld.current, prevMouseWorld.current).multiplyScalar(60);
    }

    if (!bodies.current) return;

    for (const body of bodies.current) {
      if (!body) continue;
      const pos = body.translation();
      const dx = mouseWorld.current.x - pos.x;
      const dy = mouseWorld.current.y - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius && dist > 0.1) {
        const factor = (1 - dist / radius) * strength * 0.016;
        const nx = dx / dist;
        const ny = dy / dist;

        body.applyImpulse(
          {
            x: -nx * factor + mouseVelocity.current.x * 0.02,
            y: -ny * factor * 0.5 + mouseVelocity.current.y * 0.02,
            z: 0,
          },
          true,
        );
      }
    }
  });

  return null;
}