'use client';

import React from 'react';
import { Home, Compass, Heart } from 'lucide-react';

export type TabType = 'home' | 'discover' | 'matches';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  matchesCount: number;
}

export const TabBar = ({
  activeTab,
  onTabChange,
  matchesCount,
}: TabBarProps) => {
  return (
    <nav className="shrink-0 w-full px-4 pb-3 pt-1 z-30">
      <div className="glass rounded-2xl border border-coy-border/80 p-1 shadow-2xl backdrop-blur-xl flex items-center justify-around">
        <button
          onClick={() => onTabChange('home')}
          className={`flex-1 flex flex-col items-center py-1.5 px-3 rounded-xl transition duration-150 ${
            activeTab === 'home'
              ? 'text-white bg-coy-surface/90'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Home"
        >
          <Home
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              activeTab === 'home' ? 'text-coy-coral stroke-[2.5]' : 'stroke-2'
            }`}
          />
          <span className="text-[10px] sm:text-[11px] font-medium mt-0.5">Home</span>
        </button>

        <button
          onClick={() => onTabChange('discover')}
          className={`flex-1 flex flex-col items-center py-1.5 px-3 rounded-xl transition duration-150 relative ${
            activeTab === 'discover'
              ? 'text-white bg-coy-surface/90'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Discover"
        >
          <div className="relative">
            <Compass
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                activeTab === 'discover'
                  ? 'text-coy-rose stroke-[2.5]'
                  : 'stroke-2'
              }`}
            />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-coy-rose" />
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium mt-0.5">Discover</span>
        </button>

        <button
          onClick={() => onTabChange('matches')}
          className={`flex-1 flex flex-col items-center py-1.5 px-3 rounded-xl transition duration-150 relative ${
            activeTab === 'matches'
              ? 'text-white bg-coy-surface/90'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Matches"
        >
          <div className="relative">
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                activeTab === 'matches'
                  ? 'text-coy-rose fill-coy-rose stroke-[2.5]'
                  : 'stroke-2'
              }`}
            />
            {matchesCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1 rounded-full bg-gradient-coy text-[9px] font-bold text-white shadow-sm min-w-3.5 text-center leading-tight">
                {matchesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium mt-0.5">Matches</span>
        </button>
      </div>
    </nav>
  );
};
