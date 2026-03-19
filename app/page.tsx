import SideNav from './components/SideNav'
import TopBar from './components/TopBar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Blog from './components/Blog'
import About from './components/About'
import Now from './components/Now'
import Experience from './components/Experience'
import Contact from './components/Contact'

export default function Home() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SideNav />
      <div style={{ marginLeft: 'var(--side-w)', flex: 1, minWidth: 0 }}>
        <TopBar />
        <main>
          <Hero />
          <Projects />
          <Blog />
          <About />
          <Now />
          <Experience />
          <Contact />
        </main>
      </div>
    </div>
  )
}