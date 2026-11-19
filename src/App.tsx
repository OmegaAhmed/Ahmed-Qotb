import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowDown, ArrowUpRight, Building2, Code2, Film, Palette, PenTool, Server,
  ChevronLeft, ChevronRight, Mail, Moon, Phone, Sun, X, Play, ExternalLink, Download
} from 'lucide-react'
import projects from './data/projects.json'
import experience from './data/experience.json'
import education from './data/education.json'
import certifications from './data/certifications.json'
import skills from './data/skills.json'
import settings from './data/settings.json'
import './App.css'

type Localized = { en: string }
const experienceIcons = [Building2, Palette]
const skillIcons = [Code2, PenTool, Film, Server]
type Theme = 'dark' | 'light'
const THEME_STORAGE_KEY = 'ahmed-qotb-theme'
const publicAsset = (path: string | undefined) => path ? `${import.meta.env.BASE_URL}${path}` : undefined

function getInitialTheme(): Theme {
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme
  } catch (error) {
    console.warn('Unable to read the saved theme preference.', error)
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const copy = {
  nav: ['About','Experience','Skills','Work','Education','Contact'],
}
const artworkImages = [...new Set(projects.find(project => project.category === 'graphic')?.gallery ?? [])]
const INTRO_SESSION_KEY = 'ahmed-qotb-intro-seen'

function isWelcomeRoute() {
  if (new URLSearchParams(window.location.search).get('intro') === 'welcome') return true
  return isWelcomePath()
}

function isWelcomePath() {
  const basePath = new URL(import.meta.env.BASE_URL, window.location.origin).pathname
  const basePrefix = basePath.endsWith('/') ? basePath : `${basePath}/`
  const route = window.location.pathname.startsWith(basePrefix)
    ? window.location.pathname.slice(basePrefix.length)
    : window.location.pathname.replace(/^\/+/, '')
  return route.replace(/\/+$/, '') === 'welcome'
}

function getRoutePath(route: 'home' | 'welcome') {
  const baseUrl = new URL(import.meta.env.BASE_URL, window.location.origin)
  return route === 'welcome' ? new URL('welcome', baseUrl).pathname : baseUrl.pathname
}

function hasEnteredPortfolio() {
  try {
    return window.sessionStorage.getItem(INTRO_SESSION_KEY) === 'true'
  } catch (error) {
    console.warn('Unable to read the intro visit preference.', error)
    return false
  }
}

function CreativeVisual({ className, portraitSrc }: { className: string; portraitSrc?: string }) {
  return (
    <div className={`creative-visual ${className}`} role="img" aria-label={portraitSrc ? "Ahmed Qotb's portrait within an abstract composition combining code, graphic design, and motion" : 'An abstract composition combining code, graphic design, and motion'}>
      <div className="creative-visual-grid"/>
      <div className="creative-visual-orbit creative-visual-orbit-outer"/>
      <div className="creative-visual-orbit creative-visual-orbit-inner"/>
      <div className={`creative-visual-object${portraitSrc ? ' has-portrait' : ''}`}>
        {portraitSrc ? <img src={portraitSrc} alt="Portrait of Ahmed Qotb"/> : <span>A</span>}
      </div>
      <div className="creative-visual-spark"/>
      <div className="creative-visual-card creative-visual-code">
        <span><Code2 size={14} aria-hidden="true"/> DEVELOPMENT</span>
        <code><i>&lt;idea</i> <b>/&gt;</b><br/><i>build(</i><b>impact</b><i>)</i></code>
      </div>
      <div className="creative-visual-card creative-visual-design">
        <span><Palette size={14} aria-hidden="true"/> VISUAL DESIGN</span>
        <div className="creative-design-shapes"><i/><i/><i/></div>
      </div>
      <div className="creative-visual-card creative-visual-motion">
        <span><Film size={14} aria-hidden="true"/> MOTION</span>
        <div className="creative-motion-frames"><i/><i/><i/><i/><i/></div>
      </div>
      <span className="creative-visual-coordinate">30° 02' N / 31° 14' E</span>
    </div>
  )
}

function AmbientCanvasBackground() {
  const cursorLight = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const light = cursorLight.current
    const screen = light?.closest('.intro-screen')
    const canTrackPointer = window.matchMedia(
      '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
    ).matches

    if (!light || !screen || !canTrackPointer) return

    let frame: number | null = null
    let x = 0
    let y = 0
    let targetX = 0
    let targetY = 0

    const animateLight = () => {
      frame = null
      x += (targetX - x) * 0.08
      y += (targetY - y) * 0.08
      light.style.transform = `translate3d(${x}px, ${y}px, 0)`

      if (Math.abs(targetX - x) > 0.1 || Math.abs(targetY - y) > 0.1) {
        frame = window.requestAnimationFrame(animateLight)
      }
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return

      const bounds = screen.getBoundingClientRect()
      targetX = Math.max(-18, Math.min(18, (event.clientX - bounds.left - bounds.width / 2) * 0.035))
      targetY = Math.max(-18, Math.min(18, (event.clientY - bounds.top - bounds.height / 2) * 0.035))

      if (frame === null) frame = window.requestAnimationFrame(animateLight)
    }

    const resetPointer = () => {
      targetX = 0
      targetY = 0
      if (frame === null) frame = window.requestAnimationFrame(animateLight)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    screen.addEventListener('pointerleave', resetPointer, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      screen.removeEventListener('pointerleave', resetPointer)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="ambient-canvas" aria-hidden="true">
      <div className="ambient-mesh"/>
      <div className="ambient-orb ambient-orb-cyan"/>
      <div className="ambient-orb ambient-orb-blue"/>
      <div className="ambient-orb ambient-orb-soft"/>
      <div ref={cursorLight} className="ambient-cursor-light"/>
      <div className="intro-atmosphere"><i/><i/><i/></div>
    </div>
  )
}

function WelcomeScreen({ onEnter, isExiting }: { onEnter: () => void; isExiting: boolean }) {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  )

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    document.documentElement.dataset.theme = nextTheme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', nextTheme === 'dark' ? '#0B1220' : '#F4F8FC')
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    } catch (error) {
      console.warn('Unable to save the theme preference.', error)
    }
  }

  return (
    <main className={`intro-screen${isExiting ? ' is-exiting' : ''}`} aria-hidden={isExiting} inert={isExiting}>
      <AmbientCanvasBackground/>
      <header className="intro-header">
        <p className="intro-brand-label"><span>A</span> PERSONAL PORTFOLIO</p>
        <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme" aria-pressed={theme === 'light'}>
          {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
        </button>
      </header>
      <section className="intro-content" aria-labelledby="intro-name">
        <div className="intro-photo-frame">
          <img
            className="intro-photo"
            src={publicAsset('images/profile/Ahmed.webp')}
            alt="Portrait of Ahmed Qotb"
            fetchPriority="high"
          />
        </div>
        <p className="intro-greeting">WELCOME TO MY DIGITAL SPACE</p>
        <h1 id="intro-name" className="intro-name">Ahmed <em>Qotb</em></h1>
        <p className="intro-tagline">Where Creativity Meets <em>Technology.</em></p>
        <p className="intro-profession">Senior Web Developer <span>·</span> Graphic Designer <span>·</span> Motion Graphics Artist</p>
        <div className="intro-actions">
          <button className="intro-enter" onClick={onEnter}>Enter My Portfolio <ArrowUpRight size={18}/></button>
          <button className="intro-skip" onClick={onEnter}>Skip Intro</button>
        </div>
        <div className="intro-discover" aria-hidden="true"><span/> DISCOVER <ArrowDown size={14}/></div>
      </section>
    </main>
  )
}

