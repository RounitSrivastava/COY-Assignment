'use client';

import React from 'react';
import { Compass, RotateCcw, Heart, CheckCircle2 } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
  onViewMatches: () => void;
  matchesCount: number;
  isResetting?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onReset,
  onViewMatches,
  matchesCount,
  isResetting = false,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in my-auto">
      {/* Animated Radar Pulse */}
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-coy-rose/20 animate-ping" />
        <div className="w-24 h-24 rounded-full bg-coy-surface border border-coy-border/80 flex items-center justify-center relative shadow-2xl">
          <Compass className="w-10 h-10 text-coy-rose animate-spin-slow" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-3">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>All Caught Up</span>
      </div>

      <h3 className="text-2xl font-bold text-white mb-2">
        No More Profiles Nearby
      </h3>
      <p className="text-sm text-gray-400 max-w-xs mb-8">
        You’ve swiped through all available profiles in your area. Check back later or reset your feed to demo again!
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        {matchesCount > 0 && (
          <button
            onClick={onViewMatches}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-coy text-white font-semibold text-sm shadow-lg shadow-coy-rose/25 hover:opacity-95 transition"
          >
            <Heart className="w-4 h-4 fill-white" />
            <span>View {matchesCount} {matchesCount === 1 ? 'Match' : 'Matches'}</span>
          </button>
        )}

        <button
          onClick={onReset}
          disabled={isResetting}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-coy-surface border border-coy-border hover:bg-coy-border/80 text-white font-medium text-sm transition disabled:opacity-50"
        >
          <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin text-coy-rose' : ''}`} />
          <span>Reset Demo</span>
        </button>
      </div>
    </div>
  );
};
