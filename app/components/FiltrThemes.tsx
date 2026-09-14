'use client'

import { useRef } from 'react'
import { useInViewOnce } from '../lib/hooks'

// Only the top theme is the published example; the rest are blurred rather than invented.
const BLURRED = [0.72, 0.55, 0.4, 0.28]

export default function FiltrThemes() {
  const ref = useRef<HTMLDivElement>(null)
  const on = useInViewOnce(ref, 0.4)
  return (
    <div ref={ref} className={`themes${on ? ' on' : ''}`}>
      <div className="th3 top">
        <span>Mobile Checkout Failures</span>
        <span className="bar"><i style={{ ['--w' as string]: 1 }} /></span>
        <span className="n">7 mentions</span>
      </div>
      {BLURRED.map((w, i) => (
        <div key={w} className="th3 blur" aria-hidden="true">
          <span>{['████████ ██████', '██████ ████████', '████ ██████████', '███████ █████'][i]}</span>
          <span className="bar"><i style={{ ['--w' as string]: w }} /></span>
          <span className="n">██</span>
        </div>
      ))}
    </div>
  )
}
