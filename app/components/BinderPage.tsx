'use client'

import { useRef } from 'react'
import type { Bullet, Company, Role } from '../lib/site'
import { useInViewOnce } from '../lib/hooks'
import CountUp from './CountUp'

const PENDING_RESULTS = [2, 3, 4]

const CHEVRON = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 3.8 5 6.3l2.5-2.5" /></svg>
)

const RING = (
  <svg className="bd-ring" viewBox="0 0 70 30" aria-hidden="true">
    <path d="M4 26 C 18 2, 50 2, 63 22" stroke="rgba(0,0,0,.28)" strokeWidth="6" fill="none" transform="translate(1.5 3)" />
    <path d="M4 26 C 18 2, 50 2, 63 22" stroke="var(--metalB)" strokeWidth="5.5" fill="none" strokeLinecap="round" />
    <path d="M10 17 C 22 6, 44 6, 56 14" stroke="var(--metalA)" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".85" />
  </svg>
)

/** "Jul 2025 to Dec 2025 · Internship · Bengaluru" loses the city the page header already shows. */
function roleDates(meta: string, city: string): string {
  const parts = meta.split(' · ')
  return parts.length > 2 && parts[parts.length - 1] === city ? parts.slice(0, -1).join(' · ') : meta
}

function RoleHead({ role, city }: { role: Role; city: string }) {
  return (
    <div className="bd-head">
      <span className="d">{roleDates(role.meta, city)}</span>
      <h4 className="bd-title">{role.title}</h4>
    </div>
  )
}

/** The verbatim bullets, one click away. */
function FullNotes({ bullets }: { bullets: Bullet[] }) {
  return (
    <details className="bd-ft">
      <summary><span>All {bullets.length} results {CHEVRON}</span></summary>
      <ul>{bullets.map(b => <li key={b.lead}><strong>{b.lead}</strong>{b.rest}</li>)}</ul>
    </details>
  )
}

function Outcomes({ role }: { role: Role }) {
  if (role.pending) {
    return (
      <ul className="bd-out">
        {PENDING_RESULTS.map(n => <li key={n} className="ph"><b aria-hidden="true" /><span>Full-time result {n}: Shubh to add</span></li>)}
      </ul>
    )
  }
  return (
    <ul className="bd-out">
      {role.results.map(r => <li key={r.label}><b>{r.value}</b><span>{r.label}</span></li>)}
    </ul>
  )
}

/** Headline (or its dashed slot) and the note under it: the "how" for a real result, the bullets for a pending role. */
function Proof({ role }: { role: Role }) {
  if (role.pending) {
    return (
      <>
        <div className="bd-slot"><b>Shubh to add</b><span>Full-time headline result</span></div>
        <div className="bd-ann"><p>{role.bullets.map(b => <span key={b.lead}><strong>{b.lead}</strong>{b.rest}</span>)}</p></div>
      </>
    )
  }
  return (
    <>
      <div className="bd-big"><CountUp text={role.hero.value} className="bd-ul" /><span>{role.hero.label}</span></div>
      <div className="bd-ann"><p>{role.how}</p></div>
    </>
  )
}

function Notes({ role }: { role: Role }) {
  return role.pending
    ? <span className="bd-ft bd-ft-ph"><span>Full notes: Shubh to add {CHEVRON}</span></span>
    : <FullNotes bullets={role.bullets} />
}

/** One company page in the binder. Two roles sit side by side; one role keeps headline left, outcomes right. */
export default function BinderPage({ c }: { c: Company }) {
  const ref = useRef<HTMLElement>(null)
  const seen = useInViewOnce(ref, 0.3)
  const single = c.roles.length === 1
  return (
    <article ref={ref} id={`experience-${c.id}`} className={`bd-pg${seen ? ' seen' : ''}`} aria-labelledby={`bd-${c.id}`}>
      <i className="bd-hole at1" /><i className="bd-hole at2" /><i className="bd-hole at3" />
      <span className="bd-rg at1">{RING}</span><span className="bd-rg at2">{RING}</span><span className="bd-rg at3">{RING}</span>
      <div className="bd-in">
        <header className="bd-rh">
          <h3 id={`bd-${c.id}`}>{c.name}</h3>
          <small>{c.city} · {c.roles.length} {c.roles.length === 1 ? 'role' : 'roles'} · {c.years}</small>
        </header>
        {single ? (
          <div className="bd-one">
            <section className="bd-role">
              <RoleHead role={c.roles[0]} city={c.city} />
              <Proof role={c.roles[0]} />
            </section>
            <div className="bd-rt">
              <Outcomes role={c.roles[0]} />
              <Notes role={c.roles[0]} />
            </div>
          </div>
        ) : (
          <div className="bd-cols">
            {c.roles.map(role => (
              <section key={role.title} className="bd-role">
                <RoleHead role={role} city={c.city} />
                <Proof role={role} />
                <Outcomes role={role} />
                <Notes role={role} />
              </section>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
