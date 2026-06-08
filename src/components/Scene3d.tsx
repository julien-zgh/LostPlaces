import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function FloatingRuins({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const columnRef = useRef<THREE.Mesh>(null);
  const blockRef = useRef<THREE.Mesh>(null);
  const archRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Mouse-based rotation - more dramatic
      groupRef.current.rotation.y =
        state.clock.elapsedTime * 0.1 + mouseX * 0.005;
      groupRef.current.rotation.x = mouseY * 0.003;

      // Individual piece movements based on mouse
      if (columnRef.current) {
        columnRef.current.position.x = -2 + mouseX * 0.001;
        columnRef.current.rotation.z = mouseX * 0.002;
      }

      if (blockRef.current) {
        blockRef.current.position.x = 2 + mouseX * -0.001;
        blockRef.current.position.y = -0.5 + mouseY * 0.001;
      }

      if (archRef.current) {
        archRef.current.position.z = -2 + mouseY * 0.001;
        archRef.current.rotation.y = mouseX * 0.001;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ancient Column */}
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={columnRef} position={[-2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 3, 8]} />
          <meshStandardMaterial color="#8B6914" roughness={0.8} />
        </mesh>
      </Float>

      {/* Stone Block */}
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh ref={blockRef} position={[2, -0.5, 1]}>
          <boxGeometry args={[1.2, 0.8, 0.6]} />
          <meshStandardMaterial color="#A0826D" roughness={0.9} />
        </mesh>
      </Float>

      {/* Ancient Arch */}
      <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.4}>
        <group ref={archRef} position={[0, 0, -2]}>
          <mesh position={[-0.8, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 2.5, 6]} />
            <meshStandardMaterial color="#9B7B47" roughness={0.8} />
          </mesh>
          <mesh position={[0.8, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 2.5, 6]} />
            <meshStandardMaterial color="#9B7B47" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 1.8, 6]} />
            <meshStandardMaterial color="#9B7B47" roughness={0.8} />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function Scene({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#f4a460" />

      <FloatingRuins mouseX={mouseX} mouseY={mouseY} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

export default function Scene3D() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Convert mouse position to normalized coordinates (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x: x * 100, y: y * 100 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 3, 8], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <Scene mouseX={mousePosition.x} mouseY={mousePosition.y} />
      </Canvas>
    </div>
  );
}
