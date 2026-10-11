import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ProjectId } from '../data/projects'
import { scrollToHash } from '../hooks/useLenis'

type NodeId = 'react' | 'streamlit' | 'express' | 'python' | 'groq' | 'ollama' | 'mongo' | 'docker' | 'results'

const W = 116
const H = 34
const nodes: Record<NodeId, { x: number; y: number; label: string }> = {
  react: { x: 70, y: 140, label: 'React' },
  streamlit: { x: 70, y: 290, label: 'Streamlit' },
  express: { x: 225, y: 140, label: 'Node · Express' },
  python: { x: 225, y: 290, label: 'Python runner' },
  groq: { x: 380, y: 66, label: 'Groq LLM API' },
  ollama: { x: 380, y: 290, label: 'Ollama · qwen3' },
  mongo: { x: 530, y: 66, label: 'MongoDB' },
  docker: { x: 530, y: 190, label: 'Docker sandbox' },
  results: { x: 530, y: 290, label: 'results.json' },
}

const columns = [
  { x: 70, label: 'Interface' },
  { x: 225, label: 'Service' },
  { x: 380, label: 'Model' },
  { x: 530, label: 'Runtime & data' },
]

interface Route {
  id: ProjectId
  name: string
  hops: NodeId[]
  optional?: [NodeId, NodeId]
  caption: string
}

const routes: Route[] = [
  {
    id: 'devlaunch',
    name: 'DevLaunch',
    hops: ['react', 'express', 'docker'],
    optional: ['express', 'groq'],
    caption: 'Dashboard → orchestrator → hardened containers. The LLM is only consulted when rules can’t plan or repair.',
  },
  {
    id: 'prompt-engine',
    name: 'Prompt Engine',
    hops: ['react', 'express', 'groq', 'mongo'],
    caption: 'Prompt in → validated and scope-checked → rewritten by the model → stored with token counts.',
  },
  {
    id: 'benchmark',
    name: 'Reliability Benchmark',
    hops: ['streamlit', 'python', 'ollama', 'results'],
    caption: 'Tasks streamed to a local model → strictly graded → written atomically → charted.',
  },
]

function edge(a: NodeId, b: NodeId) {
  const p = nodes[a]
  const q = nodes[b]
  const x1 = p.x + W / 2
  const x2 = q.x - W / 2
  const mx = (x1 + x2) / 2
  return `M${x1} ${p.y} C${mx} ${p.y} ${mx} ${q.y} ${x2} ${q.y}`
}

// One continuous path through every hop, used for the travelling pulse.
function routePath(hops: NodeId[]) {
  let d = ''
  hops.forEach((h, i) => {
    const n = nodes[h]
    if (i === 0) d += `M${n.x - W / 2} ${n.y} L${n.x + W / 2} ${n.y}`
    else {
      const p = nodes[hops[i - 1]]
      const x1 = p.x + W / 2
      const x2 = n.x - W / 2
      const mx = (x1 + x2) / 2
      d += ` C${mx} ${p.y} ${mx} ${n.y} ${x2} ${n.y} L${n.x + W / 2} ${n.y}`
    }
  })
  return d
}

const allEdges = Array.from(
  new Set(
    routes.flatMap((r) => [
      ...r.hops.slice(1).map((h, i) => `${r.hops[i]}>${h}`),
      ...(r.optional ? [`${r.optional[0]}>${r.optional[1]}`] : []),
    ]),
  ),
)

