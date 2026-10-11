import { useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { ArrowUpRight, Check, Copy, FileText, Mail } from 'lucide-react'
import { education, experience, profile, skills } from '../data/profile'
import { Reveal, SectionHead } from './Reveal'
import { GithubIcon, LinkedinIcon } from './BrandIcons'

export function Experience() {
  const ref = useRef<HTMLOListElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })

  return (
    <section id="experience" aria-labelledby="exp-title" className="section py-24 md:py-32">
      <div className="container-x">
        <SectionHead id="exp-title" kicker="Experience" title="Where I’ve worked" />
        <div className="md:grid md:grid-cols-12">
          <ol ref={ref} className="relative md:col-span-8 md:col-start-5">
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-line" />
            {!reduce && (
              <motion.span
                aria-hidden="true"
                style={{ scaleY: progress }}
                className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-gradient-to-b from-signal to-signal-2"
              />
            )}
            {experience.map((e, i) => (
              <Reveal as="li" key={e.org} delay={i * 0.05} className="relative pb-14 pl-10 last:pb-0">
                <span
                  aria-hidden="true"
                  className={`absolute top-2 left-0 size-[11px] rounded-full border-2 ${e.current ? 'border-signal bg-ink shadow-[0_0_0_4px_rgba(109,139,255,0.15)]' : 'border-line-2 bg-ink'}`}
                />
                <p className="text-sm text-faint">
                  {e.period} <span className="mx-1.5 text-line-2">/</span> {e.place}
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">{e.role}</h3>
                <p className="mt-1 text-lg text-dim">{e.org}</p>
                <ul className="mt-5 space-y-2.5">
                  {e.points.map((p) => (
                    <li key={p} className="flex gap-3 text-dim">
                      <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-line-2" />
                      <span className="text-pretty">{p}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-faint">{e.stack.join(', ')}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal className="mt-16 md:grid md:grid-cols-12">
          <div className="flex flex-col gap-1 rounded-2xl border border-line p-6 sm:flex-row sm:items-baseline sm:justify-between md:col-span-8 md:col-start-5">
            <div>
              <p className="font-medium">{education.degree}</p>
              <p className="text-sm text-dim">{education.school}</p>
            </div>
            <p className="text-sm text-faint">
              {education.period}, CGPA {education.cgpa}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="section border-t border-line py-24 md:py-32">
      <div className="container-x">
        <SectionHead
          id="skills-title"
          kicker="Toolkit"
          title="What I build with, and where it shows"
          intro="No percentages. Each group points to where the skill was used."
        />
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((g, i) => (
            <Reveal as="li" key={g.group} delay={(i % 3) * 0.06} className="group flex flex-col bg-ink p-6 transition-colors duration-500 hover:bg-ink-2 sm:p-7">
              <h3 className="font-display text-xl font-semibold tracking-tight">{g.group}</h3>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <li key={s} className="rounded-md border border-line bg-panel/50 px-2 py-1 text-[13px] text-fg/90 transition-colors duration-500 group-hover:border-line-2">
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-auto pt-5 text-sm text-faint text-pretty">{g.evidence}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section border-t border-line py-24 md:py-32">
      <div className="container-x grid gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <p className="flex items-center gap-3 text-sm text-faint">
            <span className="h-px w-8 bg-line-2" aria-hidden="true" />
            About
          </p>
          <figure className="relative mt-8 max-w-[18rem] overflow-hidden rounded-2xl">
            <img
              src="/chinthan-hd.jpg"
              alt="Portrait of Chinthan Shetty"
              width={800}
              height={800}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover object-[50%_25%]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-4 pt-10 pb-3 text-sm">
              Chinthan Shetty
              <span className="block text-xs text-dim">Bengaluru</span>
            </figcaption>
          </figure>
        </Reveal>
        <div className="md:col-span-8">
          <Reveal>
            <h2 id="about-title" className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.12] font-medium tracking-[-0.03em] text-balance">
              I like the problems between “it works on my machine” and “it works.”
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-6 text-lg text-dim sm:grid-cols-2">
            <Reveal delay={0.05}>
              <p className="text-pretty">
                I came to software from electronics and communication engineering, where I built ESP32 boards that ran ML models on-device and
                talked over LoRa. That habit stuck: I want to know what happens under the interface, on the wire and in the container.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-pretty">
                Today I write React and Node.js at PESU Venture Labs, and in my own projects I focus on making AI useful without making it
                load-bearing: rules first, models where they help, limits on both, and tests that prove the claims.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="contact" aria-labelledby="contact-title" className="section relative isolate overflow-hidden border-t border-line py-24 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[-12rem] -z-10 mx-auto h-[28rem] max-w-4xl rounded-full bg-signal/[0.12] blur-[120px]" />
      <div className="container-x">
        <Reveal>
          <p className="flex items-center gap-3 text-sm text-faint">
            <span className="h-px w-8 bg-line-2" aria-hidden="true" />
            Contact
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 id="contact-title" className="mt-6 max-w-5xl font-display text-[clamp(2.6rem,8vw,6.5rem)] leading-[0.92] font-bold tracking-[-0.05em] text-balance">
            Hiring for an engineering role? Let’s talk.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg text-dim text-pretty">
            I’m looking for software engineer, full-stack, backend and AI application roles. Email is the fastest way to reach me.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={`mailto:${profile.email}?subject=${encodeURIComponent('Engineering role')}`}
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-fg px-7 text-base font-semibold text-ink transition-transform duration-300 hover:bg-white active:scale-[0.97]"
            >
              <Mail className="size-5" aria-hidden="true" />
              {profile.email}
            </a>
            <button
              type="button"
              onClick={copy}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-line-2 px-6 text-sm font-medium transition-colors hover:border-signal/60 hover:bg-signal/10"
            >
              {copied ? <Check className="size-4 text-ok" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
              <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            {[
              { href: profile.linkedin, label: 'LinkedIn', sub: 'chinthan-shetty', icon: <LinkedinIcon className="size-5" /> },
              { href: profile.github, label: 'GitHub', sub: profile.githubHandle, icon: <GithubIcon className="size-5" /> },
              { href: profile.resume, label: 'Resume', sub: 'PDF, 1 page', icon: <FileText className="size-5" aria-hidden="true" /> },
            ].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 bg-ink p-6 transition-colors duration-300 hover:bg-ink-2"
                >
                  <span className="text-dim transition-colors group-hover:text-fg">{l.icon}</span>
                  <span className="flex-1">
                    <span className="block font-medium">{l.label}</span>
                    <span className="block text-sm text-faint">{l.sub}</span>
                  </span>
                  <ArrowUpRight
                    className="size-5 text-faint transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <div className="container-x flex flex-col gap-2 text-sm text-faint sm:flex-row sm:justify-between">
        <p>© 2026 Chinthan Shetty</p>
        <p>Built with React, TypeScript, Tailwind and Motion.</p>
      </div>
    </footer>
  )
}
