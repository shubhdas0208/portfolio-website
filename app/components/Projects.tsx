import { PROJECTS } from '../lib/content'
import SectionHeader from './SectionHeader'
import CountUp from './CountUp'
import ToolMonkeyReport from './ToolMonkeyReport'
import FiltrBoard from './FiltrBoard'
import VoxikinCase from './VoxikinCase'
import DrapeFitChat from './DrapeFitChat'
import ViewTransitionLink from './ViewTransitionLink'
import VisibleCard from './VisibleCard'
import ProjectIndex, { type ProjectRef } from './ProjectIndex'
import { SortingDots, StitchLine } from './ProjectSignatures'

const liveHost = (url: string) => url.replace(/^https?:\/\//, '')
/** Telegram bot links read as an action; every other live link shows its host. */
const liveLabel = (url: string) => (/^https?:\/\/t\.me\//.test(url) ? 'Open in Telegram' : liveHost(url))

interface Stat { value: string; label: string; hot?: boolean }

interface CaseProps {
  variant: 'df' | 'tm' | 'fl'
  id: string
  index: number
  refs: ProjectRef[]
  slug: string
  title: string
  summary: string
  liveUrl?: string | null
  githubUrl?: string | null
  stack: string
  tag?: string
  statsLabel?: string
  stats: Stat[]
  media: React.ReactNode
  signature?: React.ReactNode
}

function Case({ variant, id, index, refs, slug, title, summary, liveUrl, githubUrl, stack, tag, statsLabel, stats, media, signature }: CaseProps) {
  const [name, sub] = title.split(': ')
  const href = `/projects/${slug}`
  return (
    <VisibleCard id={id} className={`case case-${variant}`} tint={variant} style={{ ['--ci' as string]: index }}>
      {signature}
      {variant === 'tm' && <span className="tm-field" aria-hidden="true"><i className="h" /><i className="d" /></span>}
      <div className="copy">
        <ProjectIndex items={refs} current={id} />
        <h3 style={{ viewTransitionName: `case-title-${slug}` }}>
          <ViewTransitionLink href={href}>{name}</ViewTransitionLink>
          {tag && <span className="tag">{tag}</span>}
          <small>{sub}</small>
        </h3>
        {statsLabel && <p className="lab stats-lab">{statsLabel}</p>}
        <div className="stats">
          {stats.map(s => <div key={s.label}><CountUp text={s.value} className={s.hot ? 'hot' : undefined} /><span>{s.label}</span></div>)}
        </div>
        <p>{summary}</p>
        <p className="stack-ln">{stack}</p>
        <div className="ft">
          <ViewTransitionLink href={href} className="btn">Read the case study →</ViewTransitionLink>
          {liveUrl && <a href={liveUrl} target="_blank" rel="noopener noreferrer">{liveLabel(liveUrl)} ↗</a>}
          {githubUrl && <a href={githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
        </div>
      </div>
      <div className="media" style={{ viewTransitionName: `case-media-${slug}` }}>{media}</div>
      <span className="shade" aria-hidden="true" />
    </VisibleCard>
  )
}

export default function Projects() {
  const drapefit = PROJECTS.find(p => p.slug === 'drapefit-chat-to-cart')
  const toolmonkey = PROJECTS.find(p => p.slug === 'toolmonkey-chaos-agent')
  const filtr = PROJECTS.find(p => p.slug === 'filtr-rag-pm-tool')
  const shipped = [drapefit, toolmonkey, filtr].filter(Boolean)
  const refs: ProjectRef[] = [
    ...(drapefit ? [{ id: 'projects-drapefit', name: drapefit.title.split(': ')[0] }] : []),
    ...(toolmonkey ? [{ id: 'projects-toolmonkey', name: toolmonkey.title.split(': ')[0] }] : []),
    ...(filtr ? [{ id: 'projects-filtr', name: filtr.title.split(': ')[0] }] : []),
    { id: 'projects-own', name: 'Voxikin' },
  ]

  const indexOf = (id: string) => refs.findIndex(r => r.id === id)

  const meta: [string, string] = [`${shipped.length} shipped · 1 being built`, 'Case study and live link for each']

  return (
    <section className="band" id="projects" data-current={drapefit ? 'df' : 'tm'}>
      <i className="pj-scan" aria-hidden="true" />
      <div className="sec wrap">
        <SectionHeader
          id="projects"
          label="Projects"
          variant="xl"
          title="Built and shipped, end to end."
          meta={meta}
          aside={<>
            <b>{meta[0]}</b><span>{meta[1]}</span>
            <span className="pj-pip" aria-hidden="true">{refs.map(r => <i key={r.id} />)}</span>
          </>}
        />
        <div className="pj stack">
          {drapefit && (
            <Case
              variant="df"
              id="projects-drapefit"
              index={indexOf('projects-drapefit')}
              refs={refs}
              slug={drapefit.slug}
              title={drapefit.title}
              summary="Type what you want in one message. Get in-stock options in your size from Indian D2C brands, build a cart in chat, and pay on each brand's own checkout."
              liveUrl={drapefit.live_url}
              githubUrl={drapefit.github_url}
              stack="Telegram · LLM · Shopify Catalog · FastAPI"
              statsLabel="Built to be trusted"
              stats={[
                { value: '100%', label: 'prices from the store', hot: true },
                { value: '14/15', label: 'unseen requests understood' },
                { value: '~6 s', label: 'to options in your size' },
              ]}
              media={<DrapeFitChat />}
              signature={<StitchLine />}
            />
          )}
          {toolmonkey && (
            <Case
              variant="tm"
              id="projects-toolmonkey"
              index={indexOf('projects-toolmonkey')}
              refs={refs}
              slug={toolmonkey.slug}
              title={toolmonkey.title}
              summary="Breaks your agent's tools on purpose, then shows exactly how it fails, before your users do."
              liveUrl={toolmonkey.live_url}
              githubUrl={toolmonkey.github_url}
              stack="AgentEval · LLM · FastAPI · Python"
              statsLabel="First test run"
              stats={[
                { value: '100%', label: 'tasks completed' },
                { value: '33%', label: 'failures caught' },
                { value: '25%', label: 'went unnoticed', hot: true },
              ]}
              media={<ToolMonkeyReport />}
            />
          )}
          {filtr && (
            <Case
              variant="fl"
              id="projects-filtr"
              index={indexOf('projects-filtr')}
              refs={refs}
              slug={filtr.slug}
              title={filtr.title}
              summary="Reads your call transcripts, Slack and Jira tickets, then ranks the biggest issues by impact so you know what to fix first."
              liveUrl={filtr.live_url}
              githubUrl={filtr.github_url}
              stack="RAG · LLM · FastAPI · Pinecone"
              statsLabel="What you get"
              stats={[
                { value: '~45 s', label: 'to first insight', hot: true },
                { value: '5', label: 'ranked issues' },
                { value: '3', label: 'sources' },
              ]}
              media={<FiltrBoard />}
              signature={<SortingDots />}
            />
          )}
          <VoxikinCase index={refs.length - 1} refs={refs} />
        </div>
      </div>
    </section>
  )
}
