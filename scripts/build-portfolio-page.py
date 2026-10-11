#!/usr/bin/env python3
"""Derive the portfolio homepage from ThreeUI's canonical Kage page.

public/landing-pages/kage.html stays byte-exact (verified against the ThreeUI
bundle hash). This script copies it, swaps the temple copy for portfolio
content, and writes public/landing-pages/portfolio.html. The Three.js world,
scroll scenes, layout and motion are untouched; only text, links and the 3D
wordmark string change.

Every replacement must match exactly once (or the stated count), so if the
source page ever changes the build stops instead of silently half-applying.

    python3 scripts/build-portfolio-page.py
"""
from __future__ import annotations

import hashlib
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "public/landing-pages/kage.html"
OUT = ROOT / "public/landing-pages/portfolio.html"
CANONICAL_SHA256 = "c8e06b90397ac246baf0ab6f32f5f6b570acc6fe03c7009f711b579fb72d9f49"

EMAIL = "chinthanshettycs@gmail.com"
GITHUB = "https://github.com/chinthanshetty07"
LINKEDIN = "https://www.linkedin.com/in/chinthan-shetty-640178380/"
RESUME = "/Chinthan_Shetty_Resume.pdf"
CLASSIC = "/classic"
# The page runs in a sandboxed iframe that may open popups but not navigate the
# top window, so every link leaving the page opens a new tab.
EXT = 'target="_blank" rel="noopener noreferrer"'

ARROW = '<svg viewBox="0 0 14 14" fill="none"><path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" stroke-width="1.3"/></svg>'

R: list[tuple[str, str, int]] = []


def sub(old: str, new: str, count: int = 1) -> None:
    R.append((old, new, count))


# ------------------------------------------------------------------ head
sub("<title>Kage — Where stillness reveals the unseen</title>",
    "<title>Chinthan Shetty · Software Engineer</title>")
sub('<meta name="description" content="A five-chapter night walk through a Kyoto mountain temple. Charred cypress, lantern light and a vermilion moon, rendered live in WebGL.">',
    '<meta name="description" content="Chinthan Shetty, software engineer building full-stack and AI-powered products: DevLaunch, ARC, Stock-Watch and more.">')

# ------------------------------------------------------- wordmark (3D + fallback)
# The bundled "Wordmark" face is subset to A E G K S, so the name is set in Onest 700,
# which ships complete. Eight letters need far less tracking than four.
sub("const word = 'KAGE', gl = [];", "const word = 'CHINTHAN', gl = [];")
sub("const SZ = 320, TRACK = .40, PAD = 26;", "const SZ = 320, TRACK = .08, PAD = 26;")
sub("'600 ' + SZ + 'px Wordmark, sans-serif'", "'700 ' + SZ + 'px Onest, sans-serif'", 2)
sub("document.fonts.load('600 320px Wordmark')", "document.fonts.load('700 320px Onest')")
sub("font-family:'Wordmark','Onest',sans-serif; font-weight:600; font-size:21.4vw;",
    "font-family:'Onest',sans-serif; font-weight:700; font-size:11.2vw;")
sub('<div class="word-fb" aria-hidden="true">KAGE</div>',
    '<div class="word-fb" aria-hidden="true">CHINTHAN</div>')

# ------------------------------------------------------------------ preloader
sub('<div class="pre-jp jp">影の道</div>', '<div class="pre-jp">Chinthan Shetty</div>')
sub("<span>Raising the mountain temple</span>", "<span>Loading the portfolio</span>")

# ------------------------------------------------------------------ nav
sub('''    <svg viewBox="0 0 44 44" fill="none" aria-hidden="true">
      <circle cx="22" cy="25" r="8.6" fill="#e0231c" fill-opacity=".9"/>
      <path d="M5 13h34M9 18.4h26M22 8.5v27" stroke="#dfe7e0" stroke-width="1.5"/>
      <path d="M14 35.5h16" stroke="#dfe7e0" stroke-width="1.2" stroke-opacity=".6"/>
    </svg>
    <span class="brand-tx"><b>KAGE</b><i>HIDDEN REALMS OF KYOTO</i></span>''',
    '''    <img src="/logo.jpg" alt="" width="34" height="34" style="width:34px;height:34px;border-radius:8px;display:block">
    <span class="brand-tx"><b>CHINTHAN SHETTY</b><i>SOFTWARE ENGINEER</i></span>''')
