// AUTO-GENERATED from the former Supabase tables, then hand-owned.
// This file is now the single source of truth for site content.
// To change what the site shows, edit the values below and redeploy.

/** Reading annotations shared by essays and case studies. Every string is verbatim from body. */
export interface Annotated {
  /** mark is a substring of text that gets the marker sweep. */
  pull_quote?: { text: string; mark?: string }
  /** Margin notes beside the lines they quote. The first 3 also show on the home sheet and the article header. */
  notes?: { label: string; line: string }[]
  /** Further lines that get the marker sweep as they are read. Keep it to a handful per piece. */
  highlights?: string[]
}

export interface Post extends Annotated {
  id: string
  slug: string
  title: string
  summary: string
  tag: string | null
  body: string | null
  reading_time: string | null
  cover_image_url?: string | null
  hero_image_url?: string | null
  coming_soon?: boolean
  is_published: boolean
  created_at: string
  updated_at?: string
  /** Leads the home Writing desk; otherwise the newest post leads. */
  pinned?: boolean
  /** Short standfirst for pile pages; falls back to summary. */
  dek?: string
}

export interface Project extends Annotated {
  id: string
  slug: string
  title: string
  summary: string
  tags: string[]
  body: string | null
  cover_image_url?: string | null
  diagram_url?: string | null
  live_url?: string | null
  coming_soon?: boolean
  is_published: boolean
  created_at: string
  updated_at?: string
  label?: string
}

export interface Book {
  id: number
  title: string
  author: string
  cover_url: string
  note: string
  display_order: number
  is_active?: boolean
}

export interface NowData {
  id: number
  building: string
  reading: string
  thinking: string
  thinking_2: string
  thinking_3: string
  obsessing: string
  obsessing_label: string
  obsessing_image_url: string
  updated_at: string
}

