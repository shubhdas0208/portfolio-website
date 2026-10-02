'use client'

import ProjectIndex, { type ProjectRef } from './ProjectIndex'
import { CallRings } from './ProjectSignatures'
import VisibleCard from './VisibleCard'

export const PREFILL_EVENT = 'contact:prefill'
export const ASK_OWN_MESSAGE = "Hi Shubh, I'd like to hear about Voxikin."

const WAVE_BARS = 18

interface Props { index: number; refs: ProjectRef[] }

/** Voxikin as the third project card. The call on the right is an illustration of the product, not a recording. */
export default function VoxikinCase({ index, refs }: Props) {
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
        <div className="call" role="img" aria-label="Illustration: Voxikin calls a parent for a morning dose check and confirms it">
          <div className="who">
            <span className="av" aria-hidden="true">Ma</span>
            <div><b>Ma</b><small>Morning dose · Hindi</small></div>
            <span className="live">● on call</span>
          </div>
          <span className="wave" aria-hidden="true">{Array.from({ length: WAVE_BARS }, (_, i) => <i key={i} />)}</span>
          <p className="say">Good morning. Did you take the BP tablet after breakfast?</p>
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
