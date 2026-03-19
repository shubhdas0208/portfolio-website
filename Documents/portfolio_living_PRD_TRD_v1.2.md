# AI PM Portfolio — Living PRD / TRD
**Version:** 1.2  
**Status:** Pre-build — awaiting checklist completion  
**Primary audience:** AI-first hiring managers (Anthropic, Databricks, Stripe, OpenAI)  
**Stack:** Next.js 14 · Vercel · Supabase · Tailwind CSS · Framer Motion  

---

## How to use this document

Upload this file at the start of every build session.  
State what was completed in the last session.  
The document will tell you exactly what to build next.  
Update the session log at the bottom after every session.

---

## Current Status Tracker

| Phase | Name | Status |
|-------|------|--------|
| Phase 0 | Pre-build checklist | 🔴 Not started |
| Phase 1 | Skeleton + design system | 🔴 Not started |
| Phase 2 | Supabase integration | 🔴 Not started |
| Phase 3 | Real content + case studies | 🔴 Not started |
| Phase 4 | Polish + ship | 🔴 Not started |

**Update this table every session. Statuses: 🔴 Not started · 🟡 In progress · 🟢 Complete**

---

## Product Requirements Document (PRD)

### Problem Statement

Early AI PMs have no credible, AI-native portfolio format. Most PM portfolios are resume mirrors — titles and bullet points with no artifact, no reasoning, no technical evidence. For AI-first companies, this is disqualifying.

**Primary reader:** Hiring manager or technical PM lead at an AI-first company. 4–6 minutes. Scanning for three signals:
1. Can this person think about AI systems, not just AI features?
2. Have they shipped anything real, and do they know what broke?
3. Do they have a point of view and can they defend it?

---

### Section Specifications

#### 1. Hero
- One-line positioning statement (not a title, not "passionate PM")
- 2-line subtext: current focus + target role
- Two CTAs: "See my work" (scrolls to Projects) + "Download CV" (PDF)
- One purposeful animated element — typewriter reveal on headline only

#### 2. Projects
- Gallery: 2-column card grid (1-column mobile)
- Each card: title · one-line problem statement · 2–3 tags · cover image · hover lift animation
- Filter bar by tag: AI Infra / Consumer / Fintech / Tooling
- Each card opens a full case study page at `/projects/[slug]`

**Case study page structure (in order):**
1. Header: title + summary + tags + date
2. Problem: who was suffering, what was breaking, evidence
3. Decision: what was built, what was rejected, why this path
4. System diagram: embedded image from Supabase Storage
5. Technical choices: LLM decision log + stack rationale + key tradeoff
6. Metrics: what was measured, what moved
7. Video walkthrough: embedded Loom or YouTube unlisted (60–90 seconds)
8. What broke: honest failure account with fixes
9. Retrospective: what I'd do differently (one paragraph)

#### 3. AI Product Teardowns
- Card grid, same visual language as Projects
- Each card opens full teardown at `/teardowns/[slug]`
- Per teardown: product name · likely model + reasoning · failure modes · eval design · cost estimate · PM verdict

#### 4. Blog
- List view: title · one-line summary · date · reading time · tag · source badge (Medium / Substack / Original)
- All posts render natively at `/blog/[slug]` — no external redirects
- Bottom of every post: two CTAs — "Follow on Substack" + "Read more posts"
- Canonical URL tag in HTML head for cross-posted content (prevents duplicate content SEO issues)

#### 5. Now
- Single paragraph section, three lines:
  - What I'm building
  - What I'm reading
  - What problem I'm thinking about
- Displays last-updated timestamp
- Single row in Supabase — edit in place, never insert new rows

#### 6. About
- How you think about product (2–3 opinionated sentences)
- Why AI PM specifically (real reason, not generic)
- One non-PM fact that reveals something true
- NOT a bio. NOT a skill list.

#### 7. Experience
- Vertical timeline, reverse chronological
- Each entry: company + role + dates + 2–3 outcome-first bullets
- Resume PDF download link at top of section

