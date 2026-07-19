import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Box, Torus, Line, Html, useGLTF, Center, useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Procedural Quadcopter Drone Component
function ProceduralDrone({ color, droneRef, initialPosition, label }) {
  const rotors = useRef()
  
  useFrame((state, delta) => {
    if (rotors.current) {
      rotors.current.rotation.y += delta * 15 // Spin rotors fast
    }
  })

  return (
    <group ref={droneRef} position={initialPosition}>
      {/* Label */}
      {label && (
        <Html position={[0, 0.8, 0]} center>
          <div style={{
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            border: `1px solid ${color}`,
            padding: '4px 8px',
            borderRadius: '4px',
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {label}
          </div>
        </Html>
      )}
      {/* Main Body */}
      <mesh>
        <boxGeometry args={[0.4, 0.15, 0.4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} wireframe />
      </mesh>
      {/* Camera */}
      <mesh position={[0, -0.15, 0.15]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
      </mesh>
      {/* Arms (X shape) */}
      <mesh rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1, 0.05, 0.05]} />
        <meshStandardMaterial color={color} wireframe />
      </mesh>
      <mesh rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[1, 0.05, 0.05]} />
        <meshStandardMaterial color={color} wireframe />
      </mesh>
      {/* Rotors */}
      <group ref={rotors}>
        {/* Front Left */}
        <mesh position={[-0.35, 0.1, -0.35]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
          <meshStandardMaterial color={color} transparent opacity={0.5} />
        </mesh>
        {/* Front Right */}
        <mesh position={[0.35, 0.1, -0.35]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
          <meshStandardMaterial color={color} transparent opacity={0.5} />
        </mesh>
        {/* Back Left */}
        <mesh position={[-0.35, 0.1, 0.35]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
          <meshStandardMaterial color={color} transparent opacity={0.5} />
        </mesh>
        {/* Back Right */}
        <mesh position={[0.35, 0.1, 0.35]}>
          <cylinderGeometry args={[0.2, 0.2, 0.02, 16]} />
          <meshStandardMaterial color={color} transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  )
}

// 1. Drone Tracking Scene
export function DroneTrackingScene({ isBackground = false }) {
  const targetDrone = useRef()
  const trackerDrone = useRef()
  const scanLineRef = useRef()

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    // Target drone evades in a figure-8 (tighter pattern)
    if (targetDrone.current) {
      targetDrone.current.position.x = Math.sin(time * 1.5) * 1.5
      targetDrone.current.position.z = Math.sin(time * 3) * 1.0
      targetDrone.current.position.y = Math.sin(time * 0.8) * 0.5
    }
    // Tracker drone follows with a delay
    if (trackerDrone.current && targetDrone.current) {
      trackerDrone.current.position.lerp(
        new THREE.Vector3(targetDrone.current.position.x + 2, targetDrone.current.position.y + 1, targetDrone.current.position.z + 2),
        0.05
      )
      trackerDrone.current.lookAt(targetDrone.current.position)
    }
  })

  return (
    <group scale={1.8}>
      {/* Target Drone (Red) */}
      <ProceduralDrone color="#ff0044" droneRef={targetDrone} initialPosition={[0, 0, 0]} label={!isBackground ? "Anomalous Drone" : null} />
      {/* Tracker Drone (Cyan) */}
      <ProceduralDrone color="#00f3ff" droneRef={trackerDrone} initialPosition={[1.5, 0.5, 1.5]} label={!isBackground ? "Detector" : null} />
    </group>
  )
}

// 2. Cosmic Gateway Scene (Full Solar System + Exoplanet Transit)
export function CosmicGatewayScene({ isBackground = false }) {
  const systemRef = useRef()
  const sunRef = useRef()
  
  // Real Solar System Data + Exoplanet Anomaly
  const planetsData = [
    { name: 'Mercury', radius: 1.0, speed: 1.2, size: 0.05, color: '#aaaaaa' },
    { name: 'Venus',   radius: 1.5, speed: 0.9, size: 0.08, color: '#e6cd98' },
    { name: 'Earth',   radius: 2.1, speed: 0.7, size: 0.10, color: '#2b82c9' },
    { name: 'Mars',    radius: 2.7, speed: 0.5, size: 0.07, color: '#c1440e' },
    { name: 'Jupiter', radius: 4.0, speed: 0.3, size: 0.25, color: '#d39c7e' },
    { name: 'Saturn',  radius: 5.5, speed: 0.2, size: 0.20, color: '#ead6b8', hasRing: true },
    { name: 'Uranus',  radius: 7.0, speed: 0.12, size: 0.15, color: '#4b70dd' },
    { name: 'Neptune', radius: 8.5, speed: 0.08, size: 0.14, color: '#274687' },
    { name: 'Exoplanet', radius: 10.0, speed: 0.15, size: 0.18, color: '#9d4edd', isExoplanet: true }
  ]
  
  const planetRefs = useRef([])
  const transitUiRef = useRef()
  const fluxRef = useRef()
  const sunTexture = useTexture('/sun.png')
  const milkywayTexture = useTexture('/milkyway.png')

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (sunRef.current) sunRef.current.rotation.y = time * 0.1
    if (systemRef.current) systemRef.current.rotation.z = time * 0.02

    let isTransiting = false

    planetRefs.current.forEach((planet, i) => {
      if (planet) {
        const data = planetsData[i]
        // Orbit calculation
        const angle = time * data.speed
        planet.position.x = Math.sin(angle) * data.radius
        planet.position.z = Math.cos(angle) * data.radius
        planet.rotation.y = time * 2

        if (data.isExoplanet) {
          // Transit occurs when x is near 0 and z is positive (between sun and camera)
          if (Math.abs(planet.position.x) < 1.0 && planet.position.z > 0) {
            isTransiting = true
          }
        }
      }
    })

    // Update UI
    if (transitUiRef.current) {
      if (isTransiting) {
        transitUiRef.current.style.color = '#ff0044'
        transitUiRef.current.innerText = 'TRANSIT DETECTED'
        if (fluxRef.current) fluxRef.current.innerText = 'FLUX: 98.2% (DIP)'
      } else {
        transitUiRef.current.style.color = '#00f3ff'
        transitUiRef.current.innerText = 'MONITORING LIGHT CURVE'
        if (fluxRef.current) fluxRef.current.innerText = 'FLUX: 100.0% (NOMINAL)'
      }
    }
  })

  const panelStyle = {
    background: 'rgba(0, 20, 40, 0.7)',
    backdropFilter: 'blur(8px)',
    border: '1px solid #00f3ff',
    padding: '12px 16px',
    borderRadius: '8px',
    color: '#00f3ff',
    fontSize: '11px',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
    boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)'
  }

  return (
    <group scale={0.45}>
      {/* Milky Way Background Sphere (untilted so galaxy remains horizontal) */}
      <mesh>
        <sphereGeometry args={[50, 64, 64]} />
        <meshBasicMaterial map={milkywayTexture} side={THREE.BackSide} transparent opacity={0.6} />
      </mesh>

      {/* The Solar System (tilted to match requested default angle) */}
      <group ref={systemRef} rotation={[0.8, 0, 0]}>
        {/* Central Star */}
        <Sphere ref={sunRef} args={[0.8, 64, 64]}>
          <meshBasicMaterial map={sunTexture} color="#ffffff" />
        </Sphere>

        {/* Orbit Rings and Planets */}
        {planetsData.map((data, i) => (
          <group key={i}>
            {/* Orbital Track Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[data.radius - 0.02, data.radius + 0.02, 64]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
            </mesh>
            
            {/* Planet Body */}
            <Sphere 
              ref={el => planetRefs.current[i] = el}
              args={[data.size, 32, 32]} 
              position={[data.radius, 0, 0]}
            >
              <meshStandardMaterial color={data.color} roughness={0.7} />
              
              {/* Saturn's Planetary Ring */}
              {data.hasRing && (
                <mesh rotation={[Math.PI / 2.5, 0, 0]}>
                  <ringGeometry args={[data.size * 1.5, data.size * 2.3, 64]} />
                  <meshStandardMaterial color={data.color} transparent opacity={0.7} side={THREE.DoubleSide} />
                </mesh>
              )}
            </Sphere>
          </group>
        ))}

        {/* Background Stars (within the tilted system for depth) */}
        <points>
          <sphereGeometry args={[25, 32, 32]} />
          <pointsMaterial color="#ffffff" size={0.08} transparent opacity={0.4} />
        </points>
      </group>

      {/* Ensemble Model UI Panel (untilted to stay flat against screen) */}
      {!isBackground && (
      <Html position={[-9.5, 5.0, 0]} center>
        <div style={panelStyle}>
          <div style={{ fontWeight: 'bold', borderBottom: '1px solid rgba(0,243,255,0.3)', paddingBottom: '4px', marginBottom: '4px' }}>
            ENSEMBLE MODEL STATUS
          </div>
          <div style={{ color: '#aaa', fontSize: '10px' }}>
            MODEL 1 (RANDOM FOREST): <span style={{color: '#00f3ff'}}>ACTIVE</span><br/>
            MODEL 2 (XGBOOST): <span style={{color: '#00f3ff'}}>ACTIVE</span><br/>
            META-LEARNER (STACKING): <span style={{color: '#00f3ff'}}>ACTIVE</span>
          </div>
          <div style={{ marginTop: '8px', color: '#00f3ff', fontWeight: 'bold' }}>
            ENSEMBLE CONFIDENCE: <span style={{color: '#fff'}}>98.4%</span>
          </div>
        </div>
      </Html>
      )}

      {/* Transit UI Panel (untilted to stay flat against screen) */}
      {!isBackground && (
      <Html position={[9.5, -5.0, 0]} center>
        <div style={panelStyle}>
          <div ref={transitUiRef} style={{ fontWeight: 'bold', fontSize: '12px' }}>
            MONITORING LIGHT CURVE
          </div>
          <div ref={fluxRef} style={{ color: '#ffffff', marginTop: '4px', fontWeight: 'bold' }}>
            FLUX: 100.0% (NOMINAL)
          </div>
          <div style={{ color: '#aaa', fontSize: '9px', marginTop: '8px', maxWidth: '180px', whiteSpace: 'normal', lineHeight: '1.4' }}>
            *Fine-tune the ensemble models interactively via the web portal dashboard to adjust classification weights.
          </div>
        </div>
      </Html>
      )}
    </group>
  )
}

