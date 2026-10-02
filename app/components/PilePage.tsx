import ViewTransitionLink from './ViewTransitionLink'
import type { PileItem } from '../lib/posts'

const ROTATIONS = [0.8, -0.5, 0.4]

/**
 * One page in a pile: shows its dek, and on hover/focus wipes in its pull quote in the same fixed slot.
 * It shares post-paper-{slug} with the article's paper so opening it morphs into the page (unless vt is off
 * because the same slug is already named elsewhere on this page).
 */
export default function PilePage({ item, index, flat, vt = true }: { item: PileItem; index: number; flat?: boolean; vt?: boolean }) {
  const [first, ...rest] = item.kicker.split(' · ')
  return (
    <ViewTransitionLink
      href={item.href}
      className={`pg${flat ? ' flat' : ''}`}
      style={{
        ['--k' as string]: index,
        ['--r' as string]: `${ROTATIONS[index % ROTATIONS.length]}deg`,
        ...(vt ? { viewTransitionName: `post-paper-${item.slug}` } : {}),
      }}
    >
      <p className="pm"><b>{first}</b>{rest.length > 0 && ` · ${rest.join(' · ')}`}</p>
      <h3>{item.title}</h3>
      <div className="sw">
        <p className="dk">{item.dek}</p>
        {item.quote && <p className="pq">“{item.quote}”</p>}
      </div>
    </ViewTransitionLink>
  )
}
