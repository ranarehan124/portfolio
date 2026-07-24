import { useRef } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { RigidBody, BallCollider, type RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';

interface DraggableSphereProps {
  position: [number, number, number];
  radius: number;
  color: string;
  emissiveColor?: string;
  metalness?: number;
  roughness?: number;
  opacity?: number;
  isGlass?: boolean;
}

export default function DraggableSphere({
  position,
  radius,
  color,
  emissiveColor,
  metalness = 0.1,
  roughness = 0.05,
  opacity = 1,
  isGlass = false,
}: DraggableSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<RapierRigidBody>(null);
  const isDragging = useRef(false);
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const dragOffset = useRef(new THREE.Vector3());
  const pointerPos = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());

  useFrame(({ clock, pointer: currentPointer, camera }) => {
    pointerPos.current.set(currentPointer.x, currentPointer.y);

    if (!isDragging.current || !bodyRef.current) return;

    raycaster.current.setFromCamera(pointerPos.current, camera);
    const intersection = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(dragPlane.current, intersection);

    if (intersection) {
      const target = intersection.sub(dragOffset.current);
      const current = bodyRef.current.translation();
      const lerpFactor = 0.3;

      bodyRef.current.setNextKinematicTranslation({
        x: THREE.MathUtils.lerp(current.x, target.x, lerpFactor),
        y: THREE.MathUtils.lerp(current.y, target.y, lerpFactor),
        z: THREE.MathUtils.lerp(current.z, current.z, 1),
      });
    }

    if (emissiveColor && meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(clock.getElapsedTime() * 2) * 0.3;
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!bodyRef.current) return;

    isDragging.current = true;
    bodyRef.current.setBodyType('kinematicPosition' as never, true);
    bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    bodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

    const point = e.point;
    const bodyPos = bodyRef.current.translation();
    dragOffset.current.set(point.x - bodyPos.x, point.y - bodyPos.y, point.z - bodyPos.z);

    dragPlane.current.set(new THREE.Vector3(0, 0, 1), -bodyPos.z);
  };

  const handlePointerUp = () => {
    if (!bodyRef.current) return;
    isDragging.current = false;
    bodyRef.current.setBodyType('dynamic' as never, true);
  };

  const handlePointerLeave = () => {
    if (!isDragging.current || !bodyRef.current) return;
    isDragging.current = false;
    bodyRef.current.setBodyType('dynamic' as never, true);
  };

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      position={position}
      restitution={0.6}
      friction={0.3}
      linearDamping={0.8}
      angularDamping={0.85}
      gravityScale={1.0}
      lockRotations={false}
    >
      <BallCollider args={[radius]} />
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        {isGlass ? (
          <meshPhysicalMaterial
            color={color}
            metalness={metalness}
            roughness={roughness}
            opacity={opacity}
            transparent
            transmission={0.9}
            ior={1.5}
            clearcoat={1}
            clearcoatRoughness={0.05}
            envMapIntensity={1.8}
            depthWrite={false}
          />
        ) : (
          <meshStandardMaterial
            color={color}
            emissive={emissiveColor ?? color}
            emissiveIntensity={emissiveColor ? 0.5 : 0}
            metalness={metalness}
            roughness={roughness}
            opacity={opacity}
            transparent={opacity < 1}
            envMapIntensity={2.0}
          />
        )}
      </mesh>
    </RigidBody>
  );
}