import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDown, FileText, Mail } from 'lucide-react'
import { StackMap } from './StackMap'
import { GithubIcon, LinkedinIcon } from './BrandIcons'
import { profile } from '../data/profile'
import { scrollToHash } from '../hooks/useLenis'

const ease = [0.16, 1, 0.3, 1] as const

function Line({ children, delay }: { children: string; delay: number }) {
  const reduce = useReducedMotion()
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className="block"
        initial={reduce ? false : { y: '105%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.15, delay, ease }}
      >
        {children}
      </motion.span>
    </span>
  )
}

export function Hero() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const nameY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -60])
  const nameOpacity = useTransform(scrollY, [0, 500], [1, reduce ? 1 : 0.25])

  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease },
        }

  return (
    <section id="top" className="relative isolate overflow-hidden pt-24 pb-16 sm:pt-28 md:pb-20">
      {/* Ambient light: two soft fields, kept off the text column */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 right-[-10%] h-[38rem] w-[38rem] rounded-full bg-signal/[0.13] blur-[120px]" />
        <div className="absolute top-[30%] right-[20%] h-[22rem] w-[22rem] rounded-full bg-signal-2/[0.08] blur-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-line-2 to-transparent" />
      </div>

      <div className="container-x grid items-center gap-14 lg:min-h-[calc(100svh-7rem)] lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-6">
          <motion.div {...fade(0.15)} className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-dim">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 py-1.5 pr-3.5 pl-2.5">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-ok opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-ok" />
              </span>
              Open to SDE and full-stack roles
            </span>
            <span>{profile.location}</span>
          </motion.div>

          <div className="flex items-center gap-5 sm:gap-7">
            <motion.div
              className="shrink-0"
              initial={reduce ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease }}
            >
              <picture>
                <source srcSet="/chinthan-hd.webp" type="image/webp" />
                <img
                  src="/chinthan-hd.jpg"
                  alt="Chinthan Shetty"
                  width={800}
                  height={800}
                  fetchPriority="high"
                  className="size-24 rounded-full object-cover object-[50%_30%] sm:size-32 lg:size-36"
                />
              </picture>
            </motion.div>
            <motion.h1
              style={{ y: nameY, opacity: nameOpacity }}
              className="font-['Times_New_Roman',Times,serif] text-[clamp(2.75rem,11vw,4.25rem)] leading-[0.98] font-normal tracking-[-0.01em] lg:text-[clamp(3.75rem,5.4vw,5.5rem)]"
            >
              <span className="sr-only">Chinthan Shetty, software engineer</span>
              <span aria-hidden="true">
                <Line delay={0.25}>Chinthan</Line>
                <Line delay={0.38}>Shetty</Line>
              </span>
            </motion.h1>
          </div>

          <motion.p {...fade(0.7)} className="mt-9 max-w-xl text-xl leading-snug text-fg text-pretty sm:text-[1.4rem]">
            Software engineer building full-stack and AI-powered products, from the React interface through the Node.js API to the
            model call and the container it runs in.
          </motion.p>
          <motion.p {...fade(0.8)} className="mt-4 max-w-lg text-dim text-pretty">
            Software Engineer Intern at PESU Venture Labs, shipping React and Node.js features. Outside work I build developer tooling
            like DevLaunch, which gets public repos running in hardened Docker containers.
          </motion.p>

          <motion.div {...fade(0.9)} className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault()
                scrollToHash('#work')
              }}
              className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-fg px-6 text-[15px] font-semibold text-ink transition-[transform,background-color] duration-300 hover:bg-white active:scale-[0.97]"
            >
              Explore my work
              <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line-2 px-6 text-[15px] font-medium transition-[border-color,background-color,transform] duration-300 hover:border-signal/60 hover:bg-signal/10 active:scale-[0.97]"
            >
              <FileText className="size-4" aria-hidden="true" />
              View resume
            </a>
          </motion.div>

          <motion.ul {...fade(1)} className="mt-5 -ml-3 flex flex-wrap items-center gap-1 text-dim" aria-label="Contact links">
            <li>
              <a href={`mailto:${profile.email}`} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm transition-colors hover:text-fg">
                <Mail className="size-4" aria-hidden="true" /> Email me
              </a>
            </li>
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm transition-colors hover:text-fg">
                <GithubIcon className="size-4" /> GitHub
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm transition-colors hover:text-fg">
                <LinkedinIcon className="size-4" /> LinkedIn
              </a>
            </li>
          </motion.ul>
        </div>

        <motion.div {...fade(0.55)} className="min-w-0 lg:col-span-6">
          <StackMap />
        </motion.div>
      </div>
    </section>
  )
}
