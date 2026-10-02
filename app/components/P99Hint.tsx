'use client'

export const P99_EVENT = 'p99:open'

/** Footer affordance for the p99 easter egg, so touch visitors can open it too. */
export default function P99Hint() {
  return (
    <button type="button" className="kb" onClick={() => window.dispatchEvent(new Event(P99_EVENT))}>
      <kbd>p</kbd><kbd>9</kbd><kbd>9</kbd>
      <span>see how fast this page loaded</span>
    </button>
  )
}
