'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicProfile, SwipeAction, MatchRecord } from '@/types';
import { SwipeCard } from './SwipeCard';
import { EmptyState } from './EmptyState';
import { MatchModal } from './MatchModal';
import { X, Heart, Sparkles, RotateCcw, AlertCircle } from 'lucide-react';

interface DiscoverTabProps {
  onOpenMatches: () => void;
  onMatchCreated: (match: MatchRecord) => void;
  matchesCount: number;
}

export const DiscoverTab: React.FC<DiscoverTabProps> = ({
  onOpenMatches,
  onMatchCreated,
  matchesCount,
}) => {
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMatch, setCurrentMatch] = useState<MatchRecord | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<SwipeAction | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Fetch unswiped profiles from GET /api/feed (or /feed)
  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/feed');
      const data = await res.json();
      if (data.success) {
        setProfiles(data.profiles || []);
      } else {
        setError(data.error || 'Failed to fetch profiles');
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching profiles');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Handle swipe logic (both drag gesture and desktop buttons)
  const handleSwipe = async (action: SwipeAction) => {
    if (profiles.length === 0 || isSwiping) return;

    const currentProfile = profiles[0];
    setIsSwiping(true);
    setSwipeDirection(action);

    // Optimistically update card stack after animation duration
    setTimeout(async () => {
      setProfiles((prev) => prev.slice(1));
      setIsSwiping(false);
      setSwipeDirection(null);

      try {
        const res = await fetch('/api/swipe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileId: currentProfile.id,
            action,
          }),
        });

        const data = await res.json();
        if (data.success && data.isMatch && data.match) {
          setCurrentMatch(data.match);
          onMatchCreated(data.match);
        }
      } catch (err) {
        console.error('Failed to record swipe:', err);
      }
    }, 220);
  };

  // Reset demo handler
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

  // Keyboard shortcut listener: Left Arrow for Pass, Right Arrow for Like
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
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

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [profiles, isSwiping]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-coy-border border-t-coy-rose animate-spin mb-4" />
        <p className="text-sm text-gray-400 font-medium">Finding people near you...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 text-rose-400">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Something went wrong</h3>
        <p className="text-xs text-gray-400 mb-6 max-w-xs">{error}</p>
        <button
          onClick={fetchFeed}
          className="px-4 py-2.5 rounded-xl bg-coy-surface border border-coy-border text-white text-xs font-semibold hover:bg-coy-border transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Clear Empty State when there are no profiles left
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
    <div className="flex-1 flex flex-col items-center justify-between px-4 pb-24 pt-2 w-full max-w-md mx-auto select-none">
      {/* Cards Stack Container */}
      <div className="relative w-full aspect-[3/4.2] max-h-[580px] my-auto">
        {/* Next Card in Stack (Peek view) */}
        {nextProfile && (
          <div className="absolute inset-0 scale-[0.94] translate-y-3 opacity-60 transition-all duration-300 pointer-events-none">
            <SwipeCard
              key={nextProfile.id}
              profile={nextProfile}
              isTop={false}
              onSwipe={() => {}}
            />
          </div>
        )}

        {/* Top Active Card */}
        <AnimatePresence>
          <motion.div
            key={topProfile.id}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={
              isSwiping
                ? {
                    x: swipeDirection === 'like' ? 450 : -450,
                    rotate: swipeDirection === 'like' ? 25 : -25,
                    opacity: 0,
                    transition: { duration: 0.22, ease: 'easeOut' },
                  }
                : {
                    scale: 1,
                    opacity: 1,
                    x: 0,
                    rotate: 0,
                    transition: { duration: 0.2 },
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

      {/* Desktop & Touch Bottom Action Buttons */}
      <div className="w-full flex items-center justify-center gap-6 mt-4">
        {/* Pass Button */}
        <button
          onClick={() => handleSwipe('pass')}
          disabled={isSwiping}
          aria-label="Pass profile (Left Arrow)"
          title="Pass (Swipe Left / ← Arrow)"
          className="w-14 h-14 rounded-full bg-coy-surface border-2 border-rose-500/40 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg transition duration-200 disabled:opacity-50"
        >
          <X className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* Counter Info Badge */}
        <div className="px-3 py-1 rounded-full glass border border-coy-border text-[11px] font-medium text-gray-400">
          <span>{profiles.length} remaining</span>
        </div>

        {/* Like Button */}
        <button
          onClick={() => handleSwipe('like')}
          disabled={isSwiping}
          aria-label="Like profile (Right Arrow)"
          title="Like (Swipe Right / → Arrow)"
          className="w-14 h-14 rounded-full bg-gradient-coy text-white hover:scale-105 active:scale-95 flex items-center justify-center shadow-xl shadow-coy-rose/30 transition duration-200 disabled:opacity-50"
        >
          <Heart className="w-7 h-7 fill-white stroke-[2.5]" />
        </button>
      </div>

      {/* Keyboard Shortcut Hints for Desktop Users */}
      <div className="hidden sm:flex items-center gap-4 text-[10px] text-gray-400 mt-2">
        <span>← Left Arrow to Pass</span>
        <span>•</span>
        <span>Right Arrow to Like →</span>
      </div>

      {/* Celebration Match Modal */}
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
