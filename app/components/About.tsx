'use client'

import '../about.css'
import { useEffect, useRef, useState } from 'react'
import { READING } from '../lib/library'
import { SOCIALS, GITHUB_USER } from '../lib/site'
import { useInViewOnce } from '../lib/hooks'
import GitHubGraph from './GitHubGraph'
import Library from './Library'
import SectionHeader from './SectionHeader'
import { CurrentlyTicker, HowIWork, LapTimer } from './AboutExtras'

type Stage = 'pre' | 'go' | 'settled'

function F1() {
  return (
    <div className="ab-f1">
      <img src="/images/now/obsessing.avif" alt="" loading="lazy" />
      <div className="in">
        <small>Obsessing over</small>
        <b>F1: Race Strategy</b>
        <LapTimer />
      </div>
    </div>
  )
}

export default function About() {
  const spreadRef = useRef<HTMLDivElement>(null)
  const inView = useInViewOnce(spreadRef, 0.15)
  // Server renders the settled spread; covers and cells only start hidden when motion is on and the spread is below the fold.
  const [stage, setStage] = useState<Stage>('settled')
  const [swept, setSwept] = useState(true)

  useEffect(() => {
    const el = spreadRef.current
    if (!el || !document.documentElement.classList.contains('motion-ok')) return
    if (el.getBoundingClientRect().top > window.innerHeight) { setStage('pre'); setSwept(false) }
  }, [])

  useEffect(() => {
    if (!inView || stage !== 'pre') return
    setStage('go')
    const a = window.setTimeout(() => setSwept(true), 380)
    const b = window.setTimeout(() => setStage('settled'), 1500)
    return () => { clearTimeout(a); clearTimeout(b) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <section className="band" id="about">
      <div className="sec wrap">
      <SectionHeader
        id="about"
        label="About"
        variant="serif"
        title="The person behind the work."
        meta={['Product Manager at Dezerv', 'Bengaluru']}
        aside={<CurrentlyTicker facts={['Product Manager at Dezerv', 'Lending and voice AI agents', 'Building Voxikin', `Reading ${READING[0]?.title ?? ''}`, 'Obsessing over F1 race strategy']} />}
      />
      <div ref={spreadRef} className={`ab-spread ab-${stage}`}>
        <div className="ab-page ab-l">
          <blockquote className="ab-pq">The most interesting product problems are people problems.</blockquote>
          <div className="ab-bio">
            <p className="ab-dc">I studied Electronics and Instrumentation at BITS Pilani Goa, with a Finance minor. I drifted into product because my questions were never only about technical output. They were also about people. Now I&apos;m a Product Manager at Dezerv.</p>
            <p>Outside work I train, read history and mythology, and travel when I can.</p>
          </div>
          <div className={`ab-gh${swept ? ' swept' : ''}${stage === 'settled' ? ' settled' : ''}`} id="about-github">
            <GitHubGraph profileUrl={SOCIALS.github} user={GITHUB_USER} fullYear />
          </div>
          <span className="ab-folio" aria-hidden="true">Shubh Sankalp Das</span>
        </div>
        <div className="ab-page ab-r">
          <div className="ab-foot">
            <F1 />
            <div className="ab-work"><HowIWork /></div>
          </div>
          <span className="ab-folio" aria-hidden="true">Bengaluru</span>
        </div>
      </div>
      <Library />
      </div>
    </section>
  )
}
