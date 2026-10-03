export interface ProjectRef { id: string; name: string }

/** The strip at the top of each project card: real links to the three cards, current one marked. */
export default function ProjectIndex({ items, current }: { items: ProjectRef[]; current: string }) {
  return (
    <nav className="idx" aria-label={`Projects, ${items.find(p => p.id === current)?.name ?? ''} card`}>
      {items.map(p => (
        // The link to the card you are on is skipped by Tab: it would only re-land on the same card.
        <a key={p.id} href={`#${p.id}`} aria-current={p.id === current ? 'true' : undefined} tabIndex={p.id === current ? -1 : undefined}>{p.name}</a>
      ))}
    </nav>
  )
}
