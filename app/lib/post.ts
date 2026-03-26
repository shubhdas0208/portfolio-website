export interface PostSection {
  heading: string
  body: string
}

export interface Post {
  slug: string
  title: string
  label: string
  desc: string
  img: string | null
  status: 'live' | 'soon'
  readTime: string
  publishDate: string
  tags: string[]
  tldr: string
  sections: PostSection[]
  takeaway: string
}

export const POSTS: Post[] = [
  {
    slug: 'uber-vector-search',
    title: "What Uber's Vector Search Blog Doesn't Tell PMs",
    label: '001 — AI Infra',
    desc: "The engineering post explains ANN search at scale. It doesn't explain the PM decision it forced — and most PMs will miss the recall-latency tradeoff entirely.",
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&q=80',
    status: 'live',
    readTime: '6 min read',
    publishDate: 'Jan 2025',
    tags: ['Vector Search', 'ANN', 'Infra', 'Uber'],
    tldr: "Uber's engineering blog is a masterclass in system design. It's a terrible guide to what the PM on that project actually had to decide. The recall-latency tradeoff isn't a technical choice — it's a product bet.",
    sections: [
      {
        heading: 'What the blog says',
        body: "Uber's post walks through their Approximate Nearest Neighbor (ANN) implementation at scale — index sharding, quantization, latency SLAs. It's detailed, well-written, and entirely focused on how the system works. The PM decision that drove those choices is never mentioned.",
      },
      {
        heading: 'The decision the blog skips',
        body: 'Every ANN implementation makes a fundamental tradeoff: recall vs latency. Higher recall (finding the most relevant results) costs more compute and time. At Uber scale, dropping recall from 99% to 95% saved ~40ms P95 latency. That 40ms difference affected driver-matching UX. The decision to accept lower recall was a product call, not an engineering one — but it reads like a purely technical optimization.',
      },
      {
        heading: 'What PMs should extract from every infra post',
        body: 'Ask three questions: (1) What was the metric being optimized, and who decided it mattered? (2) What was explicitly de-prioritized — and why was that acceptable? (3) What would have broken if the system had to operate at 2x or 0.5x scale? The answers reveal the product bets buried inside the engineering choices.',
      },
      {
        heading: 'The pattern',
        body: "Engineering blogs are written to explain how, not why. The why — the PM decision — is usually the most interesting part. When Uber chose approximate over exact search, they were betting that 95% recall was good enough for driver-matching. That's a defensible bet. But it's a bet. Read every infra post looking for the implicit bets. That's where the PM insight lives.",
      },
    ],
    takeaway: "Next time you read an engineering blog, find the implicit acceptance criteria. What precision/recall/latency threshold was chosen, and who signed off on that threshold? That's the PM decision. Everything else is implementation.",
  },
  {
    slug: 'llm-feature-not-product',
    title: "Why Your LLM Feature Isn't a Product",
    label: '002 — Product Strategy',
    desc: "A GPT-4 wrapper is not a strategy. Most AI features fail not because the model is wrong, but because there's no feedback loop and no defensible wedge.",
    img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=640&q=80',
    status: 'live',
    readTime: '8 min read',
    publishDate: 'Feb 2025',
    tags: ['LLM', 'Product Strategy', 'AI'],
    tldr: "Wrapping GPT-4 in a UI is not a product. A product has a feedback loop that makes it better over time, a wedge competitors can't easily replicate, and a clear theory of why users come back. Most AI features have none of these.",
    sections: [
      {
        heading: 'The wrapper trap',
        body: "The most common AI product mistake: build a thin UI around a foundation model, ship it, call it a product. It's not. A wrapper has no proprietary data advantage, no feedback loop, and no defensible moat. When the underlying model gets better, your 'product' gets better — but so does every other wrapper.",
      },
      {
        heading: 'What makes an LLM feature a product',
        body: 'Three things: (1) A proprietary data flywheel. Every user interaction generates signal that makes the product better in ways competitors can\'t replicate. (2) A workflow wedge. The feature solves a specific step in a workflow so completely that switching costs are real. (3) A feedback loop that tightens. User behavior improves the output, which improves retention, which generates more signal.',
      },
      {
        heading: 'The test',
        body: "Ask yourself: if OpenAI shipped this exact feature natively in ChatGPT tomorrow, would your users switch? If yes — you have a feature, not a product. If no — you have a wedge. The wedge is what you're actually building. The LLM is infrastructure.",
      },
      {
        heading: 'What to build instead',
        body: "Find the workflow step where AI output needs to be evaluated by someone with context that doesn't live in a prompt. That evaluation — the human judgment call — is where your data flywheel starts. Build around that. The model is a commodity. The accumulated judgment is not.",
      },
    ],
    takeaway: "The LLM is table stakes. The product is the feedback loop you build on top of it. If your AI feature doesn't get measurably better with usage, it's a feature, not a product. Start there.",
  },
  {
    slug: 'embedding-pm-decision',
    title: 'The Hidden PM Decision in Every Embedding Choice',
    label: '003 — AI Infra',
    desc: "When you pick Ada-002 over a fine-tuned model, you're making a product bet on update frequency and acceptable recall thresholds — not a technical choice.",
    img: null,
    status: 'soon',
    readTime: '7 min read',
    publishDate: 'Coming soon',
    tags: ['Embeddings', 'AI Infra', 'PM Decisions'],
    tldr: "Embedding model selection looks like a technical decision. It's actually a product bet on three variables: how often your corpus changes, what recall threshold is acceptable for your use case, and how much inference cost you can absorb. Getting this wrong costs you 6 months of latent retrieval debt.",
    sections: [
      {
        heading: 'Why embedding choice is a product decision',
        body: "Placeholder — this post is coming soon. The argument: Ada-002 vs fine-tuned embeddings is not a question of which model is 'better.' It's a question of update frequency. Fine-tuned models require retraining when your corpus changes. If your corpus updates weekly, you've just created a perpetual ML ops dependency.",
      },
      {
        heading: 'The three variables',
        body: 'Placeholder — update frequency, acceptable recall threshold, and inference cost ceiling. Each one is a product decision masquerading as a model selection problem.',
      },
    ],
    takeaway: "Embedding choice is a PM decision. Treat it like one — define your update frequency, recall floor, and cost ceiling before touching a model card.",
  },
]