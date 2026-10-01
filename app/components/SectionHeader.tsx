import SecRef from './SecRef'

type Variant = 'serif' | 'xl' | 'md' | 'sm'

interface Props {
  id: string
  label: string
  title: string
  pre?: string
  variant: Variant
  meta: [fact: string, context: string]
  /** Replaces the fact column (the copy-link chip stays). */
  aside?: React.ReactNode
}

/** Shared section header: a rule that draws on arrival, a heading whose form varies per section, and a fact column. */
export default function SectionHeader({ id, label, title, pre, variant, meta, aside }: Props) {
  const words = title.split(' ')
  return (
    <header className={`sh sh-${variant}`}>
      <h2 className="h2" id={`${id}-title`}>
        {pre && <span className="pre">{pre}</span>}
        {words.map((word, i) => (
          <span key={i}>
            <span className="m"><span className="w" style={{ ['--wi' as string]: i }}>{word}</span></span>
            {i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </h2>
      <div className="sh-meta">
        {aside ?? <><b>{meta[0]}</b><span>{meta[1]}</span></>}
        <SecRef id={id} label={label} />
      </div>
    </header>
  )
}