function Portfolio({ onShowIntro }: { onShowIntro: () => void }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [category, setCategory] = useState('all')
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeProject, setActiveProject] = useState<(typeof projects)[number] | null>(null)
  const [activeVideo, setActiveVideo] = useState<(typeof projects)[number] | null>(null)
  const [activeSection, setActiveSection] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [repos, setRepos] = useState<Array<{name:string;description:string|null;language:string|null;html_url:string}>>([])
  const [currentPage, setCurrentPage] = useState(1)
  const PROJECTS_PER_PAGE = 6
  const ARTWORK_PER_PAGE = 9
  const projectCloseButton = useRef<HTMLButtonElement>(null)
  const lightboxCloseButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.documentElement.lang = 'en'
    document.documentElement.dir = 'ltr'
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0B1220' : '#F4F8FC')
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch (error) {
      console.warn('Unable to save the theme preference.', error)
    }
  }, [theme])

  useEffect(() => {
    const ids = ['home','about','experience','skills','work','education','contact']
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target.id === 'home' || entry.target.id === 'contact') {
          entry.target.classList.toggle('ambient-active', entry.isIntersecting)
        }
      })
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActiveSection(visible.target.id)
    }, { rootMargin:'-10% 0px -10%', threshold:[0.05,0.25,0.5] })
    ids.forEach(id => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('.reveal-on-scroll'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      revealElements.forEach(element => element.classList.add('is-visible'))
      return
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          revealObserver.unobserve(entry.target)
        }
      })
    }, { rootMargin:'0px 0px -6% 0px', threshold:0.08 })

    revealElements.forEach(element => revealObserver.observe(element))
    return () => revealObserver.disconnect()
  }, [category, currentPage])

  useEffect(() => {
    fetch('https://api.github.com/users/OmegaAhmed/repos?per_page=100&sort=updated')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data) => setRepos(data.filter((r: {fork:boolean}) => !r.fork).slice(0, 6)))
      .catch(() => setRepos([]))
  }, [])

  useEffect(() => {
    if (!activeVideo && !activeProject && !lightbox) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveVideo(null)
        setActiveProject(null)
        setLightbox(null)
        setLightboxIndex(null)
      } else if (lightboxIndex !== null && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        event.preventDefault()
        const direction = event.key === 'ArrowRight' ? 1 : -1
        const nextIndex = (lightboxIndex + direction + artworkImages.length) % artworkImages.length
        setLightboxIndex(nextIndex)
        setLightbox(artworkImages[nextIndex])
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [activeVideo, activeProject, lightbox, lightboxIndex])

  useEffect(() => {
    if (activeProject) projectCloseButton.current?.focus()
  }, [activeProject])

  useEffect(() => {
    if (lightbox) lightboxCloseButton.current?.focus()
  }, [lightbox])

  const filtered = useMemo(() =>
    projects.filter((p) => p.visibility && (category === 'all' || p.category === category))
      .sort((a, b) => a.displayOrder - b.displayOrder),
  [category])
  const projectCards = filtered.filter(project => project.category !== 'graphic')
  const projectPageCount = Math.max(1, Math.ceil(projectCards.length / PROJECTS_PER_PAGE))
  const pagedProjectCards = projectCards.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  )
  const graphicProject = filtered.find(project => project.category === 'graphic')
  const galleryImages = [...new Set(graphicProject?.gallery ?? [])]
  const artworkPageCount = Math.max(1, Math.ceil(galleryImages.length / ARTWORK_PER_PAGE))
  const pagedArtworkImages = galleryImages.slice(
    (currentPage - 1) * ARTWORK_PER_PAGE,
    currentPage * ARTWORK_PER_PAGE
  )
  const pageCount = Math.max(projectPageCount, artworkPageCount)

  useEffect(() => {
    setCurrentPage(1)
  }, [category])

  const changePage = (page:number) => {
    setCurrentPage(Math.min(pageCount, Math.max(1, page)))
  }

  const scrollTo = (id:string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
  }

  const openArtwork = (index:number) => {
    setLightboxIndex(index)
    setLightbox(artworkImages[index] ?? null)
  }

  const closeLightbox = () => {
    setLightbox(null)
    setLightboxIndex(null)
  }

  const text = (value: Localized) => value.en

  return (
    <main className="portfolio-screen route-enter">
      <nav className="nav" aria-label="Primary navigation">
        <button className="brand" onClick={() => scrollTo('home')} aria-label="Home">
          <span>A</span><b>Ahmed Qotb</b>
        </button>
        <div id="primary-nav-links" className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {['about','experience','skills','work','education','contact'].map((id,index) =>
            <button className={activeSection === id ? 'active' : ''} key={id} onClick={() => scrollTo(id)} aria-current={activeSection === id ? 'location' : undefined}>{copy.nav[index]}</button>
          )}
          <button className="nav-intro" onClick={() => { setMenuOpen(false); onShowIntro() }}>Intro</button>
        </div>
        <div className="nav-actions">
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen} aria-controls="primary-nav-links">
            <span/><span/>
          </button>
          <button className="icon-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme" aria-pressed={theme === 'light'}>
            {theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
        </div>
      </nav>

      <section id="home" className="hero section">
        <div className="hero-copy">
          <div className="eyebrow"><span/> SENIOR WEB DEVELOPER &amp; GRAPHIC DESIGNER</div>
          <h1><span>I Turn Ideas{' '}</span><span>Into Digital{' '}</span><span>Experiences{' '}</span><span>That Stand <em>Out.</em></span></h1>
          <p className="hero-intro">Creative thinking. Technical precision. Digital experiences built with purpose.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => scrollTo('work')}>View My Work <ArrowDown size={17}/></button>
            <button className="secondary" onClick={() => scrollTo('contact')}>Let’s Connect <ArrowUpRight size={17}/></button>
          </div>
        </div>
        <CreativeVisual className="hero-visual" portraitSrc={publicAsset('images/profile/Ahmed.webp')}/>
      </section>

      <section id="about" className="about section reveal-on-scroll">
        <div className="about-editorial">
          <div className="about-introduction">
            <header className="about-title-column">
              <p className="about-label"><span>01 / ABOUT</span><span>DESIGN · DEVELOPMENT · MOTION</span></p>
              <h2 className="about-title">A Creative Mind With a Developer's <span>Perspective.</span></h2>
              <div className="about-title-detail" aria-hidden="true">
                <span/>
                <span/>
                <span/>
                <b>Precision with a creative point of view.</b>
              </div>
            </header>
            <div className="about-copy">
              <p className="lead">My professional journey brings together two worlds: the precision of development and the creativity of visual design. With expertise in front-end development, custom WordPress solutions, graphic design, and 2D motion graphics, I approach every project with a broader perspective.</p>
              <p>Rather than seeing design and development as separate disciplines, I use them together to solve problems, communicate ideas, and create meaningful digital experiences. My focus is always on combining functionality, aesthetics, and attention to detail.</p>
            </div>
          </div>
          <div className="about-expertise">
            <div className="about-subsection-heading">
              <span>AREAS OF EXPERTISE</span>
              <span>01 — 03</span>
            </div>
            <div className="about-expertise-grid">
              <article className="about-expertise-card">
                <div className="about-card-heading"><Code2 size={21} aria-hidden="true"/><span>01</span></div>
                <h3>Web Development</h3>
                <p>Modern websites, front-end experiences, and custom WordPress solutions.</p>
                <div className="about-code-detail" aria-hidden="true"><span>&lt;/&gt;</span><i/><i/><i/></div>
              </article>
              <article className="about-expertise-card">
                <div className="about-card-heading"><Palette size={21} aria-hidden="true"/><span>02</span></div>
                <h3>Graphic Design</h3>
                <p>Visual communication, digital design, and creative compositions.</p>
                <div className="about-design-detail" aria-hidden="true"><i/><i/><i/><i/></div>
              </article>
              <article className="about-expertise-card">
                <div className="about-card-heading"><Film size={21} aria-hidden="true"/><span>03</span></div>
                <h3>Motion Graphics</h3>
                <p>2D animation, visual storytelling, and engaging motion content.</p>
                <div className="about-motion-detail" aria-hidden="true"><i/><i/><i/><i/><i/></div>
              </article>
            </div>
          </div>
          <div className="about-foundation">
            <div className="about-highlights">
              <span className="about-foundation-label">PROFESSIONAL HIGHLIGHTS</span>
              <div className="about-highlight">
                <strong>10+</strong><span>Years in digital work</span>
              </div>
              <div className="about-highlight">
                <strong>03</strong><span>Connected creative disciplines</span>
              </div>
              <div className="about-tools" aria-label="Core areas">
                <span>Front-end</span><span>WordPress</span><span>Graphic design</span><span>2D motion</span>
              </div>
            </div>
            <aside className="about-approach">
              <span className="about-foundation-label">MY APPROACH</span>
              <h3>From Concept<br/>to <em>Execution.</em></h3>
              <p>I balance analytical thinking with visual sensitivity, refining each decision with care.</p>
            </aside>
          </div>
        </div>
      </section>

      <section id="experience" className="experience section reveal-on-scroll" aria-labelledby="experience-title">
        <div className="section-number">02</div>
        <header className="career-heading content-container">
          <span className="career-kicker"><i/> EXPERIENCE</span>
          <h2 id="experience-title">A career across <span>code &amp; design.</span></h2>
        </header>
        <div className="career-grid content-container">
          {experience.map((item, index) => {
            const Icon = experienceIcons[index] ?? Building2
            return (
              <article className="career-card reveal-on-scroll" key={item.company}>
                <header className="career-card-header">
                  <span className="career-period">{item.period}</span>
                  <span className="career-index" aria-hidden="true">0{index+1}</span>
                  <span className="career-icon" aria-hidden="true"><Icon size={19}/></span>
                </header>
                <p className="career-company">{item.company}</p>
                <h3 className="career-role">{text(item.role)}</h3>
                <ul className="career-points" aria-label="Responsibilities">
                  {item.points.en.map(point => <li key={point}>{point}</li>)}
                </ul>
                <div className="career-achievements">
                  <h4>Key achievements</h4>
                  <ul>{item.achievements.en.map(achievement => <li key={achievement}>{achievement}</li>)}</ul>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section id="skills" className="skills section reveal-on-scroll">
        <div className="section-number">03</div>
        <div className="section-heading">
          <span>CAPABILITIES</span>
          <h2>Tools I work with.</h2>
        </div>
        <div className="skill-grid">
          {skills.map((group, index) => {
            const Icon = skillIcons[index] ?? Code2
            return (
              <article className="skill-card reveal-on-scroll" key={index}>
                <div className="skill-card-top">
                  <div className="skill-number">0{index+1}</div>
                  <Icon className="skill-icon" size={25} aria-hidden="true"/>
                </div>
                <h3>{text(group.category)}</h3>
                <div className="skill-tags">
                  {group.items.map(item => <span key={item}>{item}</span>)}
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section id="work" className="work section reveal-on-scroll">
        <div className="section-number">04</div>
        <div className="work-header content-container">
          <div className="section-heading">
            <span>SELECTED WORK</span>
            <h2>Built, designed, animated.</h2>
          </div>
          <div className="filters" role="group" aria-label="Project filters">
            {[
              {id:'all', label:'All'},
              {id:'web', label:'Web'},
              {id:'graphic', label:'Graphic'},
              {id:'motion', label:'Motion'}
            ].map(filter => {
              const count = projects
                .filter(project => project.visibility)
                .reduce((total, project) => {
                  if (project.category === 'graphic') {
                    return filter.id === 'all' || filter.id === 'graphic'
                      ? total + new Set(project.gallery).size
                      : total
                  }
                  return total + (filter.id === 'all' || project.category === filter.id ? 1 : 0)
                }, 0)
              return (
                <button
                  className={category === filter.id ? 'active' : ''}
                  key={filter.id}
                  onClick={() => setCategory(filter.id)}
                  aria-pressed={category === filter.id}
                >
                  <span>{filter.label}</span><b>{count}</b>
                </button>
              )
            })}
          </div>
        </div>
        {pagedProjectCards.length > 0 && (
          <div className={`project-grid content-container project-grid-${category}`}>
          {pagedProjectCards.map((project) => (
            <article className={`project-card project-${project.category} reveal-on-scroll`} key={project.id}>
              <div className="project-media">
                {project.category === 'web' ? (
                  <div className="web-preview">
                    <div className="web-preview-bar" aria-hidden="true">
                      <span><i/><i/><i/></span>
                      <b>PROJECT PREVIEW</b>
                    </div>
                    <img src={publicAsset(project.thumbnail)} alt={text(project.title)} loading="lazy"/>
                  </div>
                ) : project.category === 'motion' ? (
                  <div className="motion-preview" aria-hidden="true">
                    <span className="motion-preview-label">MOTION / FILM {String(project.displayOrder - 6).padStart(2, '0')}</span>
                    <span className="motion-preview-wordmark">{text(project.title)}</span>
                    <span className="motion-preview-index">{String(project.displayOrder - 6).padStart(2, '0')}</span>
                  </div>
                ) : (
                  <img src={publicAsset(project.thumbnail)} alt={text(project.title)} loading="lazy"/>
                )}
                {project.category === 'motion' && project.videoUrl ? (
                  <button
                    className="project-overlay motion-play"
                    aria-label={`Play ${text(project.title)}`}
                    onClick={(event) => { event.stopPropagation(); setActiveVideo(project) }}
                  >
                    <span><Play size={22} fill="currentColor"/></span>
                  </button>
                ) : (
                  <div className="project-overlay"><ArrowUpRight size={24}/></div>
                )}
              </div>
              <div className="project-meta">
                <div>
                  <span>{project.category}</span>
                  <h3>{text(project.title)}</h3>
                </div>
              </div>
              <p>{text(project.shortDescription)}</p>
              {project.technologies.length > 0 && (
                <div className="project-technologies" aria-label="Technologies used">
                  {project.technologies.map(technology => <span key={technology}>{technology}</span>)}
                </div>
              )}
              {project.category === 'web' && (
                <button className="project-action" onClick={() => setActiveProject(project)} aria-haspopup="dialog">
                  Project details <ArrowUpRight size={15}/>
                </button>
              )}
              {project.category === 'web' && project.liveDemoUrl && (
                <a className="project-action" href={project.liveDemoUrl} target="_blank" rel="noreferrer">
                  View live project <ExternalLink size={15}/>
                </a>
              )}
              {project.category === 'motion' && project.videoUrl && (
                <button className="project-action" onClick={() => setActiveVideo(project)}>
                  Watch video <Play size={14} fill="currentColor"/>
                </button>
              )}
            </article>
          ))}
          </div>
        )}

        {filtered.some(p => p.category === 'graphic') && (
          <div className="gallery-grid content-container">
            {pagedArtworkImages.map((image, index) =>
              <button
                className="reveal-on-scroll"
                key={`${image}-${index}`}
                onClick={() => openArtwork(artworkImages.indexOf(image))}
                aria-label={`View artwork ${artworkImages.indexOf(image) + 1} of ${artworkImages.length}`}
              >
                <img src={publicAsset(image)} alt={`Graphic design work ${index + 1}`} loading="lazy"/>
              </button>
            )}
          </div>
        )}
        {pageCount > 1 && (
          <nav className="project-pagination content-container" aria-label="Project pagination">
            <button
              type="button"
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous project page"
            >
              <ChevronLeft size={16}/>
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(page =>
              <button
                type="button"
                className={currentPage === page ? 'active' : ''}
                key={page}
                onClick={() => changePage(page)}
                aria-current={currentPage === page ? 'page' : undefined}
                aria-label={`Go to project page ${page}`}
              >
                {page}
              </button>
            )}
            <button
              type="button"
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === pageCount}
              aria-label="Next project page"
            >
              <ChevronRight size={16}/>
            </button>
          </nav>
        )}
      </section>

      <section id="education" className="education section reveal-on-scroll">
        <div className="section-number">05</div>
        <div className="section-heading content-container">
          <span>EDUCATION & CERTIFICATIONS</span>
          <h2>Learning, continuously.</h2>
        </div>
        <h3 className="education-subheading content-container">Education</h3>
        <div className="education-grid content-container">
          {education.map(item =>
            <article className="education-card reveal-on-scroll" key={item.title.en}>
              <span>{item.period}</span><h3>{text(item.title)}</h3><p>{item.institution}</p>
            </article>
          )}
        </div>
        <h3 className="education-subheading certification-subheading content-container">Certificates & training</h3>
        <div className="certification-list content-container">
          {certifications.map((item) =>
            <article className="reveal-on-scroll" key={item.title.en}><span>{item.period}</span><h3>{text(item.title)}</h3><p>{item.institution}</p></article>
          )}
        </div>
      </section>

      <section id="contact" className="contact section reveal-on-scroll">
        <div className="contact-orb"/>
        <div className="contact-content content-container">
          <div className="contact-intro">
            <span>START A CONVERSATION</span>
            <h2><span>Have a</span><em>project in mind?</em></h2>
            <p>Let’s talk about what you’re building and how thoughtful design and development can bring it to life.</p>
            <a className="contact-cta" href={`mailto:${settings.email}`}>Let’s work together <ArrowUpRight size={17}/></a>
          </div>
          <div className="contact-links">
            <a className="contact-card reveal-on-scroll" href={`mailto:${settings.email}`}>
              <span className="contact-icon"><Mail size={19}/></span>
              <span className="contact-detail"><span>Email</span><b>{settings.email}</b></span>
              <ArrowUpRight className="contact-link-arrow" size={18} aria-hidden="true"/>
            </a>
            <a className="contact-card reveal-on-scroll" href={`tel:${settings.phone.replace(/[^\d+]/g, '')}`}>
              <span className="contact-icon"><Phone size={19}/></span>
              <span className="contact-detail"><span>Phone</span><b>{settings.phone}</b></span>
              <ArrowUpRight className="contact-link-arrow" size={18} aria-hidden="true"/>
            </a>
            <a className="contact-card reveal-on-scroll" href={settings.linkedin} target="_blank" rel="noreferrer">
              <span className="contact-icon"><ExternalLink size={19}/></span>
              <span className="contact-detail"><span>LinkedIn</span><b>Ahmed Kotb</b></span>
              <ArrowUpRight className="contact-link-arrow" size={18} aria-hidden="true"/>
            </a>
            <a className="contact-card reveal-on-scroll" href={settings.github} target="_blank" rel="noreferrer">
              <span className="contact-icon"><Code2 size={19}/></span>
              <span className="contact-detail"><span>GitHub</span><b>@OmegaAhmed</b></span>
              <ArrowUpRight className="contact-link-arrow" size={18} aria-hidden="true"/>
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div className="brand"><span>A</span><b>Ahmed Qotb</b></div>
        <p>© 2026 Ahmed Qotb</p>
        <a href={publicAsset(settings.cv)} download><Download size={16}/> CV</a>
      </footer>

      {repos.length > 0 && (
        <aside className="repo-strip" aria-label="Public GitHub repositories">
          {repos.slice(0,3).map(repo =>
            <a key={repo.name} href={repo.html_url} target="_blank" rel="noreferrer">
              <ExternalLink size={15}/><span>{repo.name}</span>{repo.language && <small>{repo.language}</small>}
            </a>
          )}
        </aside>
      )}

      {activeProject && (
        <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="active-project-title" onClick={() => setActiveProject(null)}>
          <button ref={projectCloseButton} className="project-modal-close" aria-label="Close project details" onClick={() => setActiveProject(null)}><X/></button>
          <div className="project-modal-content" onClick={event => event.stopPropagation()}>
            <div className="project-modal-copy">
              <span className="project-modal-category">{activeProject.category} project</span>
              <h2 id="active-project-title">{text(activeProject.title)}</h2>
              <p>{text(activeProject.shortDescription)}</p>
              {activeProject.technologies.length > 0 && (
                <div className="project-modal-technologies">
                  <h3>Technologies</h3>
                  <div className="project-technologies">
                    {activeProject.technologies.map(technology => <span key={technology}>{technology}</span>)}
                  </div>
                </div>
              )}
              <div className="project-modal-actions">
                {'liveDemoUrl' in activeProject && typeof activeProject.liveDemoUrl === 'string' && (
                  <a className="project-action primary" href={activeProject.liveDemoUrl} target="_blank" rel="noreferrer">
                    View live project <ExternalLink size={15}/>
                  </a>
                )}
                {'sourceCodeUrl' in activeProject && typeof activeProject.sourceCodeUrl === 'string' && (
                  <a className="project-action" href={activeProject.sourceCodeUrl} target="_blank" rel="noreferrer">
                    View source code <ExternalLink size={15}/>
                  </a>
                )}
              </div>
            </div>
            {activeProject.gallery.length > 0 && (
              <div className="project-modal-gallery">
                {activeProject.gallery.map((image, index) => (
                  <button key={`${image}-${index}`} onClick={() => setLightbox(image)} aria-label={`Enlarge project image ${index + 1}`}>
                    <img src={publicAsset(image)} alt={`${text(activeProject.title)} screenshot ${index + 1}`}/>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image preview" onClick={closeLightbox}>
          <button ref={lightboxCloseButton} className="lightbox-close" aria-label="Close preview" onClick={closeLightbox}><X/></button>
          {lightboxIndex !== null && artworkImages.length > 1 && (
            <>
              <button className="lightbox-previous" aria-label="Previous artwork" onClick={event => { event.stopPropagation(); openArtwork((lightboxIndex - 1 + artworkImages.length) % artworkImages.length) }}>
                <ChevronLeft/>
              </button>
              <button className="lightbox-next" aria-label="Next artwork" onClick={event => { event.stopPropagation(); openArtwork((lightboxIndex + 1) % artworkImages.length) }}>
                <ChevronRight/>
              </button>
            </>
          )}
          <img
            src={publicAsset(lightbox)}
            alt={lightboxIndex === null ? 'Expanded project image' : `Graphic design artwork ${lightboxIndex + 1} of ${artworkImages.length}`}
            onClick={event => event.stopPropagation()}
          />
        </div>
      )}
      {activeVideo && (
        <div className="video-modal" role="dialog" aria-modal="true" aria-labelledby="active-video-title" onClick={() => setActiveVideo(null)}>
          <button className="video-modal-close" aria-label="Close video" onClick={() => setActiveVideo(null)}><X/></button>
          <div className="video-modal-content" onClick={(event) => event.stopPropagation()}>
            <div className="video-modal-heading">
              <span>Motion Graphics</span>
              <h3 id="active-video-title">{text(activeVideo.title)}</h3>
            </div>
            <video
              key={activeVideo.videoUrl}
              src={publicAsset(activeVideo.videoUrl)}
              controls
              autoPlay
              playsInline
              preload="metadata"
            >
              Your browser does not support HTML5 video.
            </video>
          </div>
        </div>
      )}
    </main>
  )
}

function App() {
  const [showWelcome, setShowWelcome] = useState(() => isWelcomeRoute() || !hasEnteredPortfolio())
  const [showPortfolio, setShowPortfolio] = useState(() => !isWelcomeRoute() && hasEnteredPortfolio())
  const [isExiting, setIsExiting] = useState(false)
  const welcomeExitTimer = useRef<number | null>(null)

  useEffect(() => {
    if (showWelcome && !isWelcomePath()) {
      window.history.replaceState(null, '', getRoutePath('welcome'))
    }

    const handlePopState = () => {
      if (welcomeExitTimer.current !== null) {
        window.clearTimeout(welcomeExitTimer.current)
        welcomeExitTimer.current = null
      }
      setIsExiting(false)
      if (!isWelcomeRoute() && !hasEnteredPortfolio()) {
        window.history.replaceState(null, '', getRoutePath('welcome'))
        setShowWelcome(true)
        setShowPortfolio(false)
        return
      }
      const shouldShowWelcome = isWelcomeRoute()
      setShowWelcome(shouldShowWelcome)
      setShowPortfolio(!shouldShowWelcome)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [showWelcome])

  useEffect(() => () => {
    if (welcomeExitTimer.current !== null) window.clearTimeout(welcomeExitTimer.current)
  }, [])

  const enterPortfolio = () => {
    if (welcomeExitTimer.current !== null) return
    try {
      window.sessionStorage.setItem(INTRO_SESSION_KEY, 'true')
    } catch (error) {
      console.warn('Unable to save the intro visit preference.', error)
    }
    window.history.pushState(null, '', getRoutePath('home'))
    setShowPortfolio(true)
    setIsExiting(true)
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 520
    welcomeExitTimer.current = window.setTimeout(() => {
      welcomeExitTimer.current = null
      setIsExiting(false)
      setShowWelcome(false)
    }, duration)
  }

  const showIntro = () => {
    if (welcomeExitTimer.current !== null) {
      window.clearTimeout(welcomeExitTimer.current)
      welcomeExitTimer.current = null
    }
    window.history.pushState(null, '', getRoutePath('welcome'))
    setIsExiting(false)
    setShowPortfolio(false)
    setShowWelcome(true)
  }

  return (
    <>
      {showPortfolio && <Portfolio onShowIntro={showIntro}/>}
      {showWelcome && <WelcomeScreen onEnter={enterPortfolio} isExiting={isExiting}/>}
    </>
  )
}

export default App
