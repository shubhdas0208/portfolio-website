import FloatNav from './components/FloatNav'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Blog from './components/Blog'
import About from './components/About'
import Now from './components/Now'
import Experience from './components/Experience'
import Contact from './components/Contact'

export default function Home() {
  return (
    <>
      <FloatNav />
      <main>
        <Hero />
        <Projects />
        <Blog />
        <About />
        <Now />
        <Experience />
        <Contact />
      </main>
    </>
  )
}