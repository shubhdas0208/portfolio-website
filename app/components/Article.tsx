import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ReadingProgress from './ReadingProgress'

interface ArticleProps {
  kind: 'Case study' | 'Essay'
  backHref: string
  backLabel: string
  title: string
  subtitle: string
  meta: React.ReactNode
  minutes: number
  cover?: string | null
  body: string
}

export default function Article({ kind, backHref, backLabel, title, subtitle, meta, minutes, cover, body }: ArticleProps) {
  return (
    <main>
      <ReadingProgress minutes={minutes} />
      <article className="art">
        <Link className="back" href={backHref}>← {backLabel}</Link>
        <h1>{title}</h1>
        {subtitle && <p className="sub">{subtitle}</p>}
        <div className="am">{meta}<span>{minutes} min read</span></div>
        <div className="cover">
          {cover && <img src={cover} alt="" />}
          <div className="ct2"><small>{kind}</small><b>{title}</b></div>
        </div>
        <div className="prose">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => <div className="tw"><table>{children}</table></div>,
              img: ({ src, alt }) => <img src={typeof src === 'string' ? src : ''} alt={alt ?? ''} loading="lazy" />,
              a: ({ href, children }) => <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{children}</a>,
            }}
          >
            {body}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  )
}
