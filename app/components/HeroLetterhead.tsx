import { SOCIALS } from '../lib/site'

// Hero left column: the name set as his own letterhead, a sheet taped to the same surface as the desk.
// Every fact below is published (site.ts LOG and EXPERIENCE, PRODUCT.md). Text is visible on first paint;
// only the rules and the highlight draw in, and only under html.motion-ok (see hero-left.css).

interface Row {
  label: string
  value: string
  detail: string
  live?: boolean
  stack?: boolean
}

const ROWS: Row[] = [
  { label: 'Currently', value: 'Product Manager at Dezerv', detail: 'lending, voice agents', stack: true },
  { label: 'Building', value: 'Voxikin', detail: 'after hours, now', live: true },
  { label: 'Shipped', value: 'ToolMonkey, Filtr', detail: 'case studies below' },
]

const LINKS = [
  { label: 'LinkedIn', href: SOCIALS.linkedin },
  { label: 'X', href: SOCIALS.x },
  { label: 'GitHub', href: SOCIALS.github },
]

export default function HeroLetterhead() {
  return (
    <div className="lh">
      <div className="lh-sheet">
        <span className="lh-tape t1" aria-hidden="true" />
        <span className="lh-tape t2" aria-hidden="true" />

        <h1 className="lh-name"><span className="lh-first">Shubh</span><br />Sankalp Das</h1>

        <p className="lh-meta">
          <span>Bengaluru</span>
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">{l.label} <span aria-hidden="true">↗</span></a>
          ))}
        </p>

        <dl className="lh-rows">
          {ROWS.map((r, i) => (
            <div key={r.label} className={['lh-row', r.live && 'live', r.stack && 'stack'].filter(Boolean).join(' ')} style={{ ['--i' as string]: i }}>
              <dt>{r.live && <i aria-hidden="true" />}{r.label}</dt>
              <dd className="lh-val">{r.live ? <mark>{r.value}</mark> : r.value}</dd>
              <dd className="lh-det">{r.detail}</dd>
            </div>
          ))}
        </dl>

        <div className="hctas lh-ctas">
          <a className="btn" href="#projects">See the builds <span aria-hidden="true">↓</span></a>
          <a className="btn ghost" href="#contact">Let&apos;s talk</a>
        </div>
      </div>

      <p className="lh-hint">
        <i aria-hidden="true" />
        <span className="lh-hint-mouse">Drag anything on the desk. Click to open it.</span>
        <span className="lh-hint-touch">Swipe the desk. Tap anything to open it.</span>
      </p>
    </div>
  )
}
