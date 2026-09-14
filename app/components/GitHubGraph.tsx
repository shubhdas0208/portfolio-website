'use client'

import { useEffect, useRef, useState } from 'react'

export interface ContributionDay { date: string; count: number; level: number }
export interface ContributionData { total: number; weeks: ContributionDay[][] }

const WORDS = ['No contributions', 'A few contributions', 'Some contributions', 'Many contributions', 'Lots of contributions']
const CELL = 10
const GAP = 3
const LABEL_COL = 36

export default function GitHubGraph({ profileUrl, user }: { profileUrl: string; user: string }) {
  const [data, setData] = useState<ContributionData | null>(null)
  const [failed, setFailed] = useState(false)
  const [fit, setFit] = useState(53)
  const [tip, setTip] = useState('Hover a day')
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/github')
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: ContributionData) => { if (!cancelled) setData(d) })
      .catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [])

  // show as many recent weeks as fit the card, no scrollbars
  useEffect(() => {
    const box = boxRef.current
    if (!box) return
    const measure = () => setFit(Math.max(12, Math.floor((box.clientWidth - LABEL_COL + GAP) / (CELL + GAP))))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    return () => ro.disconnect()
  }, [])

  const weeks = data ? data.weeks.slice(-fit) : []
  const months: { col: number; label: string }[] = []
  let lastMonth = -1
  weeks.forEach((week, col) => {
    const first = week[0]
    if (!first) return
    const d = new Date(first.date + 'T00:00:00')
    if (d.getMonth() !== lastMonth) {
      if (col < weeks.length - 2 && !(col === 0 && d.getDate() > 20)) months.push({ col, label: d.toLocaleString('en', { month: 'short' }) })
      lastMonth = d.getMonth()
    }
  })

  return (
    <>
      <p className="lab">
        <span className="gh-total">{data ? <><span className="num">{data.total}</span> contributions in the last year</> : failed ? 'GitHub activity' : 'Loading contributions…'}</span>
        <a href={profileUrl} target="_blank" rel="noopener noreferrer"><span className="gh-long">github.com/{user}</span><span className="gh-short">GitHub</span> ↗</a>
      </p>
      <div className="gh-scroll" ref={boxRef}>
        {failed && <p style={{ margin: 0, fontSize: 14, color: 'var(--dim)' }}>Couldn&apos;t load the graph right now. See it on GitHub.</p>}
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
                if (el) setTip(`${WORDS[Number(el.dataset.l)]} on ${el.dataset.d}`)
              }}
            >
              {weeks.flatMap((week, col) =>
                Array.from({ length: 7 }, (_, row) => {
                  const day = week.find(d => new Date(d.date + 'T00:00:00').getDay() === row)
                  if (!day) return <i key={`${col}-${row}`} data-l="-1" style={{ ['--c' as string]: col }} />
                  const label = new Date(day.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  return <i key={`${col}-${row}`} data-l={day.level} data-d={label} title={`${day.count} on ${label}`} style={{ ['--c' as string]: col }} />
                }),
              )}
            </div>
          </div>
        )}
      </div>
      <div className="gh-foot">
        <span>{tip}</span>
        <span className="gh-legend">Less <i style={{ background: 'var(--gh0)' }} /><i style={{ background: 'var(--gh1)' }} /><i style={{ background: 'var(--gh2)' }} /><i style={{ background: 'var(--gh3)' }} /><i style={{ background: 'var(--gh4)' }} /> More</span>
      </div>
    </>
  )
}
