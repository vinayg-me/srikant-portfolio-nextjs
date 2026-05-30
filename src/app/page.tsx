import { client } from '@/sanity/client'
import { profileQuery, projectsQuery, tracksQuery, testimonialsQuery } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import { PortfolioGrid } from '@/components/features/PortfolioGrid'
import { AudioPlayer } from '@/components/features/AudioPlayer'
import { AboutTabs } from '@/components/features/AboutTabs'
import { ContactForm } from '@/components/features/ContactForm'
import { Music, Mail, MapPin, Film, Award, Play, ChevronRight, User } from 'lucide-react'

// Prevent caching during static builds to fetch live CMS content on request
export const revalidate = 60

export default async function Home() {
  // Parallel fetch content from Sanity
  const [profile, projects, tracks, testimonials] = await Promise.all([
    client.fetch(profileQuery),
    client.fetch(projectsQuery),
    client.fetch(tracksQuery),
    client.fetch(testimonialsQuery),
  ])

  // Fallback defaults in case CMS is not populated/connected
  const activeProfile = profile || {
    name: 'Srikant Krishna',
    headline: 'Music Composer | Music Producer | Orchestrator',
    bio: 'Srikant Krishna is a prolific Music Composer, Producer and Orchestrator from India, having an extensive experience of working on diverse projects: short and feature films, documentaries, games, songs, jingles etc.',
    yearsOfExp: 10,
    completedProjects: 350,
    noOfClients: 200,
    skills: ['Logic Pro X', 'Protools', 'Cubase', 'FL Studio', 'Sibelius'],
    experienceBreakdown: [{ noOfProjects: '100+ projects', typeOfProject: 'Orchestration' }],
    educationBreakdown: [{ titleOfDegree: 'Master of Music', college: 'Berklee College of Music', years: '2018 - 2019' }],
  }

  const profileImageUrl = activeProfile.profileImage 
    ? urlFor(activeProfile.profileImage).width(800).url() 
    : 'https://res.cloudinary.com/dedocj07m/image/upload/v1678536334/Website/Srikant-Personal_cyxaue.png'

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header / Navigation bar */}
      <header className="sticky top-0 z-50 w-full bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
          <a href="#" className="flex items-center gap-2.5 font-serif text-lg md:text-2xl font-bold tracking-wider text-white group">
            <img
              src="/Srikant-Logo.jpg"
              alt="Srikant Krishna Logo"
              className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-lg border border-neutral-800 bg-neutral-900/50 p-0.5 group-hover:border-gold/50 transition-colors duration-300"
            />
            <span className="leading-none select-none hidden min-[460px]:inline">
              SRIKANT <span className="text-gold">KRISHNA</span>
            </span>
          </a>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#about" className="hover:text-gold transition">Bio</a>
            <a href="#services" className="hover:text-gold transition">Services</a>
            <a href="#credits" className="hover:text-gold transition">Credits</a>
            <a href="#music" className="hover:text-gold transition">Showcase</a>
            <a href="#testimonials" className="hover:text-gold transition">Testimonials</a>
            <a href="#contact" className="hover:text-gold transition">Collaborate</a>
          </nav>
          
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="px-4 py-2 md:px-5 md:py-2.5 bg-neutral-900 border border-neutral-800 hover:border-gold hover:text-gold rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider text-neutral-300 transition-all duration-300"
            >
              Get In Touch
            </a>

            {/* CSS Checkbox Hack for Mobile Menu Toggle */}
            <input type="checkbox" id="mobile-menu-toggle" className="hidden peer" />
            <label
              htmlFor="mobile-menu-toggle"
              className="md:hidden p-2 text-neutral-400 hover:text-white cursor-pointer select-none relative z-50 flex items-center justify-center rounded-lg border border-neutral-900/60 bg-neutral-950/40"
            >
              <svg className="w-5 h-5 fill-current transition-transform duration-300 peer-checked:rotate-90" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 5h14a1 1 0 100-2H3a1 1 0 100 2zm0 6h14a1 1 0 100-2H3a1 1 0 100 2zm0 6h14a1 1 0 100-2H3a1 1 0 100 2z" />
              </svg>
            </label>

            {/* Mobile Navigation Dropdown Menu */}
            <div className="absolute top-20 left-0 w-full bg-neutral-950/95 backdrop-blur-md border-b border-neutral-900 hidden peer-checked:flex flex-col items-center py-6 gap-5 text-sm font-semibold tracking-wider text-neutral-300 animate-in fade-in slide-in-from-top-5 duration-200 shadow-xl z-40">
              <a href="#about" className="hover:text-gold transition py-1 w-full text-center">Bio</a>
              <a href="#services" className="hover:text-gold transition py-1 w-full text-center">Services</a>
              <a href="#credits" className="hover:text-gold transition py-1 w-full text-center">Credits</a>
              <a href="#music" className="hover:text-gold transition py-1 w-full text-center">Showcase</a>
              <a href="#testimonials" className="hover:text-gold transition py-1 w-full text-center">Testimonials</a>
              <a href="#contact" className="hover:text-gold transition py-1 w-full text-center">Collaborate</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          {/* Hero details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gold/10 border border-gold/20 text-gold text-xs font-semibold uppercase tracking-widest">
              <Award className="w-3.5 h-3.5" />
              Grammy Winning Album Contributor
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] text-white">
              Elevating Emotions <br />
              <span className="bg-gradient-to-r from-gold to-teal bg-clip-text text-transparent">
                Through Music
              </span>
            </h1>
            <p className="text-neutral-400 text-base md:text-lg max-w-xl font-sans">
              Professional scoring, orchestration, and music production for feature films, video games, documentaries, and commercial ad campaigns.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#music"
                className="px-8 py-3.5 bg-teal hover:bg-teal/90 text-background font-bold rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.25)] flex items-center gap-2 transition duration-300 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Listen to Works
              </a>
              <a
                href="#contact"
                className="px-8 py-3.5 bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white hover:border-neutral-600 font-bold rounded-lg flex items-center gap-2 transition duration-300 cursor-pointer"
              >
                Book Collaboration
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Hero Profile Image */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="w-[320px] sm:w-[380px] aspect-[4/5] rounded-3xl overflow-hidden glass-panel border border-neutral-800/80 relative shadow-[0_0_50px_rgba(212,175,55,0.05)]">
              <img
                src={profileImageUrl}
                alt={activeProfile.name}
                className="w-full h-full object-cover grayscale contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-transparent to-transparent" />
            </div>
            {/* Visual soundwaves representation */}
            <div className="absolute bottom-6 right-6 lg:right-[-20px] bg-neutral-950/80 border border-neutral-800/50 backdrop-blur-md px-4 py-3 rounded-xl flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-teal animate-ping" />
              <div className="text-left">
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-semibold">Active Session</p>
                <p className="text-xs text-white font-bold font-serif leading-none mt-1">AIR Studios, London</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaborator logos marquee */}
      <section className="py-12 bg-neutral-950/50 border-y border-neutral-900/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-widest font-semibold text-neutral-500 mb-6">
            Collaborated With Industry Stalwarts
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-neutral-400 font-serif text-sm font-bold opacity-75">
            <span>A.R. RAHMAN</span>
            <span>SALIM-SULAIMAN</span>
            <span>RICKY KEJ</span>
            <span>ARJUN JANYA</span>
            <span>THAMAN S</span>
            <span>SANCHIT BALHARA</span>
          </div>
        </div>
      </section>

      {/* Bio / About Section */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Bio details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-bold text-teal">Composer Bio</span>
              <h2 className="font-serif text-4xl font-bold text-white">Srikant Krishna</h2>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed whitespace-pre-line font-sans">
              {activeProfile.bio}
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-neutral-900">
              <div className="text-left">
                <h3 className="font-serif text-3xl font-bold text-gold">{activeProfile.yearsOfExp}+</h3>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">Years of Exp</p>
              </div>
              <div className="text-left">
                <h3 className="font-serif text-3xl font-bold text-gold">{activeProfile.completedProjects}+</h3>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">Credits Completed</p>
              </div>
              <div className="text-left">
                <h3 className="font-serif text-3xl font-bold text-gold">{activeProfile.noOfClients}+</h3>
                <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">Happy Clients</p>
              </div>
            </div>
          </div>

          {/* Interactive tab breakdown */}
          <div className="lg:col-span-6 p-8 rounded-2xl glass-panel border border-neutral-900">
            <AboutTabs
              skills={activeProfile.skills}
              experience={activeProfile.experienceBreakdown}
              education={activeProfile.educationBreakdown}
            />
          </div>
        </div>
      </section>

      {/* Services / Expertise */}
      <section id="services" className="py-24 bg-neutral-950/40 border-y border-neutral-900/40 w-full">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-teal">Expertise</span>
            <h2 className="font-serif text-4xl font-bold text-white">Professional Music Services</h2>
            <p className="text-neutral-400 text-sm">
              Providing end-to-end music composition, arrangement, and programming for creative storytelling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl glass-panel space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal flex items-center justify-center border border-teal/20">
                <Film className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Film & Game Scoring</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Composing custom themes and background scores that reinforce narrative tension, character arcs, and gameplay dynamics.
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-panel space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center border border-gold/20">
                <Music className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Orchestration & Arranging</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Expert music arrangement and conducting services for live orchestra sessions (Budapest, Macedonia, Air London).
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-panel space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal flex items-center justify-center border border-teal/20">
                <User className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Production & Programming</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                High-fidelity audio synthesis, DAW mixing preparation, virtual instruments programming, and multitrack editing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid Credits */}
      <section id="credits" className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-teal">Discography</span>
            <h2 className="font-serif text-4xl font-bold text-white">Film & Game Credits</h2>
            <p className="text-neutral-400 text-sm">
              An overview of movies, documentaries, and video games featuring orchestration or composition credits.
            </p>
          </div>

          <PortfolioGrid projects={projects} />
        </div>
      </section>

      {/* Audio Showcase Player */}
      <section id="music" className="py-24 bg-neutral-950/40 border-y border-neutral-900/40 w-full">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-teal">Showcase</span>
            <h2 className="font-serif text-4xl font-bold text-white">Listen to Preview Tracks</h2>
            <p className="text-neutral-400 text-sm">
              Explore music previews across different cinematic moods and genres.
            </p>
          </div>

          <AudioPlayer tracks={tracks} />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 max-w-7xl mx-auto px-6 w-full">
        <div className="space-y-16">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-teal">Testimonials</span>
            <h2 className="font-serif text-4xl font-bold text-white">What Peers Say</h2>
            <p className="text-neutral-400 text-sm">
              Feedback from esteemed musicians, violinists, and directors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t: any) => {
              const avatarUrl = t.avatar ? urlFor(t.avatar).width(120).url() : null

              return (
                <div 
                  key={t._id} 
                  className="relative p-8 rounded-2xl bg-neutral-950/40 backdrop-blur-md border border-neutral-900/80 hover:border-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.05)] transition-all duration-500 group flex flex-col justify-between overflow-hidden"
                >
                  {/* Classy decorative quote mark */}
                  <span className="font-serif text-7xl text-gold/15 absolute top-2 left-4 pointer-events-none select-none">“</span>
                  
                  <div className="relative z-10 space-y-6 pt-4">
                    <p className="text-neutral-200 text-sm italic font-serif font-light leading-relaxed tracking-wide">
                      "{t.quote}"
                    </p>
                    
                    <div className="flex items-center gap-3.5 pt-4 border-t border-neutral-900/60">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={t.author}
                          className="w-11 h-11 rounded-full object-cover border border-neutral-800 group-hover:border-gold/50 transition-colors duration-500"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs text-neutral-400 group-hover:border-gold/50 transition-colors duration-500">
                          {t.author[0]}
                        </div>
                      )}
                      <div>
                        <h4 className="font-serif text-sm font-bold text-white tracking-wide group-hover:text-gold transition-colors duration-500">
                          {t.author}
                        </h4>
                        <p className="text-[10px] text-teal/80 mt-0.5 uppercase tracking-widest font-semibold">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-neutral-950/40 border-t border-neutral-900/60 w-full">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-xs uppercase tracking-widest font-bold text-teal">Contact</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white">Let's Collaborate</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              If you have an upcoming movie, game, documentary, or commercial project requiring rich compositions or professional orchestration, get in touch to plan your recording session.
            </p>

            <div className="space-y-4 pt-4 text-sm text-neutral-300">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold" />
                <span>contact@srikantkrishna.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gold" />
                <span>Bangalore, India / London, UK</span>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className="w-4 h-4 text-gold fill-current shrink-0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal transition"
                >
                  linkedin.com/in/srikant-krishna
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-neutral-950 border-t border-neutral-900/40 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Srikant Krishna. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#about" className="hover:text-white transition">Bio</a>
            <a href="#credits" className="hover:text-white transition">Credits</a>
            <a href="/studio" className="hover:text-white transition">Admin Studio</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
