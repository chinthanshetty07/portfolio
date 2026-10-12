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
# the cloth plate darkens the lower half of every picture with two gradients; the pictures are already
# composed for their cards (title sits below), so the plate keeps them at full brightness
sub("""  let g = x.createLinearGradient(0, 0, 0, c.height);
  g.addColorStop(.36, 'rgba(3,6,9,.05)'); g.addColorStop(1, 'rgba(3,6,9,.73)');
  x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
  g = x.createLinearGradient(0, 0, 0, c.height);
  g.addColorStop(.46, 'rgba(4,6,9,0)'); g.addColorStop(1, 'rgba(4,6,9,.80)');
  x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
""", "")
# keep the whole name inside the frame (the original fit put the last letter on the edge)
sub("const fill = narrow ? .96 : 1.00;", "const fill = narrow ? .88 : .9;")
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
     "https://github.com/chinthanshetty07/Prompt-Engine", "Prompt Engine", "React · Node",
     "Turns rough requests into precise AI prompts", "React · Node"),
    ("Lanterns", "灯籠", "Lantern court", "02 / 03",
     "https://github.com/chinthanshetty07/Dev-launch", "DevLaunch", "TS",
     "Public repo → running app in hardened Docker", "TypeScript · Docker"),
    ("Moonwater", "月影", "The wet court", "03 / 03",
     CLASSIC + "#stockwatch", "Stock-Watch", "Py",
     "Restock alerts that never cry wolf", "Python"),
]
for i, (ob, ojp, ometa, opos, href, name, tag, meta, who) in enumerate(CARDS):
    sub(f'    <article class="card" data-rv="up" data-view="{i}" data-cursor>',
        f'    <a class="card" href="{href}" {EXT} data-rv="up" data-cursor aria-label="{name}: {meta}">')
    sub(f'<div class="card-lab"><b>{ob}</b><span class="jp">{ojp}</span></div>',
        f'<div class="card-lab"><b>{name}</b><span class="jp">{who}</span></div>')
    sub(f'<div class="card-meta"><span>{ometa}</span><span>{opos}</span></div>\n    </article>',
        f'<div class="card-meta"><span>{meta}</span><span>0{i + 1} / 06</span></div>\n    </a>')

# ------------------------------------------------------- 02b · the other three projects
# All six projects live in the one gallery: the first three keep their live 3D
# viewports, the next three are plain still cards in the same grid.
ARROW_SPAN = '<span class="card-ar">' + ARROW + '</span>'
EXTRA_CARDS = [
    ("https://github.com/arc-ive/arc", "ARC", "Python · FastAPI",
     "Multi-tenant AI platform: RAG, agents, approvals", "04"),
    ("https://github.com/chinthanshetty07/Agent-reliability-benchmark", "Reliability Benchmark", "Python",
     "Strict, repeatable grading of a local LLM", "05"),
    (None, "Smart Agriculture", "ESP32 · LoRa",
     "On-device TinyML crop monitoring over LoRa", "06"),
]


def extra_card(href: str | None, name: str, tag: str, meta: str, num: str) -> str:
    open_ = (f'<a class="card" href="{href}" {EXT} data-rv="up" data-cursor aria-label="{name}: {meta}">'
             if href else f'<div class="card card--static" data-rv="up" aria-label="{name}: {meta}">')
    close = "</a>" if href else "</div>"
    arrow = ARROW_SPAN if href else ""
    return f"""    {open_}
      <div class="card-fr" data-frame>
        {arrow}
        <div class="card-lab"><b>{name}</b><span class="jp">{tag}</span></div>
      </div>
      <div class="card-meta"><span>{meta}</span><span>{num} / 06</span></div>
    {close}
"""


sub('<span>03 / 06</span></div>\n    </a>\n  </div>\n</section>',
    '<span>03 / 06</span></div>\n    </a>\n' + "".join(extra_card(*c) for c in EXTRA_CARDS) + '  </div>\n</section>')

