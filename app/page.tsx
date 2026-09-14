import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Writing from './components/Writing'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <Projects />
        <Writing />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
