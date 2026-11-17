'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { TabBar, TabType } from '@/components/TabBar';
import { HomeTab } from '@/components/HomeTab';
import { DiscoverTab } from '@/components/DiscoverTab';
import { MatchesTab } from '@/components/MatchesTab';
import { MatchRecord } from '@/types';

export default function Page() {
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [matches, setMatches] = useState<MatchRecord[]>([]);
  const [isResetting, setIsResetting] = useState(false);
  const [discoverKey, setDiscoverKey] = useState(0);

  const fetchMatches = useCallback(async () => {
    try {
      const res = await fetch('/api/matches');
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches || []);
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleMatchCreated = (newMatch: MatchRecord) => {
    setMatches((prev) => [newMatch, ...prev]);
  };

  const handleResetDemo = async () => {
    if (isResetting) return;
    setIsResetting(true);
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchMatches();
        setDiscoverKey((k) => k + 1);
      }
    } catch (err) {
      console.error('Error resetting demo:', err);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex flex-col h-full h-[100dvh] max-h-[100dvh] bg-[#09090c] relative overflow-hidden select-none">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-coy-rose/15 via-coy-coral/10 to-transparent blur-[120px] pointer-events-none" />

      {/* Centered mobile-first application shell */}
      <div className="flex flex-col h-full w-full max-w-md mx-auto relative z-10 sm:border-x sm:border-coy-border/30 bg-[#0e0e12] sm:shadow-2xl overflow-hidden">
        <Navbar
          matchesCount={matches.length}
          onOpenMatches={() => setActiveTab('matches')}
          onReset={handleResetDemo}
          isResetting={isResetting}
        />

        <main className="flex-1 min-h-0 flex flex-col w-full relative overflow-hidden">
          {activeTab === 'home' && (
            <HomeTab onGoToDiscover={() => setActiveTab('discover')} />
          )}

          {activeTab === 'discover' && (
            <DiscoverTab
              key={discoverKey}
              onOpenMatches={() => setActiveTab('matches')}
              onMatchCreated={handleMatchCreated}
              matchesCount={matches.length}
            />
          )}

          {activeTab === 'matches' && (
            <MatchesTab
              matches={matches}
              onGoToDiscover={() => setActiveTab('discover')}
            />
          )}
        </main>

        <TabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          matchesCount={matches.length}
        />
      </div>
    </div>
  );
}
