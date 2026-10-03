'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { istTime } from '../lib/hooks'

const TICK_MS = 30_000
const LAP_SHOW_MS = 3000

/** "Currently" ticker for the About header: known facts only, plus the Bengaluru clock with a sweeping dial. */
export function CurrentlyTicker({ facts }: { facts: string[] }) {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(istTime())
    tick()
    const id = window.setInterval(tick, TICK_MS)
    return () => window.clearInterval(id)
  }, [])
  const items = [...facts, `Bengaluru ${time || '--:--'} IST`]
  const track = items.map((f, i) => <span key={i} className="tk-item">{f}</span>)
  return (
    <div className="ticker" aria-label={`Currently: ${items.join('. ')}`}>
      <span className="dial" aria-hidden="true"><i /></span>
      <div className="tk-mask" aria-hidden="true">
        <div className="tk-track">{track}{track}</div>
      </div>
    </div>
  )
}

/** How I work: three habits, each tied to the work that shows it. */
export function HowIWork() {
  const items = [
    { habit: 'Ask users first', link: 'Portfolio Snapshot', href: '#experience-dezerv' },
    { habit: 'Break it before users do', link: 'ToolMonkey', href: '/projects/toolmonkey-chaos-agent' },
    { habit: 'Watch the tail, not the average', link: 'P99 is a UX Metric', href: '/writing/p99-is-a-ux-metric' },
  ]
  return (
    <>
      <p className="lab">How I work</p>
      <ol className="hiw">
        {items.map(it => (
          <li key={it.habit}>
            <b>{it.habit}</b>
            {it.href.startsWith('#') ? <a href={it.href}>{it.link} →</a> : <Link href={it.href}>{it.link} →</Link>}
          </li>
        ))}
      </ol>
    </>
  )
}

const fmt = (ms: number) => {
  const s = ms / 1000
  return `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, '0')}`
}

/** F1 tile toy: tap to start a lap, tap again to set it. Three sector bars fill in sequence on hover. */
export function LapTimer() {
  const [state, setState] = useState<'idle' | 'running' | 'done'>('idle')
  const [ms, setMs] = useState(0)
  const start = useRef(0)
  const raf = useRef(0)
  const hide = useRef(0)

  useEffect(() => () => { cancelAnimationFrame(raf.current); clearTimeout(hide.current) }, [])

  const tap = () => {
    if (state === 'running') {
      cancelAnimationFrame(raf.current)
      setMs(performance.now() - start.current)
      setState('done')
      hide.current = window.setTimeout(() => setState('idle'), LAP_SHOW_MS)
      return
    }
    clearTimeout(hide.current)
    start.current = performance.now()
    setState('running')
    const loop = () => { setMs(performance.now() - start.current); raf.current = requestAnimationFrame(loop) }
    raf.current = requestAnimationFrame(loop)
  }

  return (
    <div className="lap">
      <span className="sectors" aria-hidden="true"><i /><i /><i /></span>
      <span className="clock num">{state === 'done' ? `Your lap ${fmt(ms)}` : fmt(ms)}</span>
      <span className="sr" aria-live="polite">{state === 'done' ? `Your lap: ${fmt(ms)}` : ''}</span>
      <button type="button" onClick={tap}>{state === 'running' ? 'Stop the lap' : 'Start a lap'}</button>
    </div>
  )
}
