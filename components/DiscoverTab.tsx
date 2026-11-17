'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicProfile, SwipeAction, MatchRecord } from '@/types';
import { SwipeCard } from './SwipeCard';
import { EmptyState } from './EmptyState';
import { MatchModal } from './MatchModal';
import { X, Heart, AlertCircle } from 'lucide-react';

interface DiscoverTabProps {
  onOpenMatches: () => void;
  onMatchCreated: (match: MatchRecord) => void;
  matchesCount: number;
}

export const DiscoverTab = ({
  onOpenMatches,
  onMatchCreated,
  matchesCount,
}: DiscoverTabProps) => {
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMatch, setCurrentMatch] = useState<MatchRecord | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeAction | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/feed');
      const data = await res.json();
      if (data.success) {
        setProfiles(data.profiles || []);
      } else {
        setError(data.error || 'Failed to load feed');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleSwipe = async (action: SwipeAction) => {
    if (!profiles.length || isSwiping) return;

    const current = profiles[0];
    setIsSwiping(true);
    setSwipeDirection(action);

    setTimeout(async () => {
      setProfiles((prev) => prev.slice(1));
      setIsSwiping(false);
      setSwipeDirection(null);

      try {
        const res = await fetch('/api/swipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileId: current.id,
            action,
          }),
        });

        const data = await res.json();
        if (data.success && data.isMatch && data.match) {
          setCurrentMatch(data.match);
          onMatchCreated(data.match);
        }
      } catch (err) {
        console.error('Error recording swipe:', err);
      }
    }, 220);
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchFeed();
      }
    } catch (err) {
      console.error('Failed to reset demo:', err);
    } finally {
      setIsResetting(false);
    }
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement).tagName.toLowerCase())) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSwipe('pass');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleSwipe('like');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [profiles, isSwiping]);

  if (isLoading) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-coy-border border-t-coy-rose animate-spin mb-3" />
        <p className="text-xs text-gray-400">Loading nearby profiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-3 text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1">Could not load profiles</h3>
        <p className="text-xs text-gray-400 mb-5 max-w-xs">{error}</p>
        <button
          onClick={fetchFeed}
          className="px-4 py-2 rounded-xl bg-coy-surface border border-coy-border text-white text-xs font-medium hover:bg-coy-border transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <EmptyState
        onReset={handleReset}
        onViewMatches={onOpenMatches}
        matchesCount={matchesCount}
        isResetting={isResetting}
      />
    );
  }

  const topProfile = profiles[0];
  const nextProfile = profiles.length > 1 ? profiles[1] : null;

  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between items-center px-3 py-1.5 w-full select-none overflow-hidden">
      {/* Card stack area - responsive fit within available height */}
      <div className="flex-1 min-h-0 w-full flex items-center justify-center relative my-1">
        <div className="relative w-full h-full max-h-[460px] sm:max-h-[500px] aspect-[3/4.2]">
          {nextProfile && (
            <div className="absolute inset-0 scale-[0.95] translate-y-2.5 opacity-60 transition-all duration-300 pointer-events-none">
              <SwipeCard
                key={nextProfile.id}
                profile={nextProfile}
                isTop={false}
                onSwipe={() => {}}
              />
            </div>
          )}

          <AnimatePresence>
            <motion.div
              key={topProfile.id}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={
                isSwiping
                  ? {
                      x: swipeDirection === 'like' ? 450 : -450,
                      rotate: swipeDirection === 'like' ? 20 : -20,
                      opacity: 0,
                      transition: { duration: 0.2, ease: 'easeOut' },
                    }
                  : {
                      scale: 1,
                      opacity: 1,
                      x: 0,
                      rotate: 0,
                      transition: { duration: 0.18 },
                    }
              }
              className="absolute inset-0"
            >
              <SwipeCard
                profile={topProfile}
                isTop={!isSwiping}
                onSwipe={handleSwipe}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Action controls - always visible above tab bar */}
      <div className="shrink-0 w-full flex items-center justify-center gap-5 pt-1.5 pb-1">
        <button
          onClick={() => handleSwipe('pass')}
          disabled={isSwiping}
          aria-label="Pass"
          title="Pass (Swipe Left / ← Arrow)"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-coy-surface border border-rose-500/40 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg transition duration-150 disabled:opacity-50"
        >
          <X className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
        </button>

        <div className="px-3 py-1 rounded-full glass border border-coy-border text-[11px] font-medium text-gray-400">
          <span>{profiles.length} left</span>
        </div>

        <button
          onClick={() => handleSwipe('like')}
          disabled={isSwiping}
          aria-label="Like"
          title="Like (Swipe Right / → Arrow)"
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-coy text-white hover:scale-105 active:scale-95 flex items-center justify-center shadow-xl shadow-coy-rose/30 transition duration-150 disabled:opacity-50"
        >
          <Heart className="w-6 h-6 sm:w-7 sm:h-7 fill-white stroke-[2.5]" />
        </button>
      </div>

      <div className="hidden sm:flex items-center gap-3 text-[10px] text-gray-500 pb-0.5">
        <span>← Pass</span>
        <span>•</span>
        <span>Like →</span>
      </div>

      {currentMatch && (
        <MatchModal
          match={currentMatch}
          onClose={() => setCurrentMatch(null)}
          onOpenMatches={() => {
            setCurrentMatch(null);
            onOpenMatches();
          }}
        />
      )}
    </div>
  );
};