sub('''    <a class="nav-link" href="#gate" data-cursor><span>Temples</span><span class="alt">伽藍</span></a>
    <a class="nav-link" href="#pathways" data-cursor><span>Gardens</span><span class="alt">庭園</span></a>
    <a class="nav-link" href="#lessons" data-cursor><span>Rituals</span><span class="alt">神事</span></a>
    <a class="nav-link" href="#eternity" data-cursor><span>Afterlight</span><span class="alt">残光</span></a>''',
    '''    <a class="nav-link" href="#gate" data-cursor><span>About</span><span class="alt">Profile</span></a>
    <a class="nav-link" href="#pathways" data-cursor><span>Work</span><span class="alt">Projects</span></a>
    <a class="nav-link" href="#lessons" data-cursor><span>Experience</span><span class="alt">Internships</span></a>
    <a class="nav-link" href="#eternity" data-cursor><span>Contact</span><span class="alt">Say hello</span></a>''')
# Every .nav-link must be an in-page anchor: the page's nav script resolves each
# href with querySelector to light the active section. The résumé lives in the hero.

# ------------------------------------------------------------------ hero
sub('<div class="eyebrow" data-rv="fade"><span class="dot"></span> Chapter 00 — The Hidden Gate</div>',
    '<div class="eyebrow" data-rv="fade"><span class="dot"></span> Software engineer — Bengaluru</div>')
sub('''      <span class="mask-line"><span>Where stillness</span></span>
      <span class="mask-line"><span>reveals the</span></span>
      <span class="mask-line"><span>unseen.</span></span>''',
    '''      <span class="mask-line"><span>I build software</span></span>
      <span class="mask-line"><span>end to end, and</span></span>
      <span class="mask-line"><span>ship it.</span></span>''')
sub('''<p class="hero-sub body" data-rv="up">Enter Kyoto through its quiet thresholds, where ritual,
      craft, and memory shape the path.</p>''',
    '''<p class="hero-sub body" data-rv="up">Full-stack and AI-powered products, from the React interface
      through the Node.js and Python services to the model call and the container it runs in.
      Software Engineer Intern at PESU Venture Labs; open to SDE and full-stack roles.</p>''')
sub('<div class="hero-cue" data-rv="fade"><span>Scroll to enter</span>',
    '<div class="hero-cue" data-rv="fade"><span>Scroll for the work</span>')

CHIPS = [
    ("#pathways", "Projects", "DevLaunch, ARC, Stock-Watch: built, tested, on GitHub."),
    ("#lessons", "Experience", "Software Engineer Intern, PESU Venture Labs."),
    ("#gate", "Stack", "React, TypeScript, Node.js, Python, FastAPI, Docker."),
    (RESUME, "Résumé", "One page, PDF. Opens in a new tab."),
]
old_chips = [
    ('Thresholds', 'Discover the hidden gates that open on to deeper paths.'),
    ('Still Gardens', 'Witness the courts where silence gently unfolds.'),
    ('Sacred Craft', 'Embrace the hands and heritage that shape devotion.'),
    ('Night Rituals', 'Explore the rites that awaken when the day is done.'),
]
for i, ((ob, op), (href, b, p)) in enumerate(zip(old_chips, CHIPS)):
    sub(f'''      <div class="chip" data-chip="{i}" data-rv="up" data-cursor><span class="num">0{i + 1}</span>
        <span class="tx"><b>{ob}</b><p>{op}</p></span></div>''',
        f'''      <a class="chip" href="{href}"{'' if href.startswith('#') else ' ' + EXT} data-chip="{i}" data-rv="up" data-cursor><span class="num">0{i + 1}</span>
        <span class="tx"><b>{b}</b><p>{p}</p></span></a>''')

