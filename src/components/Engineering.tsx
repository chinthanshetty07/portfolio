import { useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { SectionHead, Reveal } from './Reveal'

const k = (s: string) => <span className="tok-k">{s}</span>
const s = (x: string) => <span className="tok-s">{x}</span>
const c = (x: string) => <span className="tok-c">{x}</span>
const f = (x: string) => <span className="tok-f">{x}</span>

interface Decision {
  id: string
  project: string
  title: string
  context: string
  decision: string
  tradeoff: string
  file: string
  code: ReactNode
}

// Excerpts are trimmed from the real files named in `file`.
const decisions: Decision[] = [
  {
    id: 'order',
    project: 'DevLaunch',
    title: 'Match the most specific framework first',
    context: 'Next.js, Nuxt, SvelteKit and Astro all depend on Vite or webpack. A naive “does package.json list vite?” check starts the wrong dev server.',
    decision: 'Detection is an ordered, frozen table: meta-frameworks before the build tools they sit on. Each entry carries its default port, scripts and CLI argument style.',
    tradeoff: 'Order is now load-bearing, so new entries need care. In exchange, detection stays a readable, testable list instead of nested conditionals.',
    file: 'apps/backend/src/services/planning/frameworks.ts',
    code: (
      <>
        {k('export const')} {f('NODE_FRAMEWORKS')}: {k('readonly')} NodeFramework[] = Object.{f('freeze')}([{'\n'}
        {'  '}{c('// --- meta-frameworks first: each depends on a build tool below ---')}{'\n'}
        {'  '}{'{'} id: {s("'next'")}, dep: {s("'next'")}, defaultPort: 3000, scripts: [{s("'dev'")}, {s("'start'")}] {'}'},{'\n'}
        {'  '}{'{'} id: {s("'nuxt'")}, dep: {s("'nuxt'")}, defaultPort: 3000, scripts: [{s("'dev'")}] {'}'},{'\n'}
        {'  '}{'{'} id: {s("'sveltekit'")}, dep: {s("'@sveltejs/kit'")}, defaultPort: 5173 {'}'},{'\n'}
        {'  '}{'{'} id: {s("'astro'")}, dep: {s("'astro'")}, defaultPort: 4321 {'}'},{'\n'}
        {'  '}{c('// … build tools and plain servers follow')}{'\n'}
        ])
      </>
    ),
  },
  {
    id: 'ports',
    project: 'DevLaunch',
    title: 'Tell “bound to localhost” apart from “never started”',
    context: 'A dev server listening on 127.0.0.1 inside a container looks healthy in its logs but can’t be reached. Both cases surface as the same timeout.',
    decision: 'Read /proc/net/tcp inside the container and classify the sockets. Each outcome maps to a distinct failure, and loopback-only gets a deterministic fix (HOST=0.0.0.0) instead of an AI guess.',
    tradeoff: 'Linux-specific introspection, which is fine because every service runs in a Linux container DevLaunch controls.',
    file: 'apps/backend/src/services/ports/PortManager.ts',
    code: (
      <>
        {k('const')} reachable = onExpected.{f('find')}((s) =&gt; !s.loopbackOnly);{'\n'}
        {k('if')} (reachable) {k('return')} {'{'} kind: {s("'listening'")}, socket: reachable {'}'};{'\n'}
        {k('const')} loopback = onExpected.{f('find')}((s) =&gt; s.loopbackOnly);{'\n'}
        {k('if')} (loopback) {k('return')} {'{'} kind: {s("'loopback-only'")}, socket: loopback {'}'};{'\n'}
        {k('const')} elsewhere = app.{f('filter')}((s) =&gt; s.port !== expectedPort);{'\n'}
        {k('if')} (elsewhere.length === 1) {k('return')} {'{'} kind: {s("'other-port'")}, socket: elsewhere[0]! {'}'};{'\n'}
        {k('return')} {'{'} kind: {s("'not-listening'")}, observed: sockets {'}'};
      </>
    ),
  },
  {
    id: 'sandbox',
    project: 'DevLaunch',
    title: 'Treat every repository as untrusted code',
    context: 'DevLaunch runs install scripts and servers from arbitrary public repos on the user’s own machine.',
    decision: 'Runner containers get hard ceilings, a read-only root, no capabilities and no Docker socket. A repo’s own image gets a balanced profile that keeps the same walls where an arbitrary image can live with them.',
    tradeoff: 'Official images often start as root and write their own filesystem, so the strict profile would break them. They get their own user and a writable root, but keep the resource ceilings, network rules and no-socket guarantee.',
    file: 'apps/backend/src/services/docker/ContainerSecurity.ts',
    code: (
      <>
        Memory: memoryMb * 1024 * 1024,{'\n'}
        {c('// Equal to Memory: without this the container escapes its cap through swap.')}{'\n'}
        MemorySwap: memoryMb * 1024 * 1024,{'\n'}
        PidsLimit: config.container.pidsLimit,{'\n'}
        ReadonlyRootfs: {k('true')},{'\n'}
        Tmpfs: {'{'} {s("'/tmp'")}: {s('`rw,noexec,nosuid,size=${tmpSizeMb}m`')} {'}'},{'\n'}
        CapDrop: [{s("'ALL'")}],{'\n'}
        SecurityOpt: [{s("'no-new-privileges'")}],{'\n'}
        Privileged: {k('false')},{'\n'}
        {c('// The Docker socket is never mounted.')}
      </>
    ),
  },
  {
    id: 'race',
    project: 'ARC (team project)',
    title: 'Lock the rows instead of hoping the check holds',
    context: 'Removing a member must never leave a tenant with no owner. A read-then-delete check races: two owners removing each other at once both see “someone else is still an owner”.',
    decision: 'Do the check and the delete in one transaction that locks the tenant’s membership rows with SELECT … FOR UPDATE, so concurrent removals serialize.',
    tradeoff: 'Concurrent membership changes in a single tenant now wait on each other, which is a rare and cheap cost for an invariant that must never break.',
    file: 'src/arc/db/connection.py',
    code: (
      <>
        {k('async with')} self.{f('transaction')}() {k('as')} conn:{'\n'}
        {'    '}rows = {k('await')} conn.{f('fetch')}({'\n'}
        {'        '}{s('"SELECT user_id, role FROM memberships WHERE tenant_id = $1 FOR UPDATE"')},{'\n'}
        {'        '}tenant_id){'\n'}
        {'    '}{k('if not')} {f('any')}(row[{s('"user_id"')}] == user_id {k('for')} row {k('in')} rows):{'\n'}
        {'        '}{k('return')} {s('"not_found"')}{'\n'}
        {'    '}owners = [row[{s('"user_id"')}] {k('for')} row {k('in')} rows {k('if')} row[{s('"role"')}] == UserRole.OWNER.value]{'\n'}
        {'    '}{k('if')} owners == [user_id]:{'\n'}
        {'        '}{k('return')} {s('"last_owner"')}{'\n'}
        {'    '}{k('await')} conn.{f('execute')}({s('"DELETE FROM memberships WHERE tenant_id = $1 AND user_id = $2"')}, tenant_id, user_id)
      </>
    ),
  },
  {
    id: 'unknown',
    project: 'Stock-Watch',
    title: 'Make “I couldn’t tell” a first-class answer',
    context: 'Bot challenges, timeouts and changed markup are routine when reading shop pages. Treating them as “out of stock” makes the next good read look like a restock, and hides a broken parser.',
    decision: 'Model four statuses. UNKNOWN never alerts and never overwrites the last known status. A run of unreadable checks sends one distinct “watcher is blind” alert.',
    tradeoff: 'More states to reason about, so the transition rules are pure functions over (state, result), with no I/O, and directly unit-tested.',
    file: 'src/stockwatch/detector.py',
    code: (
      <>
        {c('# --- the page told us nothing ---')}{'\n'}
        {k('if not')} result.status.is_known:{'\n'}
        {'    '}state.consecutive_unknown += 1{'\n'}
        {'    '}{k('if')} state.consecutive_unknown {'>'}= config.blind_after_n_unknown {k('and not')} state.blind_alert_sent:{'\n'}
        {'        '}state.blind_alert_sent = {k('True')}{'\n'}
        {'        '}alerts.{f('append')}({f('Alert')}(kind=AlertKind.BLIND, watch=result.watch, ...)){'\n'}
        {'    '}{c('# Crucially: last_known_status is left untouched. An unreadable page is')}{'\n'}
        {'    '}{c('# not evidence of anything about the stock itself.')}{'\n'}
        {'    '}{k('return')} alerts
      </>
    ),
  },
  {
    id: 'scope',
    project: 'Prompt Engine',
    title: 'Reject out-of-scope input before paying for a model call',
    context: 'The product only handles coding prompts. Sending everything to the LLM wastes tokens and returns off-topic output.',
    decision: 'Cheap validation runs first: type, empty, length, then a regex signal check. Non-coding prompts get a 422 with a clear message, and the model is never called.',
    tradeoff: 'Regex signals can misjudge edge cases. The check deliberately looks for any technical signal rather than the topic, so “a fitness app in Rust” still passes.',
    file: 'backend/config/codingPrinciples.js',
    code: (
      <>
        {k('export function')} {f('isCodingPrompt')}(prompt) {'{'}{'\n'}
        {'  '}{k('const')} hasCodingSignal = CODING_SIGNALS.{f('some')}((p) =&gt; p.{f('test')}(prompt)){'\n'}
        {'  '}{c('// The subject area is not a reliable indicator of whether a')}{'\n'}
        {'  '}{c('// request is technical: "build a fitness app using Rust" is valid.')}{'\n'}
        {'  '}{k('return')} hasCodingSignal{'\n'}
        {'}'}{'\n\n'}
        {k('if')} (!{f('isCodingPrompt')}(prompt)) {'{'}{'\n'}
        {'  '}{k('return')} res.{f('status')}(422).{f('json')}({'{'} success: {k('false')}, error: {s("'Only coding … prompts are supported.'")} {'}'}){'\n'}
        {'}'}
      </>
    ),
  },
  {
    id: 'grade',
    project: 'Reliability Benchmark',
    title: 'Grade the answer, not the essay',
    context: 'Reasoning models write long explanations full of intermediate numbers. Searching for the expected value anywhere would pass wrong answers.',
    decision: 'Extract exactly one final value through an ordered set of patterns: an explicit “Final answer:” line, then \\boxed{}, then the last numeric line. Then compare with Decimal and a fixed tolerance.',
    tradeoff: 'Only numeric answers can be graded for now. That is acceptable for finance arithmetic, and is listed as a known limit.',
    file: 'tasks/grading.py',
    code: (
      <>
        markers = {f('list')}(FINAL_ANSWER_RE.{f('finditer')}(text)){'\n'}
        {k('if')} markers:{'\n'}
        {'    '}rest = text[markers[-1].{f('end')}():]{'\n'}
        {'    '}line = rest.{f('strip')}().{f('splitlines')}()[0] {k('if')} rest.{f('strip')}() {k('else')} {s('""')}{'\n'}
        {'    '}{k('if')} NUMBER_RE.{f('search')}(line):{'\n'}
        {'        '}{k('return')} line, {s('"final_answer_line"')}{'\n'}
        boxes = BOXED_RE.{f('findall')}(text){'\n'}
        {k('if')} boxes:{'\n'}
        {'    '}{k('return')} boxes[-1], {s('"boxed"')}
      </>
    ),
  },
]

export function Engineering() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  const d = decisions[active]

  return (
    <section id="engineering" aria-labelledby="eng-title" className="section border-y border-line bg-ink-2/40 py-24 md:py-32">
      <div className="container-x">
        <SectionHead
          id="eng-title"
          kicker="Engineering decisions"
          title="How I make the calls that don’t show up in a screenshot"
          intro="Real decisions from my repositories: the context, what I chose, what it cost, and the code."
        />

        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
            <div role="tablist" aria-label="Engineering decisions" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0 [scrollbar-width:none]">
              {decisions.map((x, i) => (
                <button
                  key={x.id}
                  role="tab"
                  id={`tab-${x.id}`}
                  aria-selected={i === active}
                  aria-controls="decision-panel"
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                      e.preventDefault()
                      const n = (i + 1) % decisions.length
                      setActive(n)
                      document.getElementById(`tab-${decisions[n].id}`)?.focus()
                    }
                    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                      e.preventDefault()
                      const n = (i - 1 + decisions.length) % decisions.length
                      setActive(n)
                      document.getElementById(`tab-${decisions[n].id}`)?.focus()
                    }
                  }}
                  tabIndex={i === active ? 0 : -1}
                  className="relative w-64 shrink-0 rounded-xl border border-line px-4 py-3.5 text-left transition-colors hover:border-line-2 aria-selected:border-signal/40 lg:w-auto"
                >
                  {i === active && (
                    <motion.span
                      layoutId="decision-bg"
                      className="absolute inset-0 -z-10 rounded-xl bg-signal/[0.08]"
                      transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className="block text-xs text-faint">{x.project}</span>
                  <span className="mt-1 block text-[15px] leading-snug font-medium">{x.title}</span>
                </button>
              ))}
            </div>

            <div id="decision-panel" role="tabpanel" aria-labelledby={`tab-${d.id}`} className="min-w-0 rounded-2xl border border-line bg-ink">
              <AnimatePresence mode="wait">
                <motion.div
                  key={d.id}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-3">
                    {[
                      ['Context', d.context],
                      ['Decision', d.decision],
                      ['Trade-off', d.tradeoff],
                    ].map(([h, t]) => (
                      <div key={h}>
                        <h3 className="text-sm font-medium text-fg">{h}</h3>
                        <p className="mt-2 text-[15px] text-dim text-pretty">{t}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-line">
                    <div className="flex items-center gap-2 border-b border-line px-5 py-2.5">
                      <span className="flex gap-1.5" aria-hidden="true">
                        <span className="size-2.5 rounded-full bg-line-2" />
                        <span className="size-2.5 rounded-full bg-line-2" />
                        <span className="size-2.5 rounded-full bg-line-2" />
                      </span>
                      <span className="ml-2 truncate font-mono text-xs text-faint">{d.file}</span>
                    </div>
                    <pre className="code overflow-x-auto p-5 text-dim sm:p-6" tabIndex={0} aria-label={`Code excerpt from ${d.file}`}>
                      <code>{d.code}</code>
                    </pre>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