#### 8. Contact
- Three links only: Email (mailto) · LinkedIn · GitHub
- No contact form in v1

---

### Design Principles

1. **Speed over beauty** — <2 second load on mobile. If animation costs load time, cut it.
2. **Purposeful motion only** — Allowed: scroll-triggered reveals, card hover lifts, smooth page transitions, single typewriter on hero. Banned: parallax, particles, auto-playing video, decorative loaders.
3. **Typographic-first** — One display font (headlines) + one body font (paragraphs). Not Inter, Roboto, or Arial.
4. **Dark mode default** — Light mode toggle available. Dark is the first impression.
5. **Mobile-first** — Build mobile layout first, scale up to desktop.
6. **One accent color** — Everything else is black, white, grays.

---

## Technical Requirements Document (TRD)

### System Architecture

```
You (author)
    │
    ├── Code changes ──→ GitHub repo ──→ auto-deploy ──→ Vercel (30 seconds)
    │
    └── Content changes ──→ Supabase dashboard ──→ insert/edit row ──→ site updates via ISR (~60s)

Visitor ──→ Vercel CDN ──→ Next.js page ──→ fetches Supabase ──→ renders content
```

**No backend server. No Render. No custom API.**  
Vercel handles hosting and edge functions. Supabase REST API called directly from Next.js server components.

---

### Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Next.js 14 (App Router) | ISR support · file-based routing · server components · Vercel-native |
| Hosting | Vercel (free tier) | Zero-config deploy · preview URLs · analytics built-in |
| Database | Supabase (free tier) | Postgres · REST API auto-generated · dashboard for content entry · 500MB free |
| Styling | Tailwind CSS | Utility-first · fast iteration · no CSS file sprawl |
| Animation | Framer Motion | React-native · declarative · purposeful motion only |
| Content rendering | react-markdown + rehype-highlight | Renders markdown from Supabase as styled HTML with code highlighting |
| Images | Supabase Storage (free) | One platform · Next.js Image component for optimization |
| Fonts | Fontsource (self-hosted) | Performance · no external request · free |
| Analytics | Vercel Analytics (free) | Zero config · built-in |

---

### Data Fetching Strategy

**ISR — Incremental Static Regeneration**

| Page type | Revalidate | Reason |
|-----------|-----------|--------|
| Blog list | 60 seconds | New posts appear within 1 minute |
| Blog post | 300 seconds | Individual posts change rarely |
| Project list | 60 seconds | |
| Project case study | 300 seconds | |
| Teardown list | 60 seconds | |
| Teardown page | 300 seconds | |
| Now section | 60 seconds | Should reflect updates quickly |
| Hero / About | Hardcoded | Only changes with a code push |

---

### Supabase Schema

#### Table: `blog_posts`
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | Primary key, auto-generated |
| title | text | Post title |
| slug | text | URL-safe e.g. `uber-vector-search-pm-lens` |
| body | text | Markdown content |
| summary | text | One-line shown on card |
| tags | text[] | e.g. `["RAG", "LLM", "Engineering"]` |
| reading_time_mins | integer | Manually set |
| source | text | "original" / "medium" / "substack" |
| external_url | text | Canonical source URL for cross-posted content |
| published_at | timestamp | Controls sort order + display date |
| is_published | boolean | false = draft, hidden from site |

#### Table: `teardowns`
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | Primary key |
| product_name | text | e.g. "Perplexity AI" |
| slug | text | URL-safe identifier |
| summary | text | One-line shown on card |
| likely_model | text | Markdown — model reasoning |
| failure_modes | text | Markdown — where it breaks |
| eval_design | text | Markdown — how you'd measure quality |
| cost_estimate | text | Rough token × price estimate |
| pm_verdict | text | The riskiest assumption in the product |
| cover_image_url | text | Card thumbnail from Supabase Storage |
| published_at | timestamp | |
| is_published | boolean | Draft/live toggle |

