import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sparkles, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

// ─── Camera keyframes ─────────────────────────────────────────────────────────
const CAM_KF = [
  { offset: 0.00, pos: [0, 0, 14],    target: [0, 0, 0] },
  { offset: 0.13, pos: [0, 0, 9.5],   target: [0, 0, 0] },
  { offset: 0.26, pos: [3.5, 0.5, 8], target: [0, 0, 0] },
  { offset: 0.42, pos: [-1, -1.5, 7], target: [0, -0.5, 0] },
  { offset: 0.57, pos: [0, 5.5, 11],  target: [0, 0, 0] },
  { offset: 0.72, pos: [-3.5, 0, 8],  target: [0, 0, 0] },
  { offset: 0.88, pos: [0, 0, 14],    target: [0, 0, 0] },
  { offset: 1.00, pos: [0, 0, 14],    target: [0, 0, 0] },
];

function lerpCamera(t: number) {
  const kf = CAM_KF;
  let a = kf[0], b = kf[kf.length - 1];
  for (let i = 0; i < kf.length - 1; i++) {
    if (t >= kf[i].offset && t <= kf[i + 1].offset) { a = kf[i]; b = kf[i + 1]; break; }
  }
  const span = b.offset - a.offset;
  const frac = span === 0 ? 0 : Math.max(0, Math.min(1, (t - a.offset) / span));
  const eased = frac < 0.5 ? 2 * frac * frac : -1 + (4 - 2 * frac) * frac;
  return {
    pos: a.pos.map((v, i) => v + (b.pos[i] - v) * eased) as [number, number, number],
    target: a.target.map((v, i) => v + (b.target[i] - v) * eased) as [number, number, number],
  };
}

function CameraController({ scrollProgressRef }: { scrollProgressRef: { current: number } }) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
  useFrame(() => {
    const { pos, target } = lerpCamera(scrollProgressRef.current);
    camera.position.lerp(new THREE.Vector3(...pos), 0.045);
    lookTarget.current.lerp(new THREE.Vector3(...target), 0.045);
    camera.lookAt(lookTarget.current);
  });
  return null;
}

// ─── Atom Model ───────────────────────────────────────────────────────────────
function AtomModel() {
  const groupRef = useRef<THREE.Group>(null!);
  const e1Ref = useRef<THREE.Mesh>(null!);
  const e2Ref = useRef<THREE.Mesh>(null!);
  const e3Ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = t * 0.1;
    if (e1Ref.current) e1Ref.current.position.set(Math.cos(t * 0.9) * 2, Math.sin(t * 0.9) * 2, 0);
    if (e2Ref.current) e2Ref.current.position.set(Math.cos(t * 0.7 + 2.1) * 2, 0, Math.sin(t * 0.7 + 2.1) * 2);
    if (e3Ref.current) e3Ref.current.position.set(0, Math.cos(t * 0.8 + 4.2) * 2, Math.sin(t * 0.8 + 4.2) * 2);
  });

  // Sky-blue materials
  const ringMat = <meshStandardMaterial color="#38BDF8" emissive="#0EA5E9" emissiveIntensity={0.6} roughness={0.2} metalness={0.5} />;
  const electronMat = <meshStandardMaterial color="#7DD3FC" emissive="#38BDF8" emissiveIntensity={1.8} roughness={0} metalness={0} />;

  return (
    <group ref={groupRef}>
      {/* Nucleus */}
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#7DD3FC" emissive="#38BDF8" emissiveIntensity={3} roughness={0.1} metalness={0.3} />
      </mesh>
      {/* Orbital rings */}
      {([
        [0, 0, 0],
        [Math.PI / 2, 0, 0],
        [Math.PI / 4, Math.PI / 6, 0],
      ] as [number, number, number][]).map((rot, i) => (
        <mesh key={i} rotation={rot}>
          <torusGeometry args={[2, 0.018, 16, 100]} />
          {ringMat}
        </mesh>
      ))}
      {/* Electrons */}
      {[e1Ref, e2Ref, e3Ref].map((ref, i) => (
        <mesh key={i} ref={ref}>
          <sphereGeometry args={[0.09, 16, 16]} />
          {electronMat}
        </mesh>
      ))}
    </group>
  );
}

