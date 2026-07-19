import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function BlackHoleVortex() {
  const pointsRef = useRef()
  const singularityRef = useRef()
  const auraRef = useRef()
  const particleCount = 10000 // More particles for a dense galaxy feel

  // Generate a perfectly circular sparkling texture
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const context = canvas.getContext('2d')
    const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    context.fillStyle = gradient
    context.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(canvas)
  }, [])

  const [positions, colors, baseColors, angles, radii, sizes] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const col = new Float32Array(particleCount * 3)
    const baseCol = new Float32Array(particleCount * 3)
    const ang = new Float32Array(particleCount)
    const rad = new Float32Array(particleCount)
    const sz = new Float32Array(particleCount)
    
    // User requested colors: White, Sky, Light Pink
    const color1 = new THREE.Color("#ffffff") // White
    const color2 = new THREE.Color("#00f3ff") // Sky Blue
    const color3 = new THREE.Color("#ffb3d9") // Light Pink
    
    for (let i = 0; i < particleCount; i++) {
      // Start randomly in a massive cylinder/tunnel (-200 to +20)
      const z = 20 - Math.random() * 220
      
      // Sharper Density variation
      const densityMod = Math.pow(Math.sin(z * 0.05) * 0.5 + 0.5, 2)
      const radius = 2 + Math.random() * 25 * (0.2 + densityMod * 0.8)
      
      const theta = Math.random() * Math.PI * 2
      
      ang[i] = theta
      rad[i] = radius
      
      pos[i * 3 + 2] = z
      
      const mix = Math.random()
      const c = mix > 0.7 ? color1 : mix > 0.35 ? color2 : color3
      
      baseCol[i * 3] = c.r
      baseCol[i * 3 + 1] = c.g
      baseCol[i * 3 + 2] = c.b
      
      // Initial darkness
      const darkness = Math.max(0.01, 1 - Math.abs(z) / 200)
      col[i * 3] = c.r * darkness
      col[i * 3 + 1] = c.g * darkness
      col[i * 3 + 2] = c.b * darkness
      
      sz[i] = Math.random() * 1.5 // smaller sparkling sizes
    }
    return [pos, col, baseCol, ang, rad, sz]
  }, [])

  useFrame((state, delta) => {
    if (!pointsRef.current) return

    const positionsArray = pointsRef.current.geometry.attributes.position.array
    const colorsArray = pointsRef.current.geometry.attributes.color.array

    // 0.3x speed (was 45 -> 18 -> now 13.5)
    const fallSpeed = 13.5 
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      
      let z = positionsArray[i3 + 2]
      z += delta * fallSpeed
      
      // Wrap around when it passes the camera to keep it infinite
      if (z > 20) {
         z -= 220
         const densityMod = Math.pow(Math.sin(z * 0.05) * 0.5 + 0.5, 2)
         radii[i] = 2 + Math.random() * 25 * (0.2 + densityMod * 0.8)
      }
      
      const offsetX = Math.sin(z * 0.02) * 20 - Math.sin(0) * 20
      const offsetY = Math.cos(z * 0.015) * 15 - Math.cos(0) * 15
      
      angles[i] += delta * (0.1 + Math.abs(z) * 0.005)
      
      positionsArray[i3] = offsetX + Math.cos(angles[i]) * radii[i]
      positionsArray[i3 + 1] = offsetY + Math.sin(angles[i]) * radii[i]
      positionsArray[i3 + 2] = z

      // Dynamic Lighting/Darkness based on depth (pure darkness deep down)
      const darkness = Math.max(0.0, 1 - Math.abs(z) / 200)
      colorsArray[i3] = baseColors[i3] * darkness
      colorsArray[i3 + 1] = baseColors[i3 + 1] * darkness
      colorsArray[i3 + 2] = baseColors[i3 + 2] * darkness
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.geometry.attributes.color.needsUpdate = true
    
    // Position the realistic Event Horizon at the end of the tunnel
    if (singularityRef.current && auraRef.current) {
       const sz = -180
       const sox = Math.sin(sz * 0.02) * 20 - Math.sin(0) * 20
       const soy = Math.cos(sz * 0.015) * 15 - Math.cos(0) * 15
       singularityRef.current.position.set(sox, soy, sz)
       auraRef.current.position.set(sox, soy, sz - 1)
       
       // Pulse the aura slightly
       const scale = 1.0 + Math.sin(state.clock.elapsedTime * 2) * 0.05
       auraRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <group>
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={sizes.length} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.15} 
        map={particleTexture}
        vertexColors={true} 
        transparent 
        opacity={0.9} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false}
        sizeAttenuation={true} 
      />
    </points>
      
      {/* Realistic Event Horizon (Singularity) */}
      <mesh ref={singularityRef}>
         <sphereGeometry args={[22, 64, 64]} />
         <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Accretion Glow / Lensing Aura behind the black hole */}
      <mesh ref={auraRef}>
         <sphereGeometry args={[26, 64, 64]} />
         <meshBasicMaterial color="#ffffff" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

