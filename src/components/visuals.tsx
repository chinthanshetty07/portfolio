import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { Check, CircleAlert, X } from 'lucide-react'

/* ---------- DevLaunch: the session state machine ---------- */

// State names are the real ones from packages/shared/src/states.ts.
const STATES = ['QUEUED', 'CLONING', 'ANALYZING', 'PLANNING', 'VALIDATING', 'STARTING', 'WAITING_FOR_READY', 'READY']
const LOG: Record<string, string> = {
  QUEUED: 'deployment accepted',
  CLONING: 'git clone --depth 1 · symlinks outside repo removed',
  ANALYZING: 'vite + express detected · pnpm lockfile · mongodb in .env.example',
  PLANNING: 'rule-based plan: 2 services, 1 backing database',
  VALIDATING: 'commands, paths and images allowlisted',
  STARTING: 'mongo healthy · install → build → start',
  WAITING_FOR_READY: 'port 5173 answered · port 5001 answered',
  READY: 'smoke test passed: services, API URL, db connection',
}
const RECOVERY = ['Classify log', 'OOM → more memory', 'Known repair', 'Bounded AI repair']

export function DevLaunchVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-20% 0px' })
  const reduce = useReducedMotion()
  const [step, setStep] = useState(reduce ? STATES.length - 1 : 0)

  useEffect(() => {
    if (reduce || !inView) return
    const t = setTimeout(() => setStep((s) => (s + 1) % (STATES.length + 3)), step >= STATES.length - 1 ? 1400 : 720)
    return () => clearTimeout(t)
  }, [step, inView, reduce])

  const current = Math.min(step, STATES.length - 1)
  const lines = STATES.slice(0, current + 1)

  return (
    <div ref={ref} className="flex flex-col gap-4 rounded-2xl border border-line bg-ink-2 p-4 sm:p-5" aria-label="Illustration of a DevLaunch run moving through its states">
      <ol className="flex flex-wrap gap-1.5" aria-hidden="true">
        {STATES.map((s, i) => {
          const done = i < current || (i === current && s === 'READY')
          const now = i === current && s !== 'READY'
          return (
            <li
              key={s}
              className={`relative rounded-md border px-2 py-1 font-mono text-[10.5px] tracking-tight transition-colors duration-500 ${
                done ? 'border-ok/30 bg-ok/10 text-ok' : now ? 'border-signal/50 bg-signal/12 text-fg' : 'border-line text-faint'
              }`}
            >
              {now && !reduce && <motion.span layoutId="dl-now" className="absolute inset-0 rounded-md ring-1 ring-signal/60" />}
              {s}
            </li>
          )
        })}
      </ol>

      <div className="h-[13.5rem] overflow-hidden rounded-xl border border-line bg-ink p-3.5 font-mono text-[11.5px] leading-relaxed" aria-hidden="true">
        <AnimatePresence initial={false}>
          {lines.map((s) => (
            <motion.div
              key={s}
              initial={reduce ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="flex gap-2.5 whitespace-nowrap"
            >
              <span className={s === 'READY' ? 'text-ok' : 'text-signal'}>{s === 'READY' ? '✓' : '›'}</span>
              <span className="w-[9.5rem] shrink-0 text-faint">{s.toLowerCase()}</span>
              <span className="truncate text-dim">{LOG[s]}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div>
        <p className="mb-2 text-xs text-faint">On failure, cheapest fix first:</p>
        <ol className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {RECOVERY.map((r, i) => (
            <li key={r} className="flex items-center gap-2 rounded-lg border border-line bg-panel/60 px-2.5 py-2 text-xs text-dim">
              <span className="font-mono text-[10px] text-faint">{i + 1}</span>
              {r}
            </li>
          ))}
        </ol>
      </div>
      <p className="text-[11px] text-faint">Illustration using DevLaunch’s real state names; log lines abbreviated.</p>
    </div>
  )
}

/* ---------- Prompt Engine: the real scope check, running in your browser ---------- */

// Copied from backend/config/codingPrinciples.js
const CODING_SIGNALS = [
  /\b(code|coding|program|programming|software|application|app|website|web app)\b/i,
  /\b(api|sdk|cli|database|sql|query|schema|backend|frontend|full[- ]stack)\b/i,
  /\b(debug|debugging|bug|error|exception|stack trace|refactor|compile|runtime)\b/i,
  /\b(function|method|class|component|module|package|library|framework|algorithm|data structure)\b/i,
  /\b(react|next\.js|node\.js|express|python|java|javascript|typescript|go|rust|c\+\+|c#|swift|kotlin|php|ruby|\.net)\b/i,
  /\b(git|github|docker|kubernetes|ci\/cd|devops|deploy|deployment|cloud|microservice|architecture)\b/i,
  /\b(unit test|integration test|end[- ]to[- ]end test|test suite|automate|automation)\b/i,
  /\b(implement|build|create|design|develop|write)\b.*\b(code|api|app|software|service|feature|function|database|website)\b/i,
]
const SAMPLES = ['make a login api in express', 'build a fitness app using Rust', 'write me a poem about the sea']
const ASKS = ['Context & objective', 'Inputs and outputs', 'Constraints & versions', 'Error handling', 'Security', 'Tests & acceptance criteria']

export function PromptVisual() {
  const [text, setText] = useState(SAMPLES[0])
  const match = useMemo(() => {
    for (const re of CODING_SIGNALS) {
      const m = text.match(re)
      if (m) return m[0]
    }
    return null
  }, [text])
  const empty = text.trim().length === 0

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-ink-2 p-4 sm:p-5">
      <div>
        <label htmlFor="pe-input" className="text-xs text-faint">
          Try the scope check (the repo’s actual regex, running in your browser)
        </label>
        <input
          id="pe-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
          className="mt-2 w-full rounded-xl border border-line-2 bg-ink px-3.5 py-3 text-[15px] text-fg placeholder:text-faint focus:border-signal/60 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/40"
          placeholder="Describe a coding task…"
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SAMPLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setText(s)}
              className="min-h-8 rounded-full border border-line px-2.5 text-xs text-dim transition-colors hover:border-line-2 hover:text-fg"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-line bg-ink p-3.5 font-mono text-[12px]" aria-live="polite">
        <span className="text-faint">POST /api/optimize → </span>
        {empty ? (
          <span className="text-warn">400 · Prompt cannot be empty</span>
        ) : match ? (
          <span className="text-ok">
            accepted · matched “{match}” → sent to model
          </span>
        ) : (
          <span className="text-[#ff8f8f]">422 · Only coding prompts are supported</span>
        )}
      </div>

      <div className={`transition-opacity duration-500 ${match && !empty ? 'opacity-100' : 'opacity-40'}`}>
        <p className="mb-2 text-xs text-faint">The rewritten prompt asks for, where relevant:</p>
        <ul className="grid grid-cols-2 gap-1.5">
          {ASKS.map((a, i) => (
            <motion.li
              key={a}
              initial={false}
              animate={{ opacity: match && !empty ? 1 : 0.6 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-2 rounded-lg border border-line bg-panel/60 px-2.5 py-2 text-xs text-dim"
            >
              <Check className="size-3.5 shrink-0 text-signal" aria-hidden="true" />
              {a}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ---------- Benchmark: how the grader reads an answer ---------- */

const CASES = [
  { said: 'Net income is revenue minus expenses …\nFinal answer: $3,000', rule: '“Final answer:” line', value: '3000', expected: '3000', ok: true },
  { said: '… so the company makes a loss.\nFinal answer: (1,200)', rule: 'accounting negative', value: '-1200', expected: '-1200', ok: true },
  { said: 'The break-even point is \\boxed{450} units', rule: '\\boxed{} fallback', value: '450', expected: '450', ok: true },
  { said: 'Roughly 12% … maybe 12.5%\nFinal answer: 12.5', rule: 'tolerance 0.005', value: '12.5', expected: '12', ok: false },
]

export function BenchmarkVisual() {
  const [i, setI] = useState(0)
  const c = CASES[i]
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-ink-2 p-4 sm:p-5">
      <div role="tablist" aria-label="Grader examples" className="flex flex-wrap gap-1.5">
        {CASES.map((x, n) => (
          <button
            key={x.rule}
            role="tab"
            aria-selected={n === i}
            onClick={() => setI(n)}
            className="min-h-8 rounded-full border border-line px-2.5 text-xs text-dim transition-colors hover:text-fg aria-selected:border-signal/50 aria-selected:bg-signal/10 aria-selected:text-fg"
          >
            {x.rule}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-3"
        >
          <div>
            <p className="mb-1.5 text-xs text-faint">Model output</p>
            <pre className="rounded-xl border border-line bg-ink p-3.5 font-mono text-[12px] whitespace-pre-wrap text-dim">{c.said}</pre>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ['Extracted', c.value],
              ['Expected', c.expected],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-line bg-panel/60 px-2 py-2.5">
                <p className="text-[11px] text-faint">{k}</p>
                <p className="font-mono text-sm text-fg">{v}</p>
              </div>
            ))}
            <div className={`flex flex-col items-center justify-center rounded-xl border px-2 py-2.5 ${c.ok ? 'border-ok/30 bg-ok/10 text-ok' : 'border-[#ff8f8f]/30 bg-[#ff8f8f]/10 text-[#ff8f8f]'}`}>
              {c.ok ? <Check className="size-4" aria-hidden="true" /> : <X className="size-4" aria-hidden="true" />}
              <p className="text-xs">{c.ok ? 'Correct' : 'Incorrect'}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <p className="flex items-start gap-1.5 text-[11px] text-faint">
        <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden="true" />
        Illustrative inputs showing the grader’s documented rules. Committed run: 16/16 correct across 3 trials on qwen3:4b, which
        the README itself calls a smoke test, not a scientific measure.
      </p>
    </div>
  )
}

/* ---------- ARC: an agent action has to clear five checks ---------- */

// Order and error kinds from src/arc/services/external_actions.py
const GATES = [
  { label: 'Capability enabled for tenant', error: 'capability_disabled' },
  { label: 'Provider can act', error: 'provider_cannot_act' },
  { label: 'Destination configured', error: 'destination_not_configured' },
  { label: 'Act credential present', error: 'missing_act_credential' },
  { label: 'Action is valid', error: 'invalid_action' },
]

export function ArcVisual() {
  const [broken, setBroken] = useState<number | null>(null)
  const reduce = useReducedMotion()
  const stop = broken ?? GATES.length

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-ink-2 p-4 sm:p-5">
      <p className="text-xs text-faint">An agent wants to post to Slack. Click a check to make it fail.</p>
      <ol className="space-y-1.5">
        {GATES.map((g, i) => {
          const passed = i < stop
          const failed = i === broken
          return (
            <li key={g.error}>
              <button
                type="button"
                onClick={() => setBroken(broken === i ? null : i)}
                aria-pressed={failed}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors duration-300 ${
                  failed
                    ? 'border-[#ff8f8f]/40 bg-[#ff8f8f]/10 text-fg'
                    : passed
                      ? 'border-ok/25 bg-ok/[0.06] text-fg hover:border-ok/40'
                      : 'border-line text-faint hover:border-line-2'
                }`}
              >
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                    failed ? 'border-[#ff8f8f]/50 text-[#ff8f8f]' : passed ? 'border-ok/40 text-ok' : 'border-line-2 text-faint'
                  }`}
                >
                  {failed ? <X className="size-3.5" aria-hidden="true" /> : passed ? <Check className="size-3.5" aria-hidden="true" /> : i + 1}
                </span>
                <span className="flex-1">{g.label}</span>
                <span className="hidden font-mono text-[10.5px] text-faint sm:inline">{g.error}</span>
              </button>
            </li>
          )
        })}
      </ol>
      <div className="rounded-xl border border-line bg-ink p-3.5 font-mono text-[12px]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.p
            key={String(broken)}
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {broken === null ? (
              <span className="text-ok">performed · logged with tenant, provider and result</span>
            ) : (
              <span className="text-[#ff8f8f]">
                refused · error_kind=“{GATES[broken].error}” · credential never logged
              </span>
            )}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="text-[11px] text-faint">The order and error kinds mirror the service I wrote; covered by 614 lines of tests.</p>
    </div>
  )
}

/* ---------- Stock-Watch: what an unreadable page does to a naive watcher ---------- */

type Read = 'OUT' | 'UNKNOWN' | 'IN'
const READS: { at: string; read: Read; note: string }[] = [
  { at: '02:58', read: 'OUT', note: 'page says out of stock' },
  { at: '03:00', read: 'UNKNOWN', note: 'bot challenge served' },
  { at: '03:01', read: 'UNKNOWN', note: '503 from the shop' },
  { at: '03:03', read: 'OUT', note: 'page readable again' },
  { at: '03:04', read: 'IN', note: 'actually back in stock' },
]

export function StockVisual() {
  const [naive, setNaive] = useState(false)
  // A naive watcher reads "couldn't parse" as out of stock, then sees the next good
  // read as a change. Stock-Watch holds the last known status through UNKNOWN.
  const rows = READS.map((r) => ({ ...r, seen: (naive && r.read === 'UNKNOWN' ? 'OUT' : r.read) as Read }))
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-ink-2 p-4 sm:p-5">
      <div role="tablist" aria-label="Compare watchers" className="grid grid-cols-2 gap-1 rounded-xl border border-line bg-ink p-1">
        {[
          { v: false, label: 'Stock-Watch' },
          { v: true, label: 'Naive watcher' },
        ].map((t) => (
          <button
            key={t.label}
            role="tab"
            aria-selected={naive === t.v}
            onClick={() => setNaive(t.v)}
            className="relative min-h-10 rounded-lg text-sm text-dim transition-colors aria-selected:text-fg"
          >
            {naive === t.v && <motion.span layoutId="sw-tab" className="absolute inset-0 -z-0 rounded-lg bg-white/[0.07]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>
      <ol className="space-y-1.5">
        {rows.map((r) => {
          const tone =
            naive && r.read === 'UNKNOWN'
              ? 'border-[#ff8f8f]/40 text-[#ff8f8f]'
              : r.seen === 'IN'
                ? 'border-ok/30 text-ok'
                : r.seen === 'UNKNOWN'
                  ? 'border-warn/30 text-warn'
                  : 'border-line-2 text-dim'
          return (
            <li key={r.at} className="grid grid-cols-[2.75rem_6.25rem_1fr] items-center gap-2 rounded-xl border border-line bg-panel/40 px-3 py-2 text-xs">
              <span className="font-mono text-faint">{r.at}</span>
              <motion.span layout className={`justify-self-start rounded-md border px-1.5 py-0.5 font-mono text-[10.5px] ${tone}`}>
                {r.seen === 'IN' ? 'IN_STOCK' : r.seen === 'OUT' ? 'OUT_OF_STOCK' : 'UNKNOWN'}
              </motion.span>
              <span className="leading-snug text-dim">{r.note}</span>
            </li>
          )
        })}
      </ol>
      <div className="rounded-xl border border-line bg-ink p-3.5 text-[13px]" aria-live="polite">
        {naive ? (
          <p className="text-dim">
            <span className="text-[#ff8f8f]">Two failed reads logged as out of stock.</span> If the parser had broken instead, every read
            would say “out of stock” forever, and you’d never know the watcher was blind.
          </p>
        ) : (
          <p className="text-dim">
            <span className="text-ok">Last known status kept through the outage.</span> One alert at 03:04, and a separate “watcher is
            blind” alert if unreadable checks keep piling up.
          </p>
        )}
      </div>
    </div>
  )
}
