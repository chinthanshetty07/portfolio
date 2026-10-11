import { useState } from 'react'
import { ArrowUpRight, BookOpen, Lock } from 'lucide-react'
import { projects, otherWork, type Project, type ProjectId } from '../data/projects'
import { Reveal, SectionHead } from './Reveal'
import { GithubIcon } from './BrandIcons'
import { ArcVisual, BenchmarkVisual, DevLaunchVisual, PromptVisual, StockVisual } from './visuals'
import { CaseStudy } from './CaseStudy'

const visuals: Record<ProjectId, () => React.JSX.Element> = {
  devlaunch: DevLaunchVisual,
  arc: ArcVisual,
  stockwatch: StockVisual,
  'prompt-engine': PromptVisual,
  benchmark: BenchmarkVisual,
}

export function StatusBadge({ status }: { status: Project['status'] }) {
  const tone = status.tone === 'ok' ? 'border-ok/30 text-ok' : 'border-warn/30 text-warn'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs ${tone}`}>
      <span className={`size-1.5 rounded-full ${status.tone === 'ok' ? 'bg-ok' : 'bg-warn'}`} aria-hidden="true" />
      {status.label}
    </span>
  )
}

function ProjectPanel({ p, index, onOpen }: { p: Project; index: number; onOpen: () => void }) {
  const Visual = visuals[p.id]
  const flagship = index === 0
  const flip = index % 2 === 0

  return (
    <article id={p.id} className="section group/panel relative">
      <Reveal>
        <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-panel/40 p-5 transition-colors duration-500 hover:border-line-2 sm:p-8 lg:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 h-72 w-72 rounded-full bg-signal/[0.07] opacity-0 blur-3xl transition-opacity duration-700 group-hover/panel:opacity-100"
            style={{ [flip ? 'right' : 'left']: '-4rem' }}
          />
          <div className={`relative grid gap-8 lg:items-center lg:gap-12 ${flagship ? 'lg:grid-cols-[1fr_1.1fr]' : 'lg:grid-cols-2'}`}>
            <div className={`flex min-w-0 flex-col ${flip ? '' : 'lg:order-2'}`}>
              <div className="flex flex-wrap items-center gap-3">
                <StatusBadge status={p.status} />
                {flagship && <span className="text-xs text-faint">Flagship project</span>}
              </div>
              <h3 className="mt-5 font-display text-[clamp(2rem,4vw,3.25rem)] leading-none font-semibold tracking-[-0.04em]">{p.name}</h3>
              <p className="mt-4 text-lg text-fg text-pretty">{p.tagline}</p>

              <dl className="mt-6 space-y-4 text-[15px]">
                <div>
                  <dt className="text-xs text-faint">Problem</dt>
                  <dd className="mt-1 text-dim text-pretty">{p.problem}</dd>
                </div>
                <div>
                  <dt className="text-xs text-faint">My part</dt>
                  <dd className="mt-1 text-dim text-pretty">{p.role}</dd>
                </div>
              </dl>

              <ul className={`mt-7 grid gap-px overflow-hidden rounded-xl border border-line bg-line ${p.facts.length === 4 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {p.facts.map((f) => (
                  <li key={f.label} className="bg-ink-2 px-3.5 py-3">
                    <p className="font-display text-2xl font-semibold tracking-tight">{f.value}</p>
                    <p className="mt-0.5 text-xs leading-snug text-faint">{f.label}</p>
                  </li>
                ))}
              </ul>

              <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={`${p.name} tech stack`}>
                {p.stack.map((s) => (
                  <li key={s} className="rounded-md border border-line px-2 py-1 text-xs text-dim">
                    {s}
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-wrap gap-2 pt-8">
                <button
                  type="button"
                  onClick={onOpen}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-5 text-sm font-semibold text-ink transition-transform duration-300 hover:bg-white active:scale-[0.97]"
                >
                  <BookOpen className="size-4" aria-hidden="true" />
                  Read case study
                </button>
                {p.repo ? (
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-2 px-5 text-sm font-medium transition-colors hover:border-signal/60 hover:bg-signal/10"
                  >
                    <GithubIcon className="size-4" />
                    Code
                  </a>
                ) : (
                  <span className="inline-flex min-h-11 items-center gap-2 px-2 text-sm text-faint">
                    <Lock className="size-4" aria-hidden="true" />
                    {p.repoNote}
                  </span>
                )}
                {p.site && (
                  <a
                    href={p.site.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm text-dim transition-colors hover:text-fg"
                  >
                    {p.site.label}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>

            <div className={`min-w-0 ${flip ? '' : 'lg:order-1'}`}>
              <Visual />
            </div>
          </div>
        </div>
      </Reveal>
    </article>
  )
}

export function Projects() {
  const [open, setOpen] = useState<ProjectId | null>(null)
  const current = projects.find((p) => p.id === open) ?? null

  return (
    <section id="work" aria-labelledby="work-title" className="section py-24 md:py-32">
      <div className="container-x">
        <SectionHead
          id="work-title"
          kicker="Selected work"
          title="Systems I’ve built and shipped"
          intro="Every claim on this page is checked against the code in the linked repositories. Where something is planned rather than built, it says so."
        />
        <div className="space-y-6 md:space-y-8">
          {projects.map((p, i) => (
            <ProjectPanel key={p.id} p={p} index={i} onOpen={() => setOpen(p.id)} />
          ))}
        </div>

        <div className="mt-20">
          <Reveal>
            <h3 className="font-display text-2xl font-semibold tracking-tight">Also built</h3>
          </Reveal>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {otherWork.map((w, i) => (
              <Reveal as="li" key={w.name} delay={i * 0.06} className="flex flex-col bg-ink p-6">
                <p className="text-xs text-faint">{w.year}</p>
                <h4 className="mt-2 font-display text-lg font-semibold tracking-tight">{w.name}</h4>
                <p className="mt-2 text-sm text-dim text-pretty">{w.body}</p>
                <p className="mt-auto pt-4 text-xs text-faint">{w.stack.join(', ')}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
      <CaseStudy project={current} onClose={() => setOpen(null)} />
    </section>
  )
}
