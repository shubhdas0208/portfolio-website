import FloatNav from './components/FloatNav'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Blog from './components/Blog'
import Experience from './components/Experience'
import Contact from './components/Contact'

export default function Home() {
  return (
    <>
      <FloatNav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Blog />
        <Experience />
        <Contact />
      </main>
    </>
  )
}
