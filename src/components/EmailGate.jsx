import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, Html, OrbitControls, Line, Edges } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, PlusCircle, MinusCircle } from 'lucide-react'

// --- Animated Synapse (Connection) - Perfect Single Wave ---
function AnimatedSynapse({ start, end, layerIdx, totalLayers }) {
  const lineRef = useRef()
  const speed = 1.5 // 1.5s per layer
  
  const distance = useMemo(() => new THREE.Vector3(...start).distanceTo(new THREE.Vector3(...end)), [start, end])

  useFrame((state) => {
    if (lineRef.current) {
      const time = state.clock.elapsedTime
      const waveCycle = totalLayers * speed + 1.5 // total time for wave + 1.5s delay
      const localTime = time % waveCycle
      
      const layerStartTime = layerIdx * speed
      const layerEndTime = (layerIdx + 1) * speed
      
      if (localTime >= layerStartTime && localTime < layerEndTime) {
        const progress = (localTime - layerStartTime) / speed
        const opacity = Math.sin(progress * Math.PI)
        lineRef.current.material.opacity = Math.max(0.05, opacity * 0.9)
        lineRef.current.material.dashOffset = -progress * (distance + distance * 0.3)
      } else {
        lineRef.current.material.opacity = 0.05
      }
    }
  })

  return (
    <group>
      {/* Static Base Connection Line */}
      <Line 
        points={[start, end]}
        color="#ffffff"
        lineWidth={1}
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
      {/* Animated Wave Packet */}
      <Line 
        ref={lineRef}
        points={[start, end]}
        color="#ffffff"
        lineWidth={4}
        transparent
        opacity={0.05}
        dashed={true}
        dashScale={1}
        dashSize={distance * 0.4}
        gapSize={distance * 2}
        blending={THREE.AdditiveBlending}
      />
    </group>
  )
}

// --- 3D CNN Visualizer ---
function CNNGraph({ cnnLayers, cnnDense, isPresenting }) {
  const groupRef = useRef()
  const totalStages = 1 + cnnLayers.length + cnnDense.length
  const maxDepth = Math.max(...cnnLayers, ...cnnDense)

  // Dynamic Scale: Fits perfectly on screen
  const baseSpacing = 3;
  const reqWidth = totalStages * baseSpacing;
  const reqHeight = maxDepth * 1;
  const scale = Math.min(1.2, 14 / Math.max(reqWidth, 1), 10 / Math.max(reqHeight, 1));
  const layerSpacing = baseSpacing * scale;

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Clean, locked isometric view. No wobble.
      groupRef.current.rotation.y = -0.6
      groupRef.current.rotation.x = 0.2
      
      if (isPresenting) {
        groupRef.current.position.x -= delta * 8
      } else {
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.05)
      }
    }
  })

  const startX = -((totalStages - 1) * layerSpacing) / 2

  // Generate blocks
  const blocks = []
  
  // Input Plane
  blocks.push({ x: startX, type: 'input', depth: 1, size: 4 * scale, color: '#ffff99' })
  
  // Feature Maps (CT Scan Slices stacked as perfect isometric glass plates)
  cnnLayers.forEach((depth, idx) => {
    const size = Math.max(1.5 * scale, (3.5 - idx * 0.5) * scale)
    blocks.push({ x: startX + (idx + 1) * layerSpacing, type: 'conv', depth, size, color: '#00f3ff' })
  })

  // Dense Layer (Flattened NN tail)
  const denseStartX = startX + (cnnLayers.length + 1) * layerSpacing
  cnnDense.forEach((neurons, idx) => {
    blocks.push({ 
      x: denseStartX + idx * layerSpacing, 
      type: 'dense', 
      depth: neurons, 
      color: idx === cnnDense.length - 1 ? '#ff0044' : '#ffb3d9' 
    })
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {blocks.map((b, layerIdx) => {
        if (b.type === 'dense') {
          return (
             <group key={`l-${layerIdx}`}>
               {[...Array(b.depth)].map((_, i) => (
                 <mesh key={i} position={[b.x, (i - (b.depth - 1) / 2) * (0.8 * scale), 0]}>
                    <sphereGeometry args={[0.225 * scale, 16, 16]} />
                    <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={1.5} />
                 </mesh>
               ))}
             </group>
          )
        } else {
          return (
             <group key={`l-${layerIdx}`}>
               {[...Array(b.depth)].map((_, i) => {
                 // Slices added purely horizontally (X-axis) within the block, much closer now
                 const xOffset = (i - (b.depth - 1) / 2) * (0.08 * scale)
                 return (
                   <mesh key={i} position={[b.x + xOffset, 0, 0]}>
                      <boxGeometry args={[0.05 * scale, b.size, b.size]} />
                      <meshStandardMaterial color={b.color} transparent opacity={0.15} />
                      <Edges color={b.color} />
                   </mesh>
                 )
               })}
             </group>
          )
        }
      })}

      {/* Fully Connected Flow Lines between every pixel/filter */}
      {blocks.slice(0, -1).map((b, idx) => {
        const nextB = blocks[idx + 1]
        
        const currentNodes = []
        for(let i=0; i<b.depth; i++) {
          const xOffset = b.type === 'dense' ? 0 : (i - (b.depth - 1) / 2) * (0.08 * scale)
          const yOffset = b.type === 'dense' ? (i - (b.depth - 1) / 2) * (0.8 * scale) : 0
          currentNodes.push([b.x + xOffset, yOffset, 0])
        }
        
        const nextNodes = []
        for(let i=0; i<nextB.depth; i++) {
          const xOffset = nextB.type === 'dense' ? 0 : (i - (nextB.depth - 1) / 2) * (0.08 * scale)
          const yOffset = nextB.type === 'dense' ? (i - (nextB.depth - 1) / 2) * (0.8 * scale) : 0
          nextNodes.push([nextB.x + xOffset, yOffset, 0])
        }
        
        return (
          <group key={`conn-layer-${idx}`}>
            {currentNodes.map((start, startIdx) => 
              nextNodes.map((end, endIdx) => (
                <AnimatedSynapse 
                  key={`c-${startIdx}-${endIdx}`} 
                  start={start} 
                  end={end} 
                  layerIdx={idx} 
                  totalLayers={totalStages} 
                />
              ))
            )}
          </group>
        )
      })}
    </group>
  )
}

