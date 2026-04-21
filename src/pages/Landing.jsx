// src/pages/Landing.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const FEATURES = [
  {
    icon: '🎉',
    title: 'Community Events',
    desc: 'Discover local gatherings, meetups, block parties, and neighborhood celebrations happening near you.',
    color: 'from-violet-500/20 to-violet-600/5 border-violet-500/20',
  },
  {
    icon: '🙋',
    title: 'Requests & Help',
    desc: 'Need a hand moving furniture or looking to borrow a ladder? Post a request and let neighbors help.',
    color: 'from-amber-500/20 to-amber-600/5 border-amber-500/20',
  },
  {
    icon: '🎁',
    title: 'Offers & Freebies',
    desc: 'Give away items, offer skills, or share surplus produce from your garden with your community.',
    color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20',
  },
  {
    icon: '📢',
    title: 'Announcements',
    desc: 'Share important local news, road closures, lost pets, or urgent neighborhood updates instantly.',
    color: 'from-sky-500/20 to-sky-600/5 border-sky-500/20',
  },
];

const STEPS = [
  { num: '01', title: 'Create an Account', desc: 'Sign up in seconds with your email or Google account. Your neighborhood awaits.' },
  { num: '02', title: 'Browse Your Feed', desc: 'See everything happening around you — events, requests, offers, and more — all in one place.' },
  { num: '03', title: 'Connect & Participate', desc: 'Comment, express interest, post your own updates, and become part of the community.' },
];

export default function Landing() {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen bg-surface-900 text-slate-100">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Animated gradient blob */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-brand-700/20 blur-3xl animate-pulse" />
          <div className="absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-brand-500/10 blur-3xl animate-pulse [animation-delay:1s]" />
          <div className="absolute bottom-0 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-brand-600/10 blur-3xl" />
        </div>

        {/* Hero grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
        />

        <div className="relative page-container pt-24 pb-32 text-center">
          {/* Pill label */}
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-4 py-1.5 text-sm text-brand-300 font-medium mb-8 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-brand-400 animate-pulse" />
            Your neighborhood, reimagined
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 animate-slide-up">
            Connect with your
            <span className="block bg-gradient-to-r from-brand-400 via-brand-300 to-lime-300 bg-clip-text text-transparent mt-1">
              neighborhood
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-slide-up [animation-delay:0.1s]">
            LocalLoop is the hyperlocal community board where neighbors post events, ask for help,
            share offers, and stay informed — all within your community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up [animation-delay:0.2s]">
            {currentUser ? (
              <Link to="/home" id="hero-cta-feed" className="btn-primary text-base px-8 py-3.5 animate-pulse-glow">
                Go to My Feed →
              </Link>
            ) : (
              <>
                <Link to="/signup" id="hero-cta-signup" className="btn-primary text-base px-8 py-3.5 animate-pulse-glow">
                  Get Started Free →
                </Link>
                <Link to="/login"  id="hero-cta-login"  className="btn-secondary text-base px-8 py-3.5">
                  Log In
                </Link>
              </>
            )}
          </div>

          {/* Social proof */}
          <p className="mt-8 text-xs text-slate-600 animate-fade-in [animation-delay:0.3s]">
            No credit card required · Free forever · Join your neighborhood today
          </p>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-heading mb-4">Everything your community needs</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Four powerful post types, one simple board. LocalLoop keeps your neighborhood connected.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`relative rounded-2xl border bg-gradient-to-br p-6 ${f.color} hover:-translate-y-1 transition-transform duration-300`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-heading mb-4">Up and running in minutes</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Getting started with LocalLoop is effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center shadow-lg shadow-brand-900/50 group-hover:shadow-brand-600/30 transition-shadow">
                    <span className="text-2xl font-black text-white">{step.num}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-brand-700 to-transparent ml-2" />
                  )}
                </div>
                <h3 className="font-bold text-white text-lg mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            {!currentUser && (
              <Link to="/signup" id="how-it-works-cta" className="btn-primary text-base px-10 py-3.5">
                Join LocalLoop Today →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="border-t border-surface-700/50 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <img src="/logo2.png" alt="LocalLoop" className="h-8 w-auto object-contain" />
          </div>
          <nav className="flex gap-6 text-sm text-slate-500">
            <Link to="/login"  className="hover:text-slate-300 transition-colors">Log In</Link>
            <Link to="/signup" className="hover:text-slate-300 transition-colors">Sign Up</Link>
          </nav>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} LocalLoop. Built for neighbors.</p>
        </div>
      </footer>
    </div>
  );
}
