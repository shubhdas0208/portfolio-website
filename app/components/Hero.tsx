'use client'

import '../hero-left.css'
import { useEffect, useRef } from 'react'
import { useVisibleLoop } from '../lib/hooks'
import DeskObject from './DeskObject'
import HeroLetterhead from './HeroLetterhead'

const DESK_W = 728
const DESK_H = 604
const WAVE_BARS = 6
const noop = () => {}

// Filtr notes: only the sources are real labels; the top-ranked note carries the one published theme.
const NOTES = [
  { src: 'Slack', tone: 'a', x0: 40, y0: 120, r0: -14, x1: 0, y1: 0 },
  { src: 'Jira', tone: 'b', x0: 6, y0: 40, r0: 9, x1: 72, y1: 0 },
  { src: 'Calls', tone: 'c', x0: 70, y0: 150, r0: 18, x1: 0, y1: 58 },
  { src: 'Slack', tone: 'a', x0: 30, y0: 80, r0: -6, x1: 72, y1: 58 },
  { src: 'Jira', tone: 'b', x0: 76, y0: 96, r0: -20, x1: 0, y1: 116 },
  { src: 'Calls', tone: 'c', x0: 0, y0: 160, r0: 7, x1: 72, y1: 116 },
]

const TRACK = 'M20 60 C 20 20, 70 6, 110 14 S 160 40, 150 62 S 100 82, 60 74 S 20 76, 20 60 Z'