export function StackMap() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const route = routes[active]

  useEffect(() => {
    if (reduce || paused) return
    const t = setInterval(() => setActive((a) => (a + 1) % routes.length), 4200)
    return () => clearInterval(t)
  }, [reduce, paused])

  const onRoute = (a: NodeId, b: NodeId) => {
    const i = route.hops.indexOf(a)
    return (i !== -1 && route.hops[i + 1] === b) || (route.optional?.[0] === a && route.optional?.[1] === b)
  }
  const isOptional = (a: NodeId, b: NodeId) => route.optional?.[0] === a && route.optional?.[1] === b
  const nodeLit = (n: NodeId) => route.hops.includes(n) || route.optional?.includes(n)

  return (
    <figure
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-2/70 p-3 sm:p-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(var(--color-line-2)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
        />
        <ol className="relative min-h-[12.5rem] sm:hidden" aria-hidden="true">
          {route.hops.map((h, i) => (
            <motion.li
              key={route.id + h}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center gap-3 pb-3 last:pb-0"
            >
              {i < route.hops.length - 1 && (
                <span className="absolute top-8 bottom-0 left-[15px] w-px bg-gradient-to-b from-signal to-signal-2" />
              )}
              <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-signal/50 bg-panel font-mono text-[11px] text-fg">
                {i + 1}
              </span>
              <span className="flex flex-1 items-baseline justify-between gap-3 rounded-lg border border-signal/30 bg-signal/[0.07] px-3 py-2">
                <span className="text-sm text-fg">{nodes[h].label}</span>
                <span className="text-[11px] text-faint">{columns.find((c) => c.x === nodes[h].x)?.label}</span>
              </span>
            </motion.li>
          ))}
          {route.optional && (
            <li className="mt-3 ml-11 rounded-lg border border-dashed border-line-2 px-3 py-2 text-xs text-dim">
              Optional: {nodes[route.optional[1]].label}, only when rules can’t plan or repair
            </li>
          )}
        </ol>
        <div className="hidden sm:block">
        <svg viewBox="0 0 600 330" className="relative w-full" role="img" aria-labelledby="stackmap-title stackmap-desc">
          <title id="stackmap-title">How my projects move through the stack</title>
          <desc id="stackmap-desc">
            {route.name}: {route.hops.map((h) => nodes[h].label).join(' to ')}.
          </desc>
          <defs>
            <linearGradient id="lit" x1="0" x2="1">
              <stop offset="0" stopColor="var(--color-signal)" />
              <stop offset="1" stopColor="var(--color-signal-2)" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {columns.map((c) => (
            <text key={c.label} x={c.x} y={16} textAnchor="middle" className="fill-faint font-sans text-[11px]">
              {c.label}
            </text>
          ))}

          {allEdges.map((key, i) => {
            const [a, b] = key.split('>') as [NodeId, NodeId]
            const lit = onRoute(a, b)
            return (
              <motion.path
                key={key}
                d={edge(a, b)}
                fill="none"
                stroke={lit ? 'url(#lit)' : 'var(--color-line-2)'}
                strokeWidth={lit ? 1.75 : 1}
                strokeDasharray={isOptional(a, b) ? '4 5' : undefined}
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: lit ? 1 : 0.55 }}
                transition={{ pathLength: { duration: 1.1, delay: 0.9 + i * 0.07, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.4 } }}
              />
            )
          })}

          {!reduce && (
            <g key={route.id}>
              <circle r="9" fill="var(--color-signal)" opacity="0.35" filter="url(#glow)">
                <animateMotion dur="2.6s" repeatCount="indefinite" path={routePath(route.hops)} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.25 1" />
              </circle>
              <circle r="3" fill="#fff">
                <animateMotion dur="2.6s" repeatCount="indefinite" path={routePath(route.hops)} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.25 1" />
              </circle>
            </g>
          )}

          {(Object.keys(nodes) as NodeId[]).map((id, i) => {
            const n = nodes[id]
            const lit = nodeLit(id)
            return (
              <motion.g
                key={id}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <rect
                  x={n.x - W / 2}
                  y={n.y - H / 2}
                  width={W}
                  height={H}
                  rx={9}
                  className="transition-[fill,stroke] duration-500"
                  fill={lit ? 'color-mix(in oklab, var(--color-signal) 14%, var(--color-panel))' : 'var(--color-panel)'}
                  stroke={lit ? 'color-mix(in oklab, var(--color-signal) 70%, transparent)' : 'var(--color-line)'}
                />
                <text
                  x={n.x}
                  y={n.y + 4}
                  textAnchor="middle"
                  className={`font-sans text-[12px] transition-[fill] duration-500 ${lit ? 'fill-fg' : 'fill-dim'}`}
                >
                  {n.label}
                </text>
              </motion.g>
            )
          })}
        </svg>
        </div>
      </div>

      <figcaption className="mt-4">
        <div role="tablist" aria-label="Choose a project route" className="flex flex-wrap gap-2">
          {routes.map((r, i) => (
            <button
              key={r.id}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className="relative min-h-10 rounded-full border border-line px-3.5 text-[13px] text-dim transition-colors hover:text-fg aria-selected:border-signal/50 aria-selected:text-fg"
            >
              {i === active && (
                <motion.span layoutId="route-pill" className="absolute inset-0 -z-10 rounded-full bg-signal/12" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
              )}
              {r.name}
            </button>
          ))}
        </div>
        <div className="mt-3 min-h-[3.25rem] text-sm text-dim" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={route.id}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
            >
              {route.caption}{' '}
              <a
                href={`#${route.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToHash(`#${route.id}`)
                }}
                className="text-fg underline decoration-line-2 underline-offset-4 transition-colors hover:decoration-signal"
              >
                See {route.name}
              </a>
            </motion.p>
          </AnimatePresence>
        </div>
      </figcaption>
    </figure>
  )
}
