import React from 'react';
import { Lock, Clock, ChevronRight, PlayCircle } from 'lucide-react';
import { Chapter } from '../types';
import { Link } from 'react-router-dom';

interface ChapterCardProps {
  chapter: Chapter;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter }) => {
  const isLocked = chapter.status === 'locked';
  const isComingSoon = chapter.status === 'coming_soon';
  const isActive = chapter.status === 'active';

  return (
    <div 
      className={`relative group rounded-xl p-6 border transition-all duration-300 ${
        isActive 
            ? 'glass-panel border-primary/30 shadow-[0_0_20px_rgba(56,189,248,0.1)] hover:border-primary/50' 
            : 'bg-secondary/10 border-white/5 opacity-70 hover:opacity-100'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-mono px-2 py-1 rounded ${
            isActive ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'
        }`}>
            CH-{chapter.id}
        </span>
        {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
        {isComingSoon && <Clock className="w-4 h-4 text-muted-foreground" />}
        {isActive && <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(56,189,248,1)] animate-pulse" />}
      </div>

      <h3 className={`text-lg font-medium mb-2 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
        {chapter.title}
      </h3>
      
      <p className="text-xs text-muted-foreground line-clamp-2 mb-6">
        {chapter.description || "Master the concepts needed for JEE Advanced."}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="text-xs text-muted-foreground capitalize">{chapter.category}</div>
        
        {isActive ? (
            <Link to="/learn/projectile-motion">
                <button className="flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all">
                    Enter Lab <ChevronRight className="w-4 h-4" />
                </button>
            </Link>
        ) : (
            <span className="text-xs text-muted-foreground italic">
                {isComingSoon ? "Available soon" : "Prerequisites needed"}
            </span>
        )}
      </div>
    </div>
  );
};

export default ChapterCard;