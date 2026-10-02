'use client'

import { useEffect, useRef, useState } from 'react'
import { minutesLeft } from './ReadingProgress'

export interface TocItem { id: string; text: string; words: number }

const READ_LINE_PX = 120
const PENCIL_LINE = <svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><path d="M1 6 C 20 2, 45 9, 70 4 S 92 5, 99 3" /></svg>

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

/**
 * In-page index for long articles. Wide screens: a sticky rail of bars sized by each section's length that
 * fill as you read, with the minutes left pencilled underneath. Below 1100px: a collapsible list.
 */
export default function Toc({ items, slug, minutes }: { items: TocItem[]; slug: string; minutes: number }) {
  const [active, setActive] = useState(items[0]?.id ?? '')
  const [left, setLeft] = useState(`${minutes} min left`)
  const fills = useRef<(HTMLElement | null)[]>([])
  const total = items.reduce((n, i) => n + i.words, 0) || 1

  // Current section = the last heading past the reading line. Each bar's fill is how far the reading
  // line has travelled from its heading to the next one (the end of the prose for the last).
  useEffect(() => {
    const heads = items.map(i => document.getElementById(i.id))
    const prose = document.querySelector<HTMLElement>('.ms-body .prose')
    let raf = 0
    const update = () => {
      raf = 0
      const tops = heads.map(h => h?.getBoundingClientRect().top ?? Infinity)
      const bottom = prose?.getBoundingClientRect().bottom ?? Infinity
      tops.forEach((t, i) => {
        const next = tops[i + 1] ?? bottom
        fills.current[i]?.style.setProperty('--f', String(clamp01((READ_LINE_PX - t) / Math.max(1, next - t))))
      })
      const passed = items.filter((_, i) => tops[i] <= READ_LINE_PX)
      setActive((passed[passed.length - 1] ?? items[0])?.id ?? '')
      const max = document.documentElement.scrollHeight - window.innerHeight
      setLeft(minutesLeft(minutes, max > 0 ? window.scrollY / max : 1))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [items, minutes])

  const link = (i: TocItem) => (
    <a href={`#${i.id}`} className={active === i.id ? 'on' : undefined} aria-current={active === i.id ? 'location' : undefined}>{i.text}</a>
  )

  return (
    <>
      <nav className="toc rail" aria-label="Sections in this article">
        <p>{items.length} sections</p>
        <ol>
          {items.map((i, n) => (
            <li
              key={i.id}
              className={active === i.id ? 'on' : undefined}
              style={{ ['--w' as string]: i.words / total, viewTransitionName: `post-seg-${slug}-${n}` }}
            >
              <i ref={el => { fills.current[n] = el }} aria-hidden="true" />
              {link(i)}
            </li>
          ))}
        </ol>
        <p className="pencil" aria-live="off">{left}{PENCIL_LINE}</p>
      </nav>
      <details className="toc-m"><summary>Sections</summary><ol>{items.map(i => <li key={i.id}>{link(i)}</li>)}</ol></details>
    </>
  )
}