// Published posts, newest first.
export const POSTS: Post[] = [
  {
    "id": "8d52441f-3631-4fc6-84fd-7b4a797053bb",
    "slug": "p99-is-a-ux-metric",
    "pinned": true,
    "pull_quote": { "text": "This is why Uber did not optimize for average latency. They optimized for the tail. Because the tail is where trust breaks.", "mark": "Because the tail is where trust breaks." },
    "notes": [
      { "label": "The number", "line": "P99 latency under 100ms at 2,000 queries per second." },
      { "label": "Said 3 times", "line": "That is a product decision." },
      { "label": "The ask", "line": "That decision is yours to make. Not the engineers'." },
      { "label": "The reframe", "line": "It sounds like an infrastructure constraint. It is not." },
      { "label": "The math", "line": "At 2,000 queries per second, that 1% is 20 users every second." },
      { "label": "The mechanism", "line": "The slowest server determines the final response time." },
      { "label": "The cascade", "line": "That one decision cascaded into every architectural choice downstream." }
    ],
    "highlights": [
      "It is a product decision about what reliability means for a specific user in a specific moment.",
      "A 250ms result that stutters does not feel slow. It feels unreliable.",
      "Smarter search introduced a new category of failure that keyword search never had.",
      "Each one was actually a tradeoff with a product consequence.",
      "The more useful question is: what did the product team decide to treat as non-negotiable?",
      "That is a product stance, written in infrastructure."
    ],
    "title": "P99 is a UX Metric. Uber Just Hid It in an SLO.",
    "summary": "Uber's billion-scale vector search wasn't an AI story. It was a product team deciding what \"reliable\" means at 11pm in the rain.",
    "tag": "LLM Infrastructure",
    "body": "## The Setup\n\nUber published an engineering post about scaling vector search to a billion data points using OpenSearch. The technical execution is impressive. But the product decision buried inside it is more interesting than the architecture.\n\nThey set a target: P99 latency under 100ms at 2,000 queries per second.\n\nMost PMs read that and move on. It sounds like an infrastructure constraint. It is not. It is a product decision about what reliability means for a specific user in a specific moment.\n\n## What P99 Actually Measures\n\nP99 means 99% of users get search results in under 100ms. The other 1% wait longer.\n\nAt 2,000 queries per second, that 1% is 20 users every second. At Uber's scale, across millions of daily searches, that number compounds fast.\n\nNow add context. A user searching for a cab at 11pm in the rain, running late for a flight, or trying to get home after a concert is not in a forgiving state. A 250ms result that stutters does not feel slow. It feels unreliable. One stalled booking in that moment changes how the product feels for that user permanently.\n\nThis is why Uber did not optimize for average latency. They optimized for the tail. Because the tail is where trust breaks.\n\n## The System Got Smarter. Then It Got Unpredictable.\n\nUber moved from keyword search to vector search. Instead of matching \"cheap cab to airport\" literally, the system now understands that \"affordable ride to terminal\" means the same thing. Genuinely useful upgrade.\n\nBut vector search is approximation. It uses a graph of similar data points where the nearest neighbor is the most relevant result. When you distribute that graph across machines, three things happen:\n\nEvery request splits across servers. The slowest server determines the final response time. Background indexing competes with live user traffic for memory.\n\nThis is latency variability. And it is a direct product of making the system more intelligent.\n\nThe engineers called it the Straggler Effect. Nine nodes returning results in 50ms and one node taking 180ms means your P99 is effectively 180ms. Not because the system is broken. Because distributed systems have noise.\n\nThe product implication: improving system intelligence increased complexity, and complexity increased unpredictability. Smarter search introduced a new category of failure that keyword search never had.\n\n## The Decisions That Were Actually Product Decisions\n\nUber made a series of tuning choices to get from P99 at 250ms down to P99 at 100ms. Each one looks like a configuration change. Each one was actually a tradeoff with a product consequence.\n\n**Replicas over cost.** Adding more replica copies of each data shard meant queries could be routed to the fastest available copy instead of waiting for a slow one. This smoothed out the Straggler Effect. It also increased memory cost. Someone decided reliability was worth that cost. That is a product decision.\n\n**K value over recall.** K is the number of nearest neighbors the system retrieves. Higher K means better search quality, more relevant results, fewer misses. It also increases latency. Uber tested the tradeoff and found latency increased only marginally with higher K. They accepted the cost. That is a product decision.\n\n**Blue/Green clusters over simplicity.** Rather than reindex on the live cluster and risk latency spikes during updates, Uber ran two separate clusters. One serves traffic. One rebuilds the index in isolation. When the new index is ready, traffic switches instantly. This decoupled indexing from serving entirely. It added operational complexity. Someone decided stability under update was non-negotiable. That is a product decision.\n\n## What PMs Miss When They Read Infrastructure Posts\n\nThe question most PMs ask when reading something like this is: what did the engineers build?\n\nThe more useful question is: what did the product team decide to treat as non-negotiable?\n\nUber decided that tail latency, not average latency, was the reliability metric that mattered. That one decision cascaded into every architectural choice downstream. The replica strategy, the memory allocation, the Blue/Green deployment, the refresh rate tuning all of it follows from that single upstream product constraint.\n\nP99 under 100ms was not handed to the engineering team as a technical requirement. Someone decided that a user booking a ride in a high-stakes moment deserved the same experience as a user browsing casually on a Tuesday afternoon. That is a product stance, written in infrastructure.\n\n## The Takeaway\n\nThe next time you read an engineering post about latency optimization, look for the number they chose to optimize for and ask why that number.\n\nIt will almost always trace back to a specific user, a specific moment, and a decision someone made about what that user deserved.\n\nThat decision is yours to make. Not the engineers'.",
    "reading_time": "6 min read",
    "is_published": true,
    "created_at": "2026-03-28T20:24:42.499932+00:00",
    "updated_at": "2026-03-28T20:24:42.499932+00:00",
    "coming_soon": false,
    "cover_image_url": "/images/blog/p99-is-a-ux-metric-cover.webp",
    "hero_image_url": "/images/blog/p99-is-a-ux-metric-hero.webp"
  },
  {
    "id": "e052ba9c-f159-410b-ba3a-661820b2480c",
    "slug": "ads-personalization-sequential-modelling",
    "title": "Ads Personalization with Sequential Modeling and Hetero-MMoE at Uber",
    "summary": "",
    "tag": null,
    "body": null,
    "reading_time": null,
    "is_published": true,
    "created_at": "2026-03-28T10:42:36.070437+00:00",
    "updated_at": "2026-03-28T10:42:36.070437+00:00",
    "coming_soon": true,
    "cover_image_url": null,
    "hero_image_url": null
  }
]