sub('aria-label="Preview: Sanmon, before the bell"', 'aria-label="Jump to selected work"')
sub('<span class="peek-cap"><b class="jp">山門</b><i>Sanmon — before the bell</i></span>',
    '<span class="peek-cap"><b>Work</b><i>Selected projects</i></span>')
sub('<span class="v jp">影の道</span>', '<span class="v">SDE</span>')

# ------------------------------------------------------------ 01 · about
sub('<span class="k"><b>01</b> — The Sanmon</span><span class="rule"></span><span class="k jp">山門</span>',
    '<span class="k"><b>01</b> — About</span><span class="rule"></span><span class="k">Profile</span>')
sub('<h2 class="display h-sec" data-rv="up">Charred cypress, worn stone, one gate left open.</h2>',
    '<h2 class="display h-sec" data-rv="up">Rules first, models where they help, tests that prove it.</h2>')
sub('''      <p class="lead" data-rv="up">Kage begins where the city stops: a mountain gate of cedar burned black,
        standing in its own weather. The soot is not decoration. It is how a board is taught to survive a
        hundred rainy seasons, and the first thing this place asks you to understand.</p>
      <p class="body" data-rv="up">Climb the worn steps and the worship hall lifts out of the mist, its paper
        screens lit from inside like a lantern the size of a house. Above the eaves a vermilion moon holds
        its place, patient, half hidden. Nothing here is in a hurry. Neither, for the next ninety minutes,
        are you.</p>''',
    '''      <p class="lead" data-rv="up">I came to software from electronics and communication engineering,
        where I built ESP32 boards that ran ML models on-device and talked over LoRa. That habit stuck:
        I want to know what happens under the interface, on the wire and in the container.</p>
      <p class="body" data-rv="up">Today I write React and Node.js at PESU Venture Labs. In my own work I
        build developer tooling and AI applications, and I make AI useful without making it load-bearing:
        deterministic rules first, a model where it genuinely helps, limits on both, and tests behind every
        claim. Stack: React, TypeScript, Node.js, Express, Python, FastAPI, PostgreSQL, MongoDB, Docker.</p>''')
sub('''        <span>Cross the threshold</span>''', '''        <span>See the work</span>''')
sub('''    <div><b>05</b><span>Chapters</span></div>
    <div><b>92</b><span>Minutes</span></div>
    <div><b>1611</b><span>Hall raised</span></div>
    <div><b>∞</b><span>Stillness</span></div>''',
    '''    <div><b>~1,360</b><span>Tests in DevLaunch</span></div>
    <div><b>47</b><span>Merged PRs on ARC</span></div>
    <div><b>6</b><span>Projects built</span></div>
    <div><b>2</b><span>Internships</span></div>''')

# ------------------------------------------------------------ 02 · work
sub('<span class="k"><b>02</b> — Still Gardens</span><span class="rule"></span><span class="k jp">庭園</span>',
    '<span class="k"><b>02</b> — Projects</span><span class="rule"></span><span class="k">Featured &amp; more</span>')
CARDS = [
    ("Approach", "参道", "The long climb", "01 / 03",
     "https://github.com/chinthanshetty07/Dev-launch", "DevLaunch", "TS",
     "Public repo → running app in hardened Docker", "Solo"),
    ("Lanterns", "灯籠", "Lantern court", "02 / 03",
     "https://github.com/arc-ive/arc", "ARC", "Py",
     "Multi-tenant AI platform: RAG, agents, approvals", "Team"),
    ("Moonwater", "月影", "The wet court", "03 / 03",
     CLASSIC + "#stockwatch", "Stock-Watch", "Py",
     "Restock alerts that never cry wolf", "Solo"),
]
for i, (ob, ojp, ometa, opos, href, name, tag, meta, who) in enumerate(CARDS):
    sub(f'    <article class="card" data-rv="up" data-view="{i}" data-cursor>',
        f'    <a class="card" href="{href}" {EXT} data-rv="up" data-view="{i}" data-cursor aria-label="{name}: {meta}">')
    sub(f'<div class="card-lab"><b>{ob}</b><span class="jp">{ojp}</span></div>',
        f'<div class="card-lab"><b>{name}</b><span class="jp">{who}</span></div>')
    sub(f'<div class="card-meta"><span>{ometa}</span><span>{opos}</span></div>\n    </article>',
        f'<div class="card-meta"><span>{meta}</span><span>0{i + 1} / 03</span></div>\n    </a>')

