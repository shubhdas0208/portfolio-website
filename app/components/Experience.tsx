'use client'

import '../binder.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import { EXPERIENCE, type Company } from '../lib/site'
import SectionHeader from './SectionHeader'
import BinderPage from './BinderPage'

/** The reading line: a page is current while it crosses the band 40% to 45% down the viewport. */
const READING_LINE = '-40% 0px -55% 0px'

const firstYear = () => {
  const years = EXPERIENCE.map(c => parseInt(c.years.match(/'(\d\d)/)?.[1] ?? '', 10)).filter(n => !Number.isNaN(n))
  return years.length ? 2000 + Math.min(...years) : null
}

/** "PM" for a full-time role, "Intern" for an internship, in role order without repeats. */
const badges = (c: Company) => Array.from(new Set(c.roles.map(r => (/full-time/i.test(r.meta) ? 'PM' : 'Intern'))))

const MARK = (
  <svg className="mark" viewBox="0 0 12 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 2l7 5-7 5" /></svg>
)

/**
 * Experience as an open ring binder: a contents sheet on the left that stays in view (sticky inside the
 * binder only) and the company pages on the right, which scroll with the page. Nothing pins.
 */
export default function Experience() {
  const binderRef = useRef<HTMLDivElement>(null)
  const floatRef = useRef<HTMLDivElement>(null)
  const pointer = useRef<[number, number] | null>(null)
  const [active, setActive] = useState(0)
  const [card, setCard] = useState<number | null>(null)
  const since = firstYear()

  // Current contents row: the page crossing the reading line.
  useEffect(() => {
    const box = binderRef.current
    if (!box) return
    const pages = Array.from(box.querySelectorAll<HTMLElement>('.bd-pg'))
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const i = pages.indexOf(e.target as HTMLElement)
        if (i >= 0) setActive(i)
      })
    }, { rootMargin: READING_LINE })
    pages.forEach(p => io.observe(p))
    return () => io.disconnect()
  }, [])

  // Hover card: the one biggest result of the company whose contents row is under the cursor (mouse devices only).
  const updateCard = useCallback(() => {
    const p = pointer.current, box = binderRef.current, fl = floatRef.current
    if (!p || !box || !fl || !window.matchMedia('(hover: hover)').matches) { setCard(null); return }
    const row = document.elementFromPoint(p[0], p[1])?.closest('[data-row]') as HTMLElement | null
    const idx = row ? Number(row.dataset.row) : -1
    if (idx < 0) { setCard(null); return }
    const r = box.getBoundingClientRect()
    fl.style.left = `${Math.max(0, Math.min(r.width - 300, p[0] - r.left + 28))}px`
    fl.style.top = `${p[1] - r.top}px`
    setCard(idx)
  }, [])

  useEffect(() => {
    const onScroll = () => { if (pointer.current) updateCard() }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [updateCard])

  const shownCard = card !== null ? EXPERIENCE[card] : null

  return (
    <section className="band" id="experience">
      <div className="sec wrap sec-headonly">
        <SectionHeader
          id="experience"
          label="Experience"
          variant="sm"
          title="Product work, measured."
          meta={[`${EXPERIENCE.length} companies${since ? ` · ${since} to now` : ''}`, 'Full-time and internships']}
        />
      </div>
      <div className="wrap bd-wrap">
        <div
          ref={binderRef}
          className="bd"
          onPointerMove={e => { pointer.current = [e.clientX, e.clientY]; updateCard() }}
          onPointerLeave={() => { pointer.current = null; setCard(null) }}
        >
          <div className="bd-cover" aria-hidden="true" />
          <nav className="toc" aria-label="Companies">
            <header><b>Contents</b><small>{EXPERIENCE.length} companies</small></header>
            <ol>
              {EXPERIENCE.map((c, i) => (
                <li key={c.id}>
                  <a
                    href={`#experience-${c.id}`}
                    data-row={i}
                    className={i === active ? 'on' : undefined}
                    aria-current={i === active ? 'location' : undefined}
                    onClick={() => setActive(i)}
                  >
                    {MARK}
                    <span className="n">{c.name}{badges(c).map(b => <em key={b}>{b}</em>)}</span>
                    <span className="m">{c.metric}</span>
                    <span className="y">{c.years}</span>
                    <span className="k">{c.metricCaption}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="bd-pages">
            <span className="bd-plate" aria-hidden="true" />
            {EXPERIENCE.map(c => <BinderPage key={c.id} c={c} />)}
          </div>
          <div ref={floatRef} className={`float${shownCard ? ' on' : ''}`} aria-hidden="true">
            <small>{shownCard?.summary}</small>
            <b>{shownCard?.metric}</b>
            <span>{shownCard?.metricCaption}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
