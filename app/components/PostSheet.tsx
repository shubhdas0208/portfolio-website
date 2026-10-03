import Link from 'next/link'
import type { Post } from '../lib/content'
import ViewTransitionLink from './ViewTransitionLink'
import { LEAD_NOTES, monthYear, sections, tagSlug } from '../lib/posts'

const ARROW = <svg viewBox="0 0 26 18" aria-hidden="true"><path d="M2 14 C 8 4, 16 4, 24 9 M20 5 L24 9 L19 11" /></svg>

/**
 * The lead essay as an annotated sheet: verbatim pull quote with a marker sweep, section ruler, margin notes.
 * Sheet, title, ruler segments and notes share view-transition names with the post page, so opening it
 * morphs this paper into the article (vt off where the same post is already named on the page).
 */
export default function PostSheet({ post, pinned, vt = true, level = 3 }: { post: Post; pinned?: boolean; vt?: boolean; level?: 2 | 3 }) {
  const H = level === 2 ? 'h2' : 'h3'
  const href = `/writing/${post.slug}`
  const parts = sections(post.body)
  const quote = post.pull_quote
  const notes = (post.notes ?? []).slice(0, LEAD_NOTES)
  const name = (part: string) => (vt ? { viewTransitionName: `post-${part}-${post.slug}` } : undefined)
  const [before, after] = quote?.mark ? quote.text.split(quote.mark) : [quote?.text ?? '', '']

  return (
    <article className={`sheet${notes.length ? '' : ' no-notes'}`} style={name('paper')}>
      <div className="main">
        <p className="meta">
          {post.tag && <Link href={`/writing?tag=${tagSlug(post.tag)}`}><b>{post.tag}</b></Link>} · {monthYear(post.created_at)}
          {pinned && <span className="pinned">Pinned</span>}
        </p>
        <H style={name('title')}><ViewTransitionLink href={href}>{post.title}</ViewTransitionLink></H>
        {quote
          ? <blockquote>{before}{quote.mark && <mark>{quote.mark}</mark>}{after}</blockquote>
          : <blockquote className="dek">{post.dek ?? post.summary}</blockquote>}
        {parts.length > 0 && (
          <div className="ruler">
            <div className="rlab"><span>{post.reading_time}</span><span>{parts.length} sections</span></div>
            <ol style={{ ['--n' as string]: parts.length }}>
              {parts.map((s, i) => (
                <li key={s.id} style={{ ['--i' as string]: i, ...(vt ? { viewTransitionName: `post-seg-${post.slug}-${i}` } : {}) }}>
                  <Link href={`${href}#${s.id}`} aria-label={`Section: ${s.text}`}><span>{s.text}</span></Link>
                </li>
              ))}
            </ol>
          </div>
        )}
        <div className="act">
          <ViewTransitionLink className="btn" href={href}>Read the blog →</ViewTransitionLink>
          {parts.length > 0 && <small>Each bar is a section. Pick one to jump in.</small>}
        </div>
      </div>
      {notes.length > 0 && (
        <aside className="margin" aria-label="Margin notes" style={name('notes')}>
          {notes.map((n, i) => (
            <div key={n.label} className="note" style={{ ['--i' as string]: i }}>
              {ARROW}
              <b>{n.label}</b>
              <p>{n.line}</p>
            </div>
          ))}
        </aside>
      )}
    </article>
  )
}