#### Table: `projects`
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | Primary key |
| title | text | Project name |
| slug | text | URL-safe identifier |
| summary | text | One-line shown on card |
| tags | text[] | e.g. `["RAG", "Python", "LLM"]` |
| pain | text | Markdown — problem statement |
| decision | text | Markdown — what was built and why |
| system_diagram_url | text | Image URL from Supabase Storage |
| tech_stack | text | Markdown — stack + rationale |
| llm_decisions | text | Markdown — model choices + tradeoffs |
| metrics | text | Markdown — what was measured |
| video_url | text | Loom or YouTube unlisted URL |
| what_broke | text | Markdown — honest failure account |
| retrospective | text | Markdown — what I'd do differently |
| cover_image_url | text | Card thumbnail |
| display_order | integer | Manual sort for gallery |
| is_published | boolean | Draft/live toggle |

#### Table: `now` (always one row — edit in place, never insert new)
| Field | Type | Notes |
|-------|------|-------|
| id | uuid | Primary key — one row only |
| building | text | What you're working on |
| reading | text | What you're consuming |
| thinking_about | text | Current problem |
| updated_at | timestamp | Displayed on site — update manually |

---

### Folder Structure

```
/app
  /page.tsx                   ← Homepage (Hero + all section anchors)
  /projects
    /page.tsx                 ← Project gallery
    /[slug]/page.tsx          ← Individual case study
  /teardowns
    /page.tsx                 ← Teardown gallery
    /[slug]/page.tsx          ← Individual teardown
  /blog
    /page.tsx                 ← Blog list
    /[slug]/page.tsx          ← Individual post (native render)
  /now/page.tsx               ← Now section
  /about/page.tsx             ← About + Experience + Contact

/components
  /Hero.tsx
  /Nav.tsx
  /Footer.tsx
  /ProjectCard.tsx
  /ProjectCaseStudy.tsx
  /TeardownCard.tsx
  /TeardownPage.tsx
  /BlogCard.tsx
  /BlogPost.tsx               ← Native blog post renderer
  /BlogCTA.tsx                ← "Follow on Substack" + "Read more" bottom CTA
  /SystemDiagram.tsx
  /ExperienceTimeline.tsx
  /NowSection.tsx
  /FilterBar.tsx              ← Tag filter for Projects gallery

/lib
  /supabase.ts                ← Supabase client initialisation
  /queries.ts                 ← All data fetching functions (one function per table)

/public
  /fonts                      ← Self-hosted via Fontsource
  /og-image.png               ← Open Graph image for link previews
  /resume.pdf                 ← Your resume — replace when updated
```

---

## Build Phases — Step by Step

---

### Phase 0 — Pre-Build Checklist
**Gate:** Do not start Phase 1 until every item below is checked.

#### Design decisions
- [ ] Aesthetic direction chosen (minimal / editorial / bold / technical)
- [ ] Font pairing chosen (display + body, not Inter/Roboto/Arial)
- [ ] Accent color locked (one color only)
- [ ] Dark mode default confirmed

#### Hero content
- [ ] Positioning headline written and finalised
- [ ] 2-line subtext written

#### Project case study — Filter project
- [ ] Problem statement written (3–5 sentences)
- [ ] Decision log written (what was built, what was rejected, why)
- [ ] System diagram drawn (hand-drawn is fine, photo it)
- [ ] What broke written in full (rate limits · cosine k · latency fix)
- [ ] Video walkthrough recorded (60–90 seconds, Loom)
- [ ] Retrospective written (one honest paragraph)

#### AI product teardown
- [ ] Product chosen
- [ ] Full teardown written (400–600 words, all structured fields)

#### Blog
- [ ] Engineering blog chosen to react to
- [ ] PM lens post written (400–600 words, one argued position)

#### Now · About · Experience · Contact
- [ ] Now section written (3 specific lines)
- [ ] About section written (mental model + why AI PM + one human fact)
- [ ] Experience entries prepared (metric-first bullets, resume PDF updated)
- [ ] Contact details confirmed (email · LinkedIn · GitHub — all links verified)

