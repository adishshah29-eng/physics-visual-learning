import React, { useState, useRef, useEffect } from 'react';
import { Atom, ArrowLeft, Flame, ChevronDown, LogOut, User, Settings, Shield } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface NavbarProps {
  currentChapter?: string;
}

const appNavLinks = [
  { path: '/home', label: 'Home' },
  { path: '/practice', label: 'Practice' },
  { path: '/analytics', label: 'Analytics' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/learn', label: 'Simulations' },
];

const Navbar: React.FC<NavbarProps> = ({ currentChapter }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, profile, signOut } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isPublicRoute = location.pathname === '/' || location.pathname === '/auth';
  const isChapterPage = location.pathname.startsWith('/learn/');
  const isAppRoute = !isPublicRoute;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    navigate('/', { replace: true });
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n.charAt(0)).join('').toUpperCase().slice(0, 2);

  const streak = profile?.streak_days || 0;

  // ─── PUBLIC NAVBAR ───────────────────────────────────────────────────────────
  if (isPublicRoute && !isAuthenticated) {
    return (
      <nav className="fixed top-0 left-0 right-0 h-16 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sky-400">
            <Atom className="w-6 h-6" />
            <span className="font-bold tracking-wider" style={{ fontFamily: "'IBM Plex Mono',monospace" }}>PHYSICS.LAB</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2">Sign In</Link>
            <Link to="/auth" className="bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg px-5 py-2 text-sm transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>
    );
  }

  // ─── CHAPTER PAGE NAVBAR ─────────────────────────────────────────────────────
  if (isChapterPage) {
    return (
      <nav className="fixed top-0 left-0 right-0 h-16 z-50 glass-nav flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4 w-1/4 sm:w-1/3">
          <Link to="/learn" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline text-sm font-medium">Back to Courses</span>
          </Link>
        </div>
        <div className="w-1/2 sm:w-1/3 flex justify-center">
          {currentChapter ? (
            <h1 className="text-foreground font-medium text-sm sm:text-lg tracking-wide truncate px-2">{currentChapter}</h1>
          ) : (
            <span className="text-muted-foreground text-sm">Select a Module</span>
          )}
        </div>
        <div className="w-1/4 sm:w-1/3 flex justify-end">
          <span className="hidden sm:inline-block text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full border border-border">
            Class 11–12 | JEE / CET
          </span>
        </div>
      </nav>
    );
  }

  // ─── APP NAVBAR ──────────────────────────────────────────────────────────────
  if (isAppRoute && isAuthenticated) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav flex flex-col shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between w-full">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 text-sky-400 shrink-0">
            <Atom className="w-5 h-5" />
            <span className="font-bold tracking-wider text-sm sm:text-base" style={{ fontFamily: "'IBM Plex Mono',monospace" }}>PHYSICS.LAB</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {appNavLinks.map((link) => {
              const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-sky-400 bg-sky-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {link.label}
                  {isActive && <div className="h-0.5 bg-sky-400 mt-0.5 rounded-full" />}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-slate-300 font-medium">{streak}</span>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-xs font-semibold text-sky-400">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getInitials(profile?.name || 'U')
                  )}
                </div>
                <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:block" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-slate-800">
                    <p className="text-sm font-medium text-white truncate">{profile?.name || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{profile?.email || ''}</p>
                  </div>
                  <div className="py-1">
                    {profile?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-sky-400 hover:bg-sky-500/10 transition-colors border-b border-sky-500/10">
                        <Shield className="w-4 h-4" /> Admin Portal
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 transition-colors">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link to="/settings" onClick={() => setDropdownOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 transition-colors">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                  </div>
                  <div className="border-t border-slate-800 py-1">
                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav strip */}
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-sm w-full">
          <div className="flex overflow-x-auto no-scrollbar px-4 gap-1 py-1 items-center">
            {appNavLinks.map((link) => {
              const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-500'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    );
  }

  // ─── FALLBACK ─────────────────────────────────────────────────────────────────
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 glass-nav flex items-center justify-center">
      <Link to="/" className="flex items-center gap-2 text-sky-400">
        <Atom className="w-6 h-6" />
        <span className="font-bold tracking-wider" style={{ fontFamily: "'IBM Plex Mono',monospace" }}>PHYSICS.LAB</span>
      </Link>
    </nav>
  );
};

export default Navbar;