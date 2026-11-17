'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { MatchRecord } from '@/types';
import { Heart, MessageCircle, X, Sparkles } from 'lucide-react';

interface MatchModalProps {
  match: MatchRecord;
  onClose: () => void;
  onOpenMatches: () => void;
}

export const MatchModal = ({
  match,
  onClose,
  onOpenMatches,
}: MatchModalProps) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF3366', '#FF5E62', '#FFFFFF'],
      });
    } catch {
      // ignore if canvas not supported
    }
  }, []);

  const currentUserPhoto =
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl glass border border-coy-border/80 p-6 flex flex-col items-center text-center shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-coy text-white text-xs font-semibold mb-3 shadow-md shadow-coy-rose/30">
          <Sparkles className="w-3.5 h-3.5 fill-white" />
          <span>Mutual Connection</span>
        </div>

        <h2 className="text-3xl font-black tracking-tight text-white mb-1">
          It&apos;s a Match!
        </h2>
        <p className="text-sm text-gray-300 mb-6">
          You and <span className="font-semibold text-white">{match.profile.name}</span> liked each other.
        </p>

        <div className="relative flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-full border-4 border-coy-rose shadow-xl overflow-hidden relative -mr-4 z-10">
            <Image
              src={currentUserPhoto}
              alt="You"
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>

          <div className="w-10 h-10 rounded-full bg-gradient-coy border-2 border-coy-dark flex items-center justify-center z-30 shadow-lg animate-bounce-short">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>

          <div className="w-24 h-24 rounded-full border-4 border-coy-coral shadow-xl overflow-hidden relative -ml-4 z-20">
            <Image
              src={match.profile.photo}
              alt={match.profile.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        </div>

        <div className="w-full bg-coy-surface/80 rounded-2xl p-3 border border-coy-border mb-6">
          <p className="text-xs text-gray-300 italic">
            &ldquo;{match.profile.bio}&rdquo;
          </p>
          <p className="text-[11px] text-coy-400 mt-1 font-medium">
            {match.profile.cityOrCollege}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={() => {
              onClose();
              onOpenMatches();
            }}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-coy text-white font-semibold text-sm shadow-xl shadow-coy-rose/30 hover:opacity-95 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send a Message</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium text-sm transition"
          >
            Keep Swiping
          </button>
        </div>
      </div>
    </div>
  );
};
