'use client'

import { useRef } from 'react'
import { useVisibleLoop } from '../lib/hooks'

const noop = () => {}

export default function UnlitProject() {
  const ref = useRef<HTMLElement>(null)
  useVisibleLoop(ref, noop, noop) // toggles .paused so the waveform stops off screen
  return (
    <article ref={ref} className="pr unlit" id="projects-own">
      <div className="copy">
        <div>
          <h3>Building something of my own</h3>
          <p style={{ marginTop: 6 }}>In private for now. Ask me about it.</p>
        </div>
        <span className="wave" aria-hidden="true">{Array.from({ length: 14 }, (_, i) => <i key={i} />)}</span>
        <a className="btn ghost" href="#contact">Ask me →</a>
      </div>
    </article>
  )
}
