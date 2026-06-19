# Portfolio — Shubh Sankalp Das

Personal site for an AI Product Manager. Hand-built, opinionated, and tuned for AI Platform PM and Consumer AI PM hiring loops — case studies, technical teardowns, and PM writing in one place instead of a Notion + LinkedIn + Medium scatter.

Live at **[shubhdas.com](https://shubhdas.com)** *(update if the domain differs)*.

## What's on the site

- **Hero** — animated WebGL shader background (Three.js fragment shader, cursor-tracking, reduced-motion aware)
- **About / Now** — current focus and short bio
- **Projects** — long-form case studies (problem → decision → metrics → what broke → retro → tradeoffs) rendered in a drawer
- **Blog** — short posts pulled from Supabase, rendered with react-markdown + GFM
- **Experience** — work timeline
- **Contact** — form that emails me via Resend
- **GitHub contribution heatmap** — last 60 days of public activity, cached for 1h
- **Theme toggle** — light / dark with a custom palette per mode
- **Floating navigation** + scroll spy, smooth scrolling via Lenis
- **Fully responsive** with hand-rolled mobile drawer scroll behavior for iOS Safari

## Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 14** (App Router) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** |
| Motion | **Framer Motion** + **Lenis** for smooth scroll |
| 3D / shaders | **Three.js** (raw fragment shader in `Hero`) |
| CMS for blog | **Supabase** (postgres + REST) |
| Transactional email | **Resend** |
| GitHub heatmap | **GitHub GraphQL API** |
| Fonts | **DM Sans** + **DM Mono** (via @fontsource) |
| Hosting | **Vercel** |

## Project layout

```
app/
├── api/
│   ├── contact/     # Resend-powered contact form endpoint
│   ├── github/      # GitHub contributions via GraphQL (revalidate: 1h)
│   └── ping/        # uptime/health
├── components/      # all UI — one file per section
│   ├── Hero.tsx              # WebGL shader background
│   ├── Projects.tsx          # project grid
│   ├── ProjectDrawer.tsx     # case-study drawer
│   ├── Blog.tsx + BlogDrawer.tsx
│   ├── Contact.tsx
│   ├── FloatNav.tsx + SideNav.tsx + TopBar.tsx
│   ├── CursorBot.tsx, EyeTracker.tsx   # small interactive touches
│   └── ...
├── lib/
│   ├── projects.ts           # case-study content (typed, in-source)
│   ├── post.ts               # blog post types + supabase queries
│   ├── supabase.ts           # supabase client
│   ├── ThemeContext.tsx      # theme provider + hook
│   └── useDrawerScrollLock.ts
├── fonts/                    # Geist woff2 files (legacy, fonts moved to @fontsource)
├── layout.tsx                # root layout + theme provider + metadata
├── page.tsx                  # one-page composition
└── globals.css
```

## Local development

Prereqs: Node 20+, npm.

```bash
git clone https://github.com/shubhdas0208/portfolio-website.git
cd portfolio-website
npm install
cp .env.local.example .env.local   # then fill in the values below
npm run dev
```

Open <http://localhost:3000>.

### Required environment variables

Stored in `.env.local` (gitignored):

```
# Supabase — blog posts
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_DB_PASSWORD=

# Resend — contact form
RESEND_API_KEY=

# GitHub — contribution heatmap (PAT with read:user scope)
GITHUB_TOKEN=
```

The site degrades gracefully if Supabase or GitHub vars are missing (blog and heatmap just won't render), but the contact form needs `RESEND_API_KEY` to actually deliver mail.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Next.js dev server on `:3000` |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint via `eslint-config-next` |

## Deployment

Deployed on Vercel from the `main` branch. Environment variables above need to be set in the Vercel project's Settings → Environment Variables. The contact route and GitHub route both run as serverless functions; `app/api/github/route.ts` uses `revalidate = 3600` so contributions update hourly without rebuilding.

## Design notes

- **Case studies live in code** (`app/lib/projects.ts`), not a CMS — they change rarely and benefit from typed editing alongside components.
- **Blog posts live in Supabase** — they change often and I want to write from anywhere.
- **The shader is the brand**. It's the first impression and the only place where the site says "AI" without saying "AI". Kept under 60fps with cursor-trail Vector2 buffers and reduced-motion bailout.
- **Mobile drawer scroll** went through ~7 fixes (visible in git log) because iOS Safari's `body { overflow: hidden }` + nested scroll is uniquely broken. Final solution: `position: fixed` body lock + CSS `touch-action: pan-y` on the drawer.

## License

Personal site — code is here for transparency and as a reference, not a template. If something's useful, take it. If you copy the case studies verbatim, that's plagiarism, not flattery.
