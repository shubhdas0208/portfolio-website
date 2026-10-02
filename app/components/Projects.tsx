import { PROJECTS } from '../lib/content'
import SectionHeader from './SectionHeader'
import CountUp from './CountUp'
import ToolMonkeyTrace from './ToolMonkeyTrace'
import FiltrThemes from './FiltrThemes'
import VoxikinCase from './VoxikinCase'
import ViewTransitionLink from './ViewTransitionLink'
import VisibleCard from './VisibleCard'
import ProjectIndex, { type ProjectRef } from './ProjectIndex'
import { Oscilloscope, SortingDots } from './ProjectSignatures'

const liveHost = (url?: string | null) => (url ? url.replace(/^https?:\/\//, '') : '')

interface Stat { value: string; label: string; hot?: boolean }

interface CaseProps {
  variant: 'tm' | 'fl'
  id: string
  index: number
  refs: ProjectRef[]
  slug: string
  title: string
  summary: string
  liveUrl?: string | null
  stack: string
  tag?: string
  statsLabel?: string
  stats: Stat[]
  media: React.ReactNode
  signature: React.ReactNode
}

function Case({ variant, id, index, refs, slug, title, summary, liveUrl, stack, tag, statsLabel, stats, media, signature }: CaseProps) {
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
          {liveUrl && <a href={liveUrl} target="_blank" rel="noopener noreferrer">{liveHost(liveUrl)} ↗</a>}
        </div>
      </div>
      <div className="media" style={{ viewTransitionName: `case-media-${slug}` }}>{media}</div>
      <span className="shade" aria-hidden="true" />
    </VisibleCard>
  )
}

export default function Projects() {
  const toolmonkey = PROJECTS.find(p => p.slug === 'toolmonkey-chaos-agent')
  const filtr = PROJECTS.find(p => p.slug === 'filtr-rag-pm-tool')
  const shipped = [toolmonkey, filtr].filter(Boolean)
  const refs: ProjectRef[] = [
    ...(toolmonkey ? [{ id: 'projects-toolmonkey', name: toolmonkey.title.split(': ')[0] }] : []),
    ...(filtr ? [{ id: 'projects-filtr', name: filtr.title.split(': ')[0] }] : []),
    { id: 'projects-own', name: 'Voxikin' },
  ]

  const meta: [string, string] = [`${shipped.length} shipped · 1 being built`, 'Case study and live link for every shipped build']

  return (
    <section className="band" id="projects" data-current="tm">
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
            <span className="pj-pip" aria-hidden="true"><i /><i /><i /></span>
          </>}
        />
        <div className="pj stack">
          {toolmonkey && (
            <Case
              variant="tm"
              id="projects-toolmonkey"
              index={0}
              refs={refs}
              slug={toolmonkey.slug}
              title={toolmonkey.title}
              summary={toolmonkey.summary}
              liveUrl={toolmonkey.live_url}
              stack="AgentEval · LLM · FastAPI · Python"
              tag="agent under test"
              statsLabel="V1 results on scenario C1"
              stats={[
                { value: '100%', label: 'of tasks completed' },
                { value: '33%', label: 'of injected failures detected' },
                { value: '25%', label: 'silent failures', hot: true },
              ]}
              media={<ToolMonkeyTrace />}
              signature={<Oscilloscope />}
            />
          )}
          {filtr && (
            <Case
              variant="fl"
              id="projects-filtr"
              index={1}
              refs={refs}
              slug={filtr.slug}
              title={filtr.title}
              summary={filtr.summary}
              liveUrl={filtr.live_url}
              stack="RAG · LLM · FastAPI · Pinecone"
              stats={[
                { value: '~45 s', label: 'upload to first insight', hot: true },
                { value: '5', label: 'issue themes, ranked for you' },
                { value: '3', label: 'sources: Slack, Jira, calls' },
              ]}
              media={<FiltrThemes />}
              signature={<SortingDots />}
            />
          )}
          <VoxikinCase index={refs.length - 1} refs={refs} />
        </div>
      </div>
    </section>
  )
}