function LorenzAttractorBackground() {
  const groupRef = useRef()
  const lineRef = useRef()
  
  const [positions, colors] = useMemo(() => {
    let x = 0.1, y = 0, z = 0;
    const sigma = 10, rho = 28, beta = 8/3;
    const dt = 0.005;
    const count = 50000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    // Interpolate colors from Cyan -> White -> Pink
    const colorStart = new THREE.Color("#00f3ff")
    const colorMid = new THREE.Color("#ffffff")
    const colorEnd = new THREE.Color("#ffb3d9")

    for(let i=0; i<count; i++) {
        const dx = (sigma * (y - x)) * dt;
        const dy = (x * (rho - z) - y) * dt;
        const dz = (x * y - beta * z) * dt;
        x += dx; y += dy; z += dz;
        
        // Scale and center it for the background
        pos[i*3] = x * 0.6;
        pos[i*3+1] = y * 0.6;
        pos[i*3+2] = (z - 28) * 0.6; 
        
        const mix = i / count;
        let c;
        if (mix < 0.5) {
            c = colorStart.clone().lerp(colorMid, mix * 2);
        } else {
            c = colorMid.clone().lerp(colorEnd, (mix - 0.5) * 2);
        }
        col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    }
    return [pos, col]
  }, [])
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (groupRef.current) {
        groupRef.current.rotation.y = time * 0.15
        groupRef.current.rotation.x = time * 0.05
    }
    if (lineRef.current) {
        // Animate the line drawing itself endlessly
        const drawCount = Math.floor((time * 3000) % 50000)
        // Draw the last 15000 points (trailing tail)
        const start = Math.max(0, drawCount - 15000)
        lineRef.current.geometry.setDrawRange(start, drawCount - start)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, -30]}>
      <line ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors={true} transparent opacity={0.8} blending={THREE.AdditiveBlending} linewidth={2} />
      </line>
      
      {/* Subtle particle glow over the entire shape */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.05} vertexColors={true} transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  )
}

function ProjectCarousel() {
    const [bgIndex, setBgIndex] = useState(0)
    
    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex(i => (i + 1) % 2)
        }, 25000)
        return () => clearInterval(interval)
    }, [])

    switch(bgIndex) {
        case 0: return <LorenzAttractorBackground />
        case 1: return <BlackHoleVortex />
        default: return <LorenzAttractorBackground />
    }
}

export default function CanvasBackground({ isLoggedIn }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 0], fov: 75 }}>
        <color attach="background" args={['#010102']} />
        <fog attach="fog" args={['#010102', 10, 150]} />
        <ambientLight intensity={0.5} />
        {/* Core lighting to give some subtle depth near the camera */}
        <pointLight position={[0, 0, 0]} color="#ffffff" intensity={2} distance={30} />
        {isLoggedIn ? <ProjectCarousel /> : <BlackHoleVortex />}
      </Canvas>
    </div>
  )
}
