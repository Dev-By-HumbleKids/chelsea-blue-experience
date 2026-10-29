import { Canvas, useFrame, useThree } from '@react-three/fiber';
import type { MotionValue } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Effects } from '@/features/stadium/Effects';
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
    const time = state.clock.elapsedTime;
    camera.position.copy(posCurve.getPoint(t));
    // Handheld feel: slow drift plus a faint breathing bob, stronger high above the city.
    camera.position.x += Math.sin(time * 0.25) * (1 - t) * 6 + Math.sin(time * 1.3) * 0.08;
    camera.position.y += Math.sin(time * 0.9) * 0.12;
    target.current.copy(tgtCurve.getPoint(t));
    camera.lookAt(target.current);
    camera.rotateZ(Math.sin(time * 0.4) * 0.006 + (t - 0.5) * -0.02);
    // Dolly zoom as we arrive pitchside.
    const persp = camera as THREE.PerspectiveCamera;
    const fov = 42 - THREE.MathUtils.smoothstep(t, 0.72, 1) * 10;
    if (Math.abs(persp.fov - fov) > 0.01) {
      persp.fov = fov;
      persp.updateProjectionMatrix();
    }
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
        camera={{ fov: 42, near: 0.5, far: 2000, position: [0, 170, 280] }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
          scene.fog = new THREE.Fog('#4a6fb8', 380, 1100);
        }}
      >
        <StadiumModel />
        <Rig progress={progress} />
        <Effects />
      </Canvas>
    </div>
  );
}
