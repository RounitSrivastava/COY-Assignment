'use client';

import React from 'react';
import { Compass, Sparkles } from 'lucide-react';

interface HomeTabProps {
  onGoToDiscover: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onGoToDiscover }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-3xl bg-coy-surface border border-coy-border flex items-center justify-center mb-5 shadow-xl">
        <Sparkles className="w-8 h-8 text-coy-coral" />
      </div>

      <h2 className="text-xl font-bold text-white mb-2">Home (Placeholder)</h2>
      <p className="text-sm text-gray-400 max-w-xs mb-6">
        As specified in the assignment requirements, the Home tab is kept blank. Head over to the <span className="text-coy-300 font-semibold">Discover</span> tab to experience the swipe discovery feature.
      </p>

      <button
        onClick={onGoToDiscover}
        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-coy text-white text-sm font-semibold shadow-lg shadow-coy-rose/30 hover:opacity-95 transition"
      >
        <Compass className="w-4 h-4" />
        <span>Open Discover Tab</span>
      </button>
    </div>
  );
};
