import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Star, Award } from 'lucide-react'

const achievementsData = [
  {
    title: "National Winner, Varthli Hackathon",
    description: "National Hackathon, Mizoram University (2026)",
    icon: Trophy,
    color: "#ffaa00"
  },
  {
    title: "National Winner, Yuvamanthan Hackathon",
    description: "Secured 1st place among 500+ competing teams nationwide (2024)",
    icon: Trophy,
    color: "#ff0044"
  },
  {
    title: "National Finalist, ReGen Hackathon 2.0",
    description: "National Hackathon, NIT Manipur (2026)",
    icon: Star,
    color: "#00f3ff"
  },
  {
    title: "National Finalist, Sci-Arena!",
    description: "National Hackathon, IISER Berhampur (2025)",
    icon: Medal,
    color: "#9d4edd"
  },
  {
    title: "National Finalist, Zinnovation 3.0!",
    description: "National Hackathon, Chandigarh University (2025)",
    icon: Award,
    color: "#22cc22"
  }
]

export default function Achievements() {
  return (
    <div style={{ padding: '100px 0', position: 'relative' }}>
      <motion.h2 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ fontSize: '3rem', marginBottom: '60px', color: 'var(--text-primary)', textAlign: 'center' }}
      >
        Achievements & Awards
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {achievementsData.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(10px)',
              border: `1px solid rgba(255, 255, 255, 0.1)`,
              borderTop: `2px solid ${item.color}`,
              borderRadius: '20px',
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              cursor: 'default'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', background: `${item.color}1a`, borderRadius: '12px', color: item.color }}>
                <item.icon size={28} />
              </div>
              <h3 style={{ color: 'white', fontSize: '1.2rem', lineHeight: '1.4' }}>{item.title}</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
