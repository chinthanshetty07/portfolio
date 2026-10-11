# Deploying to Vercel

The site is a static Vite build (`dist/`), so it runs on Vercel's free Hobby tier with no server code. `vercel.json` in the repo root holds all of the configuration.

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Install command | `npm ci` |
| Build command | `npm run build` (type-check + Vite build) |
| Output directory | `dist` |
| Node.js | 22.x (`.nvmrc`; Vite 8 requires ≥ 20.19, so Node 18 won't build it) |
| Environment variables | None. The site has no secrets. |

## What `vercel.json` does

- **Routes:** `/classic` and `/kage` are rewritten to `index.html`, which picks the page client-side. Every other unknown path gets a real **404** served from `public/404.html`. Static files always win over rewrites.
- **Security headers on every response:** HSTS (two years, `includeSubDomains`, `preload`), `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN` (the homepage frames its own `/landing-pages/portfolio.html`, so it must be SAMEORIGIN, not DENY), `Referrer-Policy` and `Permissions-Policy`.
- **Caching:** hashed bundles in `/assets/*` are immutable for a year; the Kage scene assets are cached for 30 days.

## 1. Connect the repository (recommended: Git integration, which gives CI/CD)

1. Sign in at <https://vercel.com> with GitHub.
2. Click **Add New → Project**, then **Import** `chinthanshetty07/portfolio`.
3. Vercel reads `vercel.json`; leave the detected settings as they are. Under **Node.js Version**, choose **22.x** if it isn't already selected.
4. Click **Deploy**.

From then on:
- every push to `main` deploys to production;
- every other branch or pull request gets its own preview URL, posted as a comment on the PR.

To roll back, open **Deployments**, pick an earlier one and choose **Promote to Production**.

### Alternative: the CLI

```bash
npx vercel@latest login
npx vercel@latest link
npx vercel@latest
npx vercel@latest --prod
```

`link` connects the folder to a project. The plain `vercel` command creates a preview deployment; `--prod` promotes to production.

### Fallback: deploy without Git

```bash
npm ci && npm run build
npx vercel@latest deploy --prebuilt --prod
```

Or drag the `dist/` folder onto <https://vercel.com/new> (this skips the build step on Vercel).

## 2. Verify

```bash
npm run smoke -- https://<your-project>.vercel.app
```

The smoke test checks:
- `/`, `/classic` and `/kage` return 200;
- the Kage scene files, résumé, images and every hashed bundle load with the right content type;
- an unknown path returns 404;
- HSTS is present.

Then open the site in Chrome, Safari and Firefox and scroll the homepage once.

## 3. Custom domain with HTTPS

1. In the project, go to **Settings → Domains → Add**, enter `yourdomain.com`, and also add `www.yourdomain.com`, redirecting it to the apex (or the other way round).
2. Add the DNS records Vercel shows, at your registrar:
   - apex (`yourdomain.com`): `A` → `76.76.21.21`
   - `www`: `CNAME` → `cname.vercel-dns.com`

   Or switch the domain's nameservers to Vercel's and let it manage the records.
3. Wait for the domain to show **Valid Configuration**. Vercel issues and renews the Let's Encrypt certificate automatically.
4. Check:

   ```bash
   dig +short yourdomain.com
   curl -sI https://yourdomain.com | head -5
   npm run smoke -- https://yourdomain.com
   ```

5. Update the social preview. In `index.html`, change `og:image` and `twitter:image` to absolute URLs such as `https://yourdomain.com/og.png` and add `<meta property="og:url" content="https://yourdomain.com/">`, then push. LinkedIn and X ignore relative image URLs.

HSTS includes `preload`. Only submit the domain to <https://hstspreload.org> once every subdomain is permanently on HTTPS; that list is hard to get off.

## If the build fails

Read the **Build Logs** on the failed deployment.

| Symptom | Fix |
|---|---|
| `Vite requires Node.js version 20.19+` | Set Node.js to 22.x in **Settings → General** |
| `npm ci` lockfile error | Run `npm install` locally, commit `package-lock.json`, push |
| TypeScript errors (`tsc -b`) | Run `npm run build` locally and fix the same error |
| Blank page or 404 on `/classic` | Make sure `vercel.json` is committed at the repo root |
| `No Output Directory named "dist"` | The output directory must be `dist`; don't override it in the dashboard |
| Homepage frame blank | Make sure no custom header sets `X-Frame-Options: DENY` |
