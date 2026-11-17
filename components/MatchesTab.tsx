'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MatchRecord } from '@/types';
import { Heart, MessageCircle, MapPin, Sparkles, Send, X, ArrowLeft } from 'lucide-react';

interface MatchesTabProps {
  matches: MatchRecord[];
  onGoToDiscover: () => void;
}

export const MatchesTab = ({
  matches,
  onGoToDiscover,
}: MatchesTabProps) => {
  const [activeChatMatch, setActiveChatMatch] = useState<MatchRecord | null>(null);
  const [messages, setMessages] = useState<Record<string, Array<{ text: string; sender: 'me' | 'them'; time: string }>>>({});
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (matchId: string) => {
    if (!inputText.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { text: inputText.trim(), sender: 'me' as const, time };

    setMessages((prev) => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), userMsg],
    }));
    setInputText('');

    setTimeout(() => {
      const replies = [
        `Hey! So glad we matched ✨ Loved your vibe.`,
        `Hi! Great taste in music by the way 😊`,
        `Hey! I was hoping you'd swipe right! How's your week going?`,
        `Haha hey! What's the story behind your bio?`,
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => ({
        ...prev,
        [matchId]: [
          ...(prev[matchId] || []),
          { text: reply, sender: 'them' as const, time: replyTime },
        ],
      }));
    }, 1000);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col px-4 pt-3 pb-2 w-full animate-fade-in overflow-hidden">
      <div className="shrink-0 flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <span>Matches</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-coy text-white">
              {matches.length}
            </span>
          </h2>
          <p className="text-[11px] text-gray-400">
            Mutual likes only. Private &amp; secure by Coy.
          </p>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-6 text-center my-auto">
          <div className="w-14 h-14 rounded-2xl bg-coy-surface border border-coy-border flex items-center justify-center mb-3 text-coy-rose">
            <Heart className="w-7 h-7 fill-coy-rose/20 stroke-[2]" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">No matches yet</h3>
          <p className="text-xs text-gray-400 max-w-xs mb-5">
            When you and someone else both like each other, your match will show up here.
          </p>
          <button
            onClick={onGoToDiscover}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-coy text-white text-xs font-semibold shadow-lg shadow-coy-rose/30 hover:opacity-95 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start Swiping</span>
          </button>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto grid grid-cols-2 gap-2.5 pb-2 pr-0.5">
          {matches.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveChatMatch(item)}
              className="group relative rounded-2xl overflow-hidden glass border border-coy-border hover:border-coy-rose/50 transition cursor-pointer shadow-lg aspect-[3/4]"
            >
              <Image
                src={item.profile.photo}
                alt={item.profile.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 480px) 50vw, 200px"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gradient-coy text-white text-[9px] font-bold shadow-md flex items-center gap-1">
                <Heart className="w-2.5 h-2.5 fill-white" />
                <span>Match</span>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-2.5 text-white">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-bold text-xs sm:text-sm truncate">
                    {item.profile.name}
                  </span>
                  <span className="text-[11px] text-gray-300">
                    {item.profile.age}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-gray-300 mt-0.5 truncate">
                  <MapPin className="w-2.5 h-2.5 text-coy-rose shrink-0" />
                  <span className="truncate">{item.profile.cityOrCollege}</span>
                </div>

                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[9px] text-coy-300 font-medium">
                    Say hi
                  </span>
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-coy-rose transition">
                    <MessageCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeChatMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm h-[520px] rounded-3xl glass border border-coy-border flex flex-col overflow-hidden shadow-2xl">
            <div className="px-3.5 py-2.5 bg-coy-surface/90 border-b border-coy-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setActiveChatMatch(null)}
                  className="p-1 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-coy-border">
                  <Image
                    src={activeChatMatch.profile.photo}
                    alt={activeChatMatch.profile.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>

                <div>
                  <h4 className="font-bold text-xs text-white">
                    {activeChatMatch.profile.name}, {activeChatMatch.profile.age}
                  </h4>
                  <p className="text-[9px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Mutual Match
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveChatMatch(null)}
                className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              <div className="text-center py-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-coy-surface border border-coy-border text-[10px] text-gray-300">
                  <Heart className="w-2.5 h-2.5 text-coy-rose fill-coy-rose" />
                  <span>Matched on Coy</span>
                </div>
              </div>

              {(!messages[activeChatMatch.id] || messages[activeChatMatch.id].length === 0) && (
                <div className="flex flex-col gap-1.5 pt-1">
                  {[
                    `Hey! Loved your bio about ${activeChatMatch.profile.interests[0] || 'travel'} 👋`,
                    `Coffee or tea? The most important first question ☕`,
                    `Hey ${activeChatMatch.profile.name}! Great taste in music 🎶`,
                  ].map((icebreaker, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputText(icebreaker)}
                      className="text-left text-[11px] p-2 rounded-xl bg-coy-surface/60 hover:bg-coy-surface border border-coy-border/60 text-gray-300 hover:text-white transition"
                    >
                      💡 {icebreaker}
                    </button>
                  ))}
                </div>
              )}

              {(messages[activeChatMatch.id] || []).map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    msg.sender === 'me' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-1.5 text-xs leading-relaxed ${
                      msg.sender === 'me'
                        ? 'bg-gradient-coy text-white rounded-br-none shadow-md'
                        : 'bg-coy-surface border border-coy-border text-gray-200 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-500 mt-0.5 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-coy-surface/90 border-t border-coy-border">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(activeChatMatch.id);
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-coy-dark border border-coy-border rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-coy-rose"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-1.5 rounded-xl bg-gradient-coy text-white disabled:opacity-40 transition shadow-md"
                  aria-label="Send"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
