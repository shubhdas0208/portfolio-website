export interface Metric {
  val: string
  label: string
}

export interface BrokeItem {
  id: string
  text: string
}

export interface Tradeoff {
  key: string
  value: string
}

export interface Project {
  slug: string
  title: string
  label: string
  tags: string[]
  filterTags: string[]
  demoImg: string | null
  problem: string
  decision: string
  metrics: Metric[]
  broke: BrokeItem[]
  retro: string
  tradeoffs: Tradeoff[]
}

export const PROJECTS: Project[] = [
  {
    slug: 'rag-filter',
    title: 'RAG-Based Document Filter',
    label: '001 — AI Infra',
    tags: ['AI Infra', 'RAG', 'Tooling', 'OpenAI'],
    filterTags: ['ai-infra'],
    demoImg: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=85',
    problem:
      'Engineers at the company spent <strong>3+ hours per week</strong> manually triaging an internal knowledge base of 400+ documents. Search was keyword-only. Results were irrelevant. People gave up and asked colleagues instead — which scaled poorly. A Slack audit showed 40% of engineering questions had answers in existing docs. Nobody trusted search enough to look.',
    decision:
      'Built a <strong>semantic retrieval pipeline</strong> using OpenAI Ada-002 embeddings + Pinecone + Next.js API layer. Rejected fine-tuning: corpus updates weekly, retraining on every change was untenable. RAG with hot-swappable doc index was the right call. Prototyped cosine similarity with k=5 first — too much noise. Iterated to k=3 with a relevance threshold filter at 0.78.',
    metrics: [
      { val: '70%', label: 'Search time reduction' },
      { val: '< 3s', label: 'P95 retrieval latency' },
      { val: '40%', label: 'Slack support drop' },
    ],
    broke: [
      {
        id: '01',
        text: '<strong>API rate limits on cold burst.</strong> First-batch embedding calls hit OpenAI limits when multiple users queried simultaneously. Fixed with a key pool rotator and request queue.',
      },
      {
        id: '02',
        text: '<strong>Cold-start latency spike.</strong> First request after 10min idle took 4–6s due to Pinecone connection teardown. Fixed with a Vercel cron job that pings the index every 8 minutes.',
      },
      {
        id: '03',
        text: '<strong>k=5 returning irrelevant chunks.</strong> Bottom 2 results consistently eroded trust. Dropped to k=3 with cosine similarity floor of 0.78.',
      },
    ],
    retro:
      "I underestimated how much retrieval quality depended on chunking strategy. Fixed-size 512-token chunks were the default. Semantic chunking — splitting on section headers and paragraph breaks — would have improved recall without touching the retrieval layer. I'd start there next time.",
    tradeoffs: [
      { key: 'Model', value: 'Ada-002. Higher cost than open-source but no infra to manage. At 400 docs, total embedding cost was under $2.' },
      { key: 'DB', value: 'Pinecone over Chroma. Chroma has no managed option — adding ops burden for v1 was wrong.' },
      { key: 'Chunking', value: '512-token fixed chunks. Fast to implement. Would use semantic chunking in v2.' },
      { key: 'Reranking', value: 'No reranker in v1. Would add cross-encoder reranker in v2 to improve precision at k=3.' },
    ],
  },
  {
    slug: 'case-study-2',
    title: '[ Case Study 2 — Consumer AI ]',
    label: '002 — Consumer AI',
    tags: ['Consumer', 'LLM'],
    filterTags: ['consumer'],
    demoImg: null,
    problem: 'Replace with your real problem statement. Who was suffering? What was breaking? What evidence did you have before building anything?',
    decision: 'What did you build, what did you reject, and why this path? Include the model choice and why.',
    metrics: [
      { val: '—', label: 'Metric 1' },
      { val: '—', label: 'Metric 2' },
      { val: '—', label: 'Metric 3' },
    ],
    broke: [{ id: '01', text: 'Replace with honest account of what broke and how you fixed it.' }],
    retro: "What assumption was wrong from the start? Not 'I'd add more features.' Architectural or strategic.",
    tradeoffs: [{ key: 'Decision', value: 'Your real technical tradeoffs.' }],
  },
  {
    slug: 'case-study-3',
    title: '[ Case Study 3 — Fintech ]',
    label: '003 — Fintech',
    tags: ['Fintech', 'Data'],
    filterTags: ['fintech'],
    demoImg: null,
    problem: 'Replace with your Fintech or AI Platform project. Think: reconciliation automation, fraud signal layer, payment intelligence.',
    decision: 'What did you consider and reject? Why this architecture over alternatives?',
    metrics: [
      { val: '—', label: 'Metric 1' },
      { val: '—', label: 'Metric 2' },
      { val: '—', label: 'Metric 3' },
    ],
    broke: [{ id: '01', text: 'What broke in production and how did you fix it?' }],
    retro: 'What would you do differently if you started over today?',
    tradeoffs: [{ key: 'Decision', value: 'Your real tradeoffs here.' }],
  },
  {
    slug: 'case-study-4',
    title: '[ Case Study 4 — Optional ]',
    label: '004 — Optional',
    tags: ['AI Infra', 'Consumer'],
    filterTags: ['ai-infra', 'consumer'],
    demoImg: null,
    problem: 'Only populate this if you can defend every field with real evidence. An empty slot beats a weak case study.',
    decision: 'What did you build and why?',
    metrics: [
      { val: '—', label: 'Metric 1' },
      { val: '—', label: 'Metric 2' },
      { val: '—', label: 'Metric 3' },
    ],
    broke: [{ id: '01', text: 'What broke?' }],
    retro: 'What would you change?',
    tradeoffs: [{ key: 'Decision', value: 'Tradeoffs.' }],
  },
]