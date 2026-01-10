import React from 'react';
import { ArrowLeft, Atom } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  currentChapter?: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentChapter }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 z-50 glass-nav flex items-center justify-between px-6">
      <div className="flex items-center gap-4 w-1/3">
        {!isDashboard ? (
          <Link to="/" className="flex items-center text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back to Courses</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-primary">
            <Atom className="w-6 h-6" />
            <span className="font-bold tracking-wider">PHYSICS.LAB</span>
          </div>
        )}
      </div>

      <div className="w-1/3 flex justify-center">
        {currentChapter ? (
          <h1 className="text-foreground font-medium text-lg tracking-wide">{currentChapter}</h1>
        ) : (
          <span className="text-muted-foreground text-sm">Select a Module</span>
        )}
      </div>

      <div className="w-1/3 flex justify-end">
        <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full border border-border">
          Class 11–12 | JEE / CET
        </span>
      </div>
    </nav>
  );
};

export default Navbar;