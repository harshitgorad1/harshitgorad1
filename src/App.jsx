import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import Cursor from './components/Cursor'
import Hero from './components/Hero'
import About from './components/About'
import TechStack from './components/TechStack'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

// ─── Lightweight smooth scroll (no lib needed) ───────────
function useSmoothScroll() {
  useEffect(() => {
    let currentY = window.scrollY
    let targetY = window.scrollY
    let rafId = null
    const EASE = 0.1   // lower = smoother/slower; range 0.05–0.2

    function onWheel(e) {
      e.preventDefault()
      targetY = Math.max(0, Math.min(
        document.documentElement.scrollHeight - window.innerHeight,
        targetY + e.deltaY
      ))
    }

    function loop() {
      const diff = targetY - currentY
      if (Math.abs(diff) > 0.5) {
        currentY += diff * EASE
        window.scrollTo(0, currentY)
        ScrollTrigger.update()
      }
      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    rafId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('wheel', onWheel)
      cancelAnimationFrame(rafId)
    }
  }, [])
}

export default function App() {
  useSmoothScroll()

  useEffect(() => {
    ScrollTrigger.refresh()
  }, [])

  return (
    <div className="relative min-h-screen" style={{ background: '#02020a' }}>
      <Cursor />
      <Navbar />
      <main>
        <Hero />
        <About />
        <TechStack />
        <Projects />
        <Experience />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
