'use client';

import React from 'react';
import { Flame, RotateCcw, Heart } from 'lucide-react';

interface NavbarProps {
  matchesCount: number;
  onOpenMatches: () => void;
  onReset: () => void;
  isResetting?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  matchesCount,
  onOpenMatches,
  onReset,
  isResetting = false,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-coy-border/60 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Coy Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-coy flex items-center justify-center shadow-lg shadow-coy-rose/30">
            <Flame className="w-5 h-5 text-white fill-white" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-xl tracking-tight text-white">
              Coy
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-coy-surface text-coy-300 border border-coy-border">
              Discover
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Matches quick pill */}
          <button
            onClick={onOpenMatches}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-coy-surface hover:bg-coy-border/80 border border-coy-border transition text-xs font-medium text-white group"
            title="View Matches"
          >
            <Heart className="w-3.5 h-3.5 text-coy-rose fill-coy-rose transition group-hover:scale-110" />
            <span>{matchesCount}</span>
          </button>

          {/* Reset Demo button */}
          <button
            onClick={onReset}
            disabled={isResetting}
            className="p-1.5 rounded-full bg-coy-surface hover:bg-coy-border border border-coy-border text-gray-300 hover:text-white transition disabled:opacity-50"
            title="Reset Demo (refreshes all 32 profiles)"
          >
            <RotateCcw
              className={`w-4 h-4 ${isResetting ? 'animate-spin text-coy-rose' : ''}`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
