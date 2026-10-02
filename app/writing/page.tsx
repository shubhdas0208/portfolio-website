import type { Metadata } from 'next'
import Link from 'next/link'
import PostSheet from '../components/PostSheet'
import PilePage from '../components/PilePage'
import DraftCard from '../components/DraftCard'
import Footer from '../components/Footer'
import { getDrafts, getLead, getPublished, postToPile, tagSlug } from '../lib/posts'

export const metadata: Metadata = {
  title: 'All blogs · Shubh Sankalp Das',
  description: 'Essays on the product decisions inside engineering.',
}

/** "All blogs": the same paper world as the home desk, with tag chips read from ?tag=. */
export default function WritingIndex({ searchParams }: { searchParams: { tag?: string } }) {
  const published = getPublished()
  const lead = getLead()
  const active = searchParams.tag ?? ''
  const tags = Array.from(published.reduce((m, p) => (p.tag ? m.set(p.tag, (m.get(p.tag) ?? 0) + 1) : m), new Map<string, number>()))
  const activeTag = tags.find(([t]) => tagSlug(t) === active)?.[0]
  // Without a tag filter the lead already sits on the desk above, so the year list leaves it out.
  const list = published.filter(p => (activeTag ? p.tag === activeTag : p !== lead))
  const years = Array.from(new Set(list.map(p => p.created_at.slice(0, 4))))

  return (
    <main id="content" className="widx band-sand">
      <div className="wrap an">
        <Link className="back" href="/#writing">← Home</Link>
        <h1>All blogs</h1>
        {lead && !activeTag && <div className="wdesk solo"><PostSheet post={lead} level={2} /></div>}
        {tags.length > 1 && (
          <nav className="chips" aria-label="Filter by tag">
            <Link href="/writing" aria-current={!activeTag ? 'page' : undefined}>All <span>{published.length}</span></Link>
            {tags.map(([t, n]) => (
              <Link key={t} href={`/writing?tag=${tagSlug(t)}`} aria-current={activeTag === t ? 'page' : undefined}>{t} <span>{n}</span></Link>
            ))}
          </nav>
        )}
        {active && !activeTag && <p className="empty">Nothing is tagged “{active}” yet. <Link href="/writing">Show all blogs</Link></p>}
        {years.map(y => (
          <section key={y} className="year">
            <h2>{y}</h2>
            <div className="grid">
              {list.filter(p => p.created_at.startsWith(y)).map((p, i) => (
                <PilePage key={p.slug} item={postToPile(p)} index={i} flat vt={!!activeTag || p !== lead} />
              ))}
            </div>
          </section>
        ))}
        {!activeTag && getDrafts().map(d => <DraftCard key={d.slug} post={d} />)}
      </div>
      <Footer />
    </main>
  )
}
