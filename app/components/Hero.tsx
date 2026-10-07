'use client'

import '../hero-left.css'
import { useEffect, useRef } from 'react'
import { useVisibleLoop } from '../lib/hooks'
import DeskObject from './DeskObject'
import HeroLetterhead from './HeroLetterhead'
import VoxikinSplash from './VoxikinSplash'

const DESK_W = 728
const DESK_H = 604
const noop = () => {}

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
              <span className="ph"><img src="/images/hero/shubh-portrait.webp" alt="Shubh Sankalp Das" width={144} height={136} /></span>
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
              <img src="/images/projects/filtr-rag-pm-tool-cover-480.webp" alt="" width={160} height={96} />
              <span className="cap"><b>Filtr</b>Turns Slack, Jira and call notes into a ranked list of user problems.</span>
            </DeskObject>

            <DeskObject href="/writing/p99-is-a-ux-metric" label="P99 blog" className="pg99" style={{ ['--p' as string]: 8 }}>
              <img src="/images/blog/p99-is-a-ux-metric-cover-480.webp" alt="" width={220} height={132} fetchPriority="low" />
              <span className="cap"><b>Blog</b>P99 is a UX metric.</span>
              <span className="ring" aria-hidden="true" />
            </DeskObject>

            <DeskObject href="#about" label="About" className="bits" style={{ ['--p' as string]: 4 }}>
              <span className="tape" aria-hidden="true" />
              <img src="/images/hero/bits-goa-sketch.webp" alt="" width={188} height={113} />
              <span className="pc">BITS Pilani, Goa<small>Electronics + Finance</small></span>
            </DeskObject>

            <DeskObject href="#projects-own" label="Voxikin project" className="ph1" style={{ ['--p' as string]: 10 }}>
              <span className="body" aria-hidden="true" />
              <span className="pbtn b1" aria-hidden="true" /><span className="pbtn b2" aria-hidden="true" /><span className="pbtn b3" aria-hidden="true" />
              <span className="scr"><span className="disp"><VoxikinSplash /></span></span>
              <span className="glare" aria-hidden="true" />
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
