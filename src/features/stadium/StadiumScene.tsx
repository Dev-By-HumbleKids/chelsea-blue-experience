import { Html, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { TOUR_STOPS, type TourStop } from '@/data/stadium';
import { cx } from '@/lib/format';
import { Effects } from './Effects';
import { StadiumModel } from './StadiumModel';

/** Smoothly flies the camera and orbit target to the active stop, then hands control back to the user. */
function CameraDirector({ stop, controls }: { stop: TourStop; controls: React.RefObject<OrbitControlsImpl> }) {
  const { camera } = useThree();
  const flying = useRef(true);
  const pos = useRef(new THREE.Vector3());
  const tgt = useRef(new THREE.Vector3());

  useEffect(() => {
    pos.current.set(...stop.camera.pos);
    tgt.current.set(...stop.camera.target);
    flying.current = true;
  }, [stop]);

  useFrame((_, delta) => {
    const c = controls.current;
    if (!flying.current || !c) return;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pos.current.x, 2.6, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pos.current.y, 2.6, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, pos.current.z, 2.6, delta);
    c.target.x = THREE.MathUtils.damp(c.target.x, tgt.current.x, 2.6, delta);
    c.target.y = THREE.MathUtils.damp(c.target.y, tgt.current.y, 2.6, delta);
    c.target.z = THREE.MathUtils.damp(c.target.z, tgt.current.z, 2.6, delta);
    c.update();
    if (camera.position.distanceTo(pos.current) < 0.15 && c.target.distanceTo(tgt.current) < 0.15) flying.current = false;
  });

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const stopFlying = () => (flying.current = false);
    c.addEventListener('start', stopFlying);
    return () => c.removeEventListener('start', stopFlying);
  }, [controls]);

  return null;
}

function Hotspot({ stop, active, onSelect }: { stop: TourStop; active: boolean; onSelect: () => void }) {
  return (
    <Html position={stop.spot} center zIndexRange={[20, 0]}>
      <button
        type="button"
        onClick={onSelect}
        className={cx('group relative grid h-9 w-9 place-items-center rounded-full outline-none', active ? 'bg-gold text-midnight' : 'bg-midnight/80 text-ivory ring-1 ring-white/40 backdrop-blur')}
        aria-label={`Go to ${stop.name}`}
      >
        {!active && <span className="hotspot-ring absolute inset-0 rounded-full ring-2 ring-gold/70" aria-hidden />}
        <span className="text-[11px] font-bold">{TOUR_STOPS.indexOf(stop) + 1}</span>
        <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-midnight/90 px-3 py-1 text-[11px] font-semibold text-ivory opacity-0 ring-1 ring-white/10 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          {stop.name}
        </span>
      </button>
    </Html>
  );
}

export default function StadiumScene({ stop, onSelect }: { stop: TourStop; onSelect: (s: TourStop) => void }) {
  const controls = useRef<OrbitControlsImpl>(null);
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ fov: 45, near: 0.5, far: 2000, position: [0, 120, 220] }}
      gl={{ antialias: true }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
        scene.fog = new THREE.Fog('#4a6fb8', 380, 1100);
      }}
    >
      <StadiumModel crowd={false} />
      {TOUR_STOPS.map((s) => (
        <Hotspot key={s.id} stop={s} active={s.id === stop.id} onSelect={() => onSelect(s)} />
      ))}
      <OrbitControls ref={controls} enableDamping dampingFactor={0.08} minDistance={4} maxDistance={320} maxPolarAngle={Math.PI / 2.05} />
      <CameraDirector stop={stop} controls={controls} />
      <Effects />
    </Canvas>
  );
}
