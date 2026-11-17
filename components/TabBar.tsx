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
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-4 pt-2">
      <div className="glass rounded-3xl border border-coy-border/80 p-1.5 shadow-2xl backdrop-blur-xl flex items-center justify-around">
        <button
          onClick={() => onTabChange('home')}
          className={`flex-1 flex flex-col items-center py-2 px-3 rounded-2xl transition duration-200 ${
            activeTab === 'home'
              ? 'text-white bg-coy-surface/80'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Home"
        >
          <Home
            className={`w-5 h-5 ${
              activeTab === 'home' ? 'text-coy-coral stroke-[2.5]' : 'stroke-2'
            }`}
          />
          <span className="text-[11px] font-medium mt-1">Home</span>
        </button>

        <button
          onClick={() => onTabChange('discover')}
          className={`flex-1 flex flex-col items-center py-2 px-3 rounded-2xl transition duration-200 relative ${
            activeTab === 'discover'
              ? 'text-white bg-coy-surface/80'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Discover"
        >
          <div className="relative">
            <Compass
              className={`w-5 h-5 ${
                activeTab === 'discover'
                  ? 'text-coy-rose stroke-[2.5]'
                  : 'stroke-2'
              }`}
            />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-coy-rose" />
          </div>
          <span className="text-[11px] font-medium mt-1">Discover</span>
        </button>

        <button
          onClick={() => onTabChange('matches')}
          className={`flex-1 flex flex-col items-center py-2 px-3 rounded-2xl transition duration-200 relative ${
            activeTab === 'matches'
              ? 'text-white bg-coy-surface/80'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Matches"
        >
          <div className="relative">
            <Heart
              className={`w-5 h-5 ${
                activeTab === 'matches'
                  ? 'text-coy-rose fill-coy-rose stroke-[2.5]'
                  : 'stroke-2'
              }`}
            />
            {matchesCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 rounded-full bg-gradient-coy text-[10px] font-bold text-white shadow-sm min-w-4 text-center">
                {matchesCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium mt-1">Matches</span>
        </button>
      </div>
    </nav>
  );
};