#### Technical setup
- [ ] GitHub repo created (public, named yourname-portfolio)
- [ ] Vercel account created and connected to GitHub
- [ ] Supabase account created, new project set up, URL and anon key saved

---

### Phase 1 — Skeleton + Design System
**Goal:** Live Vercel URL with real design. Placeholder content. No Supabase yet.  
**Success criterion:** You can share the URL and it looks like a real portfolio.

#### Session 1A — Project initialisation
- [ ] Initialise Next.js 14: `npx create-next-app@latest`
- [ ] Install: `tailwindcss` · `framer-motion` · `react-markdown` · `rehype-highlight` · `@supabase/supabase-js` · Fontsource font packages
- [ ] Set up Tailwind config with custom color tokens: `background` · `foreground` · `accent` · `muted`
- [ ] Add chosen fonts to `layout.tsx` via Fontsource
- [ ] Set up CSS variables for dark mode in `globals.css`
- [ ] Push to GitHub → confirm Vercel auto-deploys → share URL

#### Session 1B — Nav + Hero
- [ ] Build `Nav.tsx`: name/logo left · section links right · mobile hamburger · dark/light toggle
- [ ] Build `Hero.tsx`: positioning headline · subtext · two CTAs · typewriter animation on headline only
- [ ] Test on mobile and desktop

#### Session 1C — Projects gallery (hardcoded)
- [ ] Build `ProjectCard.tsx`: title · summary · tags · cover image placeholder · hover lift
- [ ] Build `FilterBar.tsx`: tag filter, filters cards client-side
- [ ] Build `/projects/page.tsx`: 2–3 hardcoded dummy cards in grid
- [ ] Build `/projects/[slug]/page.tsx`: all case study sections present (placeholder text fine)

#### Session 1D — Remaining sections (hardcoded)
- [ ] Build `BlogCard.tsx`: title · summary · date · reading time · tag · source badge
- [ ] Build `/blog/page.tsx`: 1–2 hardcoded dummy posts
- [ ] Build `/blog/[slug]/page.tsx`: native renderer + `BlogCTA.tsx` at bottom
- [ ] Build `TeardownCard.tsx` + `/teardowns/page.tsx`: 1 hardcoded dummy
- [ ] Build `/now/page.tsx`: static hardcoded content
- [ ] Build `/about/page.tsx`: About + Experience timeline + Contact links
- [ ] Build `Footer.tsx`

#### Session 1E — Design review
- [ ] Full review on mobile (Chrome DevTools)
- [ ] Full review on desktop
- [ ] All navigation links work
- [ ] Dark/light mode toggle works
- [ ] Lighthouse Performance >85 on mobile
- [ ] Share URL — get one real person to review and give feedback

---

### Phase 2 — Supabase Integration
**Goal:** All dynamic content fetched from database. Adding content = adding a row.  
**Success criterion:** Insert a row in Supabase, it appears on site within 60 seconds. No code change needed.

#### Session 2A — Supabase setup
- [ ] Create all 4 tables in Supabase dashboard: `blog_posts` · `teardowns` · `projects` · `now`
- [ ] Enable Row Level Security (RLS): public read, no public write
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel environment variables
- [ ] Create `/lib/supabase.ts`: initialise Supabase client
- [ ] Create `/lib/queries.ts`: one fetch function per table

#### Session 2B — Wire projects
- [ ] Update `/projects/page.tsx` to fetch from `projects` table
- [ ] Update `/projects/[slug]/page.tsx` to fetch by slug
- [ ] Set `revalidate = 60` on list page, `revalidate = 300` on case study
- [ ] Insert Filter project row in Supabase
- [ ] Confirm it renders on site

#### Session 2C — Wire blog + teardowns + now
- [ ] Update `/blog/page.tsx` and `/blog/[slug]/page.tsx` to fetch from `blog_posts`
- [ ] Add canonical `<link>` tag to blog post head when `external_url` is set
- [ ] Update `/teardowns` pages to fetch from `teardowns`
- [ ] Update `/now/page.tsx` to fetch from `now` table
- [ ] Insert first blog post, first teardown, now row
- [ ] Confirm all three render correctly

