import { POSTS, PROJECTS, type Annotated, type Post, type Project } from './content'

const PILE_SIZE = 3
const HOME_MAX_POSTS = 4
const WORDS_PER_MINUTE = 230
const SHORT_SECTION_LABEL = 24
/** Notes beyond this many appear only beside their paragraphs, not on the home sheet or article header. */
export const LEAD_NOTES = 3

export const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const tagSlug = (tag: string) => slugify(tag)
export const readMinutes = (text: string) => Math.max(3, Math.round(text.split(/\s+/).length / WORDS_PER_MINUTE))
export const monthYear = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })

const byNewest = (a: { created_at: string }, b: { created_at: string }) => b.created_at.localeCompare(a.created_at)

export const getPublished = () => POSTS.filter(p => p.is_published && !p.coming_soon && p.body).sort(byNewest)
export const getDrafts = () => POSTS.filter(p => p.coming_soon)
export const getDraft = () => getDrafts()[0] ?? null
export const getCaseStudies = () => PROJECTS.filter(p => p.is_published && !p.coming_soon && p.body).sort(byNewest)

/** Lead = the pinned post, else the newest. */
export const getLead = () => {
  const published = getPublished()
  return published.find(p => p.pinned) ?? published[0] ?? null
}

/** The next posts after the lead, for the pile beside it on the home desk. */
export const getPile = (n = PILE_SIZE) => {
  const lead = getLead()
  return getPublished().filter(p => p !== lead).slice(0, n)
}

export const showsAllLink = () => getPublished().length > HOME_MAX_POSTS

/** One page on a pile: an essay or a case study, in the shape PilePage renders. */
export interface PileItem { slug: string; href: string; kicker: string; title: string; dek: string; quote?: string }

export const postToPile = (p: Post): PileItem => ({
  slug: p.slug,
  href: `/writing/${p.slug}`,
  kicker: [p.tag, monthYear(p.created_at), p.reading_time].filter(Boolean).join(' · '),
  title: p.title,
  dek: p.dek ?? p.summary,
  quote: p.pull_quote?.text,
})

export const projectToPile = (p: Project): PileItem => {
  const [name, subtitle] = p.title.split(': ')
  return {
    slug: p.slug,
    href: `/projects/${p.slug}`,
    kicker: `Case study · ${readMinutes(p.body ?? '')} min read`,
    title: name,
    dek: subtitle ?? p.summary,
    quote: p.pull_quote?.text,
  }
}

export interface Section { id: string; text: string; words: number; start: number }

/** Article sections from "## " headings, with the ids the article renders, their length and where they start. */
export const sections = (body: string | null): Section[] => {
  if (!body) return []
  const heads = Array.from(body.matchAll(/^##\s+(.+)$/gm))
  return heads.map((m, i) => {
    const start = m.index ?? 0
    const end = heads[i + 1]?.index ?? body.length
    return { id: slugify(m[1]), text: m[1].replace(/[*_`]/g, ''), words: body.slice(start, end).split(/\s+/).length, start }
  })
}

/** The section a verbatim line first appears in, labelled by heading when short, else by ordinal plus its opening words. */
export const sectionOf = (body: string, line: string): { id: string; label: string } | null => {
  const at = body.indexOf(line)
  const all = sections(body)
  const i = all.findLastIndex(s => s.start <= at)
  if (at < 0 || i < 0) return null
  return { id: all[i].id, label: all[i].text.length <= SHORT_SECTION_LABEL ? all[i].text : `section ${i + 1}, ${all[i].text.split(' ').slice(0, 3).join(' ')}` }
}

/** How many times a line appears in a text. */
export const countOf = (text: string, line: string) => text.split(line).length - 1

/** Every quoted excerpt must appear word for word in its source, so no page ever misquotes. */
export function assertExcerpts(items: (Annotated & { slug: string; body: string | null })[] = [...POSTS, ...PROJECTS]) {
  for (const p of items) {
    const body = p.body ?? ''
    const fail = (what: string) => { throw new Error(`[posts] ${p.slug}: ${what} is not a verbatim substring of the body`) }
    if (p.pull_quote) {
      if (!body.includes(p.pull_quote.text)) fail('pull_quote.text')
      if (p.pull_quote.mark && !p.pull_quote.text.includes(p.pull_quote.mark)) fail('pull_quote.mark')
    }
    for (const n of p.notes ?? []) if (!body.includes(n.line)) fail(`note "${n.label}"`)
    for (const h of p.highlights ?? []) if (!body.includes(h)) fail(`highlight "${h.slice(0, 40)}"`)
  }
}

if (process.env.NODE_ENV !== 'production') assertExcerpts()
