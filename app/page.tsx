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
    <div className="flex flex-col min-h-screen bg-[#0e0e12] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-b from-coy-rose/15 via-coy-coral/10 to-transparent blur-[120px] pointer-events-none" />

      <Navbar
        matchesCount={matches.length}
        onOpenMatches={() => setActiveTab('matches')}
        onReset={handleResetDemo}
        isResetting={isResetting}
      />

      <main className="flex-1 flex flex-col max-w-md mx-auto w-full relative z-10 overflow-hidden">
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
  );
}