# ------------------------------------------------------- 02b · all other projects
# The three gallery cards above are the featured projects; the rest of the
# projects sit directly under them so "Projects" is one section. Experience
# below is then jobs only.
LES_OLD = [
    ("The Hidden Gate", "山門", "Why a gate is a sentence, and what you agree to when you walk under one.", "14 min"),
    ("Borrowed Scenery", "借景", "Shakkei: composing with a mountain you will never own.", "18 min"),
    ("Charred Cypress", "焼杉", "Yakisugi: burning a board black so the weather will let it live.", "21 min"),
    ("Lantern Light", "灯籠", "How a single ember decides the scale of everything around it.", "17 min"),
    ("The Vermilion Moon", "朱月", "Why the moon burns red over the valley, and what the garden does with it.", "22 min"),
]
JOBS = [
    ("Software Engineer Intern", "PESU Venture Labs",
     "Build responsive full-stack features in React and Node.js; test, debug and ship improvements with the venture team.",
     "Aug 2026 – now"),
    ("UX &amp; Game Design Intern", "Edutainer",
     "Designed UI/UX concepts and interactive elements for live projects; wireframing and usability analysis.",
     "Jan – Jun 2026"),
]
MORE_PROJECTS = [
    ("https://github.com/chinthanshetty07/Prompt-Engine", "Prompt Engine", "React · Node",
     "Rewrites rough coding requests into precise prompts: validation, a scope check before any model call, MongoDB history.",
     "2026"),
    ("https://github.com/chinthanshetty07/Agent-reliability-benchmark", "Reliability Benchmark", "Python",
     "Strict, repeatable grading of a local LLM on finance tasks, with atomic result writes and a Streamlit dashboard.",
     "2026"),
    (None, "Smart Agriculture", "ESP32 · LoRa",
     "On-device TinyML anomaly and disease detection on ESP32, results sent over LoRa to an offline dashboard.",
     "Dec 2025"),
]
SUBSTYLE = 'style="font-family:inherit;letter-spacing:.08em"'


def les_old(i: int) -> str:
    oh, ojp, op, ot = LES_OLD[i]
    return f"""    <div class="les" data-les="{i}" data-cursor>
      <span class="k">0{i + 1}</span>
      <h3>{oh}<em class="jp">{ojp}</em></h3>
      <p>{op}</p>
      <span class="t">{ot}</span><i class="bar"></i>
    </div>"""


def les_new(i: int, num: int, href: str | None, h: str, sub_: str, p: str, t: str) -> str:
    tag_open = f'<a class="les" href="{href}" {EXT} data-les="{i}" data-cursor>' if href else f'<div class="les" data-les="{i}" data-cursor>'
    tag_close = "</a>" if href else "</div>"
    return f"""    {tag_open}
      <span class="k">0{num}</span>
      <h3>{h}<em {SUBSTYLE}>{sub_}</em></h3>
      <p>{p}</p>
      <span class="t">{t}</span><i class="bar"></i>
    {tag_close}"""


