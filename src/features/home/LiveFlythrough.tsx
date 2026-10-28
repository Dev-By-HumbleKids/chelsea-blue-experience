import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { MotionValue } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { StadiumModel } from '@/features/stadium/StadiumModel';

/** Camera keyframes for the scroll fly-through: aerial London → over the Shed → down to pitchside. */
const POSITIONS = [
  [0, 170, 280],
  [130, 90, 150],
  [95, 38, 30],
  [30, 9, 12],
  [0, 2.4, -27],
].map((p) => new THREE.Vector3(...(p as [number, number, number])));

const TARGETS = [
  [0, 0, 0],
  [0, 4, 0],
  [0, 4, 0],
  [-40, 9, 0],
  [0, 12, 50],
].map((p) => new THREE.Vector3(...(p as [number, number, number])));

function Rig({ progress }: { progress: MotionValue<number> }) {
  const posCurve = useMemo(() => new THREE.CatmullRomCurve3(POSITIONS, false, 'centripetal'), []);
  const tgtCurve = useMemo(() => new THREE.CatmullRomCurve3(TARGETS, false, 'centripetal'), []);
  const smooth = useRef(0);
  const target = useRef(new THREE.Vector3());
  const { camera } = useThree();

  useFrame((state, delta) => {
    const p = THREE.MathUtils.clamp(progress.get(), 0, 1);
    smooth.current = THREE.MathUtils.damp(smooth.current, p, 4, delta);
    const t = smooth.current;
    camera.position.copy(posCurve.getPoint(t));
    // Gentle idle drift so the scene breathes even when the user stops scrolling.
    camera.position.x += Math.sin(state.clock.elapsedTime * 0.25) * (1 - t) * 6;
    target.current.copy(tgtCurve.getPoint(t));
    camera.lookAt(target.current);
  });
  return null;
}

export default function LiveFlythrough({ progress }: { progress: MotionValue<number> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Stop rendering when the hero is off-screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.6]}
        camera={{ fov: 42, near: 0.5, far: 1200, position: [0, 170, 280] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.25;
          scene.background = new THREE.Color('#040916');
          scene.fog = new THREE.Fog('#040916', 220, 620);
        }}
      >
        <StadiumModel />
        <Rig progress={progress} />
      </Canvas>
    </div>
  );
}
