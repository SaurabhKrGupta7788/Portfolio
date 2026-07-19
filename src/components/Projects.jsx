import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { detailedProjects } from '../data/projectsData'
import ProjectOverlay from './ProjectOverlay'

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null)

  return (
    <div style={{ padding: '100px 0' }}>
      <motion.h2 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ fontSize: '3rem', marginBottom: '60px', color: 'var(--text-primary)' }}
      >
        Key Projects
      </motion.h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '30px' 
      }}>
        {detailedProjects.map((proj, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -10, rotateX: 5, rotateY: -5 }}
            style={{ perspective: '1000px', cursor: 'pointer' }}
            onClick={() => setSelectedProject(proj)}
          >
            <div className="glass-panel" style={{ 
              padding: '30px', 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}>
              <div style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>
                {proj.award}
              </div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', color: 'white' }}>{proj.title}</h3>
              <p style={{ color: 'var(--accent-purple)', fontSize: '0.95rem', marginBottom: '16px', fontWeight: 500 }}>{proj.role}</p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, flexGrow: 1 }}>{proj.shortDesc}</p>
              <div style={{ marginTop: '20px', fontSize: '0.9rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                Click to explore 3D visual →
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectOverlay project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
