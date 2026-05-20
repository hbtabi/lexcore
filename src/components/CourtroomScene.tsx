import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function GiantRobot() {
  const groupRef = useRef<THREE.Group>(null);
  const armLRef = useRef<THREE.Group>(null);
  const armRRef = useRef<THREE.Group>(null);
  const eyeGlowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
    }
    if (armLRef.current) {
      armLRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
    }
    if (armRRef.current) {
      armRRef.current.rotation.z = -Math.sin(state.clock.elapsedTime * 0.3 + 0.5) * 0.03;
    }
    if (eyeGlowRef.current) {
      eyeGlowRef.current.intensity = 0.3 + Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });

  const mat = new THREE.MeshStandardMaterial({
    color: "#D9A02D",
    metalness: 0.6,
    roughness: 0.3,
    transparent: true,
    opacity: 0.08,
    wireframe: false,
  });

  const matDark = new THREE.MeshStandardMaterial({
    color: "#8B6914",
    metalness: 0.4,
    roughness: 0.5,
    transparent: true,
    opacity: 0.05,
  });

  return (
    <group ref={groupRef} position={[0, -0.5, -6]}>
      <pointLight ref={eyeGlowRef} position={[0, 1.8, 0.8]} color="#D9A02D" intensity={0.3} distance={4} />

      {/* Head */}
      <mesh position={[0, 2.2, 0]} castShadow>
        <boxGeometry args={[1.2, 0.8, 0.8]} />
        <primitive object={mat} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <cylinderGeometry args={[0.7, 1, 0.3, 8]} />
        <primitive object={mat} />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.25, 2.2, 0.45]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#D9A02D" emissive="#D9A02D" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>
      <mesh position={[0.25, 2.2, 0.45]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#D9A02D" emissive="#D9A02D" emissiveIntensity={0.5} transparent opacity={0.3} />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[1.6, 1.4, 0.6]} />
        <primitive object={mat} />
      </mesh>

      {/* Shoulder pads */}
      <mesh position={[-1.1, 1.6, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <primitive object={matDark} />
      </mesh>
      <mesh position={[1.1, 1.6, 0]}>
        <sphereGeometry args={[0.3, 8, 8]} />
        <primitive object={matDark} />
      </mesh>

      {/* Arms */}
      <group ref={armLRef} position={[-1.2, 1.2, 0]}>
        <mesh position={[-0.4, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 1.2, 6]} />
          <primitive object={mat} />
        </mesh>
      </group>
      <group ref={armRRef} position={[1.2, 1.2, 0]}>
        <mesh position={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 1.2, 6]} />
          <primitive object={mat} />
        </mesh>
      </group>

      {/* Base / legs */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 0.4, 8]} />
        <primitive object={matDark} />
      </mesh>
    </group>
  );
}

function CourtroomPillars() {
  const mat = new THREE.MeshStandardMaterial({
    color: "#D9A02D", metalness: 0.3, roughness: 0.5,
    transparent: true, opacity: 0.06, side: THREE.DoubleSide,
  });

  return (
    <>
      {[-2.8, 2.8].map((x, i) => (
        <group key={i}>
          <mesh position={[x, -0.5, -1.5]}>
            <cylinderGeometry args={[0.25, 0.3, 3.5, 12]} />
            <primitive object={mat} />
          </mesh>
          <mesh position={[x, 1.3, -1.5]}>
            <cylinderGeometry args={[0.35, 0.25, 0.15, 12]} />
            <primitive object={mat} />
          </mesh>
          <mesh position={[x, -1.2, -1.5]}>
            <cylinderGeometry args={[0.35, 0.25, 0.15, 12]} />
            <primitive object={mat} />
          </mesh>
          {/* Fluting lines */}
          {[-0.15, 0, 0.15].map((offset, j) => (
            <mesh key={j} position={[x + offset, 0, -1.2]}>
              <boxGeometry args={[0.01, 3, 0.01]} />
              <meshStandardMaterial color="#D9A02D" transparent opacity={0.03} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}

function JudgeBench() {
  const mat = new THREE.MeshStandardMaterial({
    color: "#D9A02D", metalness: 0.2, roughness: 0.6,
    transparent: true, opacity: 0.07,
  });
  const matDark = new THREE.MeshStandardMaterial({
    color: "#8B6914", metalness: 0.2, roughness: 0.6,
    transparent: true, opacity: 0.04,
  });

  return (
    <group position={[0, -0.9, -1.8]}>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.4, 0.4, 0.6]} />
        <primitive object={mat} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.5]} />
        <primitive object={matDark} />
      </mesh>
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[1.0, 0.4, 0.4]} />
        <primitive object={matDark} />
      </mesh>
      {/* Seal/emblem behind bench */}
      <mesh position={[0, 0.5, -0.35]}>
        <ringGeometry args={[0.15, 0.25, 24]} />
        <meshStandardMaterial color="#D9A02D" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Gavel() {
  const gavelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gavelRef.current) {
      const t = state.clock.elapsedTime;
      const hit = Math.sin(t * 1.5) > 0.92;
      gavelRef.current.position.y = hit ? -0.05 : 0;
      gavelRef.current.rotation.x = hit ? 0.05 : 0;
    }
  });

  const matGold = new THREE.MeshStandardMaterial({
    color: "#D9A02D", metalness: 0.5, roughness: 0.3,
    transparent: true, opacity: 0.08,
  });

  return (
    <group ref={gavelRef} position={[0.8, -0.7, -1.6]}>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.2, 0.04, 0.08]} />
        <primitive object={matGold} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.12, 6]} />
        <primitive object={matGold} />
      </mesh>
    </group>
  );
}

