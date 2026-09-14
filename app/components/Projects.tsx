import Link from 'next/link'
import { PROJECTS } from '../lib/content'
import ToolMonkeyTrace from './ToolMonkeyTrace'
import FiltrThemes from './FiltrThemes'
import UnlitProject from './UnlitProject'

const liveHost = (url?: string | null) => (url ? url.replace(/^https?:\/\//, '') : '')

export default function Projects() {
  const toolmonkey = PROJECTS.find(p => p.slug === 'toolmonkey-chaos-agent')
  const filtr = PROJECTS.find(p => p.slug === 'filtr-rag-pm-tool')
  const [tmName, tmSub] = (toolmonkey?.title ?? '').split(': ')
  const [fName, fSub] = (filtr?.title ?? '').split(': ')

  return (
    <section className="sec wrap" id="projects">
      <h2 className="h2">Projects that <em>shipped.</em></h2>
      <div className="pj">
        {toolmonkey && (
          <article className="pr">
            <div className="copy">
              <h3>{tmName}<small>{tmSub}</small></h3>
              <div className="stats">
                <div><b>100%</b><span>of tasks completed</span></div>
                <div><b className="hot">33%</b><span>of injected failures detected</span></div>
                <div><b className="hot">25%</b><span>silent failures</span></div>
              </div>
              <p>{toolmonkey.summary}</p>
              <div className="ft">
                <span>AgentEval · LLM · FastAPI · Python</span>
                <Link href={`/projects/${toolmonkey.slug}`}>Read the case study →</Link>
                {toolmonkey.live_url && <a href={toolmonkey.live_url} target="_blank" rel="noopener noreferrer">{liveHost(toolmonkey.live_url)} ↗</a>}
              </div>
            </div>
            <div className="media"><ToolMonkeyTrace /></div>
          </article>
        )}
        {filtr && (
          <article className="pr flip">
            <div className="copy">
              <h3>{fName}<small>{fSub}</small></h3>
              <div className="stats">
                <div><b>~45 s</b><span>upload to first insight</span></div>
                <div><b>5</b><span>issue themes, ranked for you</span></div>
                <div><b>3</b><span>sources: Slack, Jira, calls</span></div>
              </div>
              <p>{filtr.summary}</p>
              <div className="ft">
                <span>RAG · LLM · FastAPI · Pinecone</span>
                <Link href={`/projects/${filtr.slug}`}>Read the case study →</Link>
                {filtr.live_url && <a href={filtr.live_url} target="_blank" rel="noopener noreferrer">{liveHost(filtr.live_url)} ↗</a>}
              </div>
            </div>
            <div className="media"><FiltrThemes /></div>
          </article>
        )}
        <UnlitProject />
      </div>
    </section>
  )
}
