import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const experiences = [
  {
    title: "Guest Scientist — Uncertainty Quantification",
    company: "Karlsruhe Institute of Technology (KIT)",
    date: "May 2026 – Aug 2026",
    location: "Karlsruhe, Germany",
    description: "Developing and optimizing Gaussian Process (GP) surrogate models for Uncertainty Quantification and Sobol sensitivity analysis in complex simulations.",
    details: [
      "Designed Bayesian Optimization workflows for computational physics.",
      "Accelerated simulation throughput by replacing heavy physics solvers with ML surrogates."
    ]
  },
  {
    title: "Research Intern — UAV Detection",
    company: "IIT (BHU)",
    date: "Dec 2024 – Jan 2025",
    location: "Varanasi, UP",
    description: "Engineered end-to-end UAV detection pipeline using YOLOv8 + secondary CNN verification, achieving 95.7% accuracy with robust false-positive reduction.",
    details: [
      "Filtered out birds and clouds using a custom lightweight secondary CNN.",
      "Optimized inference time for real-time edge deployment on embedded systems."
    ]
  },
  {
    title: "Research Intern — Statistical Learning",
    company: "IIT Madras",
    date: "May 2025 – Jul 2025",
    location: "Chennai, TN",
    description: "Implemented statistical learning workflows covering regression, classification, resampling methods, and model selection on real-world datasets.",
    details: [
      "Explored trade-offs between bias and variance using cross-validation techniques.",
      "Implemented classical models from scratch to understand algorithmic fundamentals."
    ]
  }
]

export default function Timeline() {
  const [expandedIndex, setExpandedIndex] = useState(null)

  return (
    <div style={{ padding: '100px 0', position: 'relative' }}>
      <motion.h2 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ fontSize: '3rem', marginBottom: '60px', color: 'var(--text-primary)' }}
      >
        Research & Experience
      </motion.h2>

      <div style={{ position: 'relative', borderLeft: '2px solid var(--glass-border)', paddingLeft: '40px', marginLeft: '20px' }}>
        {experiences.map((exp, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="glass-panel"
            style={{ padding: '32px', marginBottom: '40px', position: 'relative', cursor: 'pointer' }}
            onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
          >
            {/* Timeline node */}
            <div style={{
              position: 'absolute',
              left: '-49px',
              top: '40px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: 'var(--accent-cyan)',
              boxShadow: expandedIndex === idx ? '0 0 15px var(--accent-cyan)' : 'none',
              transition: 'all 0.3s ease'
            }} />
            
            <h3 style={{ fontSize: '1.5rem', color: 'var(--accent-purple)', marginBottom: '8px' }}>{exp.title}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{exp.company}</span>
              <span>{exp.date} | {exp.location}</span>
            </div>
            <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>{exp.description}</p>
            
            <AnimatePresence>
              {expandedIndex === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <ul style={{ color: 'var(--accent-cyan)', paddingLeft: '20px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {exp.details.map((detail, dIdx) => (
                      <li key={dIdx} style={{ marginBottom: '8px' }}>
                        <span style={{ color: 'var(--text-primary)' }}>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            {expandedIndex !== idx && (
              <div style={{ marginTop: '16px', color: 'var(--glass-border)', fontSize: '0.85rem' }}>
                Click to expand details
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