// 3. Medical Scan Scene (CNN)
export function MedicalScanScene() {
  const { scene } = useGLTF('/brain.glb')
  const hologramRef = useRef()
  const scannerRef = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    // Hologram gently floats and rotates
    if (hologramRef.current) {
      hologramRef.current.position.y = Math.sin(time) * 0.1
      hologramRef.current.rotation.y = time * 0.3
    }
    // Scanner moving up and down
    if (scannerRef.current) {
      scannerRef.current.position.y = Math.sin(time * 1.5) * 1.2
    }
  })

  // Common glass panel style
  const panelStyle = {
    background: 'rgba(0, 20, 40, 0.6)',
    backdropFilter: 'blur(8px)',
    border: '1px solid #00f3ff',
    padding: '8px 12px',
    borderRadius: '4px',
    color: '#00f3ff',
    fontSize: '10px',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
    boxShadow: '0 0 10px rgba(0, 243, 255, 0.2)'
  }

  return (
    <group scale={1.5}>
      {/* Central Hologram (Real 3D Brain Model) */}
      <group ref={hologramRef} position={[0, 0, 0]}>
        
        <Center>
          <primitive object={scene} scale={1.6} />
        </Center>

        {/* AI Scanner Plane */}
        <mesh ref={scannerRef} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.6, 64]} />
          <meshBasicMaterial color="#ff0044" transparent opacity={0.3} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>


      </group>
    </group>
  )
}

