'use client'

import { useCallback, useEffect, useRef } from 'react'
import { usePrefersReducedMotion, useVisibleLoop } from '../lib/hooks'
import ProjectIndex, { type ProjectRef } from './ProjectIndex'
import { CallRings } from './ProjectSignatures'
import VisibleCard from './VisibleCard'

export const PREFILL_EVENT = 'contact:prefill'
export const ASK_OWN_MESSAGE = "Hi Shubh, I'd like to hear about Voxikin."

const WAVE_BARS = 18

// The call loop: ring, pick up, question, answer, confirmed. Times are ms from the start of a loop.
const AT = { answer: 1100, question: 1600, reply: 3100, done: 4200 }
const LOOP_MS = 7600
const FIRST_HOLD_MS = 2600
const STATUS = { ringing: 'calling…', live: '● on call', done: '✓ 0:38' }

interface Props { index: number; refs: ProjectRef[] }

/** Voxikin as the third project card. The call on the right is an illustration of the product, not a recording. */
export default function VoxikinCase({ index, refs }: Props) {
  const call = useRef<HTMLDivElement>(null)
  const status = useRef<HTMLSpanElement>(null)
  const timers = useRef<number[]>([])
  const running = useRef(false)
  const reduced = usePrefersReducedMotion()

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const say = (text: string) => { if (status.current) status.current.textContent = text }

  const cycle = useCallback(() => {
    const el = call.current
    if (!el || !running.current) return
    clear()
    el.classList.remove('on', 'q', 'a', 'd')
    el.classList.add('run')
    say(STATUS.ringing)
    later(() => { el.classList.add('on'); say(STATUS.live) }, AT.answer)
    later(() => el.classList.add('q'), AT.question)
    later(() => el.classList.add('a'), AT.reply)
    later(() => { el.classList.add('d'); say(STATUS.done) }, AT.done)
    later(cycle, LOOP_MS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // The first frame is the finished call; the loop replays it from the ring.
  const start = useCallback(() => {
    running.current = true
    if (!timers.current.length) later(cycle, FIRST_HOLD_MS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle])
  const stop = useCallback(() => { running.current = false; clear() }, [])
  useVisibleLoop(call, start, stop, !reduced)
  useEffect(() => stop, [stop])

  return (
    <VisibleCard className="case case-vx" id="projects-own" tint="vx" style={{ ['--ci' as string]: index }}>
      <div className="copy">
        <ProjectIndex items={refs} current="projects-own" />
        <h3>Voxikin<small>Voice AI elderly healthcare assistant</small></h3>
        <p className="tagline">Caring for your loved ones, no matter where life takes you.</p>
        <p>
          It calls your parent on schedule, confirms every dose in their own language, and tells you only what
          actually needs you. They install nothing. Their entire interface is answering a phone call.
        </p>
        <div className="ft">
          <span>Not public yet</span>
          <a
            className="btn ghost"
            href="#contact"
            onClick={() => window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail: ASK_OWN_MESSAGE }))}
          >
            Ask me about it →
          </a>
        </div>
      </div>
      <div className="media">
        <CallRings />
        <div ref={call} className="call" role="img" aria-label="Illustration: Voxikin calls a parent for a morning dose check and confirms it">
          <div className="who">
            <span className="av" aria-hidden="true">Ma</span>
            <div><b>Ma</b><small>Morning dose · Hindi</small></div>
            <span ref={status} className="live">{STATUS.done}</span>
          </div>
          <span className="wave" aria-hidden="true">{Array.from({ length: WAVE_BARS }, (_, i) => <i key={i} />)}</span>
          <p className="say">Namaste Uma Ji. Kya aapne diabetes ki dawai le li?</p>
          <p className="say them">Haan, le li.</p>
          <p className="done">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
            Dose confirmed · nothing needs you today
          </p>
        </div>
      </div>
      <span className="shade" aria-hidden="true" />
    </VisibleCard>
  )
}
