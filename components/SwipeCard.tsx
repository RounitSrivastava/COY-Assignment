'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { PublicProfile, SwipeAction } from '@/types';
import { MapPin, Info, Check, X } from 'lucide-react';

interface SwipeCardProps {
  profile: PublicProfile;
  isTop: boolean;
  onSwipe: (action: SwipeAction) => void;
}

export const SwipeCard = ({
  profile,
  isTop,
  onSwipe,
}: SwipeCardProps) => {
  const [showFullBio, setShowFullBio] = useState(false);
  const [imgSrc, setImgSrc] = useState(profile.photo);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [30, 110], [0, 1]);
  const passOpacity = useTransform(x, [-30, -110], [0, 1]);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 100;
    const velocityThreshold = 450;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipe('like');
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipe('pass');
    }
  };

  return (
    <motion.div
      style={isTop ? { x, rotate, cursor: 'grab' } : undefined}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={isTop ? handleDragEnd : undefined}
      whileTap={isTop ? { cursor: 'grabbing' } : undefined}
      className={`absolute inset-0 select-none touch-none rounded-3xl overflow-hidden shadow-2xl bg-coy-card border border-coy-border ${
        !isTop ? 'pointer-events-none' : ''
      }`}
    >
      <div className="relative w-full h-full bg-coy-dark">
        <Image
          src={imgSrc}
          alt={profile.name}
          fill
          priority={isTop}
          className="object-cover pointer-events-none select-none transition-transform duration-300"
          sizes="(max-width: 480px) 100vw, 420px"
          onError={() => {
            setImgSrc(
              `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
                profile.name
              )}`
            );
          }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

        {isTop && (
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-8 left-6 z-30 pointer-events-none border-4 border-emerald-400 text-emerald-400 px-4 py-1.5 rounded-2xl font-black text-2xl uppercase tracking-wider -rotate-12 bg-black/40 backdrop-blur-sm shadow-xl flex items-center gap-1.5"
          >
            <Check className="w-6 h-6 stroke-[3.5]" />
            <span>LIKE</span>
          </motion.div>
        )}

        {isTop && (
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-8 right-6 z-30 pointer-events-none border-4 border-rose-500 text-rose-500 px-4 py-1.5 rounded-2xl font-black text-2xl uppercase tracking-wider rotate-12 bg-black/40 backdrop-blur-sm shadow-xl flex items-center gap-1.5"
          >
            <X className="w-6 h-6 stroke-[3.5]" />
            <span>PASS</span>
          </motion.div>
        )}

        <div className="absolute bottom-0 inset-x-0 p-5 z-20 flex flex-col justify-end text-white pointer-events-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-extrabold tracking-tight drop-shadow-md">
                {profile.name}
              </h2>
              <span className="text-xl font-medium text-gray-200">
                {profile.age}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFullBio((prev) => !prev);
              }}
              className="p-1.5 rounded-full glass hover:bg-white/20 transition text-gray-200"
              aria-label="Toggle bio"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-300 mb-3 drop-shadow">
            <MapPin className="w-3.5 h-3.5 text-coy-rose shrink-0" />
            <span className="truncate">{profile.cityOrCollege}</span>
          </div>

          <p
            className={`text-xs text-gray-200 leading-relaxed mb-3 drop-shadow transition-all ${
              showFullBio ? '' : 'line-clamp-2'
            }`}
          >
            {profile.bio}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {profile.interests.map((interest, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full glass-pill text-white/90 shadow-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
