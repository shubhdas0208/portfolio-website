'use client'

import { useRef, type CSSProperties } from 'react'
import { useInViewOnce } from '../lib/hooks'

interface Stroke {
  d: string
  /** start delay and duration in seconds, plus an easing that sets the pen's speed curve */
  at: number
  dur: number
  ease: string
  dot?: boolean
}

// Hand-drawn cursive, written upright on a 390x116 grid and slanted by the group transform.
// Order and timing follow a real hand: S, pen lift, "hubh" in one run, lift, D, "as", the dot, then the underline flick.
const STROKES: Stroke[] = [
  { d: 'M60 24 C62 13 45 8 33 15 C22 22 25 35 37 43 C50 51 59 61 51 73 C43 85 22 85 15 73', at: 0, dur: 0.5, ease: 'cubic-bezier(.55,.1,.45,.95)' },
  { d: 'M64 78 C72 66 82 40 84 24 C85 14 78 12 76 22 C74 40 72 62 70 80 C74 64 82 54 90 56 C97 58 94 72 96 78 C98 82 102 80 105 76 C107 68 108 60 109 54 C108 66 110 80 116 80 C122 80 125 66 126 54 C125 66 125 78 132 79 C140 70 146 40 146 24 C146 12 138 14 138 26 C138 44 136 64 137 79 C140 66 152 56 156 64 C160 72 152 82 142 78 C150 78 158 78 166 72 C174 60 180 34 178 22 C176 12 168 16 168 28 C168 46 166 64 166 80 C170 64 178 54 186 56 C194 58 190 72 194 79 C196 82 202 80 206 74', at: 0.62, dur: 1.05, ease: 'cubic-bezier(.4,.15,.6,.9)' },
  { d: 'M232 18 C230 40 226 62 222 80 C238 82 262 74 268 54 C274 32 256 14 232 16 C222 17 214 22 210 28', at: 1.84, dur: 0.48, ease: 'cubic-bezier(.5,0,.35,1)' },
  { d: 'M298 56 C290 50 276 56 276 70 C276 82 290 80 296 66 C297 60 298 56 298 54 C297 66 296 78 302 80 C306 80 310 74 312 70 C314 62 318 54 320 52 C322 60 328 66 326 74 C324 82 312 82 310 76 C316 80 328 78 336 72', at: 2.42, dur: 0.5, ease: 'cubic-bezier(.45,.1,.4,1)' },
  { d: 'M344 77 q2 .5 1.6 2.2 q-1.6 1 -2.2 -1.4 z', at: 3.08, dur: 0.1, ease: 'linear', dot: true },
  { d: 'M10 104 C70 96 180 90 300 93 C330 94 352 97 364 89', at: 3.34, dur: 0.46, ease: 'cubic-bezier(.6,0,.2,1)' },
]

/** "Shubh Das." in orange, signed stroke by stroke the first time it scrolls into view. Static when motion is reduced. */
export default function Signature() {
  const ref = useRef<SVGSVGElement>(null)
  const seen = useInViewOnce(ref, 0.6)
  return (
    <svg ref={ref} className={`sig${seen ? ' on' : ''}`} viewBox="0 0 390 116" role="img" aria-label="Signed, Shubh Das">
      <g transform="translate(20 0) skewX(-12)">
        {STROKES.map((s, i) => (
          <path
            key={i}
            d={s.d}
            pathLength={1}
            aria-hidden="true"
            className={s.dot ? 'dot' : undefined}
            style={{ '--at': `${s.at}s`, '--dur': `${s.dur}s`, '--pen': s.ease } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  )
}
