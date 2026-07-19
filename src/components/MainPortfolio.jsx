import React from 'react'
import HeroArea from './HeroArea'
import Timeline from './Timeline'
import Projects from './Projects'
import TechArsenal from './TechArsenal'
import Achievements from './Achievements'
import Footer from './Footer'

export default function MainPortfolio() {
  return (
    <div style={{ position: 'relative', zIndex: 10, width: '100%', minHeight: '100vh', overflowY: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <HeroArea />
        <Timeline />
        <Projects />
        <TechArsenal />
        <Achievements />
        <Footer />
      </div>
    </div>
  )
}