// ─── Pendulum ─────────────────────────────────────────────────────────────────
function Pendulum({ position }: { position: [number, number, number] }) {
  const bobRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const angle = 0.6 * Math.sin(clock.getElapsedTime() * 1.4);
    if (bobRef.current) bobRef.current.position.set(Math.sin(angle) * 1.8, -Math.cos(angle) * 1.8, 0);
  });
  return (
    <group position={position}>
      <mesh><sphereGeometry args={[0.06, 16, 16]} /><meshStandardMaterial color="#475569" roughness={0.5} metalness={0.9} /></mesh>
      <mesh ref={bobRef} position={[0, -1.8, 0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial color="#38BDF8" emissive="#0EA5E9" emissiveIntensity={0.8} roughness={0.1} metalness={0.5} />
      </mesh>
    </group>
  );
}

// ─── Prism ────────────────────────────────────────────────────────────────────
function Prism({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (ref.current) { ref.current.rotation.y = clock.getElapsedTime() * 0.3; ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.2; }
  });
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group position={position}>
        <mesh ref={ref}>
          <octahedronGeometry args={[0.7]} />
          <meshStandardMaterial color="#7DD3FC" emissive="#38BDF8" emissiveIntensity={1.2} roughness={0} metalness={0.2} transparent opacity={0.85} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 6]} position={[0.8, -0.6, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 1.4, 8]} />
          <meshStandardMaterial color="#7DD3FC" emissive="#7DD3FC" emissiveIntensity={3} transparent opacity={0.55} />
        </mesh>
      </group>
    </Float>
  );
}

// ─── Solenoid ────────────────────────────────────────────────────────────────
function Solenoid({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * 0.16; });
  return (
    <Float speed={1.1} floatIntensity={0.4}>
      <group ref={ref} position={position}>
        {Array.from({ length: 10 }, (_, i) => (
          <mesh key={i} position={[0, (i - 4.5) * 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.5, 0.035, 12, 40]} />
            <meshStandardMaterial color="#38BDF8" emissive="#0EA5E9" emissiveIntensity={0.5} roughness={0.3} metalness={0.8} />
          </mesh>
        ))}
        <mesh>
          <cylinderGeometry args={[0.08, 0.08, 2.4, 16]} />
          <meshStandardMaterial color="#7DD3FC" emissive="#38BDF8" emissiveIntensity={1.5} transparent opacity={0.25} />
        </mesh>
      </group>
    </Float>
  );
}

// ─── WaveGrid ─────────────────────────────────────────────────────────────────
function WaveGrid({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const geo = meshRef.current?.geometry as THREE.PlaneGeometry;
    if (!geo) return;
    const pos = geo.attributes.position;
    const t = clock.getElapsedTime();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      pos.setY(i, Math.sin(x * 1.2 + t * 1.8) * 0.2 + Math.cos(z * 1.4 + t * 1.3) * 0.15 + Math.sin((x + z) * 0.8 + t) * 0.1);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });
  return (
    <Float speed={0.8} floatIntensity={0.2}>
      <group position={position}>
        <mesh ref={meshRef} rotation={[-Math.PI / 6, 0, 0]}>
          <planeGeometry args={[4, 3, 30, 20]} />
          <meshStandardMaterial color="#0EA5E9" emissive="#0EA5E9" emissiveIntensity={0.5} wireframe transparent opacity={0.45} />
        </mesh>
      </group>
    </Float>
  );
}

// ─── Main Scene ────────────────────────────────────────────────────────────────
export default function Scene({ scrollProgressRef }: { scrollProgressRef: { current: number } }) {
  return (
    <>
      <CameraController scrollProgressRef={scrollProgressRef} />

      {/* Lighting — sky blue tones */}
      <ambientLight intensity={0.05} color="#0c1a2e" />
      <pointLight position={[0, 0, 0]} intensity={6} color="#38BDF8" distance={14} decay={2} />
      <pointLight position={[5, 3, 2]} intensity={2} color="#7DD3FC" distance={16} decay={2} />
      <pointLight position={[-5, -2, -3]} intensity={1.2} color="#0EA5E9" distance={13} decay={2} />
      <spotLight position={[0, 8, 0]} angle={0.4} penumbra={0.8} intensity={2.5} color="#38BDF8" />

      {/* Stars & Particles */}
      <Stars radius={80} depth={60} count={2500} factor={3} saturation={0} fade speed={0.25} />
      <Sparkles count={160} scale={[22, 14, 14]} size={0.9} speed={0.2} opacity={0.25} color="#38BDF8" />
      <Sparkles count={50} scale={[8, 8, 8]} position={[0, 0, 0]} size={1.4} speed={0.4} opacity={0.45} color="#7DD3FC" />

      {/* Physics objects */}
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
        <AtomModel />
      </Float>
      <Pendulum position={[-4.5, 1.5, -2]} />
      <Prism position={[4, -1, -1]} />
      <Solenoid position={[-3.5, -2, 0]} />
      <WaveGrid position={[0, -3.5, -2]} />

      <Sparkles count={100} scale={[6, 10, 4]} position={[0, 5, -2]} size={1.8} speed={0.9} opacity={0.3} color="#7DD3FC" />
    </>
  );
}
