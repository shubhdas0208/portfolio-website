import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Writing from './components/Writing'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import PageMotion from './components/PageMotion'
import EndPull from './components/EndPull'

// Proof first: shipped work and work history before the person. Each section is its own sheet.
export default function Home() {
  return (
    <main id="content" className="bands">
      <Hero />
      <Projects />
      <Experience />
      <Writing />
      <About />
      <Contact footer={<Footer />} />
      <PageMotion />
      <EndPull />
    </main>
  )
}
