import { useFrame } from '@react-three/fiber';
import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * A stylised, procedurally-built Stamford Bridge. Units are metres; the pitch is 103 × 67 and centred
 * on the origin (x = length, z = width). Matthew Harding Stand at −x, Shed End at +x, West Stand at +z
 * (the largest, three levels with boxes), East Stand at −z (tunnel and dugouts).
 *
 * Each stand is described by raked seating tiers. Seats are drawn into canvas textures, including white
 * seat lettering like the real stands; executive-box bands, cantilever roofs with trusses, floodlight
 * strips, corner infills, big screens, LED boards and clad facades complete the bowl.
 * It is an illustration — not a survey-accurate model.
 */

export const PITCH = { length: 103, width: 67 };

interface Tier {
  rows: number;
  rise: number;
  run: number;
  /** Height of the first row. */
  y: number;
  /** Distance of the first row from the stand's front edge. */
  d: number;
}

interface StandSpec {
  id: string;
  span: number;
  /** Distance from pitch centre to the stand's front edge. */
  offset: number;
  angle: number;
  tiers: Tier[];
  roofY: number;
  lettering?: { tier: number; text: string };
}

const STANDS: StandSpec[] = [
  {
    id: 'west', span: 116, offset: 39, angle: 0, roofY: 33,
    tiers: [
      { rows: 18, rise: 0.4, run: 0.8, y: 1.3, d: 0 },
      { rows: 9, rise: 0.48, run: 0.85, y: 12, d: 13 },
      { rows: 16, rise: 0.56, run: 0.85, y: 19.5, d: 18 },
    ],
    lettering: { tier: 2, text: 'CHELSEA FOOTBALL CLUB' },
  },
  {
    id: 'east', span: 116, offset: 40, angle: Math.PI, roofY: 31,
    tiers: [
      { rows: 16, rise: 0.4, run: 0.8, y: 1.3, d: 0 },
      { rows: 10, rise: 0.48, run: 0.85, y: 11, d: 11 },
      { rows: 14, rise: 0.56, run: 0.85, y: 18.5, d: 17 },
    ],
    lettering: { tier: 0, text: 'CHELSEA FOOTBALL CLUB' },
  },
  {
    id: 'shed', span: 80, offset: 56.5, angle: Math.PI / 2, roofY: 25,
    tiers: [
      { rows: 20, rise: 0.4, run: 0.8, y: 1.3, d: 0 },
      { rows: 12, rise: 0.52, run: 0.85, y: 12, d: 13 },
    ],
    lettering: { tier: 1, text: 'CHELSEA' },
  },
  {
    id: 'matthew-harding', span: 80, offset: 56.5, angle: -Math.PI / 2, roofY: 28,
    tiers: [
      { rows: 20, rise: 0.4, run: 0.8, y: 1.3, d: 0 },
      { rows: 18, rise: 0.52, run: 0.85, y: 12.5, d: 13 },
    ],
    lettering: { tier: 1, text: 'CHELSEA FC' },
  },
];

const tierEnd = (t: Tier) => ({ y: t.y + t.rows * t.rise, d: t.d + t.rows * t.run });
const standDepth = (s: StandSpec) => Math.max(...s.tiers.map((t) => tierEnd(t).d)) + 2;

// ---- Textures ---------------------------------------------------------------------------

