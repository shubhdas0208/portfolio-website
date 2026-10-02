'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useVisibleLoop } from '../lib/hooks'

type Line = [glyph: string, text: string, tone: '' | 'dim' | 'bad' | 'good']
interface Run { mode: string; lines: Line[]; detected: number; silent: number; recovered: number }

// Failure modes from the ToolMonkey case study.
const RUNS: Run[] = [
  { mode: 'malformed_json', lines: [['·', 'task  What is 847 × 23?', 'dim'], ['→', 'calculator(847, 23)', ''], ['✕', 'injected  {"res": 1948', 'bad'], ['!', 'agent  result field missing, not trusting it', ''], ['↻', 'retry 1  calculator(847, 23)', ''], ['✓', '19,481  detected · recovered in 1 retry', 'good']], detected: 1, silent: 0, recovered: 1 },
  { mode: 'timeout', lines: [['·', 'task  Weather in Goa tomorrow?', 'dim'], ['→', 'weather("Goa", +1d)', ''], ['✕', 'injected  no response after 15 s', 'bad'], ['!', 'agent  tool timed out, flagging uncertainty', ''], ['↻', 'retry 1  weather("Goa", +1d)', ''], ['✓', 'answer returned with a timeout note', 'good']], detected: 1, silent: 0, recovered: 1 },
  { mode: 'wrong_answer', lines: [['·', 'task  What is 847 × 23?', 'dim'], ['→', 'calculator(847, 23)', ''], ['✕', 'injected  19,841', 'bad'], ['!', 'agent  cross-check 800×23 + 47×23 ≠ 19,841', ''], ['↻', 'retry 1  calculator(847, 23)', ''], ['✓', '19,481  wrong answer caught', 'good']], detected: 1, silent: 0, recovered: 1 },
  { mode: 'silent_failure', lines: [['·', 'task  Summarise the Q2 notes', 'dim'], ['→', 'summarizer(doc_q2)', ''], ['✕', 'injected  ""  (empty)', 'bad'], ['·', 'agent  answered anyway, no flag', 'dim'], ['✕', 'silent failure · the one users never see', 'bad']], detected: 0, silent: 1, recovered: 0 },
]

const LINE_MS = 650
const INJECT_MS = 1100
const HOLD_MS = 2600

export default function ToolMonkeyTrace() {
  const ref = useRef<HTMLDivElement>(null)
  // First frame is a finished run, so a glance never lands on an empty panel.
  const [state, setState] = useState({ run: 0, shown: RUNS[0].lines.length, n: 1, detected: RUNS[0].detected, silent: RUNS[0].silent, recovered: RUNS[0].recovered })
  const timer = useRef<number>(0)
  const stateRef = useRef(state)
  stateRef.current = state
  const [reduced, setReduced] = useState(false)

  useEffect(() => { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches) }, [])

  // A finished run stays on screen for the hold, then the next run starts with its first line,
  // so the panel is never empty.
  const step = useCallback(() => {
    const s = stateRef.current
    const run = RUNS[s.run]
    if (s.shown >= run.lines.length) {
      const counted = s.n === 1 && s.run === 0 // run 0 is pre-counted in the initial state
      const nextRun = (s.run + 1) % RUNS.length
      setState({ run: nextRun, shown: 1, n: s.n + 1, detected: s.detected + (counted ? 0 : run.detected), silent: s.silent + (counted ? 0 : run.silent), recovered: s.recovered + (counted ? 0 : run.recovered) })
      timer.current = window.setTimeout(step, LINE_MS)
      return
    }
    const shown = s.shown + 1
    setState({ ...s, shown })
    timer.current = window.setTimeout(step, shown === run.lines.length ? HOLD_MS : shown === 3 ? INJECT_MS : LINE_MS)
  }, [])

  const start = useCallback(() => { if (!timer.current) timer.current = window.setTimeout(step, stateRef.current.n === 1 && stateRef.current.run === 0 ? HOLD_MS : 400) }, [step])
  const stop = useCallback(() => { clearTimeout(timer.current); timer.current = 0 }, [])
  useVisibleLoop(ref, start, stop, !reduced)

  const run = RUNS[state.run]
  const shown = reduced ? run.lines.length : state.shown

  return (
    <div ref={ref} className="trace" role="img" aria-label="Animated ToolMonkey trace: an injected tool failure is detected and recovered">
      <div className="th"><span><b>ToolMonkey</b> · run <span className="num">#{state.n}</span></span><span className="num">{run.mode}</span></div>
      <div className="tb">
        {run.lines.map(([glyph, text, tone], i) => (
          <div key={`${state.run}-${i}`} className={`ln ${tone}${i < shown ? ' on' : ''}`}><i>{glyph}</i><span>{text}</span></div>
        ))}
      </div>
      <div className="tf"><span>Detected <b>{state.detected}</b></span><span>Silent <b>{state.silent}</b></span><span>Recovered <b>{state.recovered}</b></span></div>
    </div>
  )
}
