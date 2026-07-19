import React from 'react'
import { Mail, Phone, MapPin, Award } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ 
      padding: '80px 0 40px 0',
      borderTop: '1px solid var(--glass-border)',
      marginTop: '100px',
      position: 'relative'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '60px' }}>
        
        {/* Leadership */}
        <div>
          <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} /> Leadership
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <li><strong style={{ color: 'var(--text-primary)' }}>President</strong>, Arthkriti (Business & Finance Club)</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Treasurer</strong>, Mathematics & Computing Society</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Team Leader</strong>, Coding Masters</li>
            <li><strong style={{ color: 'var(--text-primary)' }}>Senior Cadet</strong>, National Cadet Corps</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 style={{ color: 'var(--accent-purple)', fontSize: '1.2rem', marginBottom: '24px' }}>Let's Connect</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)' }}>
            <a href="mailto:100rab777888@gmail.com" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', transition: 'color 0.3s ease' }} onMouseOver={e => e.target.style.color = 'var(--accent-cyan)'} onMouseOut={e => e.target.style.color = 'inherit'}>
              <Mail size={18} /> 100rab777888@gmail.com
            </a>
            <a href="tel:+917388877756" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', transition: 'color 0.3s ease' }} onMouseOver={e => e.target.style.color = 'var(--accent-cyan)'} onMouseOut={e => e.target.style.color = 'inherit'}>
              <Phone size={18} /> +91 7388877756
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <MapPin size={18} /> NIT Mizoram
            </div>
          </div>
        </div>

      </div>

      <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p>© {new Date().getFullYear()} Saurabh Kumar Gupta. Developed with React & Three.js</p>
      </div>
    </footer>
  )
}