more_rows = "\n".join(les_new(i + 2, i + 1, *m) for i, m in enumerate(MORE_PROJECTS))
sub('<span>03 / 03</span></div>\n    </a>\n  </div>\n</section>',
    '<span>03 / 03</span></div>\n    </a>\n  </div>\n'
    '  <div class="more-head" data-rv="up">\n'
    '    <h3 class="more-title">More projects</h3>\n'
    '    <p class="more-note">Case studies, architecture notes and code excerpts for the featured work are in the\n'
    '      <a href="' + CLASSIC + '" ' + EXT + ' data-cursor>detailed portfolio</a>.</p>\n'
    '  </div>\n'
    '  <div class="cur" id="more-projects">\n' + more_rows + '\n  </div>\n</section>')

# ------------------------------------------------------- 03 · experience
sub('<span class="k"><b>03</b> — Sacred Craft</span><span class="rule"></span><span class="k jp">手業</span>',
    '<span class="k"><b>03</b> — Experience</span><span class="rule"></span><span class="k">Work experience</span>')
sub('<h2 class="display h-sec" data-rv="up">Five chapters. Ninety minutes. One quiet mind.</h2>',
    '<h2 class="display h-sec" data-rv="up">Where I’ve worked.</h2>')
sub('''<p class="body-lg" data-rv="up">Each chapter is a walk, not a lecture. You arrive at the gate, climb the
      steps, sit with the lantern, and leave with one thing worth keeping.</p>''',
    '<p class="body-lg" data-rv="up">Two internships: shipping full-stack features in React and Node.js, and '
    'designing interfaces and interactions for live products.</p>')
for i, (h, sub_, p, t) in enumerate(JOBS):
    sub(les_old(i), les_new(i, i + 1, None, h, sub_, p, t))
for i in range(len(JOBS), len(LES_OLD)):
    sub(les_old(i) + "\n", "")

# ------------------------------------------------------------ 04 · contact
sub('<div class="eyebrow" data-rv="fade">Chapter 04 — Afterlight</div>',
    '<div class="eyebrow" data-rv="fade">04 — Contact</div>')
sub('<h2 class="display" data-rv="up">Afterlight</h2>', '<h2 class="display" data-rv="up">Let’s talk</h2>')
sub('''<p class="body-lg" data-rv="up">The gate does not close behind you. Take the walk whenever the noise
    gets loud — it is always the same path, and never the same light.</p>''',
    '''<p class="body-lg" data-rv="up">Hiring for a software engineer, full-stack, backend or AI application
    role? Email is the fastest way to reach me. Résumé, LinkedIn and GitHub are one click away.</p>''')
sub('''  <a class="cta" href="#top" data-rv="fade" data-cursor>
    <i></i><span>Begin the walk</span>''',
    f'''  <a class="cta" href="mailto:{EMAIL}?subject=Engineering%20role" {EXT} data-rv="fade" data-cursor>
    <i></i><span>{EMAIL}</span>''')
sub('''    <svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" stroke-width="1.3"/></svg>
  </a>
</section>''',
    f'''    <svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" stroke-width="1.3"/></svg>
  </a>
  <div class="contact-links" data-rv="fade" style="display:flex;flex-wrap:wrap;justify-content:center;gap:0 34px">
    <a class="arrowlink" href="{RESUME}" {EXT} data-cursor><span>Résumé</span><span class="ar">{ARROW}</span></a>
    <a class="arrowlink" href="{LINKEDIN}" {EXT} data-cursor><span>LinkedIn</span><span class="ar">{ARROW}</span></a>
    <a class="arrowlink" href="{GITHUB}" {EXT} data-cursor><span>GitHub</span><span class="ar">{ARROW}</span></a>
  </div>
</section>''')

# ------------------------------------------------------------------ footer
sub('''      <svg viewBox="0 0 44 44" fill="none" width="34" height="34" aria-hidden="true">
        <circle cx="22" cy="25" r="8.6" fill="#e0231c" fill-opacity=".9"/>
        <path d="M5 13h34M9 18.4h26M22 8.5v27" stroke="#dfe7e0" stroke-width="1.5"/>
      </svg>
      <p>A five-chapter night walk through a Kyoto mountain temple. Three illustrated garden field notes
        sit inside a live Three.js sanctuary.</p>''',
    '''      <img src="/logo.jpg" alt="" width="34" height="34" style="border-radius:8px;display:block">
      <p>Chinthan Shetty, software engineer building full-stack and AI-powered products. B.E. Electronics
        and Communication, HKBK College of Engineering. Bengaluru, India.</p>''')
