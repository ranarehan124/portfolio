import { EffectComposer, Bloom, Vignette, ChromaticAberration, ToneMapping } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Vector2 } from 'three';

interface PhysicsPostProcessingProps {
  enabled?: boolean;
}

export default function PhysicsPostProcessing({ enabled = true }: PhysicsPostProcessingProps) {
  if (!enabled) return null;

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.0}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={0.65}
        blendFunction={BlendFunction.NORMAL}
      />
      <ChromaticAberration
        offset={new Vector2(0.0004, 0.0004)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={false}
        modulationOffset={0}
      />
      <ToneMapping />
    </EffectComposer>
  );
}