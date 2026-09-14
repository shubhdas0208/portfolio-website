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

export default function ToolMonkeyTrace() {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState({ run: 0, shown: 0, n: 1, detected: 0, silent: 0, recovered: 0 })
  const timer = useRef<number>(0)
  const stateRef = useRef(state)
  stateRef.current = state
  const [reduced, setReduced] = useState(false)

  useEffect(() => { setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches) }, [])

  const step = useCallback(() => {
    const s = stateRef.current
    const run = RUNS[s.run]
    const shown = s.shown + 1
    if (shown > run.lines.length) {
      const next = { run: (s.run + 1) % RUNS.length, shown: 0, n: s.n + 1, detected: s.detected + run.detected, silent: s.silent + run.silent, recovered: s.recovered + run.recovered }
      setState(next)
      timer.current = window.setTimeout(step, 2600)
      return
    }
    setState({ ...s, shown })
    timer.current = window.setTimeout(step, shown === 3 ? 1100 : 650)
  }, [])

  const start = useCallback(() => { if (!timer.current) timer.current = window.setTimeout(step, 400) }, [step])
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