// Published projects, newest first.
export const PROJECTS: Project[] = [
  {
    "id": "0eece75d-74e2-494d-b9f2-a59d09d0cb2c",
    "slug": "toolmonkey-chaos-agent",
    "pull_quote": { "text": "Task completion rate is a vanity metric for agents. An agent that finishes every task but uses garbage data on 1 in 4 runs is not reliable. It is dangerous.", "mark": "Task completion rate is a vanity metric for agents." },
    "notes": [
      { "label": "The result", "line": "the agent completed 100% of tasks while only detecting 33% of injected failures and silently failing 25% of the time." },
      { "label": "The rule", "line": "Fake deterministic tools are a feature, not a limitation." },
      { "label": "The process", "line": "Pre-defined metrics force you to measure what matters, not what flatters." },
      { "label": "The question", "line": "does anyone do this for LLM agents?" },
      { "label": "The target", "line": "Silent Failure Rate has a target of below 10%." },
      { "label": "The guardrail", "line": "always run git diff --staged before every commit" },
      { "label": "In hindsight", "line": "In retrospect I would have built the base adapter and one implementation first, validated the interface, and then built the remaining four." }
    ],
    "highlights": [
      "Most teams discover their agent failure modes through production incidents, not through testing.",
      "The entire value of ToolMonkey comes from controlled, reproducible failure injection.",
      "It is the most dangerous metric because it is the one the user never sees.",
      "The lesson is that regional API restrictions are a real infrastructure risk that does not appear in API documentation.",
      "The insight was documented as a finding, not patched away.",
      "A comparison over time is what turns ToolMonkey from an interesting experiment into a tool people come back to."
    ],
    "title": "ToolMonkey: Chaos Monkey for LLM Tool-Calling Agents",
    "summary": "Built a reliability testing framework that injects deterministic failures into LLM agent tool calls and measures exactly how your agent breaks before it reaches production.",
    "tags": [
      "AgentEval",
      "LLM",
      "FastAPI",
      "Python",
      "Reliability Testing"
    ],
    "body": "## Problem\n\nEvery team building an LLM agent eventually hits the same wall in production. A tool times out and the agent keeps going with no data. A tool returns a plausible but wrong answer and the agent uses it confidently. A tool returns malformed JSON and the agent either crashes or quietly hallucates a response. The agent completes the task and the user gets a confident, completely wrong answer.\n\nThere is no standard way to test agent reliability before shipping. Unit tests check that tools work. They do not check what the agent does when tools fail. Most teams discover their agent failure modes through production incidents, not through testing.\n\nI was reading about Netflix's Chaos Monkey, their system for deliberately breaking production infrastructure to find weaknesses before they become outages. The question I could not stop thinking about was: does anyone do this for LLM agents? I built ToolMonkey to answer that question.\n\n## Decision\n\nThe core idea is to create a controlled simulation environment where an AI agent is given tasks that require tool calls, but the tools are rigged to fail in four deterministic ways. The system then measures how the agent behaves under each failure mode and produces a structured reliability report.\n\n**What I built in V1:** A backend simulation engine with 6 fake deterministic tools (search, calculator, database, weather, summarizer, code execution), 4 failure injection modes, a Groq-orchestrated agent loop, a 4-metric eval scoring system, and a 3-screen Next.js frontend. 15 predefined task scenarios with known correct answers so the system can score not just behavior but correctness.\n\n**What I built in V2:** A provider-agnostic adapter layer so users can plug in their own model and API key. Instead of testing ToolMonkey's internal Groq agent, users can now stress-test their own model (OpenAI, Anthropic, Gemini, DeepSeek, Groq) against the same 15 scenarios and get a reliability report on their specific configuration. A compare mode lets you run two models side by side on identical test conditions and see the reliability delta.\n\n**What I rejected:**\n\nReal tool integrations were considered and dropped. Real APIs are non-deterministic, rate-limited, and require secrets management. The entire value of ToolMonkey comes from controlled, reproducible failure injection. If tools are real, you cannot guarantee a specific failure mode fires on every run. Fake deterministic tools are a feature, not a limitation.\n\nPer-chunk LLM tagging for failure categorization was also considered. The simpler approach of pre-constructed failure strings injected before the agent sees the tool response turned out to be more reliable and faster, with no additional API calls at ingestion time.\n\n## System Architecture\n\n![ToolMonkey System Architecture](/images/projects/toolmonkey-chaos-agent-diagram.webp)\n\nThe system has four main layers.\n\n**Failure injection layer:** When a tool call is made, the failure engine intercepts the response before the agent sees it. In V1 this is a middleware intercept. In V2, failure strings are pre-constructed and injected directly into the normalized response. Four modes are available: timeout (15 second delay), wrong answer (plausible but incorrect data), malformed JSON (broken or incomplete response structure), and silent failure (empty string or null response).\n\n**Orchestration layer:** A Groq Llama 3.3 70B agent receives the task, selects which tool to call, processes the (potentially corrupted) response, decides whether to retry or flag uncertainty, and synthesizes a final answer. The agent loop is intentionally not hardened, which is the point. You want to observe default behavior, not behavior that has been manually patched to handle failures.\n\n**Eval layer:** Four metrics were defined in writing before a single line of scorer code was written. Task Completion Rate measures whether the agent produced a usable final answer. Failure Detection Rate measures whether the agent explicitly noticed that a tool failed. Retry Efficiency measures whether retries actually led to recovery. Silent Failure Rate measures whether the agent produced a confident answer using bad or missing data without flagging anything. Silent Failure Rate has a target of below 10%. It is the most dangerous metric because it is the one the user never sees.\n\n**Adapter layer (V2):** An abstract base class defines the interface all providers must implement: translate_request(), translate_response(), get_provider_name(). Five adapters are built: Groq, OpenAI, Anthropic, Gemini, DeepSeek. Each handles the provider-specific authentication format, request schema, and response parsing. A key validation endpoint fires a minimal real API call to confirm the user's key works before running a full simulation.\n\n**Key pool management:** All internal API calls rotate across multiple keys from separate accounts using a KeyPoolManager singleton. Round-robin rotation with a 65 second cooldown on 429 responses. The critical rule: multiple keys from the same account share the same quota pool and provide zero benefit. Every key must come from a separate account.\n\n## Technical Choices\n\n**Groq Llama 3.3 70B as the orchestrator.** The original design used Gemini. Mid-build, it became clear that Gemini's free tier returns limit: 0 on all models for India-based accounts. This is a regional restriction, not a rate limit. All four Gemini keys across four separate accounts hit the same wall simultaneously. Groq was switched in as the orchestrator with no architecture changes because the direct REST pattern was already in place. The adapter layer in V2 was partially motivated by this experience: never hardcode a single provider into the core flow.\n\n**Direct REST over SDK.** Every API call in the codebase uses requests.post() directly, not any provider SDK. This was the lesson carried forward from Filtr. SDKs add version compatibility coupling and can route through gRPC in ways that make debugging harder. REST calls are explicit, debuggable, and provider-portable.\n\n**Metrics defined before scorer code.** This was a deliberate process constraint. The four metrics and their formulas were written down and agreed on before eval/scorer.py was created. The reason is that post-hoc metric design is biased toward metrics that make the system look good. Pre-defined metrics force you to measure what matters, not what flatters.\n\n**Semantic evaluator with majority vote.** V2 added a Groq-based semantic evaluator that uses three separate LLM calls to judge whether a failure was detected, then takes the majority vote. One call is not sufficient because LLM judgment on edge cases is noisy. Three calls with majority vote reduces variance meaningfully.\n\n**Session-only key handling.** User keys in V2 are never stored. They travel with the request, are used for the duration of the simulation, and are discarded. This was both a privacy decision and a practical one: storing user API keys requires auth, encryption, and key management infrastructure that is out of scope for V1.\n\n## Metrics\n\nV1 results on scenario C1 (What is 847 multiplied by 23?) across all four failure modes:\n\n| Failure Mode | Completion | Detection | Silent Failure | Retries |\n|---|---|---|---|---|\n| none | 100% | N/A | 0% | 0 |\n| wrong_answer | 100% | 0% (MISSED) | 0% | 0 |\n| malformed_json | 100% | 0% (MISSED) | 0% | 0 |\n| silent_failure | 100% | 100% | 25% | 2 |\n\nAggregate Health Score: 72.5 out of 100 (Amber zone)\n\nThe result that validated the entire project: the agent completed 100% of tasks while only detecting 33% of injected failures and silently failing 25% of the time. Task completion rate is a vanity metric for agents. An agent that finishes every task but uses garbage data on 1 in 4 runs is not reliable. It is dangerous.\n\n## What Broke\n\n**The Gemini regional quota wall.** This was the single most disruptive problem in the build. The original architecture had Gemini as the orchestrator. Four keys across four separate Google accounts were set up. All four returned limit: 0 simultaneously. This is not a rate limit that resets. It is a regional restriction applied to all India-based accounts across all models. The entire orchestration layer had to be rebuilt around Groq in the middle of Day 1.\n\nThe lesson is not \"use Groq instead of Gemini.\" The lesson is that regional API restrictions are a real infrastructure risk that does not appear in API documentation. Any system designed around a single provider's free tier for a specific region is fragile. The V2 adapter layer is the architectural response to this: no single provider is load-bearing.\n\n**The security incident.** An env.txt file with real API keys was accidentally staged for commit. GitHub's push protection caught it before the push completed. All Groq and Cohere keys were rotated immediately. Gemini keys were not in the file and were not exposed.\n\nThe root cause was creating env.txt as a scratch file while setting up the environment, then accidentally staging it with git add. The guardrail added after: always run git diff --staged before every commit and scan for gsk_, AIza, or any real key string pattern.\n\n**UptimeRobot sending HEAD requests.** The initial /health endpoint only accepted GET. UptimeRobot's free tier sends HEAD requests for its monitoring pings. FastAPI returned 405 Method Not Allowed, UptimeRobot marked the service as down, and the Render instance started spinning down between pings. Fixed by changing the route decorator to accept both GET and HEAD: @app.api_route('/health', methods=['GET', 'HEAD']).\n\n**Malformed JSON not being detected.** The wrong_answer and malformed_json failure modes both showed 0% failure detection in testing. The agent received a response with no result field and hallucinated a correct-looking answer rather than flagging the missing data. This was not a bug in the failure injection. It was the expected behavior of an unhardened agent, which is exactly what ToolMonkey is supposed to surface. The insight was documented as a finding, not patched away.\n\n## Retrospective\n\nThe most important decision I made was defining the four eval metrics before writing the scorer. It sounds like a minor process detail but it completely changed what got measured. In every AI project I have seen, metrics get defined after the system is built, which means they get defined around what the system already does well. Defining them first means measuring what actually matters for production reliability, including metrics that make the system look bad.\n\nThe V2 adapter layer was the right architectural call but it was also the most time-consuming part of the build. Each provider has a different authentication scheme, request format, and response structure. Anthropic uses an x-api-key header. Gemini uses a query parameter. OpenAI and DeepSeek share a schema but DeepSeek has reasoning model variants that need special handling. Building five adapters that all conform to the same abstract interface took significant time. In retrospect I would have built the base adapter and one implementation first, validated the interface, and then built the remaining four.\n\nIf I were starting V3 today, the first thing I would add is score history with timestamped runs. The current architecture produces a score and discards it. The most valuable thing for a builder is not their score on a single run but how their score changes as they modify their agent. A comparison over time is what turns ToolMonkey from an interesting experiment into a tool people come back to.",
    "cover_image_url": "/images/projects/toolmonkey-chaos-agent-cover.webp",
    "diagram_url": "/images/projects/toolmonkey-chaos-agent-diagram.webp",
    "is_published": true,
    "created_at": "2026-03-28T09:56:32.154882+00:00",
    "updated_at": "2026-03-28T09:56:32.154882+00:00",
    "live_url": "https://toolmonkey.vercel.app",
    "coming_soon": false
  },
  {
    "id": "cb96e258-1b55-4a83-8fa5-9d2da25bf2d0",
    "slug": "filtr-rag-pm-tool",
    "pull_quote": { "text": "When designing against rate limited free APIs, model the worst case request cascade, not individual call counts.", "mark": "model the worst case request cascade, not individual call counts." },
    "notes": [
      { "label": "The user", "line": "I was the user. I built Filtr to solve it." },
      { "label": "The fix", "line": "Upload time dropped from ~3 minutes to ~10 seconds." },
      { "label": "The cost", "line": "What should have been a 2 hour feature became a 2 day infrastructure problem." },
      { "label": "The pain", "line": "Product managers at startups spend 3 to 6 hours every week doing the same thing manually" },
      { "label": "The hypothesis", "line": "a PM can ask natural language questions and get sourced, synthesized answers in under 3 minutes, without reading anything manually." },
      { "label": "The tradeoff", "line": "k-means on embeddings degrades on noisy informal language" },
      { "label": "Still open", "line": "The product decision I'm most uncertain about: the 4-query cap." }
    ],
    "highlights": [
      "The output is a mental model that lives in their head, is non-reproducible, and disappears when they leave the company.",
      "Nothing cross-references all three sources semantically.",
      "The PM sees \"Mobile Checkout Failures: 7 mentions (5 Jira, 2 Slack)\" before typing a single query.",
      "The riskiest assumption in V2 was cluster trust: would PMs act on auto generated cluster names without manual synthesis?",
      "Design the rate limit architecture first, before writing a single line of feature code.",
      "I was flying blind on what users actually did in the product."
    ],
    "title": "Filtr: RAG-Based Insight Engine for Product Managers",
    "summary": "Built and shipped a hosted RAG tool that turns Slack exports, Jira CSVs, and call transcripts into ranked, auto-clustered user insights. No SQL, no manual synthesis.",
    "tags": [
      "RAG",
      "LLM",
      "FastAPI",
      "Pinecone",
      "Python"
    ],
    "body": "## Problem\n\nProduct managers at startups spend 3 to 6 hours every week doing the same thing manually: reading through Slack threads, scanning Jira boards, and skimming call transcripts to figure out what users are actually complaining about. The output is a mental model that lives in their head, is non-reproducible, and disappears when they leave the company.\n\nThe tools that exist don't help. Jira search is keyword-only. Slack search has no cross-channel synthesis. Gong and Chorus are transcript-only and expensive. Nothing cross-references all three sources semantically.\n\nThe specific pain: a PM opens their tools on Monday morning and has no fast, reliable way to answer \"what is my top user problem this quarter across all channels?\" They have to read everything. Every time.\n\nI was the user. I built Filtr to solve it.\n\n## Decision\n\nThe core hypothesis: if you embed multi-source PM data into a shared vector space and run semantic search over it, a PM can ask natural language questions and get sourced, synthesized answers in under 3 minutes, without reading anything manually.\n\n**What I built in V1:** A hosted upload-and-query RAG tool. Upload Slack exports (JSON), Jira exports (CSV), and call transcripts (TXT/PDF). Ask natural language questions. Get answers with source attribution showing which file and which chunk each insight came from.\n\n**What I built in V2:** The Insight Engine. Instead of waiting for the PM to know what to ask, Filtr automatically clusters the uploaded data into the top 5 issue themes after every upload, ranked by mention count, with source breakdown (Slack / Jira / Transcript). The PM sees \"Mobile Checkout Failures: 7 mentions (5 Jira, 2 Slack)\" before typing a single query.\n\n**What I rejected:**\n\nPer-chunk LLM tagging at ingestion was the obvious alternative for clustering. Tag every chunk with an issue category using an LLM call, then aggregate counts. I rejected it because at Gemini free tier (15 RPM), tagging 300 chunks from a real upload would take 20+ minutes. It also scales linearly with data size and provides no meaningful advantage over embedding based clustering for distinct issue themes. The tradeoff accepted: k-means on embeddings degrades on noisy informal language (Slack casual messages) where semantically similar content uses very different phrasing. Acceptable for MVP. Source aware clustering (separate k-means per source type, then merge) is scoped for V2.1.\n\n## System Architecture\n\n![Filtr System Architecture](/images/projects/filtr-rag-pm-tool-diagram.webp)\n\nThe architecture has three layers:\n\n**Ingestion layer:** FastAPI backend receives uploaded files. Three parsers handle Slack (message level chunking), Jira (ticket level chunking), and transcripts (300-token chunks with 50-token overlap). All chunks are embedded in a single batch call to `gemini-embedding-001` (768 dims) via direct REST, not the SDK. Vectors are stored in Pinecone with metadata: source_type, session_id, original_text.\n\n**Query layer:** On query, the user's question is embedded using the same model with `taskType: retrieval_query`. Top 20 candidates retrieved from Pinecone by cosine similarity. Cohere Rerank (`rerank : english v3.0`) rescores the candidates for relevance to the specific query. Top 5 reranked chunks passed to GroQ (Llama 3.3 70B) for answer generation. Answer is grounded: the prompt instructs the model to answer only from retrieved chunks and say so explicitly if they don't contain the answer.\n\n**Clustering layer:** After ingestion, a separate `/insights` endpoint runs k means (k=5, scikit learn) on all session vectors fetched from Pinecone. Three representative chunks per cluster (closest to centroid) are passed in a single LLM call to GroQ for cluster naming. Cluster names, mention counts, and source breakdowns are returned as structured JSON.\n\n**Rate limit management:** All three API providers (Gemini, GroQ, Cohere) are managed through a `KeyPoolManager` singleton. Round robin key rotation across 4 Gemini keys and 3 GroQ keys from separate accounts. On 429, the key is put on 65 second cooldown and the next available key is used immediately. This was the critical infrastructure that made the free tier architecture viable at any real load.\n\n## Technical Choices\n\n**Gemini `gemini embedding 001` for embeddings, GroQ Llama 3.3 70B for generation.** Originally everything was Gemini. The rate limit problem forced a split: Gemini's free tier at 15 RPM meant embedding + cluster naming + query answering all firing within seconds would exhaust quota and push `/insights` past Render's 30 second response timeout (resulting in 502s). Separating embedding (Gemini) from generation (GroQ) meant two independent rate limit pools. GroQ's free tier is generous on tokens and has effectively no RPM limit at this scale.\n\n**Direct REST over SDK.** The `google generativeai` SDK routes through gRPC and has version compatibility issues that caused silent failures. Both `text embedding 004` and `gemini 1.5 flash` were retired in early February 2026 mid build. Direct REST calls via `requests` are explicit, debuggable, and not tied to SDK version. Every API call in the codebase uses `requests.post()` directly.\n\n**Batch embeddings.** The first version of `embed_texts()` called the Gemini API once per chunk in a sequential loop. For a 30 chunk upload (small), that was 30 sequential API calls taking ~3 minutes. Switched to `batchEmbedContents`: one API call for all chunks regardless of count. Upload time dropped from ~3 minutes to ~10 seconds.\n\n**Cohere reranking.** Cosine similarity alone was producing \"no context found\" responses on valid queries because the top 8 candidates by cosine score weren't always the most contextually relevant. Adding a reranking pass with Cohere's `rerank english v3.0` model re scores top 20 cosine candidates for query relevance. Retrieval quality improved meaningfully on edge cases.\n\n**Session based ephemeral architecture.** No user accounts. No persistent storage. Every upload generates a session_id. Pinecone vectors tagged with that session_id. 4 query cap per session enforced in memory. This kept the architecture simple, avoided auth complexity entirely, and is appropriate for a tool where users upload their own proprietary PM data; they likely don't want it persisted.\n\n## Metrics\n\nV1 targets (measured on beta cohort with mock data):\n\n| Metric | Target | Result |\n|--------|--------|--------|\n| Retrieval Relevance Score | >80% chunks rated relevant | Validated on 4 test queries with mock data |\n| Time to First Insight | <3 minutes upload to first result | ~45 seconds on warm backend |\n| Session Completion Rate | >60% complete 3+ queries | Confirmed on internal testing |\n\nV2 targets:\n\n| Metric | Target |\n|--------|--------|\n| Cluster Name Accuracy | >75% rated useful via thumbs up |\n| Time to First Cluster | <90 seconds post upload |\n| Query volume per session | +20% vs V1 baseline |\n\nThe riskiest assumption in V2 was cluster trust: would PMs act on auto generated cluster names without manual synthesis? This was the primary thing being tested in beta.\n\n## What Broke\n\n**The Gemini 15 RPM wall.** This was the biggest architectural failure of the build. I designed the system with a single Gemini API key handling embeddings, cluster naming, and query answering. In production, a single upload triggering all three sequentially would exhaust the 15 RPM quota. The cluster naming LLM call would hit a 429, wait 30 seconds, retry, and push the total `/insights` response time past Render's 30 second timeout. The result: a 502 error on the most important new feature of V2, every time.\n\nThe fix required a full task split architecture redesign: Gemini handles only embeddings, GroQ handles all generation. Plus the `KeyPoolManager` for round robin rotation across 4 Gemini keys and 3 GroQ keys from separate accounts. What should have been a 2 hour feature became a 2 day infrastructure problem.\n\n**Root cause I missed at design time:** I had accounted for the 15 RPM limit in isolation for each task but not for the compounded rate across tasks that fire sequentially within the same request cycle. The batch embeddings fix helped (30 calls → 1 call) but didn't fully solve it because cluster naming and query answering each still consume RPM after the embedding call.\n\n**Lesson:** When designing against rate limited free APIs, model the worst case request cascade, not individual call counts.\n\n**The React StrictMode double invoke.** In development, React 18 StrictMode double invokes effects. Two `/insights` fetch calls fired on every upload. The first returned empty clusters (Pinecone hadn't finished indexing), the `.finally()` set `insightsLoading(false)`, and the second returned correct data but the state update was getting overwritten in the race. Cluster cards showed nothing despite correct API responses. Fixed with a 2 second setTimeout before the fetch to ensure Pinecone indexing completes, and local state tracking instead of relying on backend counters for the query cap.\n\n**API keys auto revoked twice.** The Gemini API key appeared in the browser's Network tab during local development. Google auto revokes keys detected in browser accessible network traffic. The fix was restricting the key to `generativelanguage.googleapis.com` in Google AI Studio and being more careful about dev tools. Lost half a day to this twice.\n\n**PowerShell encoding corruption.** Every time I used PowerShell to write Python files with Unicode characters (em dashes, box-drawing chars in comments), the file got corrupted with `â€\"` and `â\"€` byte sequences. Spent significant time chasing bugs that turned out to be encoding artifacts. Rule established: never use PowerShell to write Python files. Use Python to write Python.\n\n## Retrospective\n\n**What I'd do differently:**\n\nDesign the rate limit architecture first, before writing a single line of feature code. The 15 RPM wall was knowable at day one I knew the limit existed, I just underestimated the compounded impact of sequential API calls within a single request. The entire `KeyPoolManager` infrastructure, the Gemini/GroQ task split, and two days of debugging could have been avoided with 30 minutes of upfront capacity planning.\n\nThe session based ephemeral architecture was the right call for V1. But I'd add a lightweight analytics layer from day one, not for users, for me. Knowing which queries were firing, which clusters were getting thumbs-up, and where sessions were dropping off would have made V2 scoping decisions much faster. I was flying blind on what users actually did in the product.\n\nBatch embeddings should have been the default from the start. Sequential-per-chunk was the naive first implementation. The performance difference (3 minutes vs 10 seconds) is significant enough that it should have been in the original design, not a hotfix after seeing users wait.\n\nThe product decision I'm most uncertain about: the 4-query cap. It prevents abuse on the free API pool, which was necessary, but it also caps the most valuable thing Filtr can do -- the more you query, the more signal you extract. If I were building V3, I'd replace the hard cap with a soft nudge and move toward authenticated accounts with per-user quota management.",
    "cover_image_url": "/images/projects/filtr-rag-pm-tool-cover.webp",
    "diagram_url": "/images/projects/filtr-rag-pm-tool-diagram.webp",
    "is_published": true,
    "created_at": "2026-03-28T09:10:59.809511+00:00",
    "updated_at": "2026-03-28T09:10:59.809511+00:00",
    "live_url": "https://filtr-omega.vercel.app",
    "coming_soon": false
  },
  {
    "id": "522fb115-d3ba-4430-b4d6-1d06b3cb3ab2",
    "slug": "voice-agent-eval",
    "title": "AI Voice Agent with Eval Framework",
    "summary": "Building a reliability testing framework for voice AI agents evaluation layer, failure modes, and production readiness scoring.",
    "tags": [
      "VoiceAI",
      "AgentEval",
      "LLM",
      "Python"
    ],
    "body": "COMING SOON",
    "cover_image_url": null,
    "diagram_url": null,
    "is_published": true,
    "created_at": "2024-01-01T00:00:00+00:00",
    "updated_at": "2026-03-28T10:23:08.284682+00:00",
    "live_url": null,
    "coming_soon": true
  }
]

