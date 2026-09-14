'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { EXPERIENCE } from '../lib/site'

const HEADER_H = 72
const NAV_H = 100
const INTENT_MS = 160
const GLIDE_LOCK_MS = 900

export default function Experience() {
  const ixRef = useRef<HTMLDivElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const floatRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(0)
  const [hot, setHot] = useState<number | null>(null)
  const [card, setCard] = useState<number | null>(null)
  const openRef = useRef(0)
  const intent = useRef(0)
  const lockUntil = useRef(0)
  const pointer = useRef<[number, number] | null>(null)

  const centre = useCallback((i: number) => {
    const row = rowRefs.current[i]
    if (!row) return
    const btn = row.querySelector('button') as HTMLElement
    const inner = row.querySelector('.more > div') as HTMLElement
    const height = btn.offsetHeight + inner.scrollHeight
    const top = row.getBoundingClientRect().top + window.scrollY
    const room = window.innerHeight - HEADER_H - NAV_H
    const y = height <= room ? top + height / 2 - (HEADER_H + room / 2) : top - HEADER_H - 12
    lockUntil.current = performance.now() + GLIDE_LOCK_MS
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: Math.max(0, y), behavior: reduced ? 'instant' : 'smooth' })
  }, [])

  const openRow = useCallback((i: number) => {
    const current = openRef.current
    if (current === i) { centre(i); return }
    const row = rowRefs.current[i]
    if (!row) return
    // a row above closes instantly and the scroll is offset in the same frame, so nothing jumps
    if (current >= 0 && current < i) {
      const above = rowRefs.current[current]
      const before = row.getBoundingClientRect().top
      const more = above?.querySelector('.more') as HTMLElement | null
      if (more) more.style.transition = 'none'
      above?.classList.remove('open')
      const shift = row.getBoundingClientRect().top - before
      if (shift) window.scrollBy({ top: shift, behavior: 'instant' })
      requestAnimationFrame(() => { if (more) more.style.transition = '' })
    }
    openRef.current = i
    setOpen(i)
    requestAnimationFrame(() => centre(i))
  }, [centre])

  const updateCard = useCallback(() => {
    const p = pointer.current, ix = ixRef.current, fl = floatRef.current
    if (!p || !ix || !fl) { setCard(null); return }
    const hit = document.elementFromPoint(p[0], p[1])
    const row = hit?.closest('.ixr') as HTMLElement | null
    const idx = row ? rowRefs.current.indexOf(row as HTMLDivElement) : -1
    if (idx < 0 || idx !== openRef.current || !window.matchMedia('(hover: hover)').matches) { setCard(null); return }
    const box = ix.getBoundingClientRect()
    fl.style.left = `${Math.max(0, Math.min(box.width - 300, p[0] - box.left + 28))}px`
    fl.style.top = `${p[1] - box.top}px`
    setCard(idx)
  }, [])

  useEffect(() => {
    const onScroll = () => { if (pointer.current) updateCard() }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(intent.current) }
  }, [updateCard])

  const shownCard = card !== null ? EXPERIENCE[card] : null

  return (
    <section className="sec wrap" id="experience">
      <h2 className="h2">Where I&apos;ve <em>worked.</em></h2>
      <div
        ref={ixRef}
        className={`ix${hot !== null ? ' hovering' : ''}`}
        onPointerMove={e => { pointer.current = [e.clientX, e.clientY]; updateCard() }}
        onPointerLeave={() => { clearTimeout(intent.current); pointer.current = null; setHot(null); setCard(null) }}
      >
        {EXPERIENCE.map((company, i) => (
          <div
            key={company.id}
            id={`experience-${company.id}`}
            ref={el => { rowRefs.current[i] = el }}
            className={`ixr${open === i ? ' open' : ''}${hot === i ? ' hot' : ''}`}
            onPointerMove={e => {
              // only real mouse movement counts; content gliding under a still cursor must not open rows
              if (e.pointerType !== 'mouse' || (!e.movementX && !e.movementY)) return
              if (hot !== i) setHot(i)
              clearTimeout(intent.current)
              if (openRef.current !== i) {
                intent.current = window.setTimeout(() => {
                  if (performance.now() < lockUntil.current) return
                  openRow(i)
                }, INTENT_MS)
              }
            }}
          >
            <button
              type="button"
              aria-expanded={open === i}
              aria-controls={`experience-${company.id}-details`}
              onClick={() => { if (openRef.current === i) { openRef.current = -1; setOpen(-1) } else openRow(i) }}
              onFocus={() => { if (openRef.current !== i) openRow(i) }}
            >
              <span className="nmx">{company.name}<sup>{company.years}</sup></span>
              <span className="side"><b>{company.metric}</b>{company.summary}</span>
            </button>
            <div className="more" id={`experience-${company.id}-details`}>
              <div>
                <div className="roles">
                  {company.roles.map(role => (
                    <div className="role" key={role.title}>
                      <h4>{role.title} <small>{role.meta}</small></h4>
                      <ul>
                        {role.bullets.map(b => <li key={b.lead}><strong>{b.lead}</strong>{b.rest}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={floatRef} className={`float${shownCard ? ' on' : ''}`} aria-hidden="true">
          <small>{shownCard?.summary}</small>
          <b>{shownCard?.metric}</b>
          <span>{shownCard?.metricCaption}</span>
        </div>
      </div>
    </section>
  )
}