// Internal component for an individual reactive slice
const CTSlice = ({ i, scannerRef, texture }) => {
  const yPos = (i - 25) * 0.08
  const meshRef = useRef()

  useFrame(() => {
    if (scannerRef.current && meshRef.current && meshRef.current.material) {
      const dist = Math.abs(meshRef.current.position.y - scannerRef.current.position.y)
      const isClose = dist < 0.3
      // Solid opacity when scanned, semi-transparent otherwise to see internal volume
      meshRef.current.material.opacity = isClose ? 1.0 : 0.2
      // Highlight pure white when scanned, slightly dim otherwise
      meshRef.current.material.color.setHex(isClose ? 0xffffff : 0xaaaaaa)
    }
  })

  return (
    <mesh ref={meshRef} position={[0, yPos, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4, 4]} />
      <meshBasicMaterial 
        map={texture}
        alphaMap={texture}
        color="#ffffff"
        transparent={true}
        depthWrite={false} 
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// 4. CT Scan Scene (For Colorectal Tumor Classification)
export function CTScanScene({ isBackground = false }) {
  const groupRef = useRef()
  const scannerRef = useRef()
  const tumorRef = useRef()
  const texture = useTexture('/ct_slice.png')

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.z = time * 0.15 // Spin like a dial when looking top-down
      groupRef.current.position.y = Math.sin(time) * 0.1
    }
    if (scannerRef.current) {
      scannerRef.current.position.y = Math.sin(time * 1.2) * 2.2
    }
    if (tumorRef.current) {
      tumorRef.current.scale.setScalar(1 + Math.sin(time * 5) * 0.15)
    }
  })

  // 50 stacked slices for high volumetric density
  const slices = Array.from({ length: 50 })

  const panelStyle = {
    background: 'rgba(0, 20, 40, 0.6)',
    backdropFilter: 'blur(8px)',
    border: '1px solid #00f3ff',
    padding: '10px 16px',
    borderRadius: '6px',
    color: '#00f3ff',
    fontSize: '11px',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
    boxShadow: '0 0 15px rgba(0, 243, 255, 0.2)'
  }

  return (
    <group ref={groupRef} scale={1.1} rotation={[Math.PI / 2, 0, 0]}>
      {/* Volumetric CT Slices */}
      {slices.map((_, i) => (
        <CTSlice key={i} i={i} scannerRef={scannerRef} texture={texture} />
      ))}

      {/* Malignant Tumor Anomaly */}
      <group ref={tumorRef} position={[0.4, -0.6, 0.3]}>
        <mesh>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshBasicMaterial color="#ff0044" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Pulsing hazard ring */}
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <ringGeometry args={[0.3, 0.35, 32]} />
          <meshBasicMaterial color="#ff0044" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Scanning Laser Plane (Rectangular) */}
      <mesh ref={scannerRef}>
        <boxGeometry args={[4.2, 0.05, 4.2]} />
        <meshBasicMaterial color="#ff0044" transparent opacity={0.4} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Extruded Bounding Box */}
      <mesh>
        <boxGeometry args={[4.4, 4.6, 4.4]} />
        <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={0.03} />
      </mesh>
      
      {/* Floating UI Elements */}
      {!isBackground && (
      <Html position={[2.5, 1.2, 0]} center rotation={[-Math.PI / 2, 0, 0]}>
        <div style={panelStyle}>
          <span style={{color:'#ff0044', fontWeight: 'bold'}}>! MALIGNANT LESION DETECTED</span><br/>
          <div style={{ marginTop: '8px' }}>
            SLICE: <span style={{ color: 'white' }}>#144 (MASK-GUIDED)</span><br/>
            CONFIDENCE: <span style={{ color: 'white' }}>98.7%</span><br/>
            VOLUME: <span style={{ color: 'white' }}>4.2cc</span>
          </div>
        </div>
      </Html>
      )}
      {!isBackground && <Line points={[[2.5, 1.2, 0], [0.6, -0.5, 0.4]]} color="#ff0044" lineWidth={1.5} transparent opacity={0.8} />}

      {!isBackground && (
      <Html position={[-2.8, -1.2, 0]} center rotation={[-Math.PI / 2, 0, 0]}>
        <div style={panelStyle}>
          <span style={{ fontWeight: 'bold' }}>MIL TOP-K POOLING: ACTIVE</span><br/>
          <div style={{ marginTop: '8px', color: '#aaa' }}>
            FEATURES: EXTRACTED (RESNET-18)<br/>
            CLASSIFIER: LOGISTIC REGRESSION<br/>
            Z-SCORE NORM: APPLIED
          </div>
        </div>
      </Html>
      )}
      {!isBackground && <Line points={[[-2.8, -1.2, 0], [-1.0, 0, 0]]} color="#00f3ff" lineWidth={1} transparent opacity={0.5} />}
    </group>
  )
}

