import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FileText, Menu, X } from 'lucide-react'
import { scrollToHash, stopScroll } from '../hooks/useLenis'
import { profile } from '../data/profile'

const links = [
  { href: '#work', label: 'Work' },
  { href: '#engineering', label: 'Engineering' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive('#' + e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    links.forEach((l) => {
      const el = document.querySelector(l.href)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    stopScroll(open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setOpen(false)
    // Lenis is paused while the menu is open; resume it before scrolling.
    stopScroll(false)
    history.replaceState(null, '', href)
    scrollToHash(href)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        open ? 'border-b border-line/80 bg-ink' : scrolled ? 'border-b border-line/80 bg-ink/92' : 'border-b border-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between" aria-label="Primary">
        <a
          href="#top"
          onClick={(e) => go(e, '#top')}
          className="group flex items-center gap-2.5 font-display text-[15px] font-semibold tracking-tight"
        >
          <img src="/logo.jpg" alt="" width={32} height={32} className="size-8 rounded-lg ring-1 ring-line-2 transition-transform duration-500 ease-out-expo group-hover:scale-105" />
          Chinthan Shetty
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => go(e, l.href)}
                aria-current={active === l.href ? 'true' : undefined}
                className="relative rounded-full px-3.5 py-2 text-sm text-dim transition-colors hover:text-fg aria-[current]:text-fg"
              >
                {active === l.href && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white/[0.06]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full border border-line-2 px-4 py-2 text-sm font-medium transition-colors hover:border-signal/60 hover:bg-signal/10 sm:inline-flex"
          >
            <FileText className="size-4" aria-hidden="true" />
            Resume
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="inline-flex size-11 items-center justify-center rounded-full text-fg md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100dvh - 4rem)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden md:hidden"
          >
            <ul className="container-x flex flex-col gap-1 pt-6">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.045, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    className="block border-b border-line py-4 font-display text-3xl font-semibold tracking-tight"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="pt-6"
              >
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-3 text-sm font-semibold text-ink"
                >
                  <FileText className="size-4" aria-hidden="true" /> View resume
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
