import React from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.18-.35 6.5-1.57 6.5-7.16a5.8 5.8 0 0 0-1.5-3.9 5.4 5.4 0 0 0-.15-3.86s-1.18-.38-3.9 1.47a13.38 13.38 0 0 0-7 0C7.68 1.62 6.5 2 6.5 2a5.4 5.4 0 0 0-.15 3.86 5.8 5.8 0 0 0-1.5 3.9c0 5.58 3.32 6.81 6.5 7.16a4.8 4.8 0 0 0-1 3.02V22" />
  </svg>
)

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

export default function HeroArea() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{ maxWidth: '800px' }}
      >
        <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '16px', lineHeight: 1.1 }}>
          <span style={{ color: 'var(--accent-cyan)' }}>Saurabh Kumar Gupta</span>
          <br />
          Machine Learning Researcher
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6 }}>
          Aspiring Machine Learning researcher with strong foundations in mathematics, statistical learning, and deep learning. 
          Focused on developing scalable AI systems for advancing computational science.
        </p>
        
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="https://github.com/SaurabhKrGupta7788" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <button className="glass-panel" style={{
              padding: '16px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid var(--accent-cyan)',
              animation: 'pulse-glow 4s infinite'
            }}>
              <GithubIcon />
              GitHub
            </button>
          </a>
          
          <a href="#" style={{ textDecoration: 'none' }}>
            <button className="glass-panel" style={{
              padding: '16px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: '1px solid var(--accent-purple)'
            }}>
              <LinkedinIcon />
              LinkedIn
            </button>
          </a>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', opacity: 0.5 }}
      >
        <ChevronDown size={32} color="var(--accent-cyan)" />
      </motion.div>
    </div>
  )
}
