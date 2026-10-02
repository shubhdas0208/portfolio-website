import { Children, cloneElement, isValidElement, type ReactNode } from 'react'
import type { Annotated } from '../lib/content'
import { countOf } from '../lib/posts'

export const NOTE_ARROW = <svg viewBox="0 0 28 18" aria-hidden="true"><path d="M26 14 C 20 4, 12 4, 3 9 M7 5 L3 9 L8 11" /></svg>

interface Target { text: string; cls: 'mk' | 'pen' }
interface Pos { start?: { offset?: number }; end?: { offset?: number } }
type ParagraphProps = { children?: ReactNode; node?: { position?: Pos } }

/** Splits string children around each target and wraps the hits, leaving every other child as is. */
function wrap(children: ReactNode, targets: Target[]): ReactNode {
  if (!targets.length) return children
  let key = 0
  const splitString = (str: string): ReactNode[] => {
    const hits = targets.map(t => ({ t, at: str.indexOf(t.text) })).filter(h => h.at >= 0).sort((a, b) => a.at - b.at)
    if (!hits.length) return [str]
    const { t, at } = hits[0]
    const hit = t.cls === 'mk' ? <mark key={key++} className="mk">{t.text}</mark> : <u key={key++} className="pen">{t.text}</u>
    return [str.slice(0, at), hit, ...splitString(str.slice(at + t.text.length))].filter(n => n !== '')
  }
  return Children.toArray(children).flatMap(c => {
    if (typeof c === 'string') return splitString(c)
    if (isValidElement<{ children?: ReactNode }>(c) && c.props.children) return [cloneElement(c, undefined, wrap(c.props.children, targets))]
    return [c]
  })
}

/**
 * A ReactMarkdown `p` renderer that annotates the essay or case study in place: the pull quote and the
 * highlights get the marker, a line repeated in the body gets a pencil underline and a "k of n" tally,
 * and each margin note sits beside the paragraph it quotes. Offsets come from the markdown source, so output is deterministic.
 */
export function annotatedParagraph(body: string, annot: Annotated) {
  const mark = annot.pull_quote?.mark ?? annot.pull_quote?.text
  const notes = annot.notes ?? []
  const highlights = annot.highlights ?? []

  return function Paragraph({ children, node }: ParagraphProps) {
    const start = node?.position?.start?.offset ?? -1
    const end = node?.position?.end?.offset ?? -1
    if (start < 0) return <p>{children}</p>
    const raw = body.slice(start, end)
    const before = body.slice(0, start)
    const firstIn = (line: string) => { const at = body.indexOf(line); return at >= start && at < end }

    const targets: Target[] = []
    const asides: ReactNode[] = []
    if (mark && firstIn(mark)) {
      targets.push({ text: mark, cls: 'mk' })
      asides.push(
        <span key="pq" className="mnote">{NOTE_ARROW}<b>Pull quote</b><small>Select any line to reply</small></span>,
      )
    }
    for (const h of highlights) if (firstIn(h)) targets.push({ text: h, cls: 'mk' })
    for (const n of notes) {
      const total = countOf(body, n.line)
      if (total > 1 && raw.includes(n.line)) {
        targets.push({ text: n.line, cls: 'pen' })
        const k = countOf(before, n.line) + 1
        asides.push(k === 1
          ? <span key={n.label} className="mnote">{NOTE_ARROW}<b>{n.label}</b><i>{n.line}</i><small>1 of {total}</small></span>
          : <span key={n.label} className="mnote tally">{NOTE_ARROW}<small><span className="m-only">{n.label} · </span>{k} of {total}</small></span>)
      } else if (total === 1 && firstIn(n.line)) {
        asides.push(<span key={n.label} className="mnote">{NOTE_ARROW}<b>{n.label}</b><i>{n.line}</i></span>)
      }
    }

    const p = <p>{wrap(children, targets)}</p>
    if (!asides.length) return p
    return <div className="mp">{p}<div className="mnotes" role="note">{asides}</div></div>
  }
}
