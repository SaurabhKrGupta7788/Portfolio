import React, { useState, useEffect } from 'react'
import EmailGate from './components/EmailGate'
import MainPortfolio from './components/MainPortfolio'
import CanvasBackground from './components/CanvasBackground'
import { supabase } from './lib/supabase'

function App() {
  const [session, setSession] = useState(null)
  const [animatingOut, setAnimatingOut] = useState(false)

  // Check initial session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        // Trigger animation out sequence before setting session
        setAnimatingOut(true)
        setTimeout(() => {
          setSession(session)
          setAnimatingOut(false)
        }, 2000) // 2 second transition time for character to wave and walk off
      } else {
        setSession(session)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // For testing without real auth, we expose a mock login function
  const handleMockLogin = () => {
    setAnimatingOut(true)
    setTimeout(() => {
      setSession({ user: { email: 'mock@test.com' } })
      setAnimatingOut(false)
    }, 2000)
  }

  return (
    <>
      {/* Global persistent 3D canvas */}
      <CanvasBackground isLoggedIn={!!session} />
      
      {/* Overlay UI based on auth state */}
      {!session ? (
        <EmailGate onMockLogin={handleMockLogin} isAnimatingOut={animatingOut} />
      ) : (
        <MainPortfolio />
      )}
    </>
  )
}

export default App
