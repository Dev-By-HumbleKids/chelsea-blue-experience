import { useMemo } from 'react';
import * as THREE from 'three';

/**
 * A stylised, procedurally-built Stamford Bridge: pitch, four stands (Matthew Harding north,
 * Shed End south, East and West sides), roofs, floodlight strips and a crowd of points.
 * Units are metres; the pitch is 103 × 67 and centred on the origin (x = length, z = width).
 * It is an illustration — not a survey-accurate model of the real stadium.
 */

export const PITCH = { length: 103, width: 67 };

function pitchTexture() {
  const c = document.createElement('canvas');
  c.width = 2048;
  c.height = 1332;
  const g = c.getContext('2d')!;
  const stripes = 16;
  for (let i = 0; i < stripes; i++) {
    g.fillStyle = i % 2 ? '#1f6b2e' : '#257a35';
    g.fillRect((i * c.width) / stripes, 0, c.width / stripes + 1, c.height);
  }
  const sx = c.width / 103;
  const sy = c.height / 67;
  g.strokeStyle = 'rgba(255,255,255,0.92)';
  g.lineWidth = 5;
  const m = 2 * sx;
  g.strokeRect(m, m, c.width - 2 * m, c.height - 2 * m);
  g.beginPath();
  g.moveTo(c.width / 2, m);
  g.lineTo(c.width / 2, c.height - m);
  g.stroke();
  g.beginPath();
  g.arc(c.width / 2, c.height / 2, 9.15 * sx, 0, Math.PI * 2);
  g.stroke();
  for (const side of [0, 1]) {
    const x0 = side ? c.width - m : m;
    const dir = side ? -1 : 1;
    g.strokeRect(Math.min(x0, x0 + dir * 16.5 * sx), c.height / 2 - 20.15 * sy, 16.5 * sx, 40.3 * sy);
    g.strokeRect(Math.min(x0, x0 + dir * 5.5 * sx), c.height / 2 - 9.16 * sy, 5.5 * sx, 18.32 * sy);
    g.beginPath();
    g.arc(x0 + dir * 11 * sx, c.height / 2, 9.15 * sx, side ? Math.PI * 0.705 : -Math.PI * 0.295, side ? Math.PI * 1.295 : Math.PI * 0.295);
    g.stroke();
    g.fillStyle = 'white';
    g.beginPath();
    g.arc(x0 + dir * 11 * sx, c.height / 2, 6, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = 'white';
  g.beginPath();
  g.arc(c.width / 2, c.height / 2, 7, 0, Math.PI * 2);
  g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function seatTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const g = c.getContext('2d')!;
  g.fillStyle = '#0a3f8c';
  g.fillRect(0, 0, 64, 64);
  g.fillStyle = '#0e4fa8';
  for (let y = 0; y < 64; y += 8) for (let x = 0; x < 64; x += 6) g.fillRect(x + 1, y + 2, 4, 4);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

interface StandSpec {
  id: string;
  /** Length along the pitch edge. */
  span: number;
  tiers: number;
  rise: number;
  run: number;
  /** Distance from pitch centre to the stand's front edge. */
  offset: number;
  angle: number;
  roofHeight: number;
}

const STANDS: StandSpec[] = [
  { id: 'west', span: 118, tiers: 14, rise: 1.9, run: 2.1, offset: 34 + 5, angle: 0, roofHeight: 33 },
  { id: 'east', span: 118, tiers: 11, rise: 1.8, run: 2.0, offset: 34 + 6, angle: Math.PI, roofHeight: 27 },
  { id: 'shed', span: 82, tiers: 11, rise: 1.8, run: 2.0, offset: 51.5 + 5, angle: Math.PI / 2, roofHeight: 25 },
  { id: 'matthew-harding', span: 82, tiers: 12, rise: 1.85, run: 2.0, offset: 51.5 + 5, angle: -Math.PI / 2, roofHeight: 27 },
];

function Stand({ spec, seatMap }: { spec: StandSpec; seatMap: THREE.Texture }) {
  const tex = useMemo(() => {
    const t = seatMap.clone();
    t.needsUpdate = true;
    t.repeat.set(spec.span / 3, 1);
    return t;
  }, [seatMap, spec.span]);
  const depth = spec.tiers * spec.run;
  const height = spec.tiers * spec.rise;
  return (
    <group rotation={[0, spec.angle, 0]}>
      <group position={[0, 0, spec.offset]}>
        {Array.from({ length: spec.tiers }).map((_, i) => (
          <mesh key={i} position={[0, (i + 1) * spec.rise * 0.5, i * spec.run + spec.run / 2]} receiveShadow>
            <boxGeometry args={[spec.span, (i + 1) * spec.rise, spec.run]} />
            <meshStandardMaterial map={tex} emissiveMap={tex} emissive="#3b6fd0" emissiveIntensity={0.35} roughness={0.85} metalness={0.05} />
          </mesh>
        ))}
        {/* Back wall */}
        <mesh position={[0, (height + 6) / 2, depth + 0.6]}>
          <boxGeometry args={[spec.span, height + 6, 1.2]} />
          <meshStandardMaterial color="#0b1a3a" roughness={0.9} />
        </mesh>
        {/* Roof */}
        <mesh position={[0, spec.roofHeight, depth / 2 + 2]} rotation={[-0.06, 0, 0]}>
          <boxGeometry args={[spec.span + 2, 0.8, depth + 8]} />
          <meshStandardMaterial color="#12224a" roughness={0.6} metalness={0.4} />
        </mesh>
        {/* Floodlight strip under the roof edge */}
        <mesh position={[0, spec.roofHeight - 0.6, -1.8]}>
          <boxGeometry args={[spec.span - 4, 0.35, 0.6]} />
          <meshBasicMaterial color="#e8f0ff" toneMapped={false} />
        </mesh>
        {/* Pitchside LED board */}
        <mesh position={[0, 0.6, -0.9]}>
          <boxGeometry args={[spec.span - 10, 1, 0.2]} />
          <meshBasicMaterial color="#1b5fd1" toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Crowd({ count = 9000 }: { count?: number }) {
  const geom = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [new THREE.Color('#2a6bc4'), new THREE.Color('#f5f2ea'), new THREE.Color('#0e4fa8'), new THREE.Color('#5b8fd6'), new THREE.Color('#c9a45c')];
    let n = 0;
    while (n < count) {
      const s = STANDS[n % STANDS.length];
      const tier = Math.floor(Math.random() * s.tiers);
      const u = (Math.random() - 0.5) * (s.span - 4);
      const z = s.offset + tier * s.run + s.run * 0.5;
      const y = (tier + 1) * s.rise + 0.55;
      const v = new THREE.Vector3(u, y, z).applyAxisAngle(new THREE.Vector3(0, 1, 0), s.angle);
      pos.set([v.x, v.y, v.z], n * 3);
      const c = palette[Math.random() < 0.55 ? 0 : Math.floor(Math.random() * palette.length)];
      col.set([c.r, c.g, c.b], n * 3);
      n++;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  }, [count]);
  return (
    <points geometry={geom}>
      <pointsMaterial size={0.55} vertexColors sizeAttenuation transparent opacity={0.9} />
    </points>
  );
}

function City() {
  const blocks = useMemo(() => {
    const out: { p: [number, number, number]; s: [number, number, number]; lit: number }[] = [];
    for (let i = 0; i < 70; i++) {
      const a = (i / 70) * Math.PI * 2 + Math.random() * 0.05;
      const r = 150 + Math.random() * 110;
      const h = 8 + Math.random() * 34;
      out.push({ p: [Math.cos(a) * r * 1.2, h / 2, Math.sin(a) * r], s: [8 + Math.random() * 14, h, 8 + Math.random() * 14], lit: Math.random() });
    }
    return out;
  }, []);
  return (
    <group>
      {blocks.map((b, i) => (
        <mesh key={i} position={b.p}>
          <boxGeometry args={b.s} />
          <meshBasicMaterial color={b.lit > 0.75 ? '#151d33' : '#080e1e'} />
        </mesh>
      ))}
    </group>
  );
}

export function StadiumModel({ crowd = true, city = true }: { crowd?: boolean; city?: boolean }) {
  const pitch = useMemo(pitchTexture, []);
  const seats = useMemo(seatTexture, []);
  return (
    <group>
      <hemisphereLight args={['#bcd3ff', '#0b1220', 0.55]} />
      <directionalLight position={[40, 90, 30]} intensity={1.1} color="#dfe8ff" />
      <pointLight position={[0, 40, 0]} intensity={1800} distance={160} color="#e9f1ff" />
      {/* Surrounds and pitch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[600, 600]} />
        <meshStandardMaterial color="#070d1d" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[118, 82]} />
        <meshStandardMaterial color="#1c5e28" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[PITCH.length, PITCH.width]} />
        <meshStandardMaterial map={pitch} emissiveMap={pitch} emissive="#ffffff" emissiveIntensity={0.28} roughness={0.95} />
      </mesh>
      {/* Goals */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (PITCH.length / 2 - 0.2), 0, 0]}>
          <mesh position={[0, 2.44, 0]}>
            <boxGeometry args={[0.15, 0.15, 7.32]} />
            <meshStandardMaterial color="white" />
          </mesh>
          {[-3.66, 3.66].map((z) => (
            <mesh key={z} position={[0, 1.22, z]}>
              <boxGeometry args={[0.15, 2.44, 0.15]} />
              <meshStandardMaterial color="white" />
            </mesh>
          ))}
        </group>
      ))}
      {/* Dugouts on the East side */}
      {[-8, 8].map((x) => (
        <mesh key={x} position={[x, 1, -(PITCH.width / 2 + 3)]}>
          <boxGeometry args={[9, 2, 2]} />
          <meshStandardMaterial color="#d9e2f2" transparent opacity={0.35} roughness={0.2} metalness={0.3} />
        </mesh>
      ))}
      {STANDS.map((s) => (
        <Stand key={s.id} spec={s} seatMap={seats} />
      ))}
      {crowd && <Crowd />}
      {city && <City />}
    </group>
  );
}
