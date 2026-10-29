import { ContactShadows, Float, PresentationControls, Sparkles } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * A stylised gold trophy (an original lathe-turned design with looping handles — not a replica of
 * any real trophy) on a royal-blue plinth. Drag to turn it; it slowly revolves on its own.
 */

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Trophy() {
  const spin = useRef<THREE.Group>(null);
  const gold = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#e0b64f', metalness: 1, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.6 }),
    [],
  );
  // The lathe is a single open surface, so the bowl needs both faces rendered.
  const goldDouble = useMemo(() => {
    const m = gold.clone();
    m.side = THREE.DoubleSide;
    return m;
  }, [gold]);
  const darkGold = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#a77d2c', metalness: 1, roughness: 0.3, envMapIntensity: 1.2 }), []);
  const lacquer = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0a3d91', metalness: 0.2, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.05 }), []);

  const cup = useMemo(() => {
    const pts = [
      [0, 0.6], [0.62, 0.6], [0.6, 0.7], [0.42, 0.78], [0.3, 0.95], [0.2, 1.2], [0.15, 1.55], [0.17, 1.7], [0.26, 1.78],
      [0.18, 1.86], [0.34, 1.92], [0.62, 2.08], [0.86, 2.34], [1.02, 2.68], [1.08, 3.02], [1.12, 3.24], [1.18, 3.3],
      [1.1, 3.31], [1.0, 3.12], [0.9, 2.78], [0.66, 2.42], [0.3, 2.2], [0, 2.14],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const g = new THREE.LatheGeometry(pts, 96);
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={spin} position={[0, -1.75, 0]}>
      {/* Plinth */}
      <mesh material={lacquer} position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.95, 1.05, 0.56, 64]} />
      </mesh>
      <mesh material={darkGold} position={[0, 0.58, 0]}>
        <torusGeometry args={[0.66, 0.035, 16, 96]} />
      </mesh>
      <mesh material={darkGold} position={[0, 0.03, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.03, 16, 96]} />
      </mesh>
      {/* Cup */}
      <mesh geometry={cup} material={goldDouble} />
      <mesh material={darkGold} position={[0, 2.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.96, 0.025, 12, 96]} />
      </mesh>
      {/* Looping handles */}
      {[1, -1].map((s) => (
        <mesh key={s} material={gold} position={[s * 0.98, 2.5, 0]} rotation={[0, 0, s > 0 ? -0.62 * Math.PI : 0.38 * Math.PI]}>
          <torusGeometry args={[0.62, 0.07, 24, 64, Math.PI * 1.24]} />
        </mesh>
      ))}
    </group>
  );
}

export default function TrophyStage() {
  return (
    <Canvas dpr={[1, 1.8]} camera={{ position: [0, 0.6, 7.2], fov: 34 }} gl={{ antialias: true, alpha: true }} onCreated={({ gl }) => {
      gl.toneMapping = THREE.ACESFilmicToneMapping;
      gl.toneMappingExposure = 1.15;
    }}>
      <Environment />
      <ambientLight intensity={0.25} />
      <spotLight position={[4, 8, 5]} angle={0.4} penumbra={0.8} intensity={180} color="#fff1d2" />
      <spotLight position={[-5, 4, -3]} angle={0.5} penumbra={1} intensity={120} color="#5b8fd6" />
      <pointLight position={[0, 1, 3]} intensity={6} color="#ffd98a" />
      <PresentationControls global={false} cursor snap rotation={[0.08, 0, 0]} polar={[-0.2, 0.3]} azimuth={[-Math.PI, Math.PI]} config={{ mass: 1.2, tension: 160 }}>
        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>
          <Trophy />
        </Float>
      </PresentationControls>
      <Sparkles count={70} scale={[5, 5, 4]} size={3.2} speed={0.35} color="#f1d58e" opacity={0.9} />
      <ContactShadows position={[0, -1.78, 0]} opacity={0.55} scale={6} blur={2.6} far={2.5} color="#000814" />
    </Canvas>
  );
}
