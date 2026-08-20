'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'

function QuantumCore() {
  const coreRef = useRef<THREE.Group>(null)
  const ringsRef = useRef<THREE.Group>(null)
  const particlesRef = useRef<THREE.Points>(null)

  // Particles
  const particleCount = 100
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const r = 4 + Math.random() * 4
      const theta = 2 * Math.PI * Math.random()
      const phi = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [particleCount])

  useFrame((state, delta) => {
    if (!coreRef.current || !ringsRef.current || !particlesRef.current) return
    
    const time = state.clock.elapsedTime
    const scrollProgress = Math.min(window.scrollY / 1000, 1)

    // Pulse core
    const scale = 1 + Math.sin(time * 2) * 0.05 + scrollProgress * 0.5
    coreRef.current.scale.set(scale, scale, scale)
    coreRef.current.rotation.y += delta * 0.2
    coreRef.current.rotation.x += delta * 0.1

    // Rotate rings in different directions
    ringsRef.current.children.forEach((ring, i) => {
      ring.rotation.x += delta * (0.2 + i * 0.1)
      ring.rotation.y += delta * (0.1 + i * 0.15)
    })

    // Rotate particles
    particlesRef.current.rotation.y -= delta * 0.05

    // Camera move on scroll
    const group = coreRef.current.parent
    if (group) {
      group.position.z = scrollProgress * 3
      
      // Mouse parallax
      const mx = (state.pointer.x * 2) 
      const my = (state.pointer.y * 2)
      group.position.x += (mx - group.position.x) * 0.05
      group.position.y += (my - group.position.y) * 0.05
    }
  })

  return (
    <group>
      {/* Central AI Brain (Icosahedron + Sphere) */}
      <group ref={coreRef}>
        <mesh>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshBasicMaterial color="#C6A15B" wireframe transparent opacity={0.6} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1.4, 32, 32]} />
          <meshPhysicalMaterial 
            color="#071A2E" 
            emissive="#102A43"
            emissiveIntensity={0.5}
            metalness={0.9} 
            roughness={0.1} 
            transparent 
            opacity={0.9} 
          />
        </mesh>
      </group>

      {/* Rotating Data Rings */}
      <group ref={ringsRef}>
        {[2.2, 2.6, 3.0].map((radius, i) => (
          <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
            <torusGeometry args={[radius, 0.01, 8, 40]} />
            <meshBasicMaterial color="#C6A15B" transparent opacity={0.3 + (i * 0.1)} />
          </mesh>
        ))}
        {/* Outer Hexagon ring */}
        <mesh rotation={[Math.PI/4, Math.PI/4, 0]}>
            <torusGeometry args={[3.8, 0.02, 6, 6]} />
            <meshBasicMaterial color="#C6A15B" wireframe transparent opacity={0.15} />
        </mesh>
      </group>

      {/* Floating Ambient Data Dust */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#C6A15B" transparent opacity={0.6} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
    </group>
  )
}

export function Hero3DScene() {
  const [isMobile, setIsMobile] = useState(true) // Default to true so SSR matches fast mobile load

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile) return null

  return (
    <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#C6A15B" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#0055ff" />
        <QuantumCore />
      </Canvas>
    </div>
  )
}