function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, repeat = false) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Rows of blue seats; seats covered by `text` are painted white, like real stand lettering. */
function seatTexture(span: number, rows: number, text?: string) {
  const seatW = 0.5;
  const cols = Math.round(span / seatW);
  const cw = 6;
  const rh = 10;
  // Rasterise the lettering onto a seat-sized grid first.
  let mask: Uint8ClampedArray | null = null;
  if (text) {
    const m = document.createElement('canvas');
    m.width = cols;
    m.height = rows;
    const g = m.getContext('2d')!;
    g.fillStyle = '#000';
    g.fillRect(0, 0, cols, rows);
    g.fillStyle = '#fff';
    const size = Math.floor(rows * 0.82);
    g.font = `900 ${size}px Arial, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const width = g.measureText(text).width;
    const scale = Math.min(1, (cols * 0.86) / width);
    g.save();
    g.translate(cols / 2, rows / 2);
    g.scale(scale, 1);
    g.fillText(text, 0, 1);
    g.restore();
    mask = g.getImageData(0, 0, cols, rows).data;
  }
  return canvasTexture(cols * cw, rows * rh, (g) => {
    g.fillStyle = '#071634';
    g.fillRect(0, 0, cols * cw, rows * rh);
    for (let r = 0; r < rows; r++) {
      // Canvas y=0 maps to the back row, which is the top of the text as seen from the pitch.
      const row = r;
      for (let c = 0; c < cols; c++) {
        const white = mask ? mask[(row * cols + c) * 4] > 110 : false;
        const shade = 0.88 + Math.random() * 0.12;
        g.fillStyle = white ? `rgba(240,244,252,${shade})` : `rgb(${Math.round(10 * shade)},${Math.round(72 * shade)},${Math.round(170 * shade)})`;
        g.fillRect(c * cw + 1, r * rh + 2, cw - 2, rh - 4);
        g.fillStyle = white ? 'rgba(200,210,230,0.9)' : 'rgba(18,92,200,0.9)';
        g.fillRect(c * cw + 1, r * rh + 2, cw - 2, 2);
      }
    }
  });
}

function facadeTexture() {
  return canvasTexture(512, 256, (g) => {
    g.fillStyle = '#c9d2e0';
    g.fillRect(0, 0, 512, 256);
    for (let x = 0; x < 512; x += 16) {
      g.fillStyle = x % 32 ? '#b4bfd0' : '#dde4ee';
      g.fillRect(x, 0, 6, 256);
    }
    g.fillStyle = '#034694';
    g.fillRect(0, 150, 512, 30);
    for (let x = 6; x < 512; x += 24) {
      g.fillStyle = Math.random() > 0.35 ? '#f6d79a' : '#2a3550';
      g.fillRect(x, 200, 12, 18);
      g.fillStyle = Math.random() > 0.5 ? '#f6d79a' : '#2a3550';
      g.fillRect(x, 60, 12, 18);
    }
  }, true);
}

function boxesTexture() {
  return canvasTexture(512, 64, (g) => {
    g.fillStyle = '#0d1a33';
    g.fillRect(0, 0, 512, 64);
    for (let x = 4; x < 512; x += 32) {
      g.fillStyle = Math.random() > 0.25 ? '#ffd9a0' : '#3b4a6b';
      g.fillRect(x, 14, 26, 34);
    }
  }, true);
}

function ledTexture(text: string) {
  return canvasTexture(1024, 64, (g) => {
    const grad = g.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0, '#0a3fa0');
    grad.addColorStop(0.5, '#1b63e0');
    grad.addColorStop(1, '#0a3fa0');
    g.fillStyle = grad;
    g.fillRect(0, 0, 1024, 64);
    g.fillStyle = '#ffffff';
    g.font = '900 38px Arial, sans-serif';
    g.textBaseline = 'middle';
    let x = 10;
    while (x < 1024) {
      g.fillText(text, x, 34);
      x += g.measureText(text).width + 40;
    }
  }, true);
}

function screenTexture() {
  return canvasTexture(512, 256, (g) => {
    const grad = g.createLinearGradient(0, 0, 512, 256);
    grad.addColorStop(0, '#0a2f7a');
    grad.addColorStop(1, '#034694');
    g.fillStyle = grad;
    g.fillRect(0, 0, 512, 256);
    g.fillStyle = '#ffffff';
    g.textAlign = 'center';
    g.font = '900 64px Arial, sans-serif';
    g.fillText('LONDON', 256, 100);
    g.fillStyle = '#e2c88e';
    g.fillText('IS BLUE', 256, 176);
  });
}

/** Night-time street grid: dark blocks, lit roads. */
function groundTexture() {
  const t = canvasTexture(256, 256, (g) => {
    g.fillStyle = '#161e33';
    g.fillRect(0, 0, 256, 256);
    g.fillStyle = '#212a45';
    for (let i = 0; i < 256; i += 64) {
      g.fillRect(i, 0, 6, 256);
      g.fillRect(0, i, 256, 6);
    }
    g.fillStyle = 'rgba(246,210,140,0.4)';
    for (let i = 0; i < 256; i += 64) for (let j = 4; j < 256; j += 16) {
      g.fillRect(i + 2, j, 2, 2);
      g.fillRect(j, i + 2, 2, 2);
    }
  }, true);
  t.repeat.set(40, 40);
  return t;
}

function pitchTexture() {
  return canvasTexture(2048, 1332, (g) => {
    const W = 2048;
    const H = 1332;
    const stripes = 18;
    for (let i = 0; i < stripes; i++) {
      g.fillStyle = i % 2 ? '#2a8a3c' : '#319a45';
      g.fillRect((i * W) / stripes, 0, W / stripes + 1, H);
    }
    // Subtle cross-mowing.
    for (let j = 0; j < 12; j++) {
      g.fillStyle = j % 2 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.025)';
      g.fillRect(0, (j * H) / 12, W, H / 12 + 1);
    }
    const sx = W / 103;
    const sy = H / 67;
    g.strokeStyle = 'rgba(255,255,255,0.95)';
    g.lineWidth = 5;
    const m = 2 * sx;
    g.strokeRect(m, m, W - 2 * m, H - 2 * m);
    g.beginPath();
    g.moveTo(W / 2, m);
    g.lineTo(W / 2, H - m);
    g.stroke();
    g.beginPath();
    g.arc(W / 2, H / 2, 9.15 * sx, 0, Math.PI * 2);
    g.stroke();
    for (const side of [0, 1]) {
      const x0 = side ? W - m : m;
      const dir = side ? -1 : 1;
      g.strokeRect(Math.min(x0, x0 + dir * 16.5 * sx), H / 2 - 20.15 * sy, 16.5 * sx, 40.3 * sy);
      g.strokeRect(Math.min(x0, x0 + dir * 5.5 * sx), H / 2 - 9.16 * sy, 5.5 * sx, 18.32 * sy);
      g.beginPath();
      g.arc(x0 + dir * 11 * sx, H / 2, 9.15 * sx, side ? Math.PI * 0.705 : -Math.PI * 0.295, side ? Math.PI * 1.295 : Math.PI * 0.295);
      g.stroke();
      g.fillStyle = 'white';
      g.beginPath();
      g.arc(x0 + dir * 11 * sx, H / 2, 6, 0, Math.PI * 2);
      g.fill();
    }
    g.fillStyle = 'white';
    g.beginPath();
    g.arc(W / 2, H / 2, 7, 0, Math.PI * 2);
    g.fill();
  });
}

function glowTexture() {
  return canvasTexture(64, 64, (g) => {
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.25, 'rgba(220,235,255,0.6)');
    grad.addColorStop(1, 'rgba(180,210,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
  });
}

// ---- Geometry helpers -------------------------------------------------------------------

/** A quad from four points (counter-clockwise from bottom-left), with UVs 0..1. */
function quad(a: number[], b: number[], c: number[], d: number[], uRepeat = 1) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c, ...d], 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, uRepeat, 0, uRepeat, 1, 0, 1], 2));
  g.setIndex([0, 1, 2, 0, 2, 3]);
  g.computeVertexNormals();
  return g;
}

function Stand({ spec, facade, boxes, glow }: { spec: StandSpec; facade: THREE.Texture; boxes: THREE.Texture; glow: THREE.Texture }) {
  const s = spec.span / 2;
  const depth = standDepth(spec);
  const seats = useMemo(() => spec.tiers.map((t, i) => seatTexture(spec.span, t.rows, spec.lettering?.tier === i ? spec.lettering.text : undefined)), [spec]);

  const profile = useMemo(() => {
    // Side gable outline in (d, y): ground → front → each tier → roof → back.
    const pts: [number, number][] = [[0, 0], [0, spec.tiers[0].y]];
    for (const t of spec.tiers) {
      const e = tierEnd(t);
      pts.push([t.d, t.y], [e.d, e.y]);
    }
    pts.push([depth, spec.roofY], [depth, 0]);
    const shape = new THREE.Shape(pts.map(([d, y]) => new THREE.Vector2(d, y)));
    return new THREE.ShapeGeometry(shape);
  }, [spec, depth]);

  const lights = useMemo(() => {
    const out: number[] = [];
    for (let x = -s + 4; x <= s - 4; x += 7) out.push(x);
    return out;
  }, [s]);

  return (
    <group rotation={[0, spec.angle, 0]}>
      <group position={[0, 0, spec.offset]}>
        {spec.tiers.map((t, i) => {
          const e = tierEnd(t);
          return (
            <group key={i}>
              {/* Raked seating */}
              <mesh geometry={quad([s, t.y, t.d], [-s, t.y, t.d], [-s, e.y, e.d], [s, e.y, e.d])}>
                <meshStandardMaterial map={seats[i]} roughness={0.8} side={THREE.DoubleSide} />
              </mesh>
              {/* Front fascia under the first row */}
              <mesh geometry={quad([-s, t.y - (i === 0 ? t.y : 2.2), t.d - 0.05], [s, t.y - (i === 0 ? t.y : 2.2), t.d - 0.05], [s, t.y, t.d - 0.05], [-s, t.y, t.d - 0.05])}>
                <meshStandardMaterial color={i === 0 ? '#0a2a66' : '#e8edf5'} roughness={0.5} side={THREE.DoubleSide} />
              </mesh>
              {/* Executive boxes between tiers */}
              {i > 0 && (
                <mesh geometry={quad([-s, tierEnd(spec.tiers[i - 1]).y, tierEnd(spec.tiers[i - 1]).d + 0.4], [s, tierEnd(spec.tiers[i - 1]).y, tierEnd(spec.tiers[i - 1]).d + 0.4], [s, t.y - 2.2, tierEnd(spec.tiers[i - 1]).d + 0.4], [-s, t.y - 2.2, tierEnd(spec.tiers[i - 1]).d + 0.4], spec.span / 16)}>
                  <meshStandardMaterial map={boxes} emissiveMap={boxes} emissive="#ffffff" emissiveIntensity={0.9} side={THREE.DoubleSide} />
                </mesh>
              )}
            </group>
          );
        })}

        {/* Gable ends */}
        {[-s, s].map((x) => (
          <mesh key={x} geometry={profile} position={[x, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <meshStandardMaterial color="#c3ccda" roughness={0.6} side={THREE.DoubleSide} />
          </mesh>
        ))}

        {/* Outer facade */}
        <mesh geometry={quad([s, 0, depth], [-s, 0, depth], [-s, spec.roofY, depth], [s, spec.roofY, depth], spec.span / 24)}>
          <meshStandardMaterial map={facade} emissiveMap={facade} emissive="#ffffff" emissiveIntensity={0.12} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>

        {/* Cantilever roof, trusses and front fascia */}
        <mesh geometry={quad([-s - 1, spec.roofY, -5], [s + 1, spec.roofY, -5], [s + 1, spec.roofY + 2.5, depth + 1], [-s - 1, spec.roofY + 2.5, depth + 1])}>
          <meshStandardMaterial color="#dfe5ee" roughness={0.45} metalness={0.3} side={THREE.DoubleSide} />
        </mesh>
        {Array.from({ length: Math.floor(spec.span / 12) + 1 }, (_, k) => -s + k * 12).map((x) => (
          <mesh key={x} position={[x, spec.roofY + 2.2, depth / 2 - 2]} rotation={[-Math.atan2(2.5, depth + 6), 0, 0]}>
            <boxGeometry args={[0.6, 2.4, depth + 6]} />
            <meshStandardMaterial color="#f4f6fa" roughness={0.4} metalness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, spec.roofY - 0.6, -5]}>
          <boxGeometry args={[spec.span + 2, 1.6, 0.6]} />
          <meshStandardMaterial color="#f2f5fa" roughness={0.35} metalness={0.5} />
        </mesh>
        {/* Floodlight strip + halos */}
        <mesh position={[0, spec.roofY - 1.6, -4.8]}>
          <boxGeometry args={[spec.span - 4, 0.35, 0.4]} />
          <meshBasicMaterial color={[3, 3, 3.4]} toneMapped={false} />
        </mesh>
        {lights.map((x) => (
          <sprite key={x} position={[x, spec.roofY - 1.8, -5.6]} scale={[6, 6, 1]}>
            <spriteMaterial map={glow} color="#dfe9ff" transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.7} />
          </sprite>
        ))}
      </group>
    </group>
  );
}

function CornerStand({ sx, sz, screen, screenTex }: { sx: number; sz: number; screen?: boolean; screenTex: THREE.Texture }) {
  const angle = Math.atan2(sx, sz);
  const tex = useMemo(() => seatTexture(26, 22), []);
  const t: Tier = { rows: 22, rise: 0.42, run: 0.8, y: 1.3, d: 0 };
  const e = tierEnd(t);
  return (
    <group position={[sx * 56, 0, sz * 39]} rotation={[0, angle, 0]}>
      <group position={[0, 0, 4]}>
        <mesh geometry={quad([13, t.y, t.d], [-13, t.y, t.d], [-13, e.y, e.d], [13, e.y, e.d])}>
          <meshStandardMaterial map={tex} roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
        <mesh geometry={quad([13, 0, e.d + 1], [-13, 0, e.d + 1], [-13, 20, e.d + 1], [13, 20, e.d + 1])}>
          <meshStandardMaterial color="#c3ccda" side={THREE.DoubleSide} />
        </mesh>
        {screen && (
          <group position={[0, e.y + 7, e.d - 2]} rotation={[-0.12, Math.PI, 0]}>
            <mesh>
              <planeGeometry args={[16, 8]} />
              <meshBasicMaterial map={screenTex} color={[1.6, 1.6, 1.6]} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, -0.3]}>
              <boxGeometry args={[17, 9, 0.5]} />
              <meshStandardMaterial color="#111827" />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
}

function Crowd({ fill = 0.72 }: { fill?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const { matrices, colors, count } = useMemo(() => {
    const palette = [
      new THREE.Color('#1550b8'), new THREE.Color('#1550b8'), new THREE.Color('#1550b8'), new THREE.Color('#0d3f99'),
      new THREE.Color('#f2f4f8'), new THREE.Color('#1d2333'), new THREE.Color('#c9a45c'), new THREE.Color('#9c2b2b'),
    ];
    const m: THREE.Matrix4[] = [];
    const c: THREE.Color[] = [];
    const tmp = new THREE.Object3D();
    const up = new THREE.Vector3(0, 1, 0);
    for (const s of STANDS) {
      for (const t of s.tiers) {
        for (let r = 0; r < t.rows; r++) {
          for (let u = -s.span / 2 + 0.6; u < s.span / 2 - 0.6; u += 0.8) {
            if (Math.random() > fill) continue;
            const local = new THREE.Vector3(u + (Math.random() - 0.5) * 0.15, t.y + r * t.rise + 0.45, s.offset + t.d + r * t.run + t.run * 0.45);
            local.applyAxisAngle(up, s.angle);
            tmp.position.copy(local);
            tmp.rotation.set(0, s.angle, 0);
            tmp.scale.setScalar(0.9 + Math.random() * 0.2);
            tmp.updateMatrix();
            m.push(tmp.matrix.clone());
            c.push(palette[Math.floor(Math.random() * palette.length)]);
          }
        }
      }
    }
    return { matrices: m, colors: c, count: m.length };
  }, [fill]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    matrices.forEach((mat, i) => {
      mesh.setMatrixAt(i, mat);
      mesh.setColorAt(i, colors[i]);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [matrices, colors]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.42, 0.8, 0.34]} />
      <meshStandardMaterial roughness={0.9} />
    </instancedMesh>
  );
}

function LedBoards() {
  const tex = useMemo(() => ledTexture('LONDON IS BLUE  •  CHELSEA FC  •  STAMFORD BRIDGE  •'), []);
  const boards: { pos: [number, number, number]; rot: number; len: number }[] = [
    { pos: [0, 0.5, 37], rot: Math.PI, len: 100 },
    { pos: [0, 0.5, -37.5], rot: 0, len: 100 },
    { pos: [54.5, 0.5, 0], rot: -Math.PI / 2, len: 70 },
    { pos: [-54.5, 0.5, 0], rot: Math.PI / 2, len: 70 },
  ];
  return (
    <>
      {boards.map((b, i) => {
        const t = tex.clone();
        t.needsUpdate = true;
        t.repeat.set(b.len / 30, 1);
        return (
          <mesh key={i} position={b.pos} rotation={[0, b.rot, 0]}>
            <planeGeometry args={[b.len, 1]} />
            <meshBasicMaterial map={t} color={[1.4, 1.4, 1.4]} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </>
  );
}

function City() {
  const tex = useMemo(
    () =>
      canvasTexture(64, 128, (g) => {
        g.fillStyle = '#1a2440';
        g.fillRect(0, 0, 64, 128);
        for (let y = 6; y < 128; y += 10) for (let x = 4; x < 64; x += 10) {
          g.fillStyle = Math.random() > 0.55 ? '#f3cf8a' : '#26324f';
          g.fillRect(x, y, 5, 6);
        }
      }, true),
    [],
  );
  const blocks = useMemo(() => {
    const out: { p: [number, number, number]; s: [number, number, number] }[] = [];
    // Dense, mostly low-rise west London blocks with the occasional tower.
    for (let i = 0; i < 260; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 115 + Math.pow(Math.random(), 0.7) * 260;
      const x = Math.cos(a) * r * 1.2;
      const z = Math.sin(a) * r;
      if (Math.abs(x) < 105 && Math.abs(z) < 90) continue;
      const tower = Math.random() < 0.07;
      const h = tower ? 40 + Math.random() * 45 : 8 + Math.random() * 16;
      out.push({ p: [x, h / 2, z], s: [8 + Math.random() * 14, h, 8 + Math.random() * 14] });
    }
    return out;
  }, []);
  return (
    <group>
      {blocks.map((b, i) => (
        <mesh key={i} position={b.p}>
          <boxGeometry args={b.s} />
          <meshStandardMaterial map={tex} emissiveMap={tex} emissive="#ffffff" emissiveIntensity={0.55} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/** Dusk sky dome: deep royal overhead fading to a lit blue horizon. */
function Sky() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { top: { value: new THREE.Color('#0b1f52') }, mid: { value: new THREE.Color('#1f4a9c') }, horizon: { value: new THREE.Color('#6d8fd0') } },
        vertexShader: 'varying vec3 vPos; void main(){ vPos = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader:
          'uniform vec3 top; uniform vec3 mid; uniform vec3 horizon; varying vec3 vPos; void main(){ float h = clamp(vPos.y, 0.0, 1.0); vec3 c = mix(horizon, mid, smoothstep(0.0, 0.18, h)); c = mix(c, top, smoothstep(0.18, 0.7, h)); gl_FragColor = vec4(c, 1.0); }',
      }),
    [],
  );
  return (
    <mesh material={mat} renderOrder={-1}>
      <sphereGeometry args={[1500, 32, 16]} />
    </mesh>
  );
}

/** Volumetric floodlight beams: additive cones from the roof fronts down onto the pitch, gently breathing. */
function Beams() {
  const group = useRef<THREE.Group>(null);
  const tex = useMemo(
    () =>
      canvasTexture(4, 256, (g) => {
        const grad = g.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0, 'rgba(255,255,255,0.95)');
        grad.addColorStop(0.35, 'rgba(210,228,255,0.35)');
        grad.addColorStop(1, 'rgba(180,210,255,0)');
        g.fillStyle = grad;
        g.fillRect(0, 0, 4, 256);
      }),
    [],
  );
  const beams = useMemo(() => {
    const out: { pos: THREE.Vector3; quat: THREE.Quaternion; len: number; radius: number }[] = [];
    const up = new THREE.Vector3(0, 1, 0);
    for (const s of STANDS) {
      const n = s.span > 100 ? 4 : 3;
      for (let k = 0; k < n; k++) {
        const u = -s.span / 2 + ((k + 0.5) * s.span) / n;
        const light = new THREE.Vector3(u, s.roofY - 1.6, s.offset - 5).applyAxisAngle(up, s.angle);
        const target = new THREE.Vector3(u * 0.55, 0, s.offset * 0.15).applyAxisAngle(up, s.angle);
        const dir = light.clone().sub(target);
        const len = dir.length();
        out.push({
          pos: light.clone().add(target).multiplyScalar(0.5),
          quat: new THREE.Quaternion().setFromUnitVectors(up, dir.normalize()),
          len,
          radius: 9 + (k % 2) * 3,
        });
      }
    }
    return out;
  }, []);
  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    g.children.forEach((m, i) => {
      const mat = (m as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = 0.075 + Math.sin(clock.elapsedTime * 0.6 + i * 1.7) * 0.025;
    });
  });
  return (
    <group ref={group}>
      {beams.map((b, i) => (
        <mesh key={i} position={b.pos} quaternion={b.quat} renderOrder={2}>
          <coneGeometry args={[b.radius, b.len, 32, 1, true]} />
          <meshBasicMaterial map={tex} color="#dbe8ff" transparent opacity={0.08} depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

export function StadiumModel({ crowd = true, city = true, beams = true }: { crowd?: boolean; city?: boolean; beams?: boolean }) {
  const pitch = useMemo(pitchTexture, []);
  const facade = useMemo(facadeTexture, []);
  const boxes = useMemo(boxesTexture, []);
  const glow = useMemo(glowTexture, []);
  const screen = useMemo(screenTexture, []);
  const ground = useMemo(groundTexture, []);
  return (
    <group>
      <Sky />
      <hemisphereLight args={['#c9dbff', '#1b2a4a', 1.1]} />
      <directionalLight position={[60, 120, 40]} intensity={1.4} color="#eef3ff" />
      <directionalLight position={[-80, 60, -60]} intensity={0.5} color="#9fb8ff" />
      <pointLight position={[0, 45, 0]} intensity={4000} distance={200} color="#f1f6ff" />

      {/* Ground, surround and pitch */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[1600, 1600]} />
        <meshStandardMaterial map={ground} emissiveMap={ground} emissive="#ffffff" emissiveIntensity={0.35} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[116, 82]} />
        <meshStandardMaterial color="#25803a" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <planeGeometry args={[PITCH.length, PITCH.width]} />
        <meshStandardMaterial map={pitch} emissiveMap={pitch} emissive="#ffffff" emissiveIntensity={0.18} roughness={0.95} />
      </mesh>

      {/* Goals with nets */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (PITCH.length / 2 - 0.1), 0, 0]}>
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
          <mesh position={[s * 1, 1.22, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[7.32, 2.44]} />
            <meshStandardMaterial color="white" transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* Dugouts and tunnel on the East side */}
      {[-9, 9].map((x) => (
        <mesh key={x} position={[x, 1.1, -(PITCH.width / 2 + 3.2)]}>
          <boxGeometry args={[10, 2.2, 2.4]} />
          <meshPhysicalMaterial color="#cfd9ea" transparent opacity={0.45} roughness={0.1} metalness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 1.4, -(PITCH.width / 2 + 4)]}>
        <boxGeometry args={[5, 2.8, 4]} />
        <meshStandardMaterial color="#f4f6fa" roughness={0.4} />
      </mesh>

      <LedBoards />
      {STANDS.map((s) => (
        <Stand key={s.id} spec={s} facade={facade} boxes={boxes} glow={glow} />
      ))}
      <CornerStand sx={1} sz={1} screenTex={screen} screen />
      <CornerStand sx={-1} sz={-1} screenTex={screen} screen />
      <CornerStand sx={1} sz={-1} screenTex={screen} />
      <CornerStand sx={-1} sz={1} screenTex={screen} />
      {crowd && <Crowd />}
      {beams && <Beams />}
      {city && <City />}
    </group>
  );
}
