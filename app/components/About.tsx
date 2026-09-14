'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { BOOKS } from '../lib/content'
import { LOG, SOCIALS, GITHUB_USER } from '../lib/site'
import { useInViewOnce } from '../lib/hooks'
import GitHubGraph from './GitHubGraph'

function Books() {
  const [active, setActive] = useState(0)
  const [swapping, setSwapping] = useState(false)
  const [shown, setShown] = useState(0)
  const pick = (i: number) => {
    setActive(i)
    setSwapping(true)
    window.setTimeout(() => { setShown(i); setSwapping(false) }, 180)
  }
  const book = BOOKS[shown]
  return (
    <>
      <p className="lab">Currently reading <span>{BOOKS.length} books</span></p>
      <div className="fan" role="group" aria-label="Books">
        {BOOKS.map((b, i) => (
          <button key={b.id} type="button" aria-pressed={active === i} aria-label={b.title} onClick={() => pick(i)}>
            <img src={b.cover_url} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      <div className={`bk${swapping ? ' swap' : ''}`}>
        <b>{book.title}</b>
        <span>{book.author}</span>
        <em>{book.note}</em>
      </div>
    </>
  )
}

export default function About() {
  const bentoRef = useRef<HTMLDivElement>(null)
  const inView = useInViewOnce(bentoRef, 0.15)
  const [stage, setStage] = useState<'pre' | 'go' | 'settled'>('pre')
  const [swept, setSwept] = useState(false)
  const [dim, setDim] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setStage('settled'); setSwept(true); return }
    if (!inView) return
    setStage('go')
    const a = window.setTimeout(() => setSwept(true), 380)
    const b = window.setTimeout(() => setStage('settled'), 1500)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [inView])

  useEffect(() => {
    const onScroll = () => { if (!bentoRef.current?.matches(':hover')) setDim(false) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const cls = ['bento', stage === 'pre' ? 'pre' : stage === 'go' ? 'go' : 'go settled', dim ? 'dim' : ''].join(' ')

  return (
    <section className="sec wrap" id="about">
      <h2 className="h2">About <em>me.</em></h2>
      <div
        ref={bentoRef}
        className={cls}
        onPointerMove={e => setDim(e.pointerType === 'mouse' && !!(e.target as HTMLElement).closest('.tile'))}
        onPointerLeave={() => setDim(false)}
      >
        <div className="tile t-bio" style={{ ['--i' as string]: 0 }}>
          <p>I studied Electronics and Instrumentation at BITS Pilani Goa, with a Finance minor. I drifted into product because my questions were never about technical output. They were about people. Now I&apos;m a Product Manager at Dezerv.</p>
          <blockquote>The most interesting product problems are people problems.</blockquote>
        </div>
        <div className="swipe">
          <div className="tile t-read" id="about-reading" style={{ ['--i' as string]: 1 }}>
            <Books />
          </div>
          <div className="tile t-think" style={{ ['--i' as string]: 2 }}>
            <p className="lab">How I think</p>
            <p>Electronics taught me how systems fail. Finance taught me how incentives shape behavior.</p>
          </div>
          <div className="tile t-now" style={{ ['--i' as string]: 4 }}>
            <p className="lab">Log</p>
            <ol className="log">
              {LOG.map(entry => (
                <li key={entry.when}>
                  <time>{entry.when}</time>
                  <span>
                    {entry.text}
                    {entry.link && <> <Link href={entry.link.href}>{entry.link.label}</Link>.</>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="tile t-f1" style={{ ['--i' as string]: 3 }}>
          <img src="/images/now/obsessing.avif" alt="F1 logo" loading="lazy" />
          <svg className="lap" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <rect x="1" y="1" width="98" height="98" rx="5" pathLength={1} vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="in">
            <small>Obsessing over</small>
            <b>F1: Race Strategy</b>
            <p>Outside work I train, read history and mythology, and travel when I can.</p>
          </div>
        </div>
        <div className={`tile t-gh${swept ? ' swept' : ''}${stage === 'settled' ? ' settled' : ''}`} id="about-github" style={{ ['--i' as string]: 5 }}>
          <GitHubGraph profileUrl={SOCIALS.github} user={GITHUB_USER} />
        </div>
      </div>
    </section>
  )
}
