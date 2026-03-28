import FloatNav from './components/FloatNav'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Blog from './components/Blog'
import About from './components/About'
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
        <Experience />
        <Contact />
      </main>
    </>
  )
}