'use client'

import { useEffect, useRef, useState } from 'react'
import { RESUME_URL } from '../lib/site'
import { startCursorShader } from '../lib/cursorShader'

/* Name lines, letter gaps and hover bounce match the previous deployed Hero. */
function BounceText({ text, gap = '0.02em' }: { text: string; gap?: string }) {
  return (
    <>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className="ch"
          style={{ transitionDelay: `${i * 20}ms`, marginRight: i === text.length - 1 ? 0 : gap }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-7px)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {ch}
        </span>
      ))}
    </>
  )
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const shaderRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setRevealed(true), 80)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    const host = heroRef.current, mount = shaderRef.current
    if (!host || !mount) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    return startCursorShader(host, mount)
  }, [])

  return (
    <section id="hero" ref={heroRef} className={`hero${revealed ? ' revealed' : ''}`}>
      <div ref={shaderRef} className="shader" aria-hidden="true" />
      <div className="veil" aria-hidden="true" />
      <div className="in">
        <div className="reveal" style={{ transitionDelay: '.26s' }}>
          <h1 className="hname" aria-label="Shubh Sankalp Das">
            <span className="ln ln1" aria-hidden="true"><BounceText text="SHUBH" /></span>
            <span className="ln ln2" aria-hidden="true"><BounceText text="SANKALP" /></span>
            <span className="ln ln3" aria-hidden="true"><BounceText text="DAS" gap="0.000008em" /></span>
          </h1>
        </div>
        <div className="reveal" style={{ transitionDelay: '.36s' }}>
          <p className="hsup">
            <b>Product Manager at Dezerv</b>, building lending products and voice AI agents for client calls. Also building something of my own.
          </p>
        </div>
        <div className="reveal" style={{ transitionDelay: '.42s' }}>
          <div className="hctas">
            <a className="btn" href="#projects">See the case studies <span aria-hidden="true">↓</span></a>
            <a className="btn ghost" href={RESUME_URL} target="_blank" rel="noopener noreferrer">Resume ↗</a>
          </div>
        </div>
      </div>
    </section>
  )
}
