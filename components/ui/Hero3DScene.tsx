'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { QuadraticBezierLine, Float, MeshTransmissionMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from 'framer-motion'
import Image from 'next/image'

// Configuration
const COLOR_NAVY = '#071A2E'
const COLOR_GOLD = '#C6A15B'
const COLOR_WHITE = '#FFFFFF'
const COLOR_GLASS = '#F4F1ED' // Slightly darker off-white with a warm/gold tint for the glass so it stands out against white
const FALLBACK_IMAGE = '/images/ai-pulse-agentic-3d-white-navy-gold-final.jpg'

function DataPacket({ curve, timeOffset, speed = 0.5 }: { curve: THREE.QuadraticBezierCurve3, timeOffset: number, speed?: number }) {
  const ref = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (!ref.current) return
    const t = ((state.clock.elapsedTime * speed) + timeOffset) % 1
    const position = curve.getPoint(t)
    ref.current.position.copy(position)
    
    // Scale pulse
    const scale = Math.sin(t * Math.PI) * 1.5
    ref.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.04, 16, 16]} />
      <meshBasicMaterial color={COLOR_GOLD} transparent opacity={0.8} />
    </mesh>
  )
}

function AIAgent({ position, corePosition }: { position: [number, number, number], corePosition: THREE.Vector3 }) {
  const [hovered, setHovered] = useState(false)
  const agentVec = useMemo(() => new THREE.Vector3(...position), [position])
  
  // Curve from Agent to Core
  const curve = useMemo(() => {
    const midPoint = new THREE.Vector3().addVectors(agentVec, corePosition).multiplyScalar(0.5)
    // Add some curve outwards
    midPoint.y += 1.5
    midPoint.x += (Math.random() - 0.5) * 2
    return new THREE.QuadraticBezierCurve3(agentVec, midPoint, corePosition)
  }, [agentVec, corePosition])

  return (
    <group>
      {/* The Agent Module */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1} floatingRange={[-0.2, 0.2]}>
        <mesh 
          position={position}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[0.6, 0.8, 0.6]} />
          <meshPhysicalMaterial 
            color={COLOR_GLASS}
            metalness={0.1}
            roughness={0.2}
            transmission={0.9}
            thickness={0.5}
            transparent
            opacity={0.9}
          />
          {/* Inner Agent Core */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color={hovered ? COLOR_GOLD : COLOR_NAVY} />
          </mesh>
        </mesh>
      </Float>

      {/* Data Connection Curve */}
      <QuadraticBezierLine 
        start={agentVec} 
        end={corePosition} 
        mid={curve.v1}
        color={hovered ? COLOR_GOLD : COLOR_NAVY} 
        lineWidth={hovered ? 2 : 1} 
        transparent 
        opacity={hovered ? 0.6 : 0.2} 
      />

      {/* Moving Packets */}
      <DataPacket curve={curve} timeOffset={0} speed={0.4} />
      <DataPacket curve={curve} timeOffset={0.5} speed={0.4} />
    </group>
  )
}

function CentralComputer() {
  const innerRef = useRef<THREE.Group>(null)
  const corePos = useMemo(() => new THREE.Vector3(0, 0, 0), [])

  const agents = useMemo(() => {
    const arr = []
    const count = 6
    for(let i=0; i<count; i++) {
      const angle = (i / count) * Math.PI * 2
      const radius = 3.5 + Math.random() * 1.5
      const y = (Math.random() - 0.5) * 3
      arr.push([Math.cos(angle) * radius, y, Math.sin(angle) * radius] as [number, number, number])
    }
    return arr
  }, [])

  useFrame((state, delta) => {
    if (innerRef.current) {
      innerRef.current.rotation.y += delta * 0.2
      innerRef.current.rotation.x += delta * 0.1
    }
  })

  return (
    <group>
      {/* Outer Glass Casing */}
      <mesh>
        <cylinderGeometry args={[1.5, 1.5, 3.5, 32]} />
        <MeshTransmissionMaterial 
          background={new THREE.Color(COLOR_WHITE)}
          transmission={0.95} 
          thickness={1.5} 
          roughness={0.15} 
          ior={1.5} 
          color={COLOR_GLASS} 
        />
      </mesh>

      {/* Inner Processors and Core */}
      <group ref={innerRef}>
        {/* Processors */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 2.5, 1.2]} />
          <meshStandardMaterial color={COLOR_NAVY} metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Gold Core */}
        <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
          <meshBasicMaterial color={COLOR_GOLD} />
        </Sphere>
      </group>

      {/* Surround Agents */}
      {agents.map((pos, i) => (
        <AIAgent key={i} position={pos} corePosition={corePos} />
      ))}
    </group>
  )
}

function SceneContainer() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (!groupRef.current) return
    // Subtle mouse parallax
    const targetX = (state.pointer.x * Math.PI) / 20
    const targetY = (state.pointer.y * Math.PI) / 20
    
    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05
    groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05
    
    // Slight continuous floating of the whole assembly
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
  })

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <CentralComputer />
    </group>
  )
}

export function Hero3DScene() {
  const [shouldRender3D, setShouldRender3D] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const checkCapabilities = () => {
      const isDesktop = window.innerWidth >= 1024
      const supportsWebGL = (() => {
        try {
          const canvas = document.createElement('canvas')
          return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
        } catch {
          return false
        }
      })()
      
      // We removed !prefersReducedMotion so the 3D scene still renders even if they have OS animations disabled, 
      // since the user wants to see the 3D scene on their Mac.
      setShouldRender3D(isDesktop && supportsWebGL)
      setIsLoaded(true)
    }

    checkCapabilities()
    window.addEventListener('resize', checkCapabilities)
    return () => window.removeEventListener('resize', checkCapabilities)
  }, [prefersReducedMotion])

  // Fallback while detecting or if 3D is disabled
  if (!isLoaded || !shouldRender3D) {
    return (
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none opacity-90 transition-opacity duration-1000">
        <Image 
          src={FALLBACK_IMAGE}
          alt="AI Agentic Network"
          fill
          className="object-contain"
          priority
        />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }} 
        dpr={[1, 1.5]}
        frameloop="always" // R3F pauses automatically when tab is hidden
      >
        <ambientLight intensity={1.5} color={COLOR_WHITE} />
        <directionalLight position={[5, 10, 5]} intensity={2} color={COLOR_WHITE} />
        <directionalLight position={[-5, -10, -5]} intensity={0.5} color={COLOR_NAVY} />
        
        <SceneContainer />
      </Canvas>
    </div>
  )
}
