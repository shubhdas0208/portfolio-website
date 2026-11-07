'use client'

import '../library.css'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { LIBRARY_COUNT, READING, SHELVES, type LibraryBook } from '../lib/library'

const COVER_H = 188
const DEFAULT_RATIO = 0.66
const OPEN_SCROLL_DELAY_MS = 420

/** Stable pseudo-random number per book so spine heights don't jump between renders. */
function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function bookStyle(b: LibraryBook): CSSProperties {
  const spineW = b.pages ? Math.min(36, Math.max(20, Math.round(b.pages / 14))) : 24
  return {
    '--sp': b.spine,
    '--ink': b.ink,
    '--spw': `${spineW}px`,
    '--sph': `${150 + (hash(b.id) % 38)}px`,
    '--cvw': `${Math.round(COVER_H * (b.ratio ?? DEFAULT_RATIO))}px`,
  } as CSSProperties
}

interface BookProps {
  book: LibraryBook
  shelfLabel: string
  open: boolean
  onToggle: (id: string) => void
}

function Book({ book, shelfLabel, open, onToggle }: BookProps) {
  const ref = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => ref.current?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' }), OPEN_SCROLL_DELAY_MS)
    return () => window.clearTimeout(t)
  }, [open])

  const meta = [book.year && `First published ${book.year}`, book.pages && `${book.pages} pages`].filter(Boolean).join(' · ')
  const cls = ['lib-bk', book.faceOut ? 'face' : 'spine', open ? 'open' : ''].filter(Boolean).join(' ')

  return (
    <li ref={ref} className={cls} style={bookStyle(book)}>
      <button type="button" className="lib-btn" aria-expanded={open} aria-label={`${book.title} by ${book.author}`} onClick={() => onToggle(book.id)}>
        <span className="lib-spine" aria-hidden="true">
          <span className="t">{book.title}</span>
          <span className="a">{book.author.split(' ').pop()}</span>
        </span>
        <span className="lib-cover" aria-hidden="true">
          {book.cover
            ? <img src={book.cover} alt="" loading="lazy" decoding="async" />
            : <span className="lib-type"><b>{book.title}</b><small>{book.author}</small></span>}
        </span>
      </button>
      <div className="lib-card" aria-hidden={!open}>
        <div className="in">
          <small className="eb">{shelfLabel}</small>
          <b className="ti">{book.title}</b>
          <span className="au">{book.author}</span>
          {book.series && <span className="se">{book.series}</span>}
          {meta && <span className="me">{meta}</span>}
          <button type="button" className="put" tabIndex={open ? 0 : -1} onClick={() => onToggle(book.id)}>Put it back</button>
        </div>
      </div>
    </li>
  )
}

/** The library: a bookcase of three shelves. Click a spine to pull the book out and read its card. */
export default function Library() {
  const [openId, setOpenId] = useState<string | null>(null)
  const toggle = useCallback((id: string) => setOpenId(cur => (cur === id ? null : id)), [])

  useEffect(() => {
    if (!openId) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenId(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openId])

  return (
    <div className="lib" id="about-library">
      <p className="lab">Me between the Pages <span>{LIBRARY_COUNT} books · pull one off the shelf</span></p>
      <div className="lib-case">
        {SHELVES.map((shelf, si) => (
          <div key={shelf.id} className="lib-row">
            <ul className="lib-books" aria-label={shelf.label}>
              {si === 0 && (
                <li className="lib-grp now">
                  <ul>{READING.map(b => <Book key={b.id} book={b} shelfLabel="Reading now" open={openId === b.id} onToggle={toggle} />)}</ul>
                  <span className="lib-lbl">Reading now</span>
                </li>
              )}
              {shelf.groups.map(g => (
                <li key={g.label} className="lib-grp">
                  <ul>{g.books.map(b => <Book key={b.id} book={b} shelfLabel={g.label} open={openId === b.id} onToggle={toggle} />)}</ul>
                  <span className="lib-lbl">{g.label}</span>
                </li>
              ))}
            </ul>
            <div className="lib-plank" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  )
}