// --- K-Means Clustering Game ---
function KMeansGame({ stepTrigger, resetTrigger }) {
  const groupRef = useRef()
  const numPoints = 150
  
  const [points, setPoints] = useState([])
  const [centroids, setCentroids] = useState([])
  
  const clusterColors = ["#ff0044", "#00f3ff", "#9d4edd", "#ffff99"]
  
  const generateData = useCallback(() => {
     const trueCenters = [
       { x: -4 + Math.random()*8, y: -4 + Math.random()*8, z: -4 + Math.random()*8 },
       { x: -4 + Math.random()*8, y: -4 + Math.random()*8, z: -4 + Math.random()*8 },
       { x: -4 + Math.random()*8, y: -4 + Math.random()*8, z: -4 + Math.random()*8 }
     ]
     
     const newPoints = []
     for(let i=0; i<numPoints; i++) {
        const c = trueCenters[i % 3]
        newPoints.push({
           x: c.x + (Math.random()-0.5)*4,
           y: c.y + (Math.random()-0.5)*4,
           z: c.z + (Math.random()-0.5)*4,
           cluster: -1,
           id: i
        })
     }
     setPoints(newPoints)
     
     setCentroids([
        { x: -6 + Math.random()*12, y: -6 + Math.random()*12, z: -6 + Math.random()*12, color: clusterColors[0] },
        { x: -6 + Math.random()*12, y: -6 + Math.random()*12, z: -6 + Math.random()*12, color: clusterColors[1] },
        { x: -6 + Math.random()*12, y: -6 + Math.random()*12, z: -6 + Math.random()*12, color: clusterColors[2] }
     ])
  }, [])
  
  useEffect(() => {
     generateData()
  }, [resetTrigger, generateData])
  
  useEffect(() => {
     if (stepTrigger > 0) {
        const newPoints = points.map(p => {
           let minDist = Infinity
           let closestIdx = -1
           centroids.forEach((c, idx) => {
              const dist = Math.sqrt((p.x-c.x)**2 + (p.y-c.y)**2 + (p.z-c.z)**2)
              if (dist < minDist) {
                 minDist = dist
                 closestIdx = idx
              }
           })
           return { ...p, cluster: closestIdx }
        })
        setPoints(newPoints)
        
        setTimeout(() => {
            const newCentroids = centroids.map((c, idx) => {
               const assignedPoints = newPoints.filter(p => p.cluster === idx)
               if (assignedPoints.length === 0) return c
               
               const sumX = assignedPoints.reduce((acc, p) => acc + p.x, 0)
               const sumY = assignedPoints.reduce((acc, p) => acc + p.y, 0)
               const sumZ = assignedPoints.reduce((acc, p) => acc + p.z, 0)
               
               return {
                 ...c,
                 x: sumX / assignedPoints.length,
                 y: sumY / assignedPoints.length,
                 z: sumZ / assignedPoints.length
               }
            })
            setCentroids(newCentroids)
        }, 600)
     }
  }, [stepTrigger])
  
  useFrame((state, delta) => {
      if (groupRef.current) {
          groupRef.current.rotation.y += delta * 0.1
      }
  })
  
  return (
     <group ref={groupRef} scale={0.7} position={[0,0,0]}>
        {points.map(p => (
           <mesh key={`p-${p.id}`} position={[p.x, p.y, p.z]}>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color={p.cluster === -1 ? '#ffffff' : clusterColors[p.cluster]} />
              {p.cluster !== -1 && (
                 <Line 
                    points={[[0,0,0], [centroids[p.cluster].x - p.x, centroids[p.cluster].y - p.y, centroids[p.cluster].z - p.z]]}
                    color={clusterColors[p.cluster]}
                    lineWidth={1}
                    transparent
                    opacity={0.3}
                 />
              )}
           </mesh>
        ))}
        
        {centroids.map((c, idx) => (
           <mesh key={`c-${idx}`} position={[c.x, c.y, c.z]}>
              <sphereGeometry args={[0.5, 32, 32]} />
              <meshStandardMaterial color={c.color} emissive={c.color} emissiveIntensity={1.5} />
           </mesh>
        ))}
     </group>
  )
}

