import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Atom, Zap, BookOpen, BarChart3, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const floatingFormulas = [
  'F = ma', 'E = mc²', 'v = u + at', 'KE = ½mv²', 'F = -kx',
  'T = 2π√(l/g)', 'PV = nRT', 'λ = h/p', 'V = IR', 'τ = r × F',
  'ω = 2πf', 'p = mv', 'W = Fd cos θ', 'g = GM/r²', 'a = v²/r',
];

const Landing: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/home', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Floating formulas background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingFormulas.map((formula, i) => (
          <span
            key={i}
            className="absolute text-slate-500 font-mono select-none"
            style={{
              left: `${(i * 7.3) % 100}%`,
              top: `${(i * 11.7) % 100}%`,
              fontSize: `${12 + (i % 4) * 3}px`,
              opacity: 0.05,
              animation: `floatFormula ${20 + (i % 5) * 5}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            {formula}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes floatFormula {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(2deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
          75% { transform: translateY(-25px) rotate(1deg); }
        }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sky-400">
            <Atom className="w-6 h-6" />
            <span className="font-bold tracking-wider text-lg">PHYSICS.LAB</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              className="bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg px-5 py-2 text-sm transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-3 h-3" />
            Now with AI-Powered Analytics
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
            Master JEE Physics with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
              Visual Learning + AI
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Interactive simulations, 10,000+ PYQs, AI tutor and ML-powered
            analytics — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg px-8 py-3 text-base transition-all hover:shadow-lg hover:shadow-sky-500/25 flex items-center gap-2"
            >
              Start Free <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/auth"
              className="border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-lg px-8 py-3 text-base transition-colors"
            >
              See Simulations
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-slate-800/60">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 sm:gap-16">
          {[
            { num: '7', label: 'Simulations' },
            { num: '10,000+', label: 'Questions' },
            { num: '3', label: 'Exams' },
            { num: 'AI', label: 'Powered' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.num}</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything You Need to{' '}
            <span className="text-sky-400">Ace Physics</span>
          </h2>
          <p className="text-slate-400 text-center mb-14 max-w-xl mx-auto">
            A complete learning ecosystem designed for JEE and MHT CET aspirants.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Visual Learning */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-sky-500/40 transition-all duration-300 group">
              <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-sky-500/20 transition-colors">
                <Atom className="w-6 h-6 text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Visual Learning</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Interactive physics simulations for every chapter. Visualize projectile motion,
                SHM, waves, and more with real-time parameter controls.
              </p>
            </div>

            {/* Card 2: MCQ Practice */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-violet-500/40 transition-all duration-300 group">
              <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-violet-500/20 transition-colors">
                <BookOpen className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">MCQ Practice</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Year-wise previous year questions (PYQs) from JEE Main, JEE Advanced,
                and MHT CET with detailed explanations and spaced repetition.
              </p>
            </div>

            {/* Card 3: AI Analytics */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-emerald-500/40 transition-all duration-300 group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Analytics</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                ML-powered performance tracking with Bayesian Knowledge Tracing, predicted
                scores, weak topic detection, and personalized study plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exams Supported */}
      <section className="py-16 px-6 border-t border-slate-800/60">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8">Exams Supported</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { name: 'JEE Main', color: 'sky' },
              { name: 'JEE Advanced', color: 'violet' },
              { name: 'MHT CET', color: 'emerald' },
            ].map((exam) => (
              <div
                key={exam.name}
                className={`px-6 py-3 rounded-xl border font-semibold text-sm
                  ${exam.color === 'sky' ? 'bg-sky-500/10 border-sky-500/30 text-sky-400' : ''}
                  ${exam.color === 'violet' ? 'bg-violet-500/10 border-violet-500/30 text-violet-400' : ''}
                  ${exam.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : ''}
                `}
              >
                {exam.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800/60 text-center">
        <p className="text-slate-500 text-sm">© 2025 PHYSICS.LAB</p>
      </footer>
    </div>
  );
};

export default Landing;