sub('''    <div><h4>Chapters</h4><ul>
      <li><a href="#gate" data-cursor>The Sanmon</a></li>
      <li><a href="#pathways" data-cursor>Still Gardens</a></li>
      <li><a href="#lessons" data-cursor>Sacred Craft</a></li>
      <li><a href="#eternity" data-cursor>Afterlight</a></li>
    </ul></div>
    <div><h4>Practice</h4><ul>
      <li><a href="#lessons" data-cursor>Borrowed scenery</a></li>
      <li><a href="#lessons" data-cursor>Lantern light</a></li>
      <li><a href="#lessons" data-cursor>Charred cypress</a></li>
      <li><a href="#lessons" data-cursor>Raked gravel</a></li>
    </ul></div>
    <div><h4>Elsewhere</h4><ul>
      <li><a href="#top" data-cursor>Journal</a></li>
      <li><a href="#top" data-cursor>Field notes</a></li>
      <li><a href="#top" data-cursor>Colophon</a></li>
    </ul></div>''',
    f'''    <div><h4>Sections</h4><ul>
      <li><a href="#gate" data-cursor>About</a></li>
      <li><a href="#pathways" data-cursor>Work</a></li>
      <li><a href="#lessons" data-cursor>Experience</a></li>
      <li><a href="#eternity" data-cursor>Contact</a></li>
    </ul></div>
    <div><h4>Projects</h4><ul>
      <li><a href="https://github.com/chinthanshetty07/Dev-launch" {EXT} data-cursor>DevLaunch</a></li>
      <li><a href="https://github.com/arc-ive/arc" {EXT} data-cursor>ARC</a></li>
      <li><a href="https://github.com/chinthanshetty07/Prompt-Engine" {EXT} data-cursor>Prompt Engine</a></li>
      <li><a href="{CLASSIC}#work" {EXT} data-cursor>All case studies</a></li>
    </ul></div>
    <div><h4>Elsewhere</h4><ul>
      <li><a href="{GITHUB}" {EXT} data-cursor>GitHub</a></li>
      <li><a href="{LINKEDIN}" {EXT} data-cursor>LinkedIn</a></li>
      <li><a href="{RESUME}" {EXT} data-cursor>Résumé (PDF)</a></li>
      <li><a href="mailto:{EMAIL}" {EXT} data-cursor>Email</a></li>
    </ul></div>''')
sub('<span>© 2026 Kage — Kage no Michi</span>', '<span>© 2026 Chinthan Shetty</span>')
sub('<span class="jp">静けさは一つの技である</span>', '<span>Scene: ThreeUI Kage</span>')
sub('<span>WebGL · Onest · Kyoto</span>', '<span>WebGL · Onest · Bengaluru</span>')

# ------------------------------------------------------------------ rail
sub("const names = ['The Hidden Gate', 'The Sanmon', 'Still Gardens', 'Sacred Craft', 'Afterlight', 'Colophon'];",
    "const names = ['Intro', 'About', 'Work', 'Experience', 'Contact', 'Links'];")