// Active books, in display order.
export const BOOKS: Book[] = [
  {
    "id": 1,
    "title": "India that is Bharat",
    "author": "Jai Sai Deepak",
    "cover_url": "/images/books/india-that-is-bharat.webp",
    "display_order": 1,
    "is_active": true,
    "note": "Reinterprets India’s history through a civilizational lens"
  },
  {
    "id": 2,
    "title": "Sapiens",
    "author": "Yuval Noah Harari",
    "cover_url": "/images/books/sapiens.webp",
    "display_order": 2,
    "is_active": true,
    "note": "How shared myths shape institutions and human cooperation"
  },
  {
    "id": 3,
    "title": "Principles of Building AI Agents",
    "author": "Sam Bhagwat",
    "cover_url": "/images/books/principle-of-building-ai.webp",
    "display_order": 3,
    "is_active": true,
    "note": "Intro guide to designing and scaling AI systems"
  }
]

// Single 'now' record.
export const NOW: NowData = {
  "id": 1,
  "building": "Voice Agent Eval Framework",
  "reading": "Sapiens by Yuval Noah Harari",
  "thinking": "Control vs Capability :\r\nAs intelligence scales, will alignment keep pace or will systems outgrow oversight?",
  "updated_at": "2026-03-27T17:39:29.902959+00:00",
  "obsessing": "Optimization under uncertainty at 300 km/h",
  "obsessing_label": "F1: Race Strategy",
  "obsessing_image_url": "/images/now/obsessing.avif",
  "thinking_2": "Autonomy Thresholds :\r\nWhen do agents require less oversight than humans and what happens when that happens?",
  "thinking_3": ""
}