#### Session 2D — Draft workflow
- [ ] Confirm `is_published = false` rows excluded from all queries
- [ ] Test: insert draft row → not visible on site
- [ ] Test: flip to `is_published = true` → appears within 60 seconds

---

### Phase 3 — Real Content
**Goal:** Portfolio is credible, not just functional.  
**Success criterion:** A hiring manager at an AI-first company sees technical credibility, shipping evidence, and a point of view.

#### Session 3A — Filter project case study
- [ ] Write all fields in full: pain · decision · tech choices · metrics · what broke · retrospective
- [ ] Upload system diagram to Supabase Storage, add URL to project row
- [ ] Embed Loom video in case study
- [ ] Review: does it answer — what model, why, what broke, what was measured?

#### Session 3B — First teardown
- [ ] Write full teardown for chosen product
- [ ] Upload cover image to Supabase Storage
- [ ] Insert row, set `is_published = true`
- [ ] Review: model reasoning · failure modes · eval design · cost estimate · PM verdict — all present?

#### Session 3C — First blog post
- [ ] Write PM lens post in markdown
- [ ] Insert into `blog_posts`
- [ ] Set `external_url` and `source` if cross-posted
- [ ] Confirm bottom CTA renders correctly

#### Session 3D — About + Experience + Now
- [ ] Write and hardcode About section: mental model · why AI PM · one human fact
- [ ] Write and hardcode Experience timeline: metric-first bullets per role
- [ ] Upload resume PDF to `/public/resume.pdf`
- [ ] Insert Now row in Supabase with specific current content
- [ ] Verify last-updated timestamp displays

---

### Phase 4 — Polish + Ship
**Goal:** Ready to put on resume.

#### Session 4A — Performance + SEO
- [ ] Add Open Graph meta tags to all pages
- [ ] Create `/public/og-image.png` (1200×630px)
- [ ] Add `sitemap.xml` (Next.js auto-generates)
- [ ] Lighthouse audit — target >90 mobile Performance + Accessibility
- [ ] Fix any failing issues

#### Session 4B — Second project case study
- [ ] Choose second project
- [ ] Write all fields
- [ ] Insert into Supabase, confirm renders

#### Session 4C — Custom domain
- [ ] Buy domain (Namecheap or Google Domains — ₹800–1200/year)
- [ ] Vercel → Settings → Domains → Add domain
- [ ] Copy DNS records to registrar
- [ ] Confirm live at custom domain
- [ ] Update resume PDF with new URL

#### Session 4D — Final review
- [ ] Full walkthrough on mobile
- [ ] All links working
- [ ] All videos playing
- [ ] Resume PDF downloads correctly
- [ ] Vercel Analytics enabled
- [ ] Share with one trusted person for honest feedback
- [ ] Add URL to resume · LinkedIn · GitHub profile

---

## Domain Migration Note

Start on `yourname.vercel.app`. When ready for custom domain:
1. Vercel → Settings → Domains → Add domain
2. Copy 2 DNS records to your registrar
3. Live in ~15 minutes. Zero code changes. Zero redeployment.

Buy the domain name early even if you're not ready to use it.

---

## Open Decisions Log

| Decision | Needed by | Status |
|----------|-----------|--------|
| Aesthetic direction | Phase 1 · Session 1A | 🔴 Open |
| Font pairing (display + body) | Phase 1 · Session 1A | 🔴 Open |
| Accent color (one only) | Phase 1 · Session 1A | 🔴 Open |
| Hero positioning headline | Phase 1 · Session 1B | 🔴 Open |
| First teardown product | Phase 3 · Session 3B | 🔴 Open |
| Second project for case study 2 | Phase 4 · Session 4B | 🔴 Open |

---

## Session Log

Update this after every session. This is your continuity record.

