import Link from 'next/link'
import '../writing-bg.css'
import SectionHeader from './SectionHeader'
import PostSheet from './PostSheet'
import PilePage from './PilePage'
import DraftCard from './DraftCard'
import { getDraft, getDrafts, getLead, getPile, getPublished, postToPile, showsAllLink } from '../lib/posts'

/**
 * Thinking in public: the lead essay as an annotated sheet on a desk. While it is the only post,
 * its cover peeks from under the sheet; once more posts ship they form a pile beside it.
 */
const GUTTER_LINES = 30

export default function Writing() {
  const published = getPublished()
  const drafts = getDrafts()
  const lead = getLead()
  const pile = getPile()
  const draft = getDraft()
  const total = published.length

  return (
    <section className="band band-sand" id="writing">
      <svg className="wdeco" viewBox="0 0 1280 760" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <text className="q" x="1010" y="420">“</text>
        <path className="sw" strokeWidth="26" d="M60 712 C 260 690, 470 724, 690 700 S 980 690, 1080 706" />
        <path className="sw sw2" strokeWidth="14" d="M110 738 C 330 726, 560 748, 820 732" />
        <circle className="ring" cx="1180" cy="600" r="70" />
        {/* proofreading marks in the open spaces: delete loop, stet, paragraph, spell out, margin bracket, close up */}
        <g className="proof">
          <path d="M470 96 C 492 70, 520 70, 528 92 C 534 110, 512 118, 504 104 C 498 92, 520 82, 540 96 L 560 116" />
          <path d="M606 116 L 618 92 L 630 116" /><text x="604" y="84" fontSize="22">stet</text>
          <path d="M600 124 h36" strokeDasharray="3 4" />
          <text x="702" y="118" fontSize="44">¶</text>
          <circle cx="806" cy="100" r="18" /><text x="794" y="107" fontSize="21">sp</text>
          <path d="M1240 236 c 14 0 14 10 14 24 v 120 c 0 12 4 18 14 20 c -10 2 -14 8 -14 20 v 120 c 0 14 0 24 -16 24" />
          <path d="M440 668 c 30 -26 60 26 90 0 s 60 26 90 0" />
          <path d="M666 654 l 14 14 l 14 -14" /><text x="700" y="668" fontSize="20">close up</text>
        </g>
      </svg>
      <div className="wlines" aria-hidden="true">
        {Array.from({ length: GUTTER_LINES }, (_, i) => <i key={i} className={(i + 1) % 5 ? undefined : 'k'}>{i + 1}</i>)}
      </div>
      <div className="sec wrap an">
        <SectionHeader
          id="writing"
          label="Blogs"
          variant="md"
          title="Thinking in public."
          meta={[`${total} published${drafts.length ? ` · ${drafts.length} in draft` : ''}`, 'Essays on the product decisions inside engineering']}
          aside={showsAllLink() ? (
            <>
              <b>{`${total} published${drafts.length ? ` · ${drafts.length} in draft` : ''}`}</b>
              <span>Essays on the product decisions inside engineering</span>
              <Link className="all" href="/writing">All blogs ({total}) →</Link>
            </>
          ) : undefined}
        />
        {lead && (
          <div className={`wdesk${pile.length ? ' has-pile' : ''}`}>
            {pile.length === 0 && lead.cover_image_url && (
              <Link className="wcover" href={`/writing/${lead.slug}`} tabIndex={-1} aria-hidden="true">
                <img src={lead.cover_image_url} alt="" loading="lazy" />
              </Link>
            )}
            {pile.length === 0 && draft && <DraftCard post={draft} />}
            <PostSheet post={lead} pinned={!!lead.pinned && published.length > 1} />
            {pile.length > 0 && (
              <aside className="rail" aria-label="More blogs">
                <p className="rl"><span>Also on the desk</span><i>each page shows its pull quote</i></p>
                <div className="pile">{pile.map((p, i) => <PilePage key={p.slug} item={postToPile(p)} index={i} />)}</div>
                {draft && <DraftCard post={draft} />}
              </aside>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
