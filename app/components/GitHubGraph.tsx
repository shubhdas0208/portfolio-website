'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { loadContributions } from './useContributions'

export interface ContributionDay { date: string; count: number; level: number }
export interface ContributionData { total: number; weeks: ContributionDay[][] }

const WORDS = ['No contributions', 'A few contributions', 'Some contributions', 'Many contributions', 'Lots of contributions']
// Default card: 10px cells. Full year (About spread): every week of the year as long as cells stay at least 8px.
const SIZES = { card: { cell: 10, gap: 3, label: 36 }, full: { cell: 8, gap: 2, label: 28 } }
const DAY_LABEL = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const MONTH_LABEL = new Intl.DateTimeFormat('en', { month: 'short' })
const DEFAULT_TIP = 'Each square is one day'

interface Props { profileUrl: string; user: string; fullYear?: boolean }

export default function GitHubGraph({ profileUrl, user, fullYear = false }: Props) {
  const [data, setData] = useState<ContributionData | null>(null)
  const [failed, setFailed] = useState(false)
  const [fit, setFit] = useState(53)
  // Hover text is written straight to the DOM: a state update here re-rendered all ~370 cells per mouseover.
  const tipRef = useRef<HTMLSpanElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    // Shared with the Contact GitHub card: one request per page load.
    loadContributions()
      .then(d => { if (!cancelled) setData(d) })
      .catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [])

  // show as many recent weeks as fit the card, no scrollbars
  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const { cell, gap, label } = fullYear ? SIZES.full : SIZES.card
    const measure = () => setFit(Math.max(12, Math.floor((box.clientWidth - label + gap) / (cell + gap))))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    return () => ro.disconnect()
  }, [fullYear])

  const weeks = useMemo(() => (data ? data.weeks.slice(-fit) : []), [data, fit])

  const months = useMemo(() => {
    const out: { col: number; label: string }[] = []
    let lastMonth = -1
    weeks.forEach((week, col) => {
      const first = week[0]
      if (!first) return
      const d = new Date(first.date + 'T00:00:00')
      if (d.getMonth() !== lastMonth) {
        if (col < weeks.length - 2 && !(col === 0 && d.getDate() > 20)) out.push({ col, label: MONTH_LABEL.format(d) })
        lastMonth = d.getMonth()
      }
    })
    return out
  }, [weeks])

  const cells = useMemo(() => weeks.flatMap((week, col) => {
    const byRow: (ContributionDay | undefined)[] = []
    for (const day of week) byRow[new Date(day.date + 'T00:00:00').getDay()] = day
    return Array.from({ length: 7 }, (_, row) => {
      const day = byRow[row]
      if (!day) return <i key={`${col}-${row}`} data-l="-1" style={{ ['--c' as string]: col }} />
      const label = DAY_LABEL.format(new Date(day.date + 'T00:00:00'))
      return <i key={`${col}-${row}`} data-l={day.level} data-d={label} title={`${day.count} ${day.count === 1 ? 'contribution' : 'contributions'} on ${label}`} style={{ ['--c' as string]: col }} />
    })
  }), [weeks])

  return (
    <>
      <p className="lab">
        <span className="gh-total">{data ? <><span className="num">{data.total}</span> contributions in the last year</> : failed ? 'GitHub activity' : 'Loading contributions…'}</span>
        <a href={profileUrl} target="_blank" rel="noopener noreferrer"><span className="gh-long">github.com/{user}</span><span className="gh-short">GitHub</span> ↗</a>
      </p>
      <div className={`gh-scroll${fullYear ? ' gh-full' : ''}`} ref={boxRef}>
        {failed && <p style={{ margin: 0, fontSize: 14, color: 'var(--dim)' }}>The graph didn&apos;t load. Open it on GitHub with the link above.</p>}
        {data && (
          <div className="gh">
            <div className="months">
              {months.map(m => <span key={m.col} style={{ left: `${(m.col / weeks.length) * 100}%` }}>{m.label}</span>)}
            </div>
            <div className="days"><span /><span>Mon</span><span /><span>Wed</span><span /><span>Fri</span><span /></div>
            <div
              className="cells"
              style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
              onMouseOver={e => {
                const el = (e.target as HTMLElement).closest('i[data-d]') as HTMLElement | null
                if (el && tipRef.current) tipRef.current.textContent = `${WORDS[Number(el.dataset.l)]} on ${el.dataset.d}`
              }}
            >
              {cells}
            </div>
          </div>
        )}
      </div>
      <div className="gh-foot">
        <span ref={tipRef}>{DEFAULT_TIP}</span>
        <span className="gh-legend">Less <i style={{ background: 'var(--gh0)' }} /><i style={{ background: 'var(--gh1)' }} /><i style={{ background: 'var(--gh2)' }} /><i style={{ background: 'var(--gh3)' }} /><i style={{ background: 'var(--gh4)' }} /> More</span>
      </div>
    </>
  )
}