const PHONE_BOX = 600
const PHONE_MIN_SCALE = 0.66

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const deskRef = useRef<HTMLDivElement>(null)
  useVisibleLoop(heroRef, noop, noop) // .paused stops background and desk loops off screen

  // Scale the fixed-size desk to its column; pointer position drives a small parallax.
  useEffect(() => {
    const desk = deskRef.current
    const box = desk?.parentElement
    if (!desk || !box) return
    // Phones keep the desk at a readable floor and let it scroll sideways instead of shrinking it to ~0.4.
    const fit = () => {
      const w = box.clientWidth
      desk.style.setProperty('--s', String(w < PHONE_BOX ? Math.max(PHONE_MIN_SCALE, w / DESK_W) : Math.min(1, w / DESK_W)))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(box)
    let raf = 0
    const onMove = (e: PointerEvent) => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const r = desk.getBoundingClientRect()
        desk.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
        desk.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
      })
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced) window.addEventListener('pointermove', onMove, { passive: true })
    return () => { ro.disconnect(); window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <section id="hero" ref={heroRef} className="hero hero-desk band">
      <div className="hbg" aria-hidden="true">
        <span className="hbg-glow g1" /><span className="hbg-glow g2" /><span className="hbg-glow g3" />
        <span className="hbg-grid" />
        <svg className="hbg-lines" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path d="M-40 640 C 280 520, 520 760, 860 600 S 1300 480, 1480 560" />
          <path className="flow" d="M-40 700 C 320 600, 600 820, 920 660 S 1320 560, 1480 640" />
          <path d="M-40 220 C 300 140, 640 300, 980 180 S 1320 120, 1480 170" />
        </svg>
        <span className="hbg-grain" />
      </div>

      <div className="hd-in">
        <div className="hd-left">
          <HeroLetterhead />
        </div>

        <div className="hd-right">
          <div ref={deskRef} className="desk" style={{ ['--w' as string]: `${DESK_W}px`, ['--h' as string]: `${DESK_H}px` }}>
            <DeskObject href="#experience" label="Experience" className="badge-ob" style={{ ['--p' as string]: 6 }}>
              <span className="strap" aria-hidden="true" /><span className="clip" aria-hidden="true" />
              <span className="ph">PHOTO<br />Shubh to supply<br />(portrait, plain bg)</span>
              <span className="h4">Shubh Sankalp Das</span>
              <span className="r">Product Manager, Dezerv<br /><em>Lending + Voice Agents</em></span>
            </DeskObject>

            <DeskObject href="/projects/toolmonkey-chaos-agent" label="ToolMonkey case study" className="tm" style={{ ['--p' as string]: 9 }}>
              <span className="tape" style={{ left: -14, top: -8, transform: 'rotate(-24deg)' }} aria-hidden="true" />
              <span className="tape" style={{ right: -14, top: -8, transform: 'rotate(22deg)' }} aria-hidden="true" />
              <img src="/images/projects/toolmonkey-chaos-agent-cover-600.webp" alt="" width={284} height={164} fetchPriority="high" />
              <span className="cap"><b>ToolMonkey</b>Chaos testing for agent tool calls.</span>
            </DeskObject>

            <DeskObject href="/projects/toolmonkey-chaos-agent" label="ToolMonkey test results" className="rc" style={{ ['--p' as string]: 5 }}>
              <span className="hd"><span>RUN C1</span><span>4 MODES</span></span>
              <span className="row"><span>none</span><span className="ok">ok</span></span>
              <span className="row"><span>wrong_answer</span><span className="bad">missed</span></span>
              <span className="row"><span>malformed_json</span><span className="bad">missed</span></span>
              <span className="row"><span>silent_failure</span><span className="ok">caught</span></span>
              <span className="row tot"><span>HEALTH</span><span>72.5/100</span></span>
            </DeskObject>

            <DeskObject href="/projects/filtr-rag-pm-tool" label="Filtr case study" className="fl" style={{ ['--p' as string]: 7 }}>
              {NOTES.map((n, i) => (
                <span
                  key={i}
                  className={`sn ${n.tone}`}
                  style={{ ['--x0' as string]: `${n.x0}px`, ['--y0' as string]: `${n.y0}px`, ['--r0' as string]: `${n.r0}deg`, ['--x1' as string]: `${n.x1}px`, ['--y1' as string]: `${n.y1}px`, ['--i' as string]: i }}
                >
                  {i === 0 ? <>Mobile Checkout Failures<small>7 mentions</small></> : <><i className="scrib" aria-hidden="true" /><small>{n.src}</small></>}
                </span>
              ))}
              <span className="rk" style={{ top: 20 }}>1</span><span className="rk" style={{ top: 78 }}>2</span><span className="rk" style={{ top: 136 }}>3</span>
              <span className="cap"><b>Filtr</b>Slack, Jira and calls in. Ranked insight out.</span>
            </DeskObject>

            <DeskObject href="/writing/p99-is-a-ux-metric" label="P99 blog" className="pg99" style={{ ['--p' as string]: 8 }}>
              <img src="/images/blog/p99-is-a-ux-metric-cover-480.webp" alt="" width={220} height={132} fetchPriority="low" />
              <span className="cap"><b>Blog</b>P99 is a UX metric.</span>
              <span className="ring" aria-hidden="true" />
            </DeskObject>

            <DeskObject href="#about" label="About" className="nb" style={{ ['--p' as string]: 4 }}>
              <span className="sp" aria-hidden="true" />
              <span className="t">BITS Pilani, Goa</span>
              <span className="s">Electronics + Finance</span>
              <svg viewBox="0 0 164 84" aria-hidden="true"><path d={TRACK} /></svg>
              <span className="trk" aria-hidden="true"><span className="car" style={{ offsetPath: `path("${TRACK}")` }} /></span>
              <span className="s strat">race strategy</span>
            </DeskObject>

            <span className="rp" aria-hidden="true" /><span className="rp b2" aria-hidden="true" />
            <DeskObject href="#projects-own" label="Voxikin project" className="ph1" style={{ ['--p' as string]: 10 }}>
              <span className="scr2">
                <span className="vk">VOXIKIN</span>
                <span className="wave" aria-hidden="true">{Array.from({ length: WAVE_BARS }, (_, i) => <i key={i} />)}</span>
                <b>calling</b>
              </span>
            </DeskObject>

            <DeskObject href="#projects-own" label="Voxikin: a voice AI elderly healthcare assistant" className="vx" style={{ ['--p' as string]: 6 }}>
              <span className="cap"><b>Voxikin</b>A voice AI elderly healthcare assistant.</span>
            </DeskObject>
          </div>
        </div>
      </div>
    </section>
  )
}
