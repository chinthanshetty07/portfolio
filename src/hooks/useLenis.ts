import { useEffect } from 'react'
import Lenis from 'lenis'

let instance: Lenis | null = null

export function scrollToHash(hash: string) {
  const el = document.querySelector(hash)
  if (!el) return
  if (instance) instance.scrollTo(el as HTMLElement, { offset: -72, duration: 1.1 })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function useLenis() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, touchMultiplier: 1 })
    instance = lenis
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      instance = null
    }
  }, [])
}

export function stopScroll(stop: boolean) {
  if (!instance) return
  if (stop) instance.stop()
  else instance.start()
}