function LibraryShelves() {
  const mat = new THREE.MeshStandardMaterial({
    color: "#D9A02D", transparent: true, opacity: 0.04,
  });
  const bookMat = new THREE.MeshStandardMaterial({
    color: "#D9A02D", transparent: true, opacity: 0.03,
  });

  const books = useMemo(() => {
    const b: { x: number; y: number; z: number; w: number; h: number }[] = [];
    for (let side = -1; side <= 1; side += 2) {
      for (let row = 0; row < 3; row++) {
        for (let i = 0; i < 6; i++) {
          b.push({
            x: side * 2.5 + (i - 2.5) * 0.06,
            y: -0.8 + row * 0.22,
            z: -2.2 + (side > 0 ? 0 : 0),
            w: 0.04 + Math.random() * 0.03,
            h: 0.12 + Math.random() * 0.08,
          });
        }
      }
    }
    return b;
  }, []);

  return (
    <>
      {[-2.5, 2.5].map((x, i) => (
        <group key={i}>
          <mesh position={[x, -0.2, -2.2]}>
            <boxGeometry args={[0.3, 1.4, 0.1]} />
            <primitive object={mat} />
          </mesh>
        </group>
      ))}
      {books.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]}>
          <boxGeometry args={[b.w, b.h, 0.04]} />
          <primitive object={bookMat} />
        </mesh>
      ))}
    </>
  );
}

function LexEmergence() {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = -0.6 + Math.abs(Math.sin(state.clock.elapsedTime * 0.3)) * 0.5;
      groupRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      glowRef.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.6, -1.8]}>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#D9A02D" emissive="#D9A02D" emissiveIntensity={0.8}
          transparent opacity={0.25}
        />
      </mesh>
      <pointLight color="#D9A02D" intensity={0.2} distance={1.5} />
      <mesh>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color="#F2C94C" emissive="#F2C94C" emissiveIntensity={1}
          transparent opacity={0.3}
        />
      </mesh>
    </group>
  );
}

function DustParticles() {
  const count = 120;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
      const positions = ref.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i) * 0.0003;
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#D9A02D" transparent opacity={0.06} sizeAttenuation />
    </points>
  );
}

function GodRays() {
  return (
    <mesh rotation={[0, 0, 0.15]} position={[0, 0.5, -2.5]}>
      <planeGeometry args={[0.04, 2.5]} />
      <meshBasicMaterial color="#D9A02D" transparent opacity={0.03} />
    </mesh>
  );
}

export default function CourtroomScene() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[1]">
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <fog attach="fog" args={["#030303", 3, 7]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[1, 2, 1]} intensity={0.2} color="#D9A02D" />
        <pointLight position={[-1, -1, 0]} intensity={0.1} color="#D9A02D" />

        <GiantRobot />
        <CourtroomPillars />
        <JudgeBench />
        <Gavel />
        <LibraryShelves />
        <LexEmergence />
        <DustParticles />
        <GodRays />
      </Canvas>
    </div>
  );
}