| Session | Date | Phase | What was completed | What's next |
|---------|------|-------|--------------------|-------------|
| 1 | 2026-03-17 | 0 | PRD/TRD written · architecture decided · schema finalised · checklist created · blog native render confirmed · Substack CTA pattern decided | Complete Phase 0 checklist |
| 2 | 2026-03-17 | 0 | Appendix A (alternatives considered) + Appendix B (risk log) added · v1.2 | Complete Phase 0 checklist |

---

## Appendix A — Tech Stack: Alternatives Considered

Full decision log for every stack choice. Useful context if a constraint changes and you need to revisit a decision.

| Layer | Chosen | Alternative | Why alternative was rejected |
|-------|--------|-------------|------------------------------|
| Framework | Next.js 14 (App Router) | Astro | Less ecosystem, harder to add dynamic features later; ISR not as native |
| Hosting | Vercel | Netlify | Vercel is Next.js-native, better DX, tighter integration with App Router |
| Database | Supabase | PlanetScale | Supabase includes Storage + Auth if needed later; one platform |
| Styling | Tailwind CSS | CSS Modules | Slower to iterate on layout; more file management overhead |
| Animation | Framer Motion | GSAP | GSAP is overkill for purposeful-only motion; larger bundle; less React-native |
| Content rendering | react-markdown + rehype-highlight | MDX | MDX requires files on disk — not compatible with DB-driven content from Supabase |
| Images | Supabase Storage | Cloudinary | One fewer service to manage in v1; Supabase Storage is free and co-located |
| Fonts | Fontsource (self-hosted) | Google Fonts | Fontsource self-hosts via npm — no external DNS request, better performance |
| Analytics | Vercel Analytics | Plausible | Plausible requires paid plan for custom domains; Vercel Analytics is zero-config and free |
| Backend | None (no Render) | Render (Express/Node) | No business logic needed — portfolio is read-only content. A backend server adds cost, a failure point, and solves a problem that doesn't exist |

---

## Appendix B — Technical Risk Log

Known risks, their likelihood, impact, and how they are mitigated.

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Supabase free tier limits (500MB storage, 2 projects) | Low | Medium | Portfolio is text-heavy; images in Storage. 500MB is far more than needed for v1. If exceeded, upgrade is $25/month or migrate to a second project. |
| Vercel free tier bandwidth limits (100GB/month) | Low | Low | Portfolio traffic is low. 100GB handles millions of page views. Not a realistic constraint. |
| ISR revalidation delay — new post takes up to 60s to appear | Low | Low | Acceptable for a portfolio. Can manually trigger revalidation via Vercel dashboard if urgent. |
| Framer Motion bundle size adds to JS payload | Medium | Medium | Use tree-shaking — import only used primitives e.g. `import { motion } from 'framer-motion'` not the full lib. Target <50KB Framer contribution to bundle. |
| Markdown rendering edge cases (tables, code blocks, footnotes) | Low | Low | Test with real content in Phase 2. `react-markdown` + `rehype-highlight` handles 99% of cases. Add plugins as needed. |
| Image optimization — large images slow mobile load | Medium | Medium | Use Next.js `<Image>` component throughout — automatic WebP conversion, lazy loading, and size optimization built in. Never use raw `<img>` tags. |
| Supabase anon key exposed in client-side code | Low | Low | Expected and safe — anon key is public by design. RLS (Row Level Security) is the protection layer: public read, no public write. Never put service role key in frontend. |
| Cold start latency on Vercel free tier | Low | Low | Next.js App Router with ISR means pages are pre-rendered. Cold starts only affect the first request after a long idle period — acceptable for a portfolio. |

---

## Rules That Never Change

1. No code until Phase 0 checklist is fully checked.
2. The `what_broke` field is the most important field in the portfolio. Write it honestly.
3. The hero positioning headline is the hardest thing you'll write. Do not placeholder it.
4. Purposeful motion only. If you're debating whether an animation is decorative — it is. Cut it.
5. `is_published = false` is your draft system. Use it. Never push half-written content live.
6. Every session: state what was completed last session before asking what to build next.
7. Update the Status Tracker and Session Log at the end of every session.
