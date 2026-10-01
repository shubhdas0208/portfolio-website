'use client'

import { useState } from 'react'

const TOAST_MS = 1600

/** Copies a shareable link to the section and confirms with the shared toast. */
export default function SecRef({ id, label }: { id: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const url = `${window.location.origin}/#${id}`
    try { await navigator.clipboard.writeText(url) } catch { /* clipboard blocked; the hash still updates */ }
    history.replaceState(null, '', `#${id}`)
    setCopied(true)
    window.setTimeout(() => setCopied(false), TOAST_MS)
  }

  return (
    <>
      <a className="secref" href={`#${id}`} onClick={copy} aria-label={`Copy link to ${label}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        #{id}
      </a>
      <span className={`toast${copied ? ' on' : ''}`} aria-hidden="true">Link to {label} copied</span>
      <span className="sr" aria-live="polite">{copied ? `Link to ${label} copied` : ''}</span>
    </>
  )
}
