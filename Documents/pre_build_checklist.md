# AI PM Portfolio — Pre-Build Checklist
Complete all 20 tasks before writing a single line of code.

---

## Block 1 — Design Decisions
> Do this first. Everything downstream depends on it.

- [ ] **Pick aesthetic direction** — Look at Linear.app and Stripe.com. Pick one as your north star or describe a third direction. One word: minimal / editorial / bold / technical.
- [ ] **Choose font pairing** — One display font (headlines) + one body font (paragraphs). Must not be Inter, Roboto, or Arial. Examples: Clash Display + DM Sans · Syne + Instrument Sans · Playfair + IBM Plex Mono.
- [ ] **Lock accent color** — One color only. Everything else is black, white, and grays. No purple gradients.
- [ ] **Confirm dark mode as default** — Already decided. Dark is the first impression. Light mode toggle will exist.

---

## Block 2 — Hero Content

- [ ] **Write your positioning headline** — One sentence. Not your title. States: what you build + who you build it for + what constraint or context you operate in. Draft it, share it, get it sharpened.
- [ ] **Write 2-line subtext** — Current focus + target role. Example: "Currently building AI-native tools at [X]. Targeting AI Platform PM and Consumer AI PM roles."

---

## Block 3 — Project Case Study (Filter Project = Case Study 1)

- [ ] **Write problem statement** — Who was suffering? What was breaking in their life? What evidence did you have? 3–5 sentences.
- [ ] **Write decision log** — What did you build, what did you consider and reject, why this path. Include: why RAG over fine-tuning, why this embedding model, what you prototyped first.
- [ ] **Draw system diagram** — End-to-end: data in → embedding → vector DB → retrieval → LLM → output → feedback loop. Can be hand-drawn and photographed first. We'll recreate it digitally.
- [ ] **Write what broke + how you fixed it** — API key rate limits → key pool rotator. Wrong cosine similarity k → iterative tuning. Cold start latency → animation + cron job pre-warm. Write in full sentences with the reasoning behind each fix.
- [ ] **Record 60–90 second video walkthrough** — Screen recording of the product working. Loom is free. Show the actual flow, not a slide deck. Narrate as you go.
- [ ] **Write retrospective — what you'd do differently** — One honest paragraph. Not "I'd add more features." Architectural or strategic — what assumption was wrong from the start?

---

## Block 4 — AI Product Teardown (One to Start)

- [ ] **Pick the product** — One AI product you use regularly and have real opinions about. Examples: Perplexity · Cursor · ChatGPT · Notion AI · GitHub Copilot · Google Gemini in Docs.
- [ ] **Write the teardown using the structured format** — Cover: likely model + reasoning · failure modes · how you'd design evals · rough cost estimate · PM verdict (the riskiest assumption in the product). 400–600 words total.

---

## Block 5 — Blog (One Post to Start)

- [ ] **Pick the engineering blog you're reacting to** — Suggested start: Uber's vector search engineering blog. Read it fully. Identify one PM decision it surfaces that most PMs would miss.
- [ ] **Write the PM lens post** — 400–600 words. One argued position. Structure: here's what the engineering post says → here's what most PMs miss → here's the decision it forces → here's your take. No summaries disguised as insight.

---

## Block 6 — Now · About · Experience · Contact

- [ ] **Write the Now section** — Three lines: what you're building · what you're reading · what problem you're thinking about. Be specific. "Building a RAG-based filter" not "working on AI projects."
- [ ] **Write the About section** — How you think about product (2–3 opinionated sentences) · why AI PM specifically (your real reason, not the generic one) · one non-PM fact that reveals something true about you. No bio. No skill list.
- [ ] **Prepare experience entries** — For each role: company + title + dates + 2–3 bullets each starting with a metric or outcome. Update your resume PDF too.
- [ ] **Confirm contact details** — Email address · LinkedIn URL · GitHub URL. Verify all three links work.

---

## Block 7 — Hard Technical Prerequisites (One-Time Setup)

- [ ] **Create GitHub repo** — Repo name: `yourname-portfolio`. Set to public — hiring managers will look at it.
- [ ] **Create Vercel account + connect to GitHub** — Free. Sign up at vercel.com with your GitHub account. 5-minute one-time setup.
- [ ] **Create Supabase account + new project** — Free. Sign up at supabase.com. Save your project URL and anon key — needed when wiring into Next.js.

---

## Domain Migration Note
> You can start on Vercel's free subdomain (`yourname.vercel.app`) and migrate to a custom domain at any time with zero code changes. Buy your domain name early — good `.com` names get taken. Cost: ₹800–1200/year. Point it at Vercel whenever you're ready.

---

## Rules
1. No code until all 20 tasks are checked.
2. The positioning headline (Block 2, task 1) is the hardest thing you'll write. Do not skip it or placeholder it.
3. The `what broke` field (Block 3, task 4) is the most important field in the entire portfolio for your target audience. Write it honestly.
4. Content in Blocks 3–6 does not need to be perfect — it needs to exist. You will iterate. But it must exist before the build starts.
