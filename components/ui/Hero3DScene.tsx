'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function NeuralNetwork() {
  const groupRef = useRef<THREE.Group>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  
  const particleCount = 200
  const maxDistance = 2.5
  
  // Pre-calculate positions and connections
  const { positions, linePositions } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const points: THREE.Vector3[] = []
    
    // Generate random points in a sphere
    for (let i = 0; i < particleCount; i++) {
      const r = 3 + Math.random() * 2
      const theta = 2 * Math.PI * Math.random()
      const phi = Math.acos(2 * Math.random() - 1)
      
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      
      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z
      
      points.push(new THREE.Vector3(x, y, z))
    }
    
    // Create line segments between close points
    const lines: number[] = []
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dist = points[i].distanceTo(points[j])
        if (dist < maxDistance) {
          lines.push(
            points[i].x, points[i].y, points[i].z,
            points[j].x, points[j].y, points[j].z
          )
        }
      }
    }
    
    return { 
      positions: pos, 
      linePositions: new Float32Array(lines)
    }
  }, [particleCount])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    
    const scrollY = window.scrollY
    const scrollProgress = Math.min(scrollY / 1000, 1)
    
    // Rotate the whole network
    groupRef.current.rotation.y += delta * 0.1
    groupRef.current.rotation.x += delta * 0.05
    
    // Pulse effect
    const time = state.clock.elapsedTime
    const scale = 1 + Math.sin(time) * 0.05 + scrollProgress * 1.5
    groupRef.current.scale.set(scale, scale, scale)
    
    // Move towards camera on scroll
    groupRef.current.position.z = scrollProgress * 5
    
    // Mouse parallax
    const mx = (state.pointer.x * 2) 
    const my = (state.pointer.y * 2)
    groupRef.current.position.x += (mx - groupRef.current.position.x) * 0.05
    groupRef.current.position.y += (my - groupRef.current.position.y) * 0.05
  })

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.15} color="#C6A15B" transparent opacity={1} blending={THREE.NormalBlending} sizeAttenuation />
      </points>
      
      {/* Edges */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#C6A15B" transparent opacity={0.6} blending={THREE.NormalBlending} />
      </lineSegments>
    </group>
  )
}

export function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <NeuralNetwork />
      </Canvas>
    </div>
  )
}