// --- Q-Learning Maze Game ---
const MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 1, 0, 3, 1],
  [1, 1, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
]

function QLearningGame({ explorationRate, learningRateQ, discountFactor, isPlaying, resetTrigger }) {
  const groupRef = useRef()
  const agentRef = useRef()
  const qTable = useRef({})
  
  const agentPos = useRef({ r: 1, c: 1 })
  const lastStepTime = useRef(0)
  
  const [renderTick, setRenderTick] = useState(0)

  useEffect(() => {
     qTable.current = {}
     for(let r=0; r<MAZE.length; r++) {
         for(let c=0; c<MAZE[0].length; c++) {
            if (MAZE[r][c] !== 1) {
                qTable.current[`${r},${c}`] = [0,0,0,0] // Up, Right, Down, Left
            }
         }
     }
     agentPos.current = { r: 1, c: 1 }
     if (agentRef.current) {
        agentRef.current.position.x = 1 - 4
        agentRef.current.position.z = 1 - 3.5
     }
     setRenderTick(t => t + 1)
  }, [resetTrigger])

  const getValidMoves = (r, c) => {
      const moves = []
      if (r > 0 && MAZE[r-1][c] !== 1) moves.push([-1, 0, 0])
      if (c < MAZE[0].length-1 && MAZE[r][c+1] !== 1) moves.push([0, 1, 1])
      if (r < MAZE.length-1 && MAZE[r+1][c] !== 1) moves.push([1, 0, 2])
      if (c > 0 && MAZE[r][c-1] !== 1) moves.push([0, -1, 3])
      return moves
  }

  useFrame((state) => {
      if (groupRef.current) {
          groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2
      }
      
      if (isPlaying && state.clock.elapsedTime - lastStepTime.current > 0.05) {
          lastStepTime.current = state.clock.elapsedTime
          
          let { r, c } = agentPos.current
          if (MAZE[r][c] === 3) {
              agentPos.current = { r: 1, c: 1 }
              if (agentRef.current) {
                 agentRef.current.position.x = 1 - 4
                 agentRef.current.position.z = 1 - 3.5
              }
              return
          }
          
          const validMoves = getValidMoves(r, c)
          if (validMoves.length === 0) return
          
          let action;
          if (Math.random() < explorationRate) {
              action = validMoves[Math.floor(Math.random() * validMoves.length)]
          } else {
              const qs = qTable.current[`${r},${c}`]
              let bestVal = -Infinity
              let bestActions = []
              validMoves.forEach(m => {
                  const val = qs[m[2]]
                  if (val > bestVal) { bestVal = val; bestActions = [m] }
                  else if (val === bestVal) { bestActions.push(m) }
              })
              action = bestActions[Math.floor(Math.random() * bestActions.length)]
          }
          
          const nextR = r + action[0]
          const nextC = c + action[1]
          const actionIdx = action[2]
          
          let reward = -0.1
          if (MAZE[nextR][nextC] === 3) reward = 100
          
          let maxNextQ = 0;
          if (MAZE[nextR][nextC] !== 3) {
              const nextValid = getValidMoves(nextR, nextC)
              const nextQs = qTable.current[`${nextR},${nextC}`]
              maxNextQ = nextValid.length > 0 ? Math.max(...nextValid.map(m => nextQs[m[2]])) : 0
          }
          
          const currentQ = qTable.current[`${r},${c}`][actionIdx]
          qTable.current[`${r},${c}`][actionIdx] = currentQ + learningRateQ * (reward + discountFactor * maxNextQ - currentQ)
          
          agentPos.current = { r: nextR, c: nextC }
          setRenderTick(t => t + 1)
      }
      
      if (agentRef.current) {
          const targetX = agentPos.current.c - 4
          const targetZ = agentPos.current.r - 3.5
          agentRef.current.position.x += (targetX - agentRef.current.position.x) * 0.6
          agentRef.current.position.z += (targetZ - agentRef.current.position.z) * 0.6
      }
  })
  
  return (
     <group ref={groupRef} scale={1.2} position={[0, -1, 0]} rotation={[0.4, 0, 0]}>
         {MAZE.map((row, r) => row.map((cell, c) => {
             const x = c - 4
             const z = r - 3.5
             if (cell === 1) {
                 return (
                    <mesh key={`w-${r}-${c}`} position={[x, 0.5, z]}>
                       <boxGeometry args={[1, 1, 1]} />
                       <meshStandardMaterial color="#333" transparent opacity={0.5} />
                       <Edges scale={1} color="#00f3ff" />
                    </mesh>
                 )
             } else {
                 let floorColor = "#222"
                 let emissive = "#000"
                 let emIntensity = 0
                 
                 if (cell === 2) { floorColor = "#ffff99"; emissive = "#ffff99"; emIntensity = 0.5 }
                 if (cell === 3) { floorColor = "#ff0044"; emissive = "#ff0044"; emIntensity = 1.0 }
                 
                 let maxQ = 0
                 if (qTable.current[`${r},${c}`]) {
                     maxQ = Math.max(...qTable.current[`${r},${c}`])
                 }
                 if (cell === 0 && maxQ > 0) {
                     floorColor = "#00ff00"
                     emissive = "#00ff00"
                     emIntensity = Math.min(1.0, maxQ / 100)
                 }
                 
                 return (
                    <mesh key={`f-${r}-${c}`} position={[x, 0, z]}>
                       <boxGeometry args={[0.95, 0.1, 0.95]} />
                       <meshStandardMaterial color={floorColor} emissive={emissive} emissiveIntensity={emIntensity} />
                    </mesh>
                 )
             }
         }))}
         
         <mesh ref={agentRef} position={[1 - 4, 0.5, 1 - 3.5]}>
             <sphereGeometry args={[0.3, 16, 16]} />
             <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} />
         </mesh>
     </group>
  )
}