# ------------------------------------------------- readability: content leads
# The scene is a backdrop here, not the subject. Dim and soften it, drop the
# near-plane cut-outs that stand in front of the copy, deepen the scrims and
# lift the text tones. Injected as one block so the authored sheet stays intact.
READABILITY_CSS = """
<style id="portfolio-readability">
/* the 3D world recedes behind a flat dark veil. A CSS filter on the canvas
   would do the same visually but costs a full-screen pass every frame
   (measured: 60 fps -> 30 fps), so the veil is a plain fixed layer. */
body::before{ content:''; position:fixed; inset:0; z-index:1; pointer-events:none; background:rgba(4,6,9,.55); }
/* the foreground plants are placed in front of the reading; remove them */
.fg, #fg-sky{ display:none !important; }
#grain{ opacity:.03; }
/* no trailing cursor ring: the system cursor alone feels direct */
.cur-dot{ display:none !important; }
#vignette{ background:radial-gradient(120% 92% at 50% 42%, rgba(2,4,6,.18) 32%, rgba(2,4,6,.72) 100%); }
/* deeper section scrims so every block of copy sits on near-black */
.sec::before{ background:radial-gradient(125% 72% at 34% 50%, rgba(4,7,10,.94), rgba(4,7,10,.82) 46%, rgba(4,7,10,.48) 78%, rgba(4,7,10,0)); }
#pathways::before{ background:radial-gradient(115% 70% at 50% 50%, rgba(4,7,10,.88), rgba(4,7,10,.66) 55%, rgba(4,7,10,0)); }
#eternity::before{ background:radial-gradient(90% 64% at 50% 46%, rgba(4,7,10,.82), rgba(4,7,10,.86) 56%, rgba(4,7,10,.94) 82%, rgba(4,7,10,0)); }
/* the hero copy gets its own soft backing */
.hero-top::before{ content:''; position:absolute; inset:-40px -90px -60px -80px; z-index:-1; pointer-events:none;
  background:radial-gradient(closest-side, rgba(4,7,10,.86), rgba(4,7,10,.55) 60%, rgba(4,7,10,0)); }
.hero-foot{ position:relative; }
.hero-foot::before{ content:''; position:absolute; inset:-30px -40px -20px; z-index:-1; pointer-events:none;
  background:linear-gradient(transparent, rgba(4,7,10,.78) 40%); }
/* brighter text tones throughout */
:root{ --muted:#9aa59e; --bone-dim:#c4cdc6; }
.hero-sub, .lead, .body, .body-lg, .gate-copy p{ color:#d3dad5 !important; }
.les p, .chip p, .foot-brand p{ color:#b8c1bb !important; }
.les .t, .card-meta, .gate-stats div span{ color:#a7b1aa !important; }
/* portrait: a round, high-resolution photo on the first screen */
.me-big{ position:absolute; z-index:3; margin:0; text-align:center;
  right:calc(var(--pad) + clamp(48px,7vw,130px)); top:calc(var(--nav-h) + clamp(16px,4vh,52px));
  width:clamp(220px,21vw,330px); }
.me-ring{ display:block; aspect-ratio:1; border-radius:50%; overflow:hidden; }
.me-ring img{ width:100%; height:100%; display:block; object-fit:cover; object-position:50% 30%; }
.me-big figcaption{ margin-top:16px; }
.me-big b{ display:block; font-size:clamp(16px,1.3vw,20px); font-weight:500; letter-spacing:.01em; }
.me-big span{ display:block; margin-top:5px; font-size:10px; letter-spacing:.22em; text-transform:uppercase; color:#b8c1bb; }
/* the hero's live preview window moves below the portrait's footprint */
.peek{ display:none; }
@media (max-width:820px){
  .me-big{ position:relative; right:auto; top:auto; width:min(54vw,230px); margin:calc(var(--nav-h) + 10px) 0 0; text-align:left; }
  .hero-top{ padding-top:22px !important; }
}
/* contact: the title reads horizontally and large instead of hanging vertical */
body[data-layout-closing="b"] .fin h2{ writing-mode:horizontal-tb; font-size:clamp(48px,7vw,112px);
  justify-self:end; text-align:right; line-height:.95; }
.fin .contact-links{ grid-column:1; grid-row:4; justify-content:flex-start !important; }
.me-about{ width:min(220px,56vw); aspect-ratio:4/5; border-radius:14px; overflow:hidden; margin-bottom:26px; }
.me-about img{ width:100%; height:100%; object-fit:cover; object-position:50% 26%; }
@media (max-width:820px){ .hero-top::before{ inset:-30px -24px -40px; } }
/* projects: the featured gallery is followed by the remaining projects in one list */
.more-head{ margin:clamp(56px,9vh,110px) 0 clamp(18px,3vh,32px); display:flex; justify-content:space-between;
  align-items:baseline; gap:12px 32px; flex-wrap:wrap; }
.more-title{ margin:0; font-size:clamp(20px,2vw,30px); font-weight:400; letter-spacing:-.005em; }
.more-note{ margin:0; font-size:13px; line-height:1.6; color:#b8c1bb; max-width:48ch; }
.more-note a{ text-decoration:underline; text-underline-offset:4px; }
body[data-layout-curriculum="b"] #more-projects .les:nth-child(n){ grid-column:span 2; }
body[data-layout-curriculum="b"] #cur .les:nth-child(n){ grid-column:span 3; }
@media (max-width:1080px){
  body[data-layout-curriculum="b"] #more-projects .les:nth-child(n){ grid-column:span 3; }
  body[data-layout-curriculum="b"] #more-projects .les:last-child{ grid-column:span 6; }
}
@media (max-width:820px){
  body[data-layout-curriculum="b"] #more-projects .les:nth-child(n),
  body[data-layout-curriculum="b"] #cur .les:nth-child(n){ grid-column:auto; }
}
</style>
"""
sub("</style>\n</head>", "</style>\n" + READABILITY_CSS + "</head>")

