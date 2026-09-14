import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Article from '../../components/Article'
import { PROJECTS } from '../../lib/content'

const published = () => PROJECTS.filter(p => p.is_published && !p.coming_soon && p.body)
const readMinutes = (text: string) => Math.max(3, Math.round(text.split(/\s+/).length / 230))

export function generateStaticParams() {
  return published().map(p => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = published().find(p => p.slug === params.slug)
  if (!project) return {}
  const title = `${project.title} · Shubh Sankalp Das`
  return {
    title,
    description: project.summary,
    openGraph: { title, description: project.summary, type: 'article', images: project.cover_image_url ? [project.cover_image_url] : undefined },
  }
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = published().find(p => p.slug === params.slug)
  if (!project || !project.body) notFound()
  const [name, subtitle] = project.title.split(': ')
  return (
    <Article
      kind="Case study"
      backHref="/#projects"
      backLabel="Projects"
      title={name}
      subtitle={subtitle ?? project.summary}
      minutes={readMinutes(project.body)}
      cover={project.cover_image_url}
      body={project.body}
      meta={
        <>
          <span>{project.tags.join(' · ')}</span>
          {project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer">{project.live_url.replace(/^https?:\/\//, '')} ↗</a>}
        </>
      }
    />
  )
}
