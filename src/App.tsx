import { useEffect } from 'react'
import { MotionConfig } from 'motion/react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'
import { Engineering } from './components/Engineering'
import { About, Contact, Experience, Footer, Skills } from './components/Sections'
import { scrollToHash, useLenis } from './hooks/useLenis'

export default function App() {
  useLenis()
  // Deep links such as /classic#stockwatch arrive before React has rendered the
  // target, so the browser's own jump misses it; repeat it once mounted.
  useEffect(() => {
    const { hash } = window.location
    if (hash.length < 2) return
    const t = setTimeout(() => scrollToHash(hash), 120)
    return () => clearTimeout(t)
  }, [])
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain">
        <a
          href="#work"
          className="sr-only rounded-full bg-fg px-4 py-2 text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80]"
        >
          Skip to projects
        </a>
        <Nav />
        <main>
          <Hero />
          <Projects />
          <Engineering />
          <Experience />
          <Skills />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
