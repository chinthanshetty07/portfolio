# Chinthan Shetty — portfolio

Personal portfolio for Chinthan Shetty, software engineer (full-stack and AI applications).
Single-page static site: React 19, TypeScript, Vite, Tailwind CSS 4, Motion, Lenis and lucide-react.

**Live:** [chinthanshetty.in](https://chinthanshetty.in)

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server at http://localhost:5173
npm run build      # type-check (tsc -b) and build to dist/
npm run preview    # serve the production build locally
npm run lint       # oxlint
python3 scripts/build-portfolio-page.py   # regenerate the homepage after editing its copy
```

Requires Node.js 20 or newer.

## Structure

```
public/
  Chinthan_Shetty_Resume.pdf   resume served by "View resume"
  chinthan.jpg                 profile photo (hero + about)
  logo.jpg, favicon.png, apple-touch-icon.png
  og.png                       1200×630 social preview
  404.html                     static not-found page for hosts that use it
src/
  data/profile.ts     contact links, experience, education, skills
  data/projects.ts    featured projects: facts, built vs planned, challenges
  components/
    Hero.tsx          name reveal + interactive stack map
    StackMap.tsx      SVG map of each project's route through the stack
    Projects.tsx      featured project panels and "Also built"
    visuals.tsx       per-project interactive visuals
    CaseStudy.tsx     slide-over case study dialog
    Engineering.tsx   engineering decisions with real code excerpts
    Sections.tsx      experience, skills, about, contact, footer
  hooks/useLenis.ts   smooth scrolling (disabled under reduced motion)
```

To change content, edit `src/data/*.ts`. Copy in `projects.ts` was checked against each repository's source in October 2026; update it when the projects change.

## Routes

| Path | What it is |
|---|---|
| `/` | Homepage: the ThreeUI Kage world (Three.js temple, scroll scenes) carrying the portfolio content |
| `/classic` | Detailed React portfolio: case studies, engineering decisions with code, skills |
| `/kage` | The original ThreeUI Kage page, unchanged, kept for reference |

All three are client-side routes. On Vercel, `vercel.json` rewrites `/classic` and `/kage` to `index.html` and lets every other unknown path return a real 404 (`public/404.html`).

## The Kage-based homepage

- `public/landing-pages/kage.html`, `fonts.css`, `three.min.js` and the 14 WebP assets are ThreeUI's canonical files (revision `c8e06b90397a`), byte-exact and verified against the bundle's SHA-256 hashes. Don't edit them.
- `public/landing-pages/portfolio.html` is **generated**. Change the copy in `scripts/build-portfolio-page.py`, then run:

  ```bash
  python3 scripts/build-portfolio-page.py
  ```

  The script refuses to run unless `kage.html` matches the canonical hash, and every text replacement must match exactly, so a changed source fails loudly instead of half-applying.
- Kage's bundled "Wordmark" font only contains the letters A E G K S, so the 3D name is set in Onest 700.
- Every `.nav-link` must be an in-page `#anchor`: the page's nav script resolves each href with `querySelector`, and a URL there stops the page from loading.
- The page runs inside ThreeUI's sandboxed `LandingPageFrame`, which can open new tabs but can't navigate the top window. That's why links leaving the page (GitHub, résumé, email, `/classic`) open in a new tab.
- `src/shaders/` holds the registered ThreeUI sources unchanged. The shared `LandingPages.tsx` imports every other ThreeUI page, which isn't in this bundle, so it's excluded from the build. `KageLandingPage.tsx` and `PortfolioLandingPage.tsx` use the same frame and typography recipe with the configured props (Onest 400/300, `#e0231c`, 46/17, −0.012em).
- `noUnusedLocals` is off in `tsconfig.app.json` because the vendored `pageRecipes.ts` declares an unused constant. `oxlint`'s `no-unused-vars` still covers app code.

## Deploying

Hosted on Vercel. See **[DEPLOY.md](DEPLOY.md)** for the full guide: connecting the repo, custom domain, HTTPS and troubleshooting. After any deploy:

```bash
npm run smoke -- https://<deployment-url>
```

## Accessibility and motion

- Semantic landmarks, a skip link, visible focus rings, labelled icon buttons.
- The case-study dialog traps focus, closes on Escape and returns focus to its trigger.
- `prefers-reduced-motion` turns off smooth scrolling, entrance animations, the travelling stack-map pulse and auto-rotation.