# ------------------------------------------------------- 03 · experience
LES_OLD = [
    ("The Hidden Gate", "山門", "Why a gate is a sentence, and what you agree to when you walk under one.", "14 min"),
    ("Borrowed Scenery", "借景", "Shakkei: composing with a mountain you will never own.", "18 min"),
    ("Charred Cypress", "焼杉", "Yakisugi: burning a board black so the weather will let it live.", "21 min"),
    ("Lantern Light", "灯籠", "How a single ember decides the scale of everything around it.", "17 min"),
    ("The Vermilion Moon", "朱月", "Why the moon burns red over the valley, and what the garden does with it.", "22 min"),
]
# (role, organisation, place line, bullet points, stack, period): same facts as src/data/profile.ts
JOBS = [
    ("Software Engineer Intern", "PESU Venture Labs", "Full stack · Bangalore",
     ["Build responsive full-stack features in React and Node.js, connecting user interfaces to backend APIs.",
      "Work with the venture team to test, debug and ship product improvements across frontend and backend workflows."],
     ["React", "Node.js", "REST APIs"], "Aug 2026 – Present", ("/logo-pesu-venture-labs.png", 45, 56)),
    ("UX &amp; Game Design Intern", "Edutainer (PAT Technologies Pvt. Ltd.)", "UX &amp; game design · Bengaluru",
     ["Designed UI/UX concepts and interactive elements for live projects, working with mentors and the team remotely.",
      "Practised wireframing, usability analysis and interaction design; designed QuestVerse, a game-based learning app, in Figma."],
     ["Figma", "Wireframing", "Usability analysis"], "Jan 2026 – Jun 2026", ("/logo-edutainer.png", 56, 56)),
]


def les_old(i: int) -> str:
    oh, ojp, op, ot = LES_OLD[i]
    return f"""    <div class="les" data-les="{i}" data-cursor>
      <span class="k">0{i + 1}</span>
      <h3>{oh}<em class="jp">{ojp}</em></h3>
      <p>{op}</p>
      <span class="t">{ot}</span><i class="bar"></i>
    </div>"""


def job(i: int, role: str, org: str, where: str, pts: list[str], stack: list[str], period: str,
        logo: tuple[str, int, int]) -> str:
    lis = "".join(f"<li>{p}</li>" for p in pts)
    chips = "".join(f"<span>{c}</span>" for c in stack)
    src, lw, lh = logo
    org_plain = org.split(" (")[0]
    return f"""    <div class="les job" data-les="{i}" data-cursor>
      <img class="job-logo" src="{src}" alt="{org_plain} logo" width="{lw}" height="{lh}" loading="lazy" decoding="async">
      <span class="k">0{i + 1}</span>
      <h3>{role}<em style="font-family:inherit;letter-spacing:.08em">{org}</em></h3>
      <span class="job-where">{where}</span>
      <ul class="job-pts">{lis}</ul>
      <span class="job-stack">{chips}</span>
      <span class="t">{period}</span><i class="bar"></i>
    </div>"""


sub('<span class="k"><b>03</b> — Sacred Craft</span><span class="rule"></span><span class="k jp">手業</span>',
    '<span class="k"><b>03</b> — Experience</span><span class="rule"></span><span class="k">Work experience</span>')
sub('<h2 class="display h-sec" data-rv="up">Five chapters. Ninety minutes. One quiet mind.</h2>',
    '<h2 class="display h-sec" data-rv="up">Where I’ve worked.</h2>')
sub('''<p class="body-lg" data-rv="up">Each chapter is a walk, not a lecture. You arrive at the gate, climb the
      steps, sit with the lantern, and leave with one thing worth keeping.</p>''',
    '<p class="body-lg" data-rv="up">Two internships: shipping full-stack features in React and Node.js, and '
    'designing interfaces and interactions for live products. Case studies for the featured projects are in the '
    '<a href="' + CLASSIC + '" ' + EXT + ' data-cursor style="text-decoration:underline;text-underline-offset:4px">detailed portfolio</a>.</p>')
for i, j in enumerate(JOBS):
    sub(les_old(i), job(i, *j))
for i in range(len(JOBS), len(LES_OLD)):
    sub(les_old(i) + "\n", "")

# ------------------------------------------------------------ 04 · contact
sub('<div class="eyebrow" data-rv="fade">Chapter 04 — Afterlight</div>',
    '<div class="eyebrow" data-rv="fade">04 — Contact</div>')
sub('<h2 class="display" data-rv="up">Afterlight</h2>', '<h2 class="display" data-rv="up">Let’s talk</h2>')
sub('''<p class="body-lg" data-rv="up">The gate does not close behind you. Take the walk whenever the noise
    gets loud — it is always the same path, and never the same light.</p>''',
    '''<p class="open-pill" data-rv="up"><i aria-hidden="true"></i>Open to SDE &amp; full-stack roles · Bengaluru</p>
  <p class="body-lg" data-rv="up">Hiring for a software engineer, full-stack, backend or AI application
    role? Email is the fastest way to reach me.</p>''')
