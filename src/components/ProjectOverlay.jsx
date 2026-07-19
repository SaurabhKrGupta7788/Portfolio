import React, { Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { DroneTrackingScene, CosmicGatewayScene, MedicalScanScene, CTScanScene, ANPRScene } from './ProjectScenes'

export default function ProjectOverlay({ project, onClose }) {
  // ANPR Specific State
  const [anprZoom, setAnprZoom] = useState(0.25)
  const [anprWeather, setAnprWeather] = useState('SUNNY')

  if (!project) return null;

  // Render the correct scene based on the project's visualScene ID
  const renderScene = () => {
    switch (project.visualScene) {
      case 'MedicalScanScene': return <MedicalScanScene />
      case 'DroneTrackingScene': return <DroneTrackingScene />
      case 'CTScanScene': return <CTScanScene />
      case 'CosmicGatewayScene': return <CosmicGatewayScene />
      case 'ANPRScene': return <ANPRScene zoomLevel={anprZoom} setWeatherName={setAnprWeather} />
      default: return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'var(--bg-color)',
        overflowY: 'auto'
      }}
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 110,
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}
      >
        <X size={24} />
      </button>

      {/* Top Half: 3D Visualization */}
      <div style={{ width: '100%', height: '65vh', minHeight: '450px', position: 'relative', background: '#0a0b10', borderBottom: '1px solid var(--glass-border)' }}>
        
        {/* ANPR Custom UI Overlay */}
        {project.visualScene === 'ANPRScene' && (
          <>
            {/* Top Left Weather */}
            <div style={{ position: 'absolute', top: 30, left: 30, zIndex: 10, color: '#00f3ff', fontWeight: 'bold', fontSize: '24px', textShadow: '0 0 10px #00f3ff', fontFamily: 'monospace' }}>
              ENVIRONMENT: <span style={{ color: '#fff' }}>{anprWeather}</span>
            </div>
            
            {/* Right Side Vertical Slider */}
            <div style={{ position: 'absolute', top: '50%', right: 40, transform: 'translateY(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '80px', pointerEvents: 'auto' }}>
               <span style={{ color: '#00f3ff', fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>ZOOM IN</span>
               <input 
                  type="range" 
                  min="0.1" max="0.9" step="0.01" 
                  value={anprZoom}
                  onChange={(e) => setAnprZoom(parseFloat(e.target.value))}
                  style={{ transform: 'rotate(-90deg)', width: '150px', cursor: 'ns-resize' }} 
               />
               <span style={{ color: '#00f3ff', fontSize: '14px', fontWeight: 'bold', fontFamily: 'monospace' }}>ZOOM OUT</span>
            </div>
          </>
        )}

        <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#00f3ff" />
          <directionalLight position={[-10, 10, 5]} intensity={0.5} color="#9d4edd" />
          <Suspense fallback={null}>
            {renderScene()}
          </Suspense>
          <OrbitControls 
            enableZoom={false} 
            autoRotate={project.visualScene !== 'ANPRScene'}
            autoRotateSpeed={0.5} 
          />
          <Environment preset="city" />
        </Canvas>
        
        {/* Overlay Label */}
        <div style={{ position: 'absolute', bottom: '20px', left: '24px', pointerEvents: 'none' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{project.title}</h2>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Interactive Visualization</span>
        </div>
      </div>

      {/* Bottom Half: Detailed Explanation */}
      <div style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        
        {/* Row 1: Problem & Technologies vs How It Works */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginBottom: '60px' }}>
          
          {/* Left Column: Context */}
          <div style={{ flex: '1 1 400px' }}>
            <h3 style={{ color: 'var(--accent-purple)', fontSize: '1.5rem', marginBottom: '16px' }}>The Problem</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '40px' }}>
              {project.problemTackled}
            </p>

            <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1.5rem', marginBottom: '16px' }}>Technologies Used</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {project.technologies.map((tech, i) => (
                <span key={i} style={{
                  padding: '8px 16px',
                  background: 'rgba(0, 243, 255, 0.1)',
                  border: '1px solid rgba(0, 243, 255, 0.3)',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '0.9rem'
                }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Execution */}
          <div style={{ flex: '1 1 400px' }}>
            <div className="glass-panel" style={{ padding: '32px', height: '100%' }}>
              <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '16px' }}>How It Works</h3>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                {project.howItWorks}
              </p>
            </div>
          </div>

        </div>

        {/* Row 2: Architecture, Results & Future Scope */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', paddingBottom: '60px' }}>
          
          {project.architecture && (
            <div className="glass-panel" style={{ padding: '32px', borderTop: '2px solid var(--accent-purple)' }}>
              <h3 style={{ color: 'var(--accent-purple)', fontSize: '1.3rem', marginBottom: '16px' }}>System Architecture</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{project.architecture}</p>
            </div>
          )}

          {project.results && (
            <div className="glass-panel" style={{ padding: '32px', borderTop: '2px solid var(--accent-cyan)' }}>
              <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1.3rem', marginBottom: '16px' }}>Key Results</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{project.results}</p>
            </div>
          )}

          {project.futureScope && (
            <div className="glass-panel" style={{ padding: '32px', borderTop: '2px solid rgba(255,255,255,0.3)' }}>
              <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '16px' }}>Future Scope</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{project.futureScope}</p>
            </div>
          )}

        </div>
      </div>


    </motion.div>
  )
}
