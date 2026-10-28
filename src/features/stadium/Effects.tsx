import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';

/** Floodlight bloom and a soft vignette, shared by the hero fly-through and the stadium tour. */
export function Effects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.2} intensity={0.85} />
      <Vignette eskil={false} offset={0.25} darkness={0.55} />
    </EffectComposer>
  );
}