sub('''  <a class="cta" href="#top" data-rv="fade" data-cursor>
    <i></i><span>Begin the walk</span>''',
    f'''  <div class="cta-row" data-rv="fade">
  <a class="cta cta--main" href="mailto:{EMAIL}?subject=Engineering%20role" {EXT} data-cursor data-magnet>
    <i></i><span>{EMAIL}</span>''')
sub('''    <svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M3 11 11 3M5 3h6v6" stroke="#dfe7e0" stroke-width="1.3"/></svg>
  </a>
</section>''',
    f'''    <svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M3 11 11 3M5 3h6v6" stroke="currentColor" stroke-width="1.3"/></svg>
  </a>
  <a class="cta cta--ghost" href="{RESUME}" {EXT} data-cursor data-magnet>
    <i></i><span>Résumé</span>
    <svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M3 11 11 3M5 3h6v6" stroke="currentColor" stroke-width="1.3"/></svg>
  </a>
  </div>
  <div class="cta-row cta-row--social" data-rv="fade">
  <a class="cta cta--ghost" href="{GITHUB}" {EXT} data-cursor data-magnet>
    <i></i><svg class="brand" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg><span>GitHub</span>
    <svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M3 11 11 3M5 3h6v6" stroke="currentColor" stroke-width="1.3"/></svg>
  </a>
  <a class="cta cta--ghost" href="{LINKEDIN}" {EXT} data-cursor data-magnet>
    <i></i><svg class="brand" viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg><span>LinkedIn</span>
    <svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M3 11 11 3M5 3h6v6" stroke="currentColor" stroke-width="1.3"/></svg>
  </a>
  </div>
</section>''')

# ------------------------------------------------------------------ footer
sub('''      <svg viewBox="0 0 44 44" fill="none" width="34" height="34" aria-hidden="true">
        <circle cx="22" cy="25" r="8.6" fill="#e0231c" fill-opacity=".9"/>
        <path d="M5 13h34M9 18.4h26M22 8.5v27" stroke="#dfe7e0" stroke-width="1.5"/>
      </svg>
      <p>A five-chapter night walk through a Kyoto mountain temple. Three illustrated garden field notes
        sit inside a live Three.js sanctuary.</p>''',
    '''      ''')
sub('<div class="foot-brand">\n      \n    </div>\n', '')
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
body::before{ content:''; position:fixed; inset:0; z-index:1; pointer-events:none; background:rgba(0,0,0,.66); opacity:.56;
  transition:opacity .9s var(--ease); }
/* from the second slide on, let the animated scene show through a little more */
body.past-hero::before{ opacity:.32; }
/* deeper black around the edges, so the scene reads as a lit window in the dark */
body::after{ content:''; position:fixed; inset:0; z-index:1; pointer-events:none; opacity:.55;
  transition:opacity .9s var(--ease);
  background:radial-gradient(95% 82% at 50% 46%, rgba(0,0,0,0) 30%, rgba(0,0,0,.62) 72%, rgba(0,0,0,.97) 100%); }