// --- 3D Architecture Visualizer ---
function NetworkGraph({ layers, isPresenting }) {
  const groupRef = useRef()

  const numLayers = layers.length
  const maxNeurons = Math.max(...layers)

  // Dynamic Scale
  const baseLayerSpacing = 3;
  const baseNeuronSpacing = 1.2;
  const reqWidth = numLayers * baseLayerSpacing;
  const reqHeight = maxNeurons * baseNeuronSpacing;
  const scale = Math.min(1.2, 14 / Math.max(reqWidth, 1), 10 / Math.max(reqHeight, 1));
  
  const layerSpacing = baseLayerSpacing * scale;
  const neuronSpacing = baseNeuronSpacing * scale;

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Clean, locked isometric view. No wobble.
      groupRef.current.rotation.y = -0.6
      groupRef.current.rotation.x = 0.1
      
      if (isPresenting) {
        groupRef.current.position.x -= delta * 8
      } else {
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.05)
      }
    }
  })

  const { nodes, connections } = useMemo(() => {
    const nodes = []
    const connections = []

    layers.forEach((numNeurons, layerIdx) => {
      const x = (layerIdx - (numLayers - 1) / 2) * layerSpacing
      for (let i = 0; i < numNeurons; i++) {
        const y = (i - (numNeurons - 1) / 2) * neuronSpacing
        const z = 0
        nodes.push({ 
          id: `L${layerIdx}-N${i}`, 
          position: new THREE.Vector3(x, y, z), 
          layerIdx,
          isTopNeuron: i === numNeurons - 1,
          numNeurons
        })
      }
    })

    for (let l = 0; l < numLayers - 1; l++) {
      const currentLayerNodes = nodes.filter(n => n.layerIdx === l)
      const nextLayerNodes = nodes.filter(n => n.layerIdx === l + 1)

      currentLayerNodes.forEach(n1 => {
        nextLayerNodes.forEach(n2 => {
          connections.push({
            start: n1.position,
            end: n2.position,
            layerIdx: n1.layerIdx
          })
        })
      })
    }

    return { nodes, connections }
  }, [layers, scale, layerSpacing, neuronSpacing])

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {connections.map((conn, idx) => (
        <AnimatedSynapse 
          key={idx}
          start={conn.start}
          end={conn.end}
          layerIdx={conn.layerIdx}
          totalLayers={layers.length}
        />
      ))}

      {nodes.map((node) => {
        const isInput = node.layerIdx === 0
        const isOutput = node.layerIdx === layers.length - 1
        const color = isInput ? "#ffff99" : isOutput ? "#ff0044" : "#ffb3d9"
        return (
          <group position={node.position} key={node.id}>
            <mesh>
              <sphereGeometry args={[0.15 * scale, 32, 32]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.27 * scale, 32, 32]} />
              <meshStandardMaterial 
                color={color}
                emissive={color}
                emissiveIntensity={2}
                transparent
                opacity={0.2}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export default function EmailGate({ onMockLogin, isAnimatingOut }) {
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')
  const [layers, setLayers] = useState([10, 9, 8, 6, 4, 2])
  const [networkType, setNetworkType] = useState('ANN') // 'ANN', 'CNN', or 'GAME'
  
  // CNN specific states
  const [cnnLayers, setCnnLayers] = useState([10, 8, 6, 4]) // depth/filters of each feature map
  const [cnnDense, setCnnDense] = useState([8, 2]) // flattened dense network at tail
  
  // Game specific states
  const [explorationRate, setExplorationRate] = useState(0.2)
  const [learningRateQ, setLearningRateQ] = useState(0.8)
  const [discountFactor, setDiscountFactor] = useState(0.9)
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameResetTrigger, setGameResetTrigger] = useState(0)
  
  const [gameSubtype, setGameSubtype] = useState('QLEARNING') // 'QLEARNING' or 'KMEANS'
  const [kMeansStepTrigger, setKMeansStepTrigger] = useState(0)
  const [kMeansResetTrigger, setKMeansResetTrigger] = useState(0)
  const [showQIntro, setShowQIntro] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) onMockLogin()
  }

  // --- ANN Controls ---
  const addLayer = () => {
    if (layers.length < 8) {
      const newLayers = [...layers]
      newLayers.splice(layers.length - 1, 0, 4)
      setLayers(newLayers)
    }
  }

  const removeLayer = () => {
    if (layers.length > 2) {
      const newLayers = [...layers]
      newLayers.splice(layers.length - 2, 1)
      setLayers(newLayers)
    }
  }

  const updateNeuron = (layerIdx, delta) => {
    const newLayers = [...layers]
    const current = newLayers[layerIdx]
    if (current + delta > 0 && current + delta <= 10) {
      newLayers[layerIdx] += delta
      setLayers(newLayers)
    }
  }

  // --- CNN Controls ---
  const addCnnLayer = () => {
    if (cnnLayers.length < 6) {
      setCnnLayers([...cnnLayers, 8])
    }
  }

  const removeCnnLayer = () => {
    if (cnnLayers.length > 1) {
      setCnnLayers(cnnLayers.slice(0, -1))
    }
  }

  const updateCnnDepth = (layerIdx, delta) => {
    const newCnn = [...cnnLayers]
    const current = newCnn[layerIdx]
    if (current + delta > 0 && current + delta <= 12) {
      newCnn[layerIdx] += delta
      setCnnLayers(newCnn)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10 }}>
      {/* 3D Visualizer Seamless Layer on the Left */}
      <div style={{ 
        position: 'absolute', 
        left: 0, 
        top: 0, 
        bottom: 0, 
        width: '50%', 
        pointerEvents: 'auto'
      }}>
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#00f3ff" />
          <directionalLight position={[-10, 10, 5]} intensity={0.5} color="#ff66b2" />
          {networkType === 'ANN' ? (
            <NetworkGraph layers={layers} isPresenting={isAnimatingOut} />
          ) : networkType === 'CNN' ? (
            <CNNGraph cnnLayers={cnnLayers} cnnDense={cnnDense} isPresenting={isAnimatingOut} />
          ) : gameSubtype === 'QLEARNING' ? (
            <QLearningGame 
               explorationRate={explorationRate} 
               learningRateQ={learningRateQ} 
               discountFactor={discountFactor}
               isPlaying={isPlaying}
               resetTrigger={gameResetTrigger}
            />
          ) : (
             <KMeansGame 
               stepTrigger={kMeansStepTrigger}
               resetTrigger={kMeansResetTrigger}
             />
          )}
          <OrbitControls enableZoom={true} enablePan={false} maxDistance={20} minDistance={5} />
        </Canvas>
      </div>
      {/* Network Type Toggle (Top Left) */}

      {/* Network Type Toggle (Top Left) */}
      <AnimatePresence>
        {showForm && !isAnimatingOut && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: '40px',
              left: '50px',
              pointerEvents: 'auto',
              display: 'flex',
              gap: '12px',
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(10px)',
              padding: '6px',
              borderRadius: '20px',
              border: '1px solid var(--glass-border)'
            }}
          >
            <button
              onClick={() => setNetworkType('ANN')}
              style={{
                padding: '8px 16px',
                borderRadius: '16px',
                border: 'none',
                background: networkType === 'ANN' ? 'var(--accent-cyan)' : 'transparent',
                color: networkType === 'ANN' ? '#000' : 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ANN
            </button>
            <button
              onClick={() => setNetworkType('CNN')}
              style={{
                padding: '8px 16px',
                borderRadius: '16px',
                border: 'none',
                background: networkType === 'CNN' ? 'var(--accent-cyan)' : 'transparent',
                color: networkType === 'CNN' ? '#000' : 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              CNN
            </button>
            <button
              onClick={() => setNetworkType('GAME')}
              style={{
                padding: '8px 16px',
                borderRadius: '16px',
                border: 'none',
                background: networkType === 'GAME' ? 'var(--accent-cyan)' : 'transparent',
                color: networkType === 'GAME' ? '#000' : 'white',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              GAME
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Controls Panel */}
      <AnimatePresence>
        {showForm && !isAnimatingOut && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50px',
              pointerEvents: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {networkType === 'ANN' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  {layers.map((numNeurons, idx) => (
                    <div key={idx} style={{
                      background: 'var(--glass-bg)',
                      backdropFilter: 'blur(10px)',
                      padding: '12px',
                      borderRadius: '16px',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      minWidth: '90px'
                    }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {idx === 0 ? 'Input' : idx === layers.length - 1 ? 'Output' : `Hidden ${idx}`}
                      </span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'white' }}>{numNeurons}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => updateNeuron(idx, -1)}
                          disabled={numNeurons <= 1}
                          style={{ background: 'transparent', border: 'none', color: numNeurons <= 1 ? '#555' : 'var(--accent-purple)', cursor: numNeurons <= 1 ? 'not-allowed' : 'pointer' }}
                        >
                          <MinusCircle size={20} />
                        </button>
                        <button 
                          onClick={() => updateNeuron(idx, 1)}
                          disabled={numNeurons >= 10}
                          style={{ background: 'transparent', border: 'none', color: numNeurons >= 10 ? '#555' : 'var(--accent-cyan)', cursor: numNeurons >= 10 ? 'not-allowed' : 'pointer' }}
                        >
                          <PlusCircle size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <button
                    onClick={removeLayer}
                    disabled={layers.length <= 2}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 16px', borderRadius: '30px',
                      border: '1px solid var(--glass-border)',
                      background: 'rgba(255, 0, 68, 0.1)',
                      color: layers.length <= 2 ? '#555' : '#ff0044',
                      cursor: layers.length <= 2 ? 'not-allowed' : 'pointer',
                      fontWeight: 600, transition: 'all 0.2s ease'
                    }}
                  >
                    <Minus size={16} /> Remove Layer
                  </button>
                  <button
                    onClick={addLayer}
                    disabled={layers.length >= 8}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 16px', borderRadius: '30px',
                      border: '1px solid var(--glass-border)',
                      background: 'rgba(0, 243, 255, 0.1)',
                      color: layers.length >= 8 ? '#555' : '#00f3ff',
                      cursor: layers.length >= 8 ? 'not-allowed' : 'pointer',
                      fontWeight: 600, transition: 'all 0.2s ease'
                    }}
                  >
                    <Plus size={16} /> Add Layer
                  </button>
                </div>
              </div>
            ) : networkType === 'CNN' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  {cnnLayers.map((depth, idx) => (
                    <div key={idx} style={{
                      background: 'var(--glass-bg)',
                      backdropFilter: 'blur(10px)',
                      padding: '12px',
                      borderRadius: '16px',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      minWidth: '90px'
                    }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Map {idx + 1} Slices
                      </span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'white' }}>{depth}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => updateCnnDepth(idx, -1)}
                          disabled={depth <= 1}
                          style={{ background: 'transparent', border: 'none', color: depth <= 1 ? '#555' : 'var(--accent-purple)', cursor: depth <= 1 ? 'not-allowed' : 'pointer' }}
                        >
                          <MinusCircle size={20} />
                        </button>
                        <button 
                          onClick={() => updateCnnDepth(idx, 1)}
                          disabled={depth >= 12}
                          style={{ background: 'transparent', border: 'none', color: depth >= 12 ? '#555' : 'var(--accent-cyan)', cursor: depth >= 12 ? 'not-allowed' : 'pointer' }}
                        >
                          <PlusCircle size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  <button
                    onClick={removeCnnLayer}
                    disabled={cnnLayers.length <= 1}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 16px', borderRadius: '30px',
                      border: '1px solid var(--glass-border)',
                      background: 'rgba(255, 0, 68, 0.1)',
                      color: cnnLayers.length <= 1 ? '#555' : '#ff0044',
                      cursor: cnnLayers.length <= 1 ? 'not-allowed' : 'pointer',
                      fontWeight: 600, transition: 'all 0.2s ease'
                    }}
                  >
                    <Minus size={16} /> Remove Map
                  </button>
                  <button
                    onClick={addCnnLayer}
                    disabled={cnnLayers.length >= 6}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '8px 16px', borderRadius: '30px',
                      border: '1px solid var(--glass-border)',
                      background: 'rgba(0, 243, 255, 0.1)',
                      color: cnnLayers.length >= 6 ? '#555' : '#00f3ff',
                      cursor: cnnLayers.length >= 6 ? 'not-allowed' : 'pointer',
                      fontWeight: 600, transition: 'all 0.2s ease'
                    }}
                  >
                    <Plus size={16} /> Add Feature Map
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    onClick={() => setGameSubtype('QLEARNING')}
                    style={{
                      padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--glass-border)',
                      background: gameSubtype === 'QLEARNING' ? 'var(--accent-cyan)' : 'transparent',
                      color: gameSubtype === 'QLEARNING' ? '#000' : 'white',
                      fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease'
                    }}
                  >
                    Q-Learning Maze
                  </button>
                  <button
                    onClick={() => setGameSubtype('KMEANS')}
                    style={{
                      padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--glass-border)',
                      background: gameSubtype === 'KMEANS' ? 'var(--accent-purple)' : 'transparent',
                      color: gameSubtype === 'KMEANS' ? '#000' : 'white',
                      fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s ease'
                    }}
                  >
                    K-Means Clustering
                  </button>
                </div>

                {gameSubtype === 'QLEARNING' ? (
                  <>
                    <AnimatePresence>
                      {showQIntro && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          onClick={() => setShowQIntro(false)}
                          style={{
                            background: 'rgba(0, 243, 255, 0.05)',
                            border: '1px solid rgba(0, 243, 255, 0.2)',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            marginBottom: '10px',
                            maxWidth: '430px',
                            cursor: 'pointer',
                            overflow: 'hidden'
                          }}
                        >
                          <h4 style={{ color: '#00f3ff', margin: '0 0 6px 0', fontSize: '1rem' }}>Reinforcement Learning (Q-Learning)</h4>
                          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>
                            Watch an AI learn to solve the maze! It starts by exploring randomly (hitting walls) and updates its "Q-Table" when it finds the red goal. The glowing green path shows the learned "rewards" propagating backwards. (Click to dismiss)
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div style={{
                        background: 'var(--glass-bg)', backdropFilter: 'blur(10px)',
                        padding: '12px', borderRadius: '16px', border: '1px solid var(--glass-border)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '130px'
                      }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Exploration (ε)</span>
                        <input type="range" min="0.0" max="1.0" step="0.05" value={explorationRate} onChange={(e) => setExplorationRate(parseFloat(e.target.value))} />
                        <span style={{ color: 'white' }}>{explorationRate.toFixed(2)}</span>
                      </div>

                      <div style={{
                        background: 'var(--glass-bg)', backdropFilter: 'blur(10px)',
                        padding: '12px', borderRadius: '16px', border: '1px solid var(--glass-border)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '130px'
                      }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Learning Rate (α)</span>
                        <input type="range" min="0.1" max="1.0" step="0.05" value={learningRateQ} onChange={(e) => setLearningRateQ(parseFloat(e.target.value))} />
                        <span style={{ color: 'white' }}>{learningRateQ.toFixed(2)}</span>
                      </div>
                      
                      <div style={{
                        background: 'var(--glass-bg)', backdropFilter: 'blur(10px)',
                        padding: '12px', borderRadius: '16px', border: '1px solid var(--glass-border)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '130px'
                      }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Discount (γ)</span>
                        <input type="range" min="0.5" max="1.0" step="0.05" value={discountFactor} onChange={(e) => setDiscountFactor(parseFloat(e.target.value))} />
                        <span style={{ color: 'white' }}>{discountFactor.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px 16px', borderRadius: '30px',
                          border: '1px solid var(--glass-border)',
                          background: isPlaying ? 'rgba(255, 0, 68, 0.1)' : 'rgba(0, 243, 255, 0.1)',
                          color: isPlaying ? '#ff0044' : '#00f3ff',
                          cursor: 'pointer',
                          fontWeight: 600, transition: 'all 0.2s ease'
                        }}
                      >
                        {isPlaying ? 'Pause Agent' : 'Start Agent'}
                      </button>
                      <button
                        onClick={() => { setIsPlaying(false); setGameResetTrigger(r => r + 1) }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px 16px', borderRadius: '30px',
                          border: '1px solid var(--glass-border)',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          cursor: 'pointer',
                          fontWeight: 600, transition: 'all 0.2s ease'
                        }}
                      >
                        Wipe Memory
                      </button>
                    </div>
                  </>


                ) : (
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                      onClick={() => setKMeansStepTrigger(r => r + 1)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 16px', borderRadius: '30px',
                        border: '1px solid var(--glass-border)',
                        background: 'rgba(0, 243, 255, 0.1)',
                        color: '#00f3ff',
                        cursor: 'pointer',
                        fontWeight: 600, transition: 'all 0.2s ease'
                      }}
                    >
                      Step Algorithm
                    </button>
                    <button
                      onClick={() => setKMeansResetTrigger(r => r + 1)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 16px', borderRadius: '30px',
                        border: '1px solid var(--glass-border)',
                        background: 'rgba(255, 0, 68, 0.1)',
                        color: '#ff0044',
                        cursor: 'pointer',
                        fontWeight: 600, transition: 'all 0.2s ease'
                      }}
                    >
                      Reset Data
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HTML Form Layer */}
      <AnimatePresence>
        {showForm && !isAnimatingOut && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: '15%', opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0, filter: 'blur(10px)' }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            style={{
              position: 'absolute',
              right: '15%',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '400px',
              pointerEvents: 'auto'
            }}
          >
            <div className="glass-panel" style={{ padding: '40px' }}>
              <h2 style={{ marginBottom: '8px', color: 'var(--accent-cyan)' }}>Welcome.</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Please verify your identity.</p>
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '24px' }}>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your name"
                    required
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      color: 'white',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'transparent',
                    border: '1px solid var(--accent-purple)',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 0 15px rgba(157, 78, 221, 0.2)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'var(--accent-purple)'
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(157, 78, 221, 0.6)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.boxShadow = '0 0 15px rgba(157, 78, 221, 0.2)'
                  }}
                >
                  Enter Portfolio
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
