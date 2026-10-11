// Claims below were checked against each repository's source (Oct 2026), not just its README.
export type ProjectId = 'devlaunch' | 'arc' | 'stockwatch' | 'prompt-engine' | 'benchmark'

export interface Project {
  id: ProjectId
  name: string
  tagline: string
  problem: string
  why: string
  role: string
  stack: string[]
  facts: { value: string; label: string }[]
  repo?: string
  repoNote?: string
  site?: { href: string; label: string }
  status: { label: string; tone: 'ok' | 'warn' }
  built: string[]
  planned: string[]
  challenges: { title: string; body: string }[]
  flow: string[]
}

export const projects: Project[] = [
  {
    id: 'devlaunch',
    name: 'DevLaunch',
    tagline: 'Paste a public GitHub URL and get the app running locally, inside hardened Docker containers.',
    problem:
      'Running an unfamiliar repository means guessing the runtime, package manager, ports, databases and env vars, then debugging whatever breaks.',
    why: 'Evaluating, reviewing or contributing to a project starts with getting it to run, and that step quietly eats hours.',
    role: 'Solo project: designed and built the backend orchestrator, analysis and planning, the Docker execution layer and the React dashboard.',
    stack: ['TypeScript', 'Node.js', 'Express 5', 'dockerode', 'WebSocket', 'zod', 'React', 'Vite', 'Tailwind', 'Vitest', 'Groq API'],
    facts: [
      { value: '~27k', label: 'lines of TypeScript' },
      { value: '~1,360', label: 'test cases' },
      { value: '28', label: 'ordered failure signatures' },
      { value: '29 / 40', label: 'real repos reached READY in the release run' },
    ],
    repo: 'https://github.com/chinthanshetty07/Dev-launch',
    site: { href: 'https://chinthanshetty07.github.io/Dev-launch/', label: 'Project site' },
    status: { label: 'Working · runs locally', tone: 'ok' },
    flow: ['Clone', 'Analyze', 'Plan', 'Validate', 'Provision DBs', 'Start', 'Ready check', 'Smoke test'],
    built: [
      'Shallow, size- and time-limited clone of public GitHub repos; symlinks escaping the repo are removed.',
      'Repository analysis: frameworks, services, ports, package manager (npm, pnpm, Yarn 1/2+, pip, poetry), runtime version, databases and env vars.',
      'Planning in layers: deterministic rules first, then the repo’s own Dockerfile or compose file, then an LLM planner only as a last resort.',
      'Plan validation with a command allowlist, path checks and an image allowlist.',
      'Provisioning of Postgres, MySQL, MongoDB and Redis with health checks; multi-service repos get each other’s addresses wired in.',
      'Hardened runner containers: all capabilities dropped, read-only root filesystem, noexec /tmp, no-new-privileges, CPU/memory/PID limits, no Docker socket. A repo’s own image gets a balanced profile with the same ceilings and network rules.',
      'Readiness checks plus an end-to-end smoke test that each service, API URL and database connection actually answers.',
      'Failure handling: classify the log, retry with more memory on OOM, apply known deterministic repairs, then a bounded AI repair.',
      'Live log streaming over WebSocket with resume-from-sequence and explicit gap markers.',
      'CLI (install, doctor, deploy, logs, stop, clean) and CI that runs real Docker install/test/uninstall on Linux.',
    ],
    planned: [
      'Hosted mode for other people (design docs only).',
      'AI relay (Cloudflare Worker) is written but not deployed.',
      'Native Java, Go, Rust, PHP, Ruby and .NET support; today these only run through a repo’s own Dockerfile.',
      'Running ORM migrations (Prisma, Alembic, Sequelize, TypeORM).',
    ],
    challenges: [
      {
        title: 'Detection order matters',
        body: 'Next, Nuxt, SvelteKit and Astro all depend on Vite or webpack. Detecting the build tool first launches the wrong command, so frameworks are matched from an ordered, most-specific-first table.',
      },
      {
        title: '“It started” is not “it works”',
        body: 'A server listening on 127.0.0.1 inside a container looks alive but is unreachable. DevLaunch reads /proc/net/tcp in the container to distinguish loopback-only, wrong-port and not-listening, then forces HOST=0.0.0.0 when that is the fix.',
      },
      {
        title: 'Running untrusted code',
        body: 'Every repo is treated as hostile: allowlisted commands and images, locked-down containers, egress to private ranges blocked, and privileged or host-mount compose settings refused. The controls are tested inside real containers.',
      },
      {
        title: 'AI as the last resort, with a budget',
        body: 'Rules and known repairs handle the common cases deterministically. The model is only called when they cannot, and each repair path has its own attempt limit so a run cannot loop forever.',
      },
    ],
  },
  {
    id: 'arc',
    name: 'ARC',
    tagline: 'A multi-tenant AI platform for IT services companies: a tenant-isolated “company brain” with RAG, agents and human approvals.',
    problem:
      'Teams want to ask questions of their own documents and let agents act on tools, without leaking data across companies or letting an agent act unchecked.',
    why: 'Enterprise AI fails on trust, not demos: isolation, refusals when the documents don’t cover a question, and a human in the loop for real actions.',
    role: 'Team project, four engineers. I joined four weeks in and shipped 47 merged PRs across the React frontend, FastAPI backend, retrieval and CI.',
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'Pydantic', 'RAG', 'React 19', 'TanStack Query', 'Tailwind', 'Docker', 'GitHub Actions'],
    facts: [
      { value: '149', label: 'of 661 commits on main' },
      { value: '47', label: 'merged pull requests' },
      { value: '+35.5k', label: 'lines added, about 20% of the repo' },
      { value: '4', label: 'engineers on the team' },
    ],
    repo: 'https://github.com/arc-ive/arc',
    status: { label: 'Team project · in development', tone: 'ok' },
    flow: ['Ingest docs', 'Redact PII', 'Hybrid retrieval', 'Answer or refuse', 'Agent proposal', 'Human approval', 'Gated action'],
    built: [
      'Typed Pydantic contracts for every request body, OpenAPI auth-error declarations, and per-field 422 errors in the UI.',
      'PDF and Word ingestion with an upload path, plus local OCR that is off by default (recorded as an ADR).',
      'Ask Arc treats refusal as a valid answer when the documents don’t cover the question.',
      'Fixed a retrieval bypass where any shared word skipped the relevance floor: separate dense and lexical floors, plus a script that measures the threshold from real documents.',
      'Agent external actions behind five ordered checks, each refusing with a specific error kind (614 lines of tests).',
      'Resuming execution after approval, tenant suspend/restore, and self-service workspace membership for company admins.',
      'Fixed a race that could leave a tenant with no owner, Google sign-in that could never complete, and an upload size check that ran only after reading the whole file.',
      'Frontend: fail-closed permission guards, semantic design tokens, agent-run and approval-timeline UIs, Company Brain and Ask Arc redesigns, keyboard and screen-reader access.',
      'CI: tests split into four parallel shards, each image built once and tested as published, releases promoted by retag rather than rebuild, and supply-chain gates.',
    ],
    planned: ['The project is still in its foundation phase per its README; there is no public deployment yet.'],
    challenges: [
      {
        title: 'Check-then-delete is a race',
        body: 'Two admins removing each other at once could both pass a “not the last owner” check. Locking the tenant’s membership rows with SELECT … FOR UPDATE makes the check and delete atomic.',
      },
      {
        title: 'A floor that one word could skip',
        body: 'Hybrid search fused dense and lexical scores, and lexical-only matches bypassed the similarity floor. Each score type now has its own floor; the fused RRF score is deliberately left unthresholded.',
      },
      {
        title: 'Ship the image you tested',
        body: 'CI builds each image once, runs the tests against that exact published image, and promotes releases by retagging. A test enforces the rule across every workflow.',
      },
    ],
  },
  {
    id: 'stockwatch',
    name: 'Stock-Watch',
    tagline: 'A Telegram bot anyone can send an Amazon or Flipkart link to, and get told the moment their item is back in stock.',
    problem:
      'Restocks of popular products last minutes. Most stock watchers treat “couldn’t read the page” as “out of stock”, which causes both 3 a.m. false alerts and silently missed drops.',
    why: 'An alerting tool is only as good as its worst night: one false alarm or one missed restock and people stop trusting it.',
    role: 'Solo project: fetcher, per-site parsers, alert rules, Telegram bot, dashboard and three deployment targets.',
    stack: ['Python', 'HTTP/2 client', 'Telegram Bot API', 'pytest', 'Docker', 'Render', 'GitHub Actions', 'launchd / systemd'],
    facts: [
      { value: '4', label: 'statuses, including UNKNOWN' },
      { value: '5', label: 'parser layers per site' },
      { value: '51', label: 'test functions, fixtures from real pages' },
    ],
    repoNote: 'Private repository, code available on request',
    status: { label: 'Working · deployable', tone: 'ok' },
    flow: ['Link from chat', 'Normalize URL', 'Fetch (warm session)', 'Layered parse', 'Evaluate transition', 'Alert / remind'],
    built: [
      'Multi-user Telegram bot: each chat watches its own products; reply “stop” to any alert to drop that item. Share links from both apps are expanded.',
      'Layered parsing per site, most reliable signal first: schema.org JSON-LD, out-of-stock buybox, availability text, cart button, embedded state, then UNKNOWN.',
      'Text markers matched inside specific containers only, so recommendation carousels can’t report a neighbour’s stock; a test covers exactly that.',
      'Pure, side-effect-free transition rules: immediate restock alert, 30-second reminders until stopped, a correction if the page flips back within 15 minutes.',
      'A “watcher is blind” alert after repeated unreadable checks, and a “reading again” alert when it recovers.',
      'Polite fetching: one warm HTTP/2 session, jittered intervals, back-off on 429, minimum interval enforced at startup.',
      'Read-only status dashboard (POST returns 405, with a test asserting it).',
      'Runs as a macOS LaunchAgent, on Render with a persistent disk, on an Oracle VM, or as a scheduled GitHub Actions job.',
    ],
    planned: ['Only Amazon and Flipkart are supported. Hosted runs on datacenter IPs are more likely to be served bot challenges, which the README documents.'],
    challenges: [
      {
        title: 'UNKNOWN is a status, not “out of stock”',
        body: 'Timeouts, 503s, bot challenges and unrecognized markup become UNKNOWN. It never triggers an alert and never overwrites the last known status, so the next good read can’t masquerade as a restock.',
      },
      {
        title: 'Speed versus certainty',
        body: 'Waiting for a second in-stock read costs about 90 seconds on a drop that may not last that long. It alerts on the first read instead, and sends a correction if the page reverts within 15 minutes.',
      },
      {
        title: 'Hosting is a trade, not an upgrade',
        body: 'Cloud IPs get challenged far more than home connections. The README spells out the trade-offs of each target (single long-poller, persistent disk, cron delays) instead of hiding them.',
      },
    ],
  },
  {
    id: 'prompt-engine',
    name: 'Prompt Engine',
    tagline: 'Rewrites rough coding requests into precise, AI-ready prompts.',
    problem:
      'Vague prompts like “make a login api” produce vague code. Most people do not spell out constraints, error handling, tests or acceptance criteria.',
    why: 'The quality of AI-generated code depends heavily on the prompt, and a structured prompt is cheaper than several rounds of corrections.',
    role: 'Solo project: built the React frontend, the Express API, the MongoDB persistence and the LLM integration.',
    stack: ['React', 'Vite', 'Context API', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'Groq API'],
    facts: [
      { value: '10', label: 'engineering principles in the system prompt' },
      { value: '422', label: 'returned for out-of-scope prompts' },
      { value: '10k', label: 'char input limit, validated server-side' },
    ],
    repo: 'https://github.com/chinthanshetty07/Prompt-Engine',
    status: { label: 'Working · runs locally', tone: 'ok' },
    flow: ['Validate', 'Scope check', 'LLM rewrite', 'Persist', 'Respond'],
    built: [
      'POST /api/optimize: validates input, rejects non-coding prompts with 422, rewrites via the Groq API and stores the result.',
      'System prompt built from ten explicit engineering principles (preserve intent, state assumptions, handle errors, recommend tests…).',
      'Layered Express backend: routes → controllers → services → Mongoose models, with centralized error middleware and a health endpoint.',
      'Deterministic mock response when no API key is configured, so the app runs end to end without secrets.',
      'MongoDB history with endpoints for list, lookup, search, stats and delete.',
      'Two-column React UI with copy-to-clipboard and system dark mode.',
    ],
    planned: ['History, search and stats are in the API but not yet surfaced in the UI.'],
    challenges: [
      {
        title: 'Scope before spend',
        body: 'A regex-based signal check rejects non-coding prompts before any model call, which keeps responses on-topic and avoids paying for requests the product does not serve.',
      },
      {
        title: 'Runs without credentials',
        body: 'Without an API key the service returns a deterministic, clearly flagged mock so the full UI → API → database path can be exercised locally.',
      },
    ],
  },
  {
    id: 'benchmark',
    name: 'Agent Reliability Benchmark',
    tagline: 'Measures whether a local LLM gets finance questions right, consistently, under strict grading.',
    problem:
      'A model that is right once is not necessarily reliable. Free-form answers make correctness hard to score automatically.',
    why: 'Before trusting an AI agent with real work you need repeatable evidence of how often it is right, not a single demo.',
    role: 'Solo project: task set, runner, grader, repeated-trial reporting and dashboard.',
    stack: ['Python', 'Ollama', 'qwen3:4b', 'pandas', 'Streamlit', 'unittest'],
    facts: [
      { value: '16', label: 'finance tasks, 8 categories' },
      { value: '3×', label: 'repeated trials per run' },
      { value: '31', label: 'unit tests' },
    ],
    repo: 'https://github.com/chinthanshetty07/Agent-reliability-benchmark',
    status: { label: 'Early prototype', tone: 'warn' },
    flow: ['Load tasks', 'Health-check', 'Stream', 'Grade', 'Save', 'Repeat'],
    built: [
      'Runner that health-checks Ollama, confirms the model is installed and streams each task at temperature 0.',
      'Separate connect, read and per-task timeouts; truncated or empty answers are counted as incorrect.',
      'Strict grader: “Final answer:” line, then \\boxed{}, then the last numeric line; handles $3,000, (1,200), “a loss of” and Decimal tolerance.',
      'Atomic, incremental result writes; Ctrl-C saves partial results marked as interrupted.',
      'Repeated-trial runner with a per-task consistency report.',
      'Streamlit dashboard: accuracy, per-task table, response times and repeated-trial charts.',
    ],
    planned: [
      'Multi-step agent tasks with tool use (today it is single-turn Q&A).',
      'Software-engineering tasks and more models beyond qwen3:4b.',
      'Grading for non-numeric answers.',
    ],
    challenges: [
      {
        title: 'Grade the answer, not the essay',
        body: 'Reasoning models write a lot. The grader extracts one final value through an ordered set of patterns, so a correct number buried in working does not count by accident.',
      },
      {
        title: 'Never lose a run',
        body: 'Results are written atomically after every task and previous results are backed up first, so a crash or interrupt mid-run leaves valid data behind.',
      },
    ],
  },
]

export const otherWork = [
  {
    name: 'Smart Agriculture with LoRa & TinyML',
    year: 'Dec 2025',
    body: 'Offline farm monitoring: ESP32 and ESP32-CAM run TensorFlow Lite Micro models for on-device anomaly and disease detection, and send compact results over an SX1278 LoRa link to a Tkinter dashboard with no internet dependency.',
    stack: ['C/C++', 'ESP32', 'TensorFlow Lite Micro', 'LoRa', 'Python / Tkinter'],
  },
  {
    name: 'QuestVerse',
    year: 'Mar 2026',
    body: 'Design for a game-based learning app: navigation, dashboards, quiz interfaces and the full flow from onboarding to reward redemption.',
    stack: ['Figma', 'UX design', 'Game design'],
  },
  {
    name: 'Electrolython hardware hackathon',
    year: 'Oct 2025',
    body: 'Built a working biomedical signal-processing prototype with a team in a 10-hour national-level hackathon at CMR Institute of Technology, and presented it to the judges.',
    stack: ['Hardware', 'Signal processing'],
  },
]