body.past-hero::after{ opacity:1; }
/* with a clearer scene behind it, keep the copy crisp */
.sec .lead, .sec .body, .sec .body-lg, .sec .h-sec, .gate-stats div{ text-shadow:0 1px 20px rgba(3,6,8,.9), 0 0 3px rgba(3,6,8,.55); }
/* the foreground plants are placed in front of the reading; remove them */
.fg, #fg-sky{ display:none !important; }
#grain{ opacity:.03; }
/* no trailing cursor ring: the system cursor alone feels direct */
.cur-dot{ display:none !important; }
#vignette{ background:radial-gradient(120% 92% at 50% 42%, rgba(2,4,6,.18) 32%, rgba(2,4,6,.72) 100%); }
/* deeper section scrims so every block of copy sits on near-black */
.sec::before{ background:radial-gradient(125% 72% at 34% 50%, rgba(4,7,10,.56), rgba(4,7,10,.42) 46%, rgba(4,7,10,.2) 78%, rgba(4,7,10,0)); }
#pathways::before{ background:radial-gradient(115% 70% at 50% 50%, rgba(4,7,10,.5), rgba(4,7,10,.3) 55%, rgba(4,7,10,0)); }
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
/* every piece of text is pure white */
:root{ --bone:#fff; --bone-dim:#fff; --muted:#fff; }
body{ color:#fff; }
.hero-sub, .lead, .body, .body-lg, .gate-copy p, .les p, .chip p, .foot-brand p, .les .t, .card-meta,
.gate-stats div span, .foot li a, .foot h4, .foot-base span, .job-where, .job-pts li, .job-stack span,
.open-pill, .more-note, .me-big span, .sec-head .k, .hero-cue, .nav-link, .les .k, .les h3 em,
.card-lab .jp, .eyebrow, .peek-cap i, .hero-side .v, .chip .num, .chip .tx b, .card-lab b, .gate-stats div b,
.brand-tx b, .brand-tx i{ color:#fff !important; }
.foot li a:hover{ text-decoration:underline; text-underline-offset:4px; }
.job-stack span, .open-pill{ border-color:rgba(255,255,255,.28); }
/* closing: a centred headline, an availability pill and two magnetic buttons */
body[data-layout-closing="b"] #eternity{ display:flex; flex-direction:column; align-items:center; text-align:center; }
body[data-layout-closing="b"] #eternity .eyebrow{ margin:0 0 22px; }
body[data-layout-closing="b"] #eternity h2{ font-size:clamp(56px,11.5vw,176px); line-height:.9; letter-spacing:-.04em;
  justify-self:auto; text-align:center; writing-mode:horizontal-tb; }
/* the page splits headings into masked words, so the accent is applied to the last word */
#eternity h2 .word-mask:last-of-type .word{ background:linear-gradient(110deg,#ffb08c 0%,#ff6a4a 40%,#e0231c 100%);
  -webkit-background-clip:text; background-clip:text; color:transparent; -webkit-text-fill-color:transparent;
  padding-right:.05em; }
body[data-layout-closing="b"] #eternity .open-pill{ margin:30px auto 0; display:inline-flex; align-items:center; gap:11px;
  padding:9px 18px; border:1px solid var(--line); border-radius:100px; background:rgba(5,7,10,.55);
  font-size:11px; letter-spacing:.2em; text-transform:uppercase; color:#cdd5cf; max-width:none; white-space:nowrap; }
.open-pill i{ position:relative; width:8px; height:8px; border-radius:50%; background:#ff6a4a; flex:none; }
.open-pill i::after{ content:''; position:absolute; inset:0; border-radius:50%; background:#ff6a4a;
  animation:pill-ping 2.4s cubic-bezier(0,0,.2,1) infinite; }
@keyframes pill-ping{ 0%{ transform:scale(1); opacity:.7; } 75%,100%{ transform:scale(3.2); opacity:0; } }
body[data-layout-closing="b"] #eternity p.body-lg{ margin:24px auto 0; max-width:46ch; }
.cta-row{ display:flex; flex-wrap:wrap; justify-content:center; gap:14px; margin-top:40px; }
body[data-layout-closing="b"] #eternity .cta-row .cta{ margin:0; }
.cta-row--social{ margin-top:14px; }
/* buttons: every animated property is transform or opacity (compositor only), pointer-driven
   motion is rAF-throttled in script, and it all switches off under reduced motion */
.cta{ translate:var(--mx,0px) var(--my,0px); scale:1; will-change:translate;
  transition:translate .5s var(--ease-out), scale .25s var(--ease-out), color .45s var(--ease), border-color .45s, background-color .45s; }
.cta svg{ flex:none; transition:transform .5s var(--ease-out); }
.cta:active{ scale:.965; transition-duration:.5s,.08s,.45s,.45s,.45s; }
.cta:focus-visible{ outline:2px solid #ffb08c; outline-offset:4px; }
.cta--main{ isolation:isolate; background:var(--vermilion); border-color:var(--vermilion); color:#fff;
  box-shadow:0 14px 44px -14px rgba(224,35,28,.7); }
.cta--main::after{ content:''; position:absolute; top:0; bottom:0; left:0; width:46%; z-index:0; pointer-events:none;
  background:linear-gradient(105deg,transparent,rgba(255,255,255,.34),transparent);
  transform:translate3d(-160%,0,0) skewX(-18deg); }
.cta--ghost{ isolation:isolate; background:rgba(5,7,10,.5); }
@media (hover:hover){
  .cta:hover svg:not(.brand){ transform:translate3d(3px,-3px,0); }
  .cta--main:hover{ color:#05070a; border-color:var(--bone); }
  .cta--main:hover::after{ transform:translate3d(420%,0,0) skewX(-18deg); transition:transform .9s var(--ease-out); }
}
@media (prefers-reduced-motion:reduce){
  .cta, .cta svg, .cta i, .cta::after{ transition:none !important; animation:none !important; }
  .open-pill i::after{ animation:none; }
  .cta{ translate:none !important; }
}
@media (max-width:820px){ body[data-layout-closing="b"] #eternity h2{ font-size:clamp(52px,17vw,110px); } }
@media (max-width:560px){ body[data-layout-closing="b"] #eternity .open-pill{ white-space:normal; text-align:left; letter-spacing:.14em; } }
/* projects: all six in one gallery, three across (two across on tablets) */
body[data-layout-gallery="b"] #cards{ grid-template-columns:repeat(3,minmax(0,1fr)); grid-template-rows:auto; gap:clamp(10px,1.2vw,18px);
  max-width:1260px; margin-inline:auto; }
body[data-layout-gallery="b"] #cards .card:first-child{ grid-row:auto; }
body[data-layout-gallery="b"] #cards .card .card-fr{ flex:0 0 auto; height:auto; aspect-ratio:16/9; min-height:0; background-color:#090c10; }
.card--static{ cursor:default; }
.card-meta{ gap:12px; }
.card-meta span:last-child{ white-space:nowrap; }
.card:nth-child(1) .card-fr{ background:url('secret-pathways-assets/generated/project-prompt-engine.webp') center / cover no-repeat; }
.card:nth-child(2) .card-fr{ background:url('secret-pathways-assets/generated/project-devlaunch.webp') center / cover no-repeat; }
.card:nth-child(3) .card-fr{ background:url('secret-pathways-assets/generated/project-stockwatch.webp') center / cover no-repeat; }
.card:nth-child(4) .card-fr{ background:url('secret-pathways-assets/generated/project-arc.webp') center / cover no-repeat; }
.card:nth-child(5) .card-fr{ background:url('secret-pathways-assets/generated/project-benchmark.webp') center / cover no-repeat; }
.card:nth-child(6) .card-fr{ background:url('secret-pathways-assets/generated/project-agriculture.webp') center / cover no-repeat; }
#cards .glow{ display:none; }
/* the picture box stays exactly 16:9, so the whole picture shows; the title sits underneath it */
body[data-layout-gallery="b"] #cards .card .card-fr{ aspect-ratio:16/9; height:auto; padding:0; margin-bottom:40px; }
#cards .card-fr::after{ display:none; }
#cards .card-lab{ top:calc(100% + 12px); bottom:auto; left:2px; right:2px; }
@media (max-width:1080px){ body[data-layout-gallery="b"] #cards{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width:820px){ body[data-layout-gallery="b"] #cards{ grid-template-columns:1fr; } }
/* experience: two wide plates with the full write-up */
body[data-layout-curriculum="b"] #cur .les:nth-child(n){ grid-column:span 3; }
@media (max-width:820px){ body[data-layout-curriculum="b"] #cur .les:nth-child(n){ grid-column:auto; } }
.job{ gap:12px !important; }
.job h3 em{ display:block; margin:8px 0 0 !important; font-size:.62em !important; }
.job-logo{ position:absolute; top:22px; right:22px; height:52px; width:auto; opacity:.95; }
.job h3{ padding-right:76px; }
.job-where{ font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:#a7b1aa; }
.job-pts{ margin:4px 0 0; padding:0; list-style:none; display:grid; gap:10px; }
.job-pts li{ position:relative; padding-left:16px; font-size:14px; line-height:1.65; color:#cdd5cf; max-width:56ch; }
.job-pts li::before{ content:''; position:absolute; left:0; top:.8em; width:7px; height:1px; background:var(--vermilion); }
.job-stack{ display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; }
.job-stack span{ font-size:11px; letter-spacing:.06em; padding:4px 10px; border:1px solid var(--line-soft); color:#b8c1bb; }
.job .t{ margin-top:auto; }
</style>
"""
sub("</style>\n</head>", "</style>\n" + READABILITY_CSS + "</head>")
CTA_JS = r'''<script id="past-hero">
(() => {
  const hero = document.getElementById('hero');
  if (!hero || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([e]) => document.body.classList.toggle('past-hero', !e.isIntersecting),
    { threshold: 0.6 }).observe(hero);
})();
</script>
<script id="cta-magnet">
(() => {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  document.querySelectorAll('[data-magnet]').forEach(el => {
    let raf = 0, mx = 0, my = 0;
    const apply = () => { raf = 0; el.style.setProperty('--mx', mx + 'px'); el.style.setProperty('--my', my + 'px'); };
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      mx = Math.max(-9, Math.min(9, (e.clientX - (r.left + r.width / 2)) * 0.14));
      my = Math.max(-6, Math.min(6, (e.clientY - (r.top + r.height / 2)) * 0.2));
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    el.addEventListener('pointerleave', () => { mx = my = 0; if (!raf) raf = requestAnimationFrame(apply); });
  });
})();
</script>
'''
sub("</body>", CTA_JS + "</body>")

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
