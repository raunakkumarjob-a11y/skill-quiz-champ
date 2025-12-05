import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, TorusKnot, Icosahedron } from "@react-three/drei";
import * as THREE from "three";

const AnimatedSphere = ({ position, color, speed = 1, distort = 0.4 }: { position: [number, number, number]; color: string; speed?: number; distort?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </Sphere>
    </Float>
  );
};

const AnimatedTorus = ({ position, color }: { position: [number, number, number]; color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
      <TorusKnot ref={meshRef} args={[0.6, 0.2, 128, 32]} position={position}>
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.9}
          transparent
          opacity={0.6}
        />
      </TorusKnot>
    </Float>
  );
};

const FloatingCode = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={3}>
      <Icosahedron ref={meshRef} args={[0.8, 1]} position={position}>
        <meshStandardMaterial
          color="#00d4ff"
          wireframe
          transparent
          opacity={0.5}
        />
      </Icosahedron>
    </Float>
  );
};

const ParticleField = () => {
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Blue to teal gradient colors
      colors[i * 3] = 0.1 + Math.random() * 0.3;
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2;
    }

    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00d4ff" />
      <pointLight position={[10, -10, 5]} intensity={0.5} color="#ff6b35" />

      <AnimatedSphere position={[-3, 2, -2]} color="#1e90ff" distort={0.5} speed={0.8} />
      <AnimatedSphere position={[4, -1, -3]} color="#00d4aa" distort={0.3} speed={1.2} />
      <AnimatedSphere position={[-2, -2, -4]} color="#ff6b35" distort={0.4} speed={0.6} />
      
      <AnimatedTorus position={[3, 2, -5]} color="#8b5cf6" />
      <AnimatedTorus position={[-4, -1, -6]} color="#00d4ff" />
      
      <FloatingCode position={[0, 0, -3]} />
      <FloatingCode position={[2, -2, -4]} />
      <FloatingCode position={[-3, 1, -5]} />

      <ParticleField />
    </>
  );
};

const ThreeBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/90 pointer-events-none" />
    </div>
  );
};

export default ThreeBackground;
