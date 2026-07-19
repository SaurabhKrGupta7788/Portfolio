import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const skillCategories = [
  {
    category: "Mathematical Foundations",
    skills: [
      { name: "Real Analysis", desc: "Rigorous study of real numbers and functions" },
      { name: "Linear & Abstract Algebra", desc: "Vector spaces, rings, and applications" },
      { name: "Complex & Functional Analysis", desc: "Complex functions and infinite-dimensional spaces" },
      { name: "Differential Equations", desc: "ODEs and PDEs for physical systems" },
      { name: "Discrete Math & Fluid Dynamics", desc: "Combinatorics and fluid mechanics" },
      { name: "Stochastic Calculus", desc: "Integration over stochastic processes" }
    ]
  },
  {
    category: "Computational Techniques",
    skills: [
      { name: "Algorithms & Data Structures", desc: "Design and analysis of computational methods" },
      { name: "Artificial Intelligence", desc: "Heuristic search, logic, and planning" },
      { name: "Machine Learning", desc: "Statistical learning and predictive modeling" },
      { name: "Neural Networks", desc: "Deep learning and network architectures" },
      { name: "Scientific Computing", desc: "Numerical simulations and modeling" }
    ]
  },
  {
    category: "Optimization and Statistics",
    skills: [
      { name: "Nonlinear Optimization", desc: "Theory and algorithmic implementations" },
      { name: "Operations Research", desc: "Mathematical optimization and decision making" },
      { name: "Probability & Statistics", desc: "Probability distributions and statistical inference" },
      { name: "Multivariate Statistics", desc: "Analysis of data involving multiple variables" }
    ]
  },
  {
    category: "Applied & Professional Studies",
    skills: [
      { name: "Database Management Systems", desc: "Relational databases and SQL" },
      { name: "Theory of Computation", desc: "Automata theory and formal languages" }
    ]
  },
  {
    category: "Development & Deployment",
    skills: [
      { name: "Python & C++", desc: "Primary development languages" },
      { name: "Docker", desc: "Containerization & microservices deployment" },
      { name: "Flask / Django", desc: "Backend architecture & REST APIs" },
      { name: "HTML / CSS", desc: "Frontend web development & styling" },
      { name: "Git & CI/CD", desc: "Version control & automation pipelines" }
    ]
  }
]

export default function TechArsenal() {
  const [hoveredSkill, setHoveredSkill] = useState(null)

  return (
    <div style={{ padding: '100px 0', position: 'relative' }}>
      <motion.h2 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ fontSize: '3rem', marginBottom: '60px', color: 'var(--text-primary)', textAlign: 'center' }}
      >
        Technical Arsenal
      </motion.h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {skillCategories.map((group, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            style={{ 
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--glass-border)',
              borderRadius: '24px',
              padding: '40px'
            }}
          >
            <h3 style={{ color: 'var(--accent-purple)', marginBottom: '24px', fontSize: '1.4rem' }}>{group.category}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {group.skills.map((skill, sIdx) => (
                <div 
                  key={sIdx} 
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <motion.span 
                    whileHover={{ scale: 1.05, y: -2, backgroundColor: 'rgba(0, 243, 255, 0.1)' }}
                    style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '30px',
                      color: 'var(--text-primary)',
                      fontSize: '1rem',
                      fontWeight: 500,
                      cursor: 'default',
                      transition: 'border-color 0.3s ease'
                    }}
                  >
                    {skill.name}
                  </motion.span>

                  {/* Tooltip Overlay */}
                  <AnimatePresence>
                    {hoveredSkill === skill.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          position: 'absolute',
                          bottom: '120%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 'max-content',
                          maxWidth: '200px',
                          background: '#0a0b10',
                          border: '1px solid var(--accent-cyan)',
                          padding: '12px',
                          borderRadius: '8px',
                          color: 'var(--text-secondary)',
                          fontSize: '0.85rem',
                          textAlign: 'center',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                          zIndex: 10
                        }}
                      >
                        {skill.desc}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ marginTop: '100px', textAlign: 'center' }}
      >
        <h3 style={{ color: 'var(--text-primary)', fontSize: '2.5rem', marginBottom: '40px' }}>Computational Capabilities</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {[
            "Data Scientist / Analyst", 
            "Quantitative Analyst (Finance & Trading)", 
            "Software Developer / Engineer", 
            "AI / Machine Learning Engineer", 
            "Operations Research Analyst", 
            "Researcher in Applied Mathematics or Computational Sciences"
          ].map((role, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 243, 255, 0.15)' }}
              style={{ 
                padding: '20px 30px', 
                background: 'rgba(0, 243, 255, 0.05)', 
                border: '1px solid rgba(0, 243, 255, 0.3)', 
                borderRadius: '16px', 
                color: 'white', 
                fontWeight: 600, 
                fontSize: '1.2rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 243, 255, 0.1)'
              }}
            >
              {role}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
