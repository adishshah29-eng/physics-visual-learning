import React from 'react';
import { Lock, Clock, ChevronRight } from 'lucide-react';
import { Chapter } from '@/types';
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
          ? 'bg-slate-900/50 backdrop-blur-sm border-sky-500/30 shadow-[0_0_20px_rgba(56,189,248,0.05)] hover:border-sky-500/50' 
          : 'bg-slate-900/20 border-white/5 opacity-70 hover:opacity-100'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-mono px-2 py-1 rounded ${
          isActive ? 'bg-sky-500/20 text-sky-400' : 'bg-white/5 text-slate-500'
        }`}>
          {chapter.code}
        </span>

        {isLocked && <Lock className="w-4 h-4 text-slate-500" />}
        {isComingSoon && <Clock className="w-4 h-4 text-slate-500" />}
        {isActive && (
          <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,1)] animate-pulse" />
        )}
      </div>

      <h3 className={`text-lg font-medium mb-2 ${
        isActive ? 'text-slate-100' : 'text-slate-500'
      }`}>
        {chapter.title}
      </h3>

      <p className="text-xs text-slate-400 line-clamp-2 mb-6">
        {chapter.description || "Master the concepts needed for JEE Advanced."}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
          {chapter.category}
        </div>

        {isActive ? (
          <Link to={`/learn/${chapter.id}`}>
            <button className="flex items-center gap-2 text-sm text-sky-400 font-medium group-hover:gap-3 transition-all cursor-pointer">
              Enter Lab <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        ) : (
          <span className="text-xs text-slate-500 italic">
            {isComingSoon ? "Available soon" : "Locked Module"}
          </span>
        )}
      </div>
    </div>
  );
};

export default ChapterCard;
