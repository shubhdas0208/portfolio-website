'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { usePrefersReducedMotion, useVisibleLoop } from '../lib/hooks'
import FitStage from './FitStage'

interface Mode { name: string; tool: string; agent: string; missed: boolean }

// Verdicts follow the V1 results on scenario C1 in the ToolMonkey case study.
const MODES: Mode[] = [
  { name: 'wrong_answer', tool: '19,841', agent: 'answered 19,841, no flag', missed: true },
  { name: 'malformed_json', tool: '{"res": 1948', agent: 'answered, no flag', missed: true },
  { name: 'silent_failure', tool: '(empty)', agent: 'flagged missing data', missed: false },
]

const STEP = { inject: 0, answer: 520, verdict: 1040 }
const ROW_AT = [400, 1750, 3100]
const GAUGE_AT = 4500
const STAMP_AT = 5500
const SHAKE_MS = 550
const LOOP_MS = 9500
const TRACK_PX = 420
const SCORE = 72.5

const wrench = <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />

export default function ToolMonkeyReport() {
  const ref = useRef<HTMLDivElement>(null)
  const paper = useRef<HTMLDivElement>(null)
  const rows = useRef<(HTMLDivElement | null)[]>([])
  const timers = useRef<number[]>([])
  const running = useRef(false)
  const reduced = usePrefersReducedMotion()
  const [counts, setCounts] = useState(false)

  useEffect(() => { setCounts(typeof CSS !== 'undefined' && 'registerProperty' in CSS) }, [])

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const rowEls = () => rows.current.filter((r): r is HTMLDivElement => !!r)

  const cycle = useCallback(() => {
    const p = paper.current
    if (!p || !running.current) return
    clear()
    rowEls().forEach(r => r.classList.remove('inj', 'ans', 'vrd'))
    p.classList.remove('g', 'st', 'shake')
    ROW_AT.forEach((base, i) => {
      later(() => rows.current[i]?.classList.add('inj'), base + STEP.inject)
      later(() => rows.current[i]?.classList.add('ans'), base + STEP.answer)
      later(() => rows.current[i]?.classList.add('vrd'), base + STEP.verdict)
    })
    later(() => p.classList.add('g'), GAUGE_AT)
    later(() => p.classList.add('st', 'shake'), STAMP_AT)
    later(() => p.classList.remove('shake'), STAMP_AT + SHAKE_MS)
    later(cycle, LOOP_MS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // The first frame is the finished report; the loop replays it from the first failure.
  const start = useCallback(() => {
    running.current = true
    if (!timers.current.length) later(cycle, LOOP_MS - STAMP_AT)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle])
  const stop = useCallback(() => { running.current = false; clear() }, [])
  useVisibleLoop(ref, start, stop, !reduced)
  useEffect(() => stop, [stop])

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const p = paper.current
    if (!p || reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 2 - 1
    const y = ((e.clientY - r.top) / r.height) * 2 - 1
    p.style.transform = `perspective(900px) rotateY(${(x * 3).toFixed(2)}deg) rotateX(${(-y * 3).toFixed(2)}deg)`
  }
  const onLeave = () => { if (paper.current) paper.current.style.transform = '' }
  const replay = (i: number) => {
    const r = rows.current[i]
    if (reduced || !r || !r.classList.contains('vrd')) return
    r.classList.remove('inj', 'ans', 'vrd')
    void r.offsetWidth
    r.classList.add('inj')
    later(() => r.classList.add('ans'), 260)
    later(() => r.classList.add('vrd'), 600)
  }

  return (
    <div ref={ref} role="img" aria-label="Animated ToolMonkey reliability report: three injected tool failures, two missed by the agent and one caught, with a health score of 72.5, amber">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="tr-ink" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="8" result="t" />
          <feColorMatrix in="t" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -9 5.4" result="holes" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="3" result="d" />
          <feComposite in="d" in2="holes" operator="in" />
        </filter>
      </svg>
      <FitStage w={560} h={440}>
        <div className="tr" onPointerMove={onMove} onPointerLeave={onLeave}>
          <div ref={paper} className={`tr-paper g st${counts ? ' cnt' : ''}`} style={{ ['--tw' as string]: `${TRACK_PX}px` } as CSSProperties}>
            <div className="tr-hd">
              <div><b>ToolMonkey</b><small>Reliability report</small></div>
              <span className="sc">Scenario C1<br />What is 847 × 23?</span>
            </div>
            {MODES.map((m, i) => (
              <div key={m.name} ref={el => { rows.current[i] = el }} className="tr-row inj ans vrd" onPointerEnter={() => replay(i)}>
                <span className="chip"><svg viewBox="0 0 24 24" aria-hidden="true">{wrench}</svg>{m.name}</span>
                <div className="ln2">
                  <span><em>tool</em><b>{m.tool}</b></span>
                  <span className={m.missed ? 'bad' : ''}><em>agent</em><b>{m.agent}</b></span>
                </div>
                <span className={`vd ${m.missed ? 'miss' : 'hit'}`}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">{m.missed ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M20 6 9 17l-5-5" />}</svg>
                  {m.missed ? 'MISSED' : 'CAUGHT'}
                </span>
              </div>
            ))}
            <div className="tr-gz">
              <div className="gl"><span>Health score</span><b><span className="v">{SCORE}</span> <span className="zone">AMBER</span></b></div>
              <div className="track"><span className="mark" /></div>
            </div>
            <div className="tr-stamp"><span className="ring" /><span><b>{SCORE}</b><i>AMBER</i></span></div>
          </div>
        </div>
      </FitStage>
    </div>
  )
}
