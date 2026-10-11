// Everything here comes from the resume (Oct 2026) or the public GitHub profile.
export const profile = {
  name: 'Chinthan Shetty',
  email: 'chinthanshettycs@gmail.com',
  github: 'https://github.com/chinthanshetty07',
  githubHandle: 'chinthanshetty07',
  linkedin: 'https://www.linkedin.com/in/chinthan-shetty-640178380/',
  resume: '/Chinthan_Shetty_Resume.pdf',
  location: 'Bengaluru, India',
}

export const experience = [
  {
    org: 'PESU Venture Labs',
    role: 'Software Engineer Intern, Full Stack',
    place: 'Bangalore',
    period: 'Aug 2026 – Present',
    current: true,
    points: [
      'Build responsive full-stack features in React and Node.js, connecting user interfaces to backend APIs.',
      'Work with the venture team to test, debug and ship product improvements across frontend and backend workflows.',
    ],
    stack: ['React', 'Node.js', 'REST APIs'],
  },
  {
    org: 'Edutainer (PAT Technologies Pvt. Ltd.)',
    role: 'UX Design & Game Design Intern',
    place: 'Bengaluru',
    period: 'Jan 2026 – Jun 2026',
    current: false,
    points: [
      'Designed UI/UX concepts and interactive elements for live projects, working with mentors and the team remotely.',
      'Practised wireframing, usability analysis and interaction design; designed QuestVerse, a game-based learning app, in Figma.',
    ],
    stack: ['Figma', 'Wireframing', 'Usability analysis'],
  },
]

export const education = {
  school: 'HKBK College of Engineering, Bengaluru',
  degree: 'B.E., Electronics and Communication Engineering',
  period: 'Nov 2022 – Jun 2026',
  cgpa: '7.6',
}

export const skills: { group: string; items: string[]; evidence: string }[] = [
  {
    group: 'Languages',
    items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'C / C++', 'HTML / CSS'],
    evidence: 'TypeScript across DevLaunch, Python for the agent benchmark, C/C++ on ESP32 firmware.',
  },
  {
    group: 'Frontend',
    items: ['React', 'TanStack Query', 'Vite', 'Tailwind CSS', 'Accessibility', 'Figma'],
    evidence: 'ARC’s product UI and design tokens, DevLaunch dashboard, product UI at PESU Venture Labs.',
  },
  {
    group: 'Backend',
    items: ['Node.js', 'Express', 'FastAPI', 'Pydantic', 'REST APIs', 'WebSockets', 'zod schemas'],
    evidence: 'ARC’s typed FastAPI contracts; Prompt Engine’s layered API; DevLaunch’s orchestrator and log streaming.',
  },
  {
    group: 'Data',
    items: ['PostgreSQL', 'MongoDB / Mongoose', 'Pandas', 'NumPy', 'Matplotlib / Seaborn', 'Power BI', 'Excel'],
    evidence: 'Row-locked tenancy logic in Postgres for ARC; prompt history in MongoDB; benchmark analysis in Pandas.',
  },
  {
    group: 'AI / ML',
    items: ['RAG / hybrid retrieval', 'LLM APIs (Groq, OpenAI)', 'Ollama local models', 'LLM evaluation', 'Agent tool gating', 'TensorFlow Lite Micro'],
    evidence: 'ARC retrieval and agent actions, AI-assisted repair in DevLaunch, model grading in the benchmark, TinyML on-device.',
  },
  {
    group: 'Tools & infra',
    items: ['Git / GitHub Actions', 'Docker', 'Vitest', 'pytest', 'Streamlit', 'ESP32 / LoRa'],
    evidence: 'Build-once CI pipeline in ARC; Docker sandboxing and CI in DevLaunch.',
  },
]