# the scene is a dimmed backdrop now, so it can render at a lower resolution
sub("const DPR_CAP      = qn('dpr', LOW ? 1.4 : 1.8);", "const DPR_CAP      = qn('dpr', LOW ? 1.2 : 1.4);")
# calmer motion: fewer falling leaves, a much smaller mouse-driven camera sway
sub("function buildLeafFall() {\n  const N = LOW ? 110 : 260;", "function buildLeafFall() {\n  const N = LOW ? 24 : 60;")
sub("_p.x += RIG.mx * 0.62 * par; _p.y += RIG.my * 0.34 * par;", "_p.x += RIG.mx * 0.18 * par; _p.y += RIG.my * 0.10 * par;")
sub("_t.x -= RIG.mx * 0.20 * par; _t.y -= RIG.my * 0.12 * par;", "_t.x -= RIG.mx * 0.06 * par; _t.y -= RIG.my * 0.04 * par;")

# ---------------------------------------------------------------- portrait
sub('''<section class="hero" id="hero" data-cam="0">
  <div class="hero-top">''',
    '''<section class="hero" id="hero" data-cam="0">
  <figure class="me-big" data-rv="fade">
    <picture class="me-ring">
      <source srcset="/chinthan-hd.webp" type="image/webp">
      <img src="/chinthan-hd.jpg" alt="Chinthan Shetty" width="800" height="800" fetchpriority="high" decoding="async">
    </picture>
    <figcaption><b>Chinthan Shetty</b><span>Software Engineer · Bengaluru</span></figcaption>
  </figure>
  <div class="hero-top">''')
sub('''    <div class="gate-copy">
      <p class="lead" data-rv="up">''',
    '''    <div class="gate-copy">
      <div class="me-about" data-rv="up"><img src="/chinthan-hd.jpg" alt="Portrait of Chinthan Shetty" width="800" height="800" loading="lazy" decoding="async"></div>
      <p class="lead" data-rv="up">''')


def main() -> int:
    raw = SRC.read_bytes()
    digest = hashlib.sha256(raw).hexdigest()
    if digest != CANONICAL_SHA256:
        print(f"kage.html is not the canonical revision ({digest[:12]}); refusing to build.", file=sys.stderr)
        return 1
    s = raw.decode("utf-8")
    for old, new, count in R:
        found = s.count(old)
        if found != count:
            print(f"expected {count} match(es), found {found}:\n{old[:160]}", file=sys.stderr)
            return 1
        s = s.replace(old, new)
    OUT.write_text(s, encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)} ({len(R)} replacements)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