// 5. Advanced ANPR Scene
// 5. Advanced ANPR Scene
// 5. Advanced ANPR Scene
// 5. Advanced ANPR Scene
// 5. Advanced ANPR Scene
export function ANPRScene({ zoomLevel = 0.25, setWeatherName, isBackground = false }) {
  const vehicleRef = useRef(); const v1z = useRef(-25)
  const incomingVehicleRef = useRef(); const v2z = useRef(25)
  
  const roadRef = useRef()
  const rainRef = useRef()
  const lightningRef = useRef()
  const uiRef = useRef()
  const incomingUiRef = useRef()
  
  const skyMatRef = useRef()
  const ambientLightRef = useRef()
  const sunLightRef = useRef()
  const rainMatRef = useRef()

  const plateTexture = useTexture('/plate.png')

  // Dynamic Traffic State
  const activeVehicleIndex = useRef(0); const activeColorIndex = useRef(0); const vehicleMeshes = useRef([])
  const incomingVehicleIndex = useRef(0); const incomingColorIndex = useRef(0); const incomingVehicleMeshes = useRef([])
  const plateOffsets = [2.01, 4.01, 2.51] // Z-offset for front plate of each vehicle
  
  // Materials to dynamically change colors
  const sedanMatRef = useRef(); const busMatRef = useRef(); const suvMatRef = useRef()
  const incSedanMatRef = useRef(); const incBusMatRef = useRef(); const incSuvMatRef = useRef()
  
  const vehicleColors = ['#ff0044', '#00f3ff', '#9d4edd', '#ffffff', '#ffaa00', '#22cc22', '#111111']

  // Weather States
  const weathers = useMemo(() => [
    { name: 'Sunny', ambient: 0.8, sun: 1.0, sky: new THREE.Color('#87CEEB'), rain: 0.0, lights: 0.0 },
    { name: 'Night', ambient: 0.1, sun: 0.0, sky: new THREE.Color('#020205'), rain: 0.0, lights: 1.0 },
    { name: 'Rainy', ambient: 0.2, sun: 0.0, sky: new THREE.Color('#111118'), rain: 0.5, lights: 1.0 }
  ], [])
  const currentWeatherParams = useRef({ ambient: 0.1, sun: 0.0, sky: new THREE.Color('#020205'), rain: 0.0, lights: 1.0 })
  const lastReportedWeather = useRef('')

  // Procedural City Generation (Extended for infinite road)
  const buildingCount = 150
  const buildings = useMemo(() => {
    const b = []
    for (let i = 0; i < buildingCount; i++) {
      const side = Math.random() > 0.5 ? 1 : -1
      const x = side * (8 + Math.random() * 20)
      const z = (Math.random() - 0.5) * 300
      const width = 2 + Math.random() * 6
      const depth = 2 + Math.random() * 6
      const height = 5 + Math.random() * 25
      b.push({ x, z, width, depth, height })
    }
    return b
  }, [])

  // Rain particles
  const rainCount = 5000
  const rainPositions = useMemo(() => {
    const positions = new Float32Array(rainCount * 3)
    for (let i = 0; i < rainCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40
      positions[i * 3 + 1] = Math.random() * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200
    }
    return positions
  }, [])

  // Streetlamps
  const lamps = useMemo(() => Array.from({ length: 40 }).map((_, i) => -195 + i * 10), [])
  const lampLightRefs = useRef([])
  const lampMatRefs = useRef([])

  // Scene Root Group Ref for Zoom Out Animation
  const groupRef = useRef()

  // Traffic Light blinker state
  const trafficLightMatRef1 = useRef()
  const trafficLightMatRef2 = useRef()
  const trafficLightPointRef1 = useRef()
  const trafficLightPointRef2 = useRef()

  // Sun Mesh Ref
  const sunMeshRef = useRef()

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    
    // Zoom Out Animation (Lerp towards the controlled zoomLevel)
    if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(zoomLevel, zoomLevel, zoomLevel), delta * 5)
    }

    // --- Weather State Machine (Smooth Fade) ---
    const phaseIndex = Math.floor(time / 20) % 3
    const targetWeather = weathers[phaseIndex]
    
    // Update React State efficiently
    if (setWeatherName && lastReportedWeather.current !== targetWeather.name) {
      lastReportedWeather.current = targetWeather.name
      setWeatherName(targetWeather.name.toUpperCase())
    }
    
    currentWeatherParams.current.ambient = THREE.MathUtils.lerp(currentWeatherParams.current.ambient, targetWeather.ambient, delta * 0.5)
    currentWeatherParams.current.sun = THREE.MathUtils.lerp(currentWeatherParams.current.sun, targetWeather.sun, delta * 0.5)
    currentWeatherParams.current.rain = THREE.MathUtils.lerp(currentWeatherParams.current.rain, targetWeather.rain, delta * 0.5)
    currentWeatherParams.current.lights = THREE.MathUtils.lerp(currentWeatherParams.current.lights, targetWeather.lights, delta * 0.5)
    currentWeatherParams.current.sky.lerp(targetWeather.sky, delta * 0.5)

    if (ambientLightRef.current) ambientLightRef.current.intensity = currentWeatherParams.current.ambient
    if (sunLightRef.current) sunLightRef.current.intensity = currentWeatherParams.current.sun
    if (skyMatRef.current) skyMatRef.current.color.copy(currentWeatherParams.current.sky)
    if (rainMatRef.current) rainMatRef.current.opacity = currentWeatherParams.current.rain
    
    if (sunMeshRef.current) {
      sunMeshRef.current.material.opacity = currentWeatherParams.current.sun
    }

    // Update Streetlights
    lampLightRefs.current.forEach(l => { if (l) l.intensity = currentWeatherParams.current.lights * 2 })
    lampMatRefs.current.forEach(m => { if (m) m.emissiveIntensity = currentWeatherParams.current.lights })

    const colorRed = new THREE.Color('#ff0044')
    const colorYellow = new THREE.Color('#ffaa00')

    // --- Traffic Kinematics ---
    // LANE 1: Outgoing Traffic (Left side, moving +Z)
    if (vehicleRef.current) {
      let speed1 = 15
      // Slow down significantly at the toll gate (Z = 0)
      if (v1z.current > -8 && v1z.current < 2) speed1 = 4
      
      v1z.current += speed1 * delta
      if (v1z.current > 40) {
        v1z.current = -40
        activeVehicleIndex.current = Math.floor(Math.random() * 3)
        activeColorIndex.current = Math.floor(Math.random() * vehicleColors.length)
        const newColor = vehicleColors[activeColorIndex.current]
        if (sedanMatRef.current) sedanMatRef.current.color.set(newColor)
        if (busMatRef.current) busMatRef.current.color.set(newColor)
        if (suvMatRef.current) suvMatRef.current.color.set(newColor)
      }
      
      vehicleRef.current.position.z = v1z.current
      vehicleRef.current.position.y = Math.sin(time * speed1 * 1.5) * 0.03

      vehicleMeshes.current.forEach((mesh, index) => {
        if (mesh) mesh.visible = (index === activeVehicleIndex.current)
      })

      // Traffic Light 1 Logic (Red until scanned, Yellow while passing)
      const plate1Z = v1z.current + plateOffsets[activeVehicleIndex.current]
      const isYellow1 = plate1Z > -1.5 && plate1Z < 4.0
      if (trafficLightMatRef1.current) {
        trafficLightMatRef1.current.color.copy(isYellow1 ? colorYellow : colorRed)
        trafficLightMatRef1.current.opacity = 1
      }
      if (trafficLightPointRef1.current) {
        trafficLightPointRef1.current.color.copy(isYellow1 ? colorYellow : colorRed)
        trafficLightPointRef1.current.intensity = 2
      }
    }

    // LANE 2: Incoming Traffic (Right side, moving -Z)
    if (incomingVehicleRef.current) {
      let speed2 = 14
      // Slow down significantly at the toll gate (Z = 0)
      if (v2z.current < 8 && v2z.current > -2) speed2 = 4

      v2z.current -= speed2 * delta
      if (v2z.current < -40) {
        v2z.current = 40
        incomingVehicleIndex.current = Math.floor(Math.random() * 3)
        incomingColorIndex.current = Math.floor(Math.random() * vehicleColors.length)
        const newColor = vehicleColors[incomingColorIndex.current]
        if (incSedanMatRef.current) incSedanMatRef.current.color.set(newColor)
        if (incBusMatRef.current) incBusMatRef.current.color.set(newColor)
        if (incSuvMatRef.current) incSuvMatRef.current.color.set(newColor)
      }
      
      incomingVehicleRef.current.position.z = v2z.current
      incomingVehicleRef.current.position.y = Math.sin(time * speed2 * 1.5) * 0.03

      incomingVehicleMeshes.current.forEach((mesh, index) => {
        if (mesh) mesh.visible = (index === incomingVehicleIndex.current)
      })

      // Traffic Light 2 Logic (Red until scanned, Yellow while passing)
      const plate2Z = v2z.current - plateOffsets[incomingVehicleIndex.current]
      const isYellow2 = plate2Z < 1.5 && plate2Z > -4.0
      if (trafficLightMatRef2.current) {
        trafficLightMatRef2.current.color.copy(isYellow2 ? colorYellow : colorRed)
        trafficLightMatRef2.current.opacity = 1
      }
      if (trafficLightPointRef2.current) {
        trafficLightPointRef2.current.color.copy(isYellow2 ? colorYellow : colorRed)
        trafficLightPointRef2.current.intensity = 2
      }
    }

    // --- Weather Effects Update ---
    if (rainRef.current && currentWeatherParams.current.rain > 0.01) {
      const positions = rainRef.current.geometry.attributes.position.array
      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= 0.6
        if (positions[i * 3 + 1] < 0) positions[i * 3 + 1] = 20
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (lightningRef.current) {
      if (targetWeather.name === 'Rainy' && Math.random() > 0.985) {
        lightningRef.current.intensity = 8 + Math.random() * 10
      } else {
        lightningRef.current.intensity = Math.max(0, lightningRef.current.intensity - 1.0)
      }
    }

    // --- Scanning Logic & UI ---
    // LANE 1 (Outgoing): Toll Gate scanner is at Z=0, looking towards -Z. 
    // It scans cars when they are just approaching the gate (e.g. Z = -3).
    if (vehicleRef.current && uiRef.current) {
      const carZ = v1z.current
      const plateZ = carZ + plateOffsets[activeVehicleIndex.current]
      
      if (plateZ > -3.5 && plateZ < -0.5) {
        let vehicleName = activeVehicleIndex.current === 0 ? 'SEDAN' : activeVehicleIndex.current === 1 ? 'TRANSIT BUS' : 'SUV / TRUCK'
        uiRef.current.innerHTML = `
          <div style="color: #ff0044; font-weight: bold; border-bottom: 1px solid #ff0044; padding-bottom: 4px; margin-bottom: 4px;">STATUS: SCANNING...</div>
          <div style="color: #fff; margin-top: 4px;">CLASS: ${vehicleName}</div>
          <div style="color: #fff; margin-top: 4px;">ISOLATING PLATE...</div>
          <div style="color: #00f3ff; margin-top: 6px; font-size: 14px; font-weight: bold;">[ UP-14-XY-9999 ]</div>
          <div style="color: #00ff00; margin-top: 6px; font-weight: bold;">DB MATCH: AUTHORIZED</div>
          <div style="color: #ffaa00; margin-top: 4px;">TOLL DEDUCTED: $2.50</div>
        `
        uiRef.current.parentElement.style.borderColor = '#00ff00'
        uiRef.current.parentElement.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.4)'
      } else {
        uiRef.current.innerHTML = `
          <div style="color: #00f3ff; font-weight: bold; border-bottom: 1px solid #00f3ff; padding-bottom: 4px; margin-bottom: 4px;">STATUS: IDLE</div>
          <div style="color: #aaa; margin-top: 4px;">WAITING FOR VEHICLE...</div>
        `
        uiRef.current.parentElement.style.borderColor = '#00f3ff'
        uiRef.current.parentElement.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.2)'
      }
    }

    // LANE 2 (Incoming): Toll Gate scanner is at Z=0, looking towards +Z.
    // It scans cars when they are just approaching the gate (e.g. Z = 3).
    if (incomingVehicleRef.current && incomingUiRef.current) {
      const carZ = v2z.current
      const plateZ = carZ - plateOffsets[incomingVehicleIndex.current] // Group is rotated 180
      
      if (plateZ < 3.5 && plateZ > 0.5) {
        let vehicleName = incomingVehicleIndex.current === 0 ? 'SEDAN' : incomingVehicleIndex.current === 1 ? 'TRANSIT BUS' : 'SUV / TRUCK'
        incomingUiRef.current.innerHTML = `
          <div style="color: #ffaa00; font-weight: bold; border-bottom: 1px solid #ffaa00; padding-bottom: 4px; margin-bottom: 4px;">STATUS: SCANNING...</div>
          <div style="color: #fff; margin-top: 4px;">CLASS: ${vehicleName}</div>
          <div style="color: #fff; margin-top: 4px;">ISOLATING PLATE...</div>
          <div style="color: #00f3ff; margin-top: 6px; font-size: 14px; font-weight: bold;">[ HR-26-AB-1234 ]</div>
          <div style="color: #00ff00; margin-top: 6px; font-weight: bold;">DB MATCH: AUTHORIZED</div>
          <div style="color: #ffaa00; margin-top: 4px;">TOLL DEDUCTED: $2.50</div>
        `
        incomingUiRef.current.parentElement.style.borderColor = '#00ff00'
        incomingUiRef.current.parentElement.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.4)'
      } else {
        incomingUiRef.current.innerHTML = `
          <div style="color: #00f3ff; font-weight: bold; border-bottom: 1px solid #00f3ff; padding-bottom: 4px; margin-bottom: 4px;">STATUS: IDLE</div>
          <div style="color: #aaa; margin-top: 4px;">WAITING FOR VEHICLE...</div>
        `
        incomingUiRef.current.parentElement.style.borderColor = '#00f3ff'
        incomingUiRef.current.parentElement.style.boxShadow = '0 0 15px rgba(0, 243, 255, 0.2)'
      }
    }
  })

  const cardScale = Math.min(zoomLevel * 3.5, 1.3) // Cap the maximum scale so it doesn't block the screen
  const panelStyle = {
    background: 'rgba(0, 20, 40, 0.8)',
    backdropFilter: 'blur(8px)',
    border: '1px solid #00f3ff',
    padding: '12px 16px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    whiteSpace: 'nowrap',
    transition: 'transform 0.1s',
    transform: `scale(${cardScale})`,
    transformOrigin: 'center center'
  }

  return (
    <group ref={groupRef} rotation={[0.4, -0.6, 0]} scale={1.2}>
      {/* Sky Sphere */}
      <mesh scale={100}>
        <sphereGeometry />
        <meshBasicMaterial ref={skyMatRef} color="#020205" side={THREE.BackSide} />
      </mesh>

      {/* Infinite Ground Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#0a0a0f" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Visible Sun */}
      <mesh ref={sunMeshRef} position={[50, 60, 20]}>
        <sphereGeometry args={[6, 32, 32]} />
        <meshBasicMaterial color="#ffffcc" transparent opacity={0} />
      </mesh>

      <ambientLight ref={ambientLightRef} intensity={0.1} />
      <directionalLight ref={sunLightRef} position={[50, 60, 20]} intensity={0} color="#ffeedd" />
      <pointLight ref={lightningRef} position={[0, 20, -10]} color="#aaccff" intensity={0} distance={100} />

      {/* Procedural City Skyline */}
      <group>
        {buildings.map((b, i) => (
          <mesh key={i} position={[b.x, b.height / 2, b.z]}>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial color="#050505" roughness={0.8} />
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(b.width, b.height, b.depth)]} />
              <lineBasicMaterial color="#00f3ff" transparent opacity={0.15} />
            </lineSegments>
          </mesh>
        ))}
      </group>

      {/* Smart Streetlamps */}
      {lamps.map((z, i) => (
        <group key={`lamp-${i}`}>
          {/* Left Side */}
          <group position={[6, 0, z]}>
            <mesh position={[0, 4, 0]}><cylinderGeometry args={[0.1, 0.1, 8]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh position={[-1, 8, 0]}><boxGeometry args={[2, 0.2, 0.4]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh position={[-1.8, 7.9, 0]}>
              <boxGeometry args={[0.6, 0.1, 0.3]} />
              <meshStandardMaterial ref={el => lampMatRefs.current.push(el)} color="#ffffff" emissive="#ffddaa" emissiveIntensity={1} />
              <pointLight ref={el => lampLightRefs.current.push(el)} color="#ffddaa" intensity={2} distance={15} />
            </mesh>
          </group>
          {/* Right Side */}
          <group position={[-6, 0, z]}>
            <mesh position={[0, 4, 0]}><cylinderGeometry args={[0.1, 0.1, 8]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh position={[1, 8, 0]}><boxGeometry args={[2, 0.2, 0.4]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh position={[1.8, 7.9, 0]}>
              <boxGeometry args={[0.6, 0.1, 0.3]} />
              <meshStandardMaterial ref={el => lampMatRefs.current.push(el)} color="#ffffff" emissive="#ffddaa" emissiveIntensity={1} />
              <pointLight ref={el => lampLightRefs.current.push(el)} color="#ffddaa" intensity={2} distance={15} />
            </mesh>
          </group>
        </group>
      ))}

      {/* The Road */}
      <group ref={roadRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 400]} />
          <meshStandardMaterial color="#111111" roughness={0.9} />
        </mesh>
        {/* Dashed Lane Dividers */}
        {Array.from({ length: 100 }).map((_, i) => (
          <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -198 + i * 4]}>
            <planeGeometry args={[0.2, 2]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
          </mesh>
        ))}
        {/* Sidewalks */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5.5, 0.01, 0]}>
          <planeGeometry args={[1, 400]} />
          <meshBasicMaterial color="#222" />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.5, 0.01, 0]}>
          <planeGeometry args={[1, 400]} />
          <meshBasicMaterial color="#222" />
        </mesh>
      </group>

      {/* Toll Gate Plaza (Z = 0) */}
      <group position={[0, 0, 0]}>
        {/* Left Pillar */}
        <mesh position={[5.5, 4, 0]}>
          <boxGeometry args={[1.5, 8, 2]} />
          <meshStandardMaterial color="#1a1a1a" />
          <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(1.5, 8, 2)]} /><lineBasicMaterial color="#00f3ff" transparent opacity={0.3} /></lineSegments>
        </mesh>
        {/* Right Pillar */}
        <mesh position={[-5.5, 4, 0]}>
          <boxGeometry args={[1.5, 8, 2]} />
          <meshStandardMaterial color="#1a1a1a" />
          <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(1.5, 8, 2)]} /><lineBasicMaterial color="#ffaa00" transparent opacity={0.3} /></lineSegments>
        </mesh>
        {/* Main Overhead Beam */}
        <mesh position={[0, 8, 0]}>
          <boxGeometry args={[12, 1.5, 2]} />
          <meshStandardMaterial color="#222" />
          <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(12, 1.5, 2)]} /><lineBasicMaterial color="#ffffff" transparent opacity={0.2} /></lineSegments>
        </mesh>
        {/* Toll Gate Signs */}
        <mesh position={[2.5, 8, 1.01]}>
          <planeGeometry args={[3, 1]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.2} />
        </mesh>
        <mesh position={[-2.5, 8, -1.01]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[3, 1]} />
          <meshBasicMaterial color="#ffaa00" transparent opacity={0.2} />
        </mesh>

        {/* Toll Gate Traffic Lights (Warning Blinkers) */}
        {/* Left Lane (Outgoing): Traffic approaches from -Z, so light must face -Z (rotate 180). Placed securely ON the beam (Y=8). */}
        <group position={[2.5, 8, -1.05]} rotation={[0, Math.PI, 0]}>
          <mesh><boxGeometry args={[0.8, 0.8, 0.2]} /><meshStandardMaterial color="#111" /></mesh>
          <mesh position={[0, 0, 0.11]}><circleGeometry args={[0.25, 16]} /><meshBasicMaterial ref={trafficLightMatRef1} color="#ffaa00" transparent /></mesh>
          <pointLight ref={trafficLightPointRef1} color="#ffaa00" intensity={0} distance={15} position={[0, 0, 1]} />
        </group>
        {/* Right Lane (Incoming): Traffic approaches from +Z, so light must face +Z (rotate 0). Placed securely ON the beam (Y=8). */}
        <group position={[-2.5, 8, 1.05]} rotation={[0, 0, 0]}>
          <mesh><boxGeometry args={[0.8, 0.8, 0.2]} /><meshStandardMaterial color="#111" /></mesh>
          <mesh position={[0, 0, 0.11]}><circleGeometry args={[0.25, 16]} /><meshBasicMaterial ref={trafficLightMatRef2} color="#ffaa00" transparent /></mesh>
          <pointLight ref={trafficLightPointRef2} color="#ffaa00" intensity={0} distance={15} position={[0, 0, 1]} />
        </group>

        {/* CCTV Scanner 1 (Outgoing Traffic, Left Lane) */}
        {/* Group rotates 180 on Y to look at -Z, then inner group tilts down on X */}
        <group position={[2.5, 7.2, -1]} rotation={[0, Math.PI, 0]}>
          <group rotation={[Math.PI / 4, 0, 0]}>
            <mesh><boxGeometry args={[0.5, 0.5, 1]} /><meshStandardMaterial color="#333" /><lineSegments><edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, 1)]} /><lineBasicMaterial color="#ff0044" transparent opacity={0.5} /></lineSegments></mesh>
            <mesh position={[0, 0, 0.51]}><circleGeometry args={[0.2, 16]} /><meshBasicMaterial color="#ff0044" /></mesh>
            {/* Laser Frustum sweeping perfectly out of the lens to a larger radius */}
            <mesh position={[0, 0, 4.5]} rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.01, 2, 8, 32, 1, true]} />
              <meshBasicMaterial color="#ff0044" transparent opacity={0.15} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          </group>
        </group>

        {/* CCTV Scanner 2 (Incoming Traffic, Right Lane) */}
        {/* Group looks at +Z, inner group tilts down on X */}
        <group position={[-2.5, 7.2, 1]} rotation={[0, 0, 0]}>
          <group rotation={[Math.PI / 4, 0, 0]}>
            <mesh><boxGeometry args={[0.5, 0.5, 1]} /><meshStandardMaterial color="#333" /><lineSegments><edgesGeometry args={[new THREE.BoxGeometry(0.5, 0.5, 1)]} /><lineBasicMaterial color="#ffaa00" transparent opacity={0.5} /></lineSegments></mesh>
            <mesh position={[0, 0, 0.51]}><circleGeometry args={[0.2, 16]} /><meshBasicMaterial color="#ffaa00" /></mesh>
            {/* Laser Frustum sweeping perfectly out of the lens to a larger radius */}
            <mesh position={[0, 0, 4.5]} rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.01, 2, 8, 32, 1, true]} />
              <meshBasicMaterial color="#ffaa00" transparent opacity={0.15} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          </group>
        </group>
      </group>

      {/* Rain Particle System */}
      <points ref={rainRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={rainCount} array={rainPositions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial ref={rainMatRef} color="#88ccff" size={0.06} transparent opacity={0.5} />
      </points>

      {/* LANE 1: Outgoing Traffic Container (Left Lane X = +2.5) */}
      <group ref={vehicleRef} position={[2.5, 0, 0]}>
        {/* 0. SEDAN */}
        <group ref={el => vehicleMeshes.current[0] = el}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[2, 0.8, 4]} />
            <meshStandardMaterial ref={sedanMatRef} color="#111" roughness={0.3} metalness={0.8} />
            <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(2, 0.8, 4)]} /><lineBasicMaterial color="#00f3ff" transparent opacity={0.3} /></lineSegments>
          </mesh>
          <mesh position={[0, 1.2, -0.5]}>
            <boxGeometry args={[1.6, 0.6, 2]} />
            <meshStandardMaterial color="#050505" />
          </mesh>
          <mesh position={[0, 0.4, 2.01]}><planeGeometry args={[0.8, 0.4]} /><meshBasicMaterial map={plateTexture} color="#ffffff" /></mesh>
          <mesh position={[0.8, 0.5, 2.01]}><planeGeometry args={[0.3, 0.2]} /><meshBasicMaterial color="#eef" /></mesh>
          <mesh position={[-0.8, 0.5, 2.01]}><planeGeometry args={[0.3, 0.2]} /><meshBasicMaterial color="#eef" /></mesh>
        </group>

        {/* 1. TRANSIT BUS */}
        <group ref={el => vehicleMeshes.current[1] = el} visible={false}>
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[2.5, 2.5, 8]} />
            <meshStandardMaterial ref={busMatRef} color="#111" roughness={0.5} metalness={0.2} />
            <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(2.5, 2.5, 8)]} /><lineBasicMaterial color="#ff0044" transparent opacity={0.3} /></lineSegments>
          </mesh>
          <mesh position={[0, 1.8, 0]}>
             <boxGeometry args={[2.55, 1.0, 7.8]} />
             <meshStandardMaterial color="#050505" />
          </mesh>
          <mesh position={[0, 0.5, 4.01]}><planeGeometry args={[1.0, 0.5]} /><meshBasicMaterial map={plateTexture} color="#ffffff" /></mesh>
          <mesh position={[1.0, 0.5, 4.01]}><planeGeometry args={[0.4, 0.3]} /><meshBasicMaterial color="#eef" /></mesh>
          <mesh position={[-1.0, 0.5, 4.01]}><planeGeometry args={[0.4, 0.3]} /><meshBasicMaterial color="#eef" /></mesh>
        </group>

        {/* 2. SUV / TRUCK */}
        <group ref={el => vehicleMeshes.current[2] = el} visible={false}>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[2.2, 1.2, 5]} />
            <meshStandardMaterial ref={suvMatRef} color="#222" roughness={0.4} />
            <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(2.2, 1.2, 5)]} /><lineBasicMaterial color="#9d4edd" transparent opacity={0.5} /></lineSegments>
          </mesh>
          <mesh position={[0, 1.8, -0.5]}>
            <boxGeometry args={[2.0, 0.8, 2.5]} />
            <meshStandardMaterial color="#050505" />
          </mesh>
          <mesh position={[0, 0.5, 2.51]}><planeGeometry args={[0.8, 0.4]} /><meshBasicMaterial map={plateTexture} color="#ffffff" /></mesh>
          <mesh position={[0.9, 0.8, 2.51]}><planeGeometry args={[0.3, 0.3]} /><meshBasicMaterial color="#eef" /></mesh>
          <mesh position={[-0.9, 0.8, 2.51]}><planeGeometry args={[0.3, 0.3]} /><meshBasicMaterial color="#eef" /></mesh>
        </group>
      </group>

      {/* LANE 2: Incoming Traffic Container (Right Lane X = -2.5) */}
      <group ref={incomingVehicleRef} position={[-2.5, 0, 0]} rotation={[0, Math.PI, 0]}>
        {/* 0. SEDAN */}
        <group ref={el => incomingVehicleMeshes.current[0] = el}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[2, 0.8, 4]} />
            <meshStandardMaterial ref={incSedanMatRef} color="#111" roughness={0.3} metalness={0.8} />
            <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(2, 0.8, 4)]} /><lineBasicMaterial color="#00f3ff" transparent opacity={0.3} /></lineSegments>
          </mesh>
          <mesh position={[0, 1.2, -0.5]}>
            <boxGeometry args={[1.6, 0.6, 2]} />
            <meshStandardMaterial color="#050505" />
          </mesh>
          <mesh position={[0, 0.4, 2.01]}><planeGeometry args={[0.8, 0.4]} /><meshBasicMaterial map={plateTexture} color="#ffffff" /></mesh>
          <mesh position={[0.8, 0.5, 2.01]}><planeGeometry args={[0.3, 0.2]} /><meshBasicMaterial color="#eef" /></mesh>
          <mesh position={[-0.8, 0.5, 2.01]}><planeGeometry args={[0.3, 0.2]} /><meshBasicMaterial color="#eef" /></mesh>
        </group>

        {/* 1. TRANSIT BUS */}
        <group ref={el => incomingVehicleMeshes.current[1] = el} visible={false}>
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[2.5, 2.5, 8]} />
            <meshStandardMaterial ref={incBusMatRef} color="#111" roughness={0.5} metalness={0.2} />
            <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(2.5, 2.5, 8)]} /><lineBasicMaterial color="#ff0044" transparent opacity={0.3} /></lineSegments>
          </mesh>
          <mesh position={[0, 1.8, 0]}>
             <boxGeometry args={[2.55, 1.0, 7.8]} />
             <meshStandardMaterial color="#050505" />
          </mesh>
          <mesh position={[0, 0.5, 4.01]}><planeGeometry args={[1.0, 0.5]} /><meshBasicMaterial map={plateTexture} color="#ffffff" /></mesh>
          <mesh position={[1.0, 0.5, 4.01]}><planeGeometry args={[0.4, 0.3]} /><meshBasicMaterial color="#eef" /></mesh>
          <mesh position={[-1.0, 0.5, 4.01]}><planeGeometry args={[0.4, 0.3]} /><meshBasicMaterial color="#eef" /></mesh>
        </group>

        {/* 2. SUV / TRUCK */}
        <group ref={el => incomingVehicleMeshes.current[2] = el} visible={false}>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[2.2, 1.2, 5]} />
            <meshStandardMaterial ref={incSuvMatRef} color="#222" roughness={0.4} />
            <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(2.2, 1.2, 5)]} /><lineBasicMaterial color="#9d4edd" transparent opacity={0.5} /></lineSegments>
          </mesh>
          <mesh position={[0, 1.8, -0.5]}>
            <boxGeometry args={[2.0, 0.8, 2.5]} />
            <meshStandardMaterial color="#050505" />
          </mesh>
          <mesh position={[0, 0.5, 2.51]}><planeGeometry args={[0.8, 0.4]} /><meshBasicMaterial map={plateTexture} color="#ffffff" /></mesh>
          <mesh position={[0.9, 0.8, 2.51]}><planeGeometry args={[0.3, 0.3]} /><meshBasicMaterial color="#eef" /></mesh>
          <mesh position={[-0.9, 0.8, 2.51]}><planeGeometry args={[0.3, 0.3]} /><meshBasicMaterial color="#eef" /></mesh>
        </group>
      </group>

      {/* UI Panel 1 */}
      {!isBackground && (
      <Html position={[12, 6, 0]} center>
        <div style={panelStyle}><div ref={uiRef} style={{ fontSize: '11px', lineHeight: '1.4' }}></div></div>
      </Html>
      )}

      {/* UI Panel 2 */}
      {!isBackground && (
      <Html position={[-12, 6, 0]} center>
        <div style={panelStyle}><div ref={incomingUiRef} style={{ fontSize: '11px', lineHeight: '1.4' }}></div></div>
      </Html>
      )}
    </group>
  )
}
