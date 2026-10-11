import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, Check, Clock, X } from 'lucide-react'
import type { Project } from '../data/projects'
import { GithubIcon } from './BrandIcons'
import { StatusBadge } from './Projects'
import { stopScroll } from '../hooks/useLenis'

export function CaseStudy({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!project) return
    lastFocus.current = document.activeElement as HTMLElement
    stopScroll(true)
    document.documentElement.style.overflow = 'hidden'
    requestAnimationFrame(() => closeRef.current?.focus())

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !panelRef.current) return
      const f = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      stopScroll(false)
      document.documentElement.style.overflow = ''
      lastFocus.current?.focus()
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby="case-title">
          <motion.div
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            initial={reduce ? { opacity: 0 } : { x: '100%' }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
            className="absolute inset-y-0 right-0 w-full max-w-3xl overflow-y-auto overscroll-contain border-l border-line bg-ink-2 shadow-[-40px_0_80px_-20px_rgba(0,0,0,0.6)]"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-ink-2/85 px-5 py-3 backdrop-blur-xl sm:px-10">
              <StatusBadge status={project.status} />
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="inline-flex size-11 items-center justify-center rounded-full border border-line transition-colors hover:border-line-2 hover:bg-white/5"
                aria-label="Close case study"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="px-5 pt-10 pb-16 sm:px-10">
              <p className="text-sm text-faint">Case study</p>
              <h2 id="case-title" className="mt-2 font-display text-5xl font-semibold tracking-[-0.04em]">
                {project.name}
              </h2>
              <p className="mt-4 text-xl text-fg text-pretty">{project.tagline}</p>

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm text-faint">The problem</h3>
                  <p className="mt-2 text-dim text-pretty">{project.problem}</p>
                </div>
                <div>
                  <h3 className="text-sm text-faint">Why it matters</h3>
                  <p className="mt-2 text-dim text-pretty">{project.why}</p>
                </div>
              </div>

              <h3 className="mt-12 text-sm text-faint">Flow</h3>
              <ol className="mt-3 flex flex-wrap items-center gap-y-2">
                {project.flow.map((f, i) => (
                  <li key={f} className="flex items-center">
                    <span className="rounded-lg border border-line bg-panel px-3 py-1.5 text-sm">{f}</span>
                    {i < project.flow.length - 1 && <span className="mx-1.5 h-px w-4 bg-line-2" aria-hidden="true" />}
                  </li>
                ))}
              </ol>

              <h3 className="mt-12 font-display text-2xl font-semibold tracking-tight">What’s built</h3>
              <ul className="mt-4 space-y-3">
                {project.built.map((b) => (
                  <li key={b} className="flex gap-3 text-dim">
                    <Check className="mt-1 size-4 shrink-0 text-ok" aria-hidden="true" />
                    <span className="text-pretty">{b}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-12 font-display text-2xl font-semibold tracking-tight">Engineering challenges</h3>
              <div className="mt-4 grid gap-3">
                {project.challenges.map((c) => (
                  <div key={c.title} className="rounded-xl border border-line bg-panel/50 p-5">
                    <h4 className="font-medium">{c.title}</h4>
                    <p className="mt-1.5 text-[15px] text-dim text-pretty">{c.body}</p>
                  </div>
                ))}
              </div>

              <h3 className="mt-12 font-display text-2xl font-semibold tracking-tight">Not built yet</h3>
              <ul className="mt-4 space-y-3">
                {project.planned.map((b) => (
                  <li key={b} className="flex gap-3 text-dim">
                    <Clock className="mt-1 size-4 shrink-0 text-warn" aria-hidden="true" />
                    <span className="text-pretty">{b}</span>
                  </li>
                ))}
              </ul>

              <h3 className="mt-12 text-sm text-faint">Stack</h3>
              <p className="mt-2 text-dim">{project.stack.join(', ')}</p>

              <div className="mt-12 flex flex-wrap gap-2">
                {project.repo ? (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-5 text-sm font-semibold text-ink"
                  >
                    <GithubIcon className="size-4" /> View the code
                  </a>
                ) : (
                  <a
                    href={`mailto:chinthanshettycs@gmail.com?subject=${encodeURIComponent(project.name + ' code access')}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-5 text-sm font-semibold text-ink"
                  >
                    Request code access
                  </a>
                )}
                {project.site && (
                  <a
                    href={project.site.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-2 px-5 text-sm"
                  >
                    {project.site.label} <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
