'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useRef, useMemo, useState, useEffect } from 'react'
import * as THREE from 'three'

const PARTICLE_COUNT = 150;
const MAX_DISTANCE = 2.5;

function DataNetwork() {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const groupRef = useRef<THREE.Group>(null)
  const { mouse } = useThree()

  // Initialize particles
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 15,
        y: (Math.random() - 0.5) * 15,
        z: (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        vz: (Math.random() - 0.5) * 0.02,
      })
    }
    return temp
  }, [])

  const pointPositions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), [])
  
  // Max possible lines = N * (N-1) / 2
  const linePositions = useMemo(() => new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 3), [])

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current || !groupRef.current) return

    let lineIndex = 0
    let vertexIndex = 0

    // Update particle positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i]
      
      // Move
      p.x += p.vx
      p.y += p.vy
      p.z += p.vz

      // Bounce off boundaries
      if (p.x < -10 || p.x > 10) p.vx *= -1
      if (p.y < -10 || p.y > 10) p.vy *= -1
      if (p.z < -5 || p.z > 5) p.vz *= -1

      // Update points geometry
      pointPositions[vertexIndex++] = p.x
      pointPositions[vertexIndex++] = p.y
      pointPositions[vertexIndex++] = p.z

      // Check connections
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const p2 = particles[j]
        const dx = p.x - p2.x
        const dy = p.y - p2.y
        const dz = p.z - p2.z
        const distSq = dx*dx + dy*dy + dz*dz

        if (distSq < MAX_DISTANCE * MAX_DISTANCE) {
          linePositions[lineIndex++] = p.x
          linePositions[lineIndex++] = p.y
          linePositions[lineIndex++] = p.z

          linePositions[lineIndex++] = p2.x
          linePositions[lineIndex++] = p2.y
          linePositions[lineIndex++] = p2.z
        }
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    linesRef.current.geometry.attributes.position.needsUpdate = true
    linesRef.current.geometry.setDrawRange(0, lineIndex / 3)

    // Gentle rotation based on time and mouse
    const time = state.clock.elapsedTime
    groupRef.current.rotation.y = time * 0.05 + mouse.x * 0.2
    groupRef.current.rotation.x = mouse.y * 0.2
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={pointPositions} itemSize={3} />
        </bufferGeometry>
        {/* Navy color for nodes since background is white */}
        <pointsMaterial size={0.08} color="#071A2E" transparent opacity={0.8} sizeAttenuation />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        {/* Gold color for edges connecting the data nodes */}
        <lineBasicMaterial color="#C6A15B" transparent opacity={0.35} />
      </lineSegments>
    </group>
  )
}

export function Hero3DScene() {
  const [isMobile, setIsMobile] = useState(true)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile) return null

  return (
    <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 1.5]}>
        <DataNetwork />
      </Canvas>
    </div>
  )
}
