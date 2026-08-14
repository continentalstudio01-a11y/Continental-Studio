import React, { useState, useEffect } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Clock, Users, ArrowRight, Sparkles } from 'lucide-react';

export const UrgencyBanner: React.FC = () => {
  const { siteSettings, openOrderModal, trackEvent } = useBioSite();
  const urgency = siteSettings?.urgency;

  // Real-time countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 2,
    minutes: 47,
    seconds: 35
  });

  useEffect(() => {
    if (!urgency?.enabled) return;

    // Set initial countdown based on settings or fallback
    const targetHours = urgency.countdownHours || 3;
    const now = Date.now();
    const storedTarget = sessionStorage.getItem('continental_urgency_countdown_target');
    let targetTime: number;

    if (storedTarget && !isNaN(Number(storedTarget))) {
      targetTime = Number(storedTarget);
      if (targetTime < now) {
        // Reset if expired
        targetTime = now + targetHours * 3600 * 1000;
        sessionStorage.setItem('continental_urgency_countdown_target', targetTime.toString());
      }
    } else {
      targetTime = now + targetHours * 3600 * 1000;
      sessionStorage.setItem('continental_urgency_countdown_target', targetTime.toString());
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, targetTime - Date.now());
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });

      if (remaining <= 0) {
        // Re-arm for another cycle
        const newTarget = Date.now() + 2 * 3600 * 1000;
        sessionStorage.setItem('continental_urgency_countdown_target', newTarget.toString());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [urgency]);

  if (!urgency?.enabled || !urgency.showInHeader) {
    return null;
  }

  const availableSlots = urgency.availableSlots ?? 3;
  const totalSlots = urgency.totalSlots || 15;
  const occupiedSlots = Math.max(0, totalSlots - availableSlots);
  const percentage = Math.min(100, Math.round((occupiedSlots / totalSlots) * 100));

  const formatDigit = (num: number) => String(num).padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="relative z-40 bg-gradient-to-r from-[#181308] via-[#2A1E08] to-[#181308] border-b border-[#C9A45C]/35 text-white overflow-hidden shadow-lg"
    >
      {/* Background Subtle Accent Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C9A45C]/15 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-3 py-2 sm:py-2.5 flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4 relative z-10 text-xs">
        {/* Left Side: Badge & Urgency Text */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center md:justify-start">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C9A45C] text-black font-extrabold text-[10px] tracking-wider uppercase shadow-sm animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-black text-black" />
            <span>{urgency.highlightBadge || 'Vagas da Semana'}</span>
          </span>

          <span className="font-bold text-white/90 text-xs sm:text-sm flex items-center gap-1.5 text-center md:text-left">
            <span>{urgency.bannerText || 'Vagas limitadas para entrega em até 24h'}</span>
          </span>
        </div>

        {/* Center / Right: Slots Progress & Live Countdown */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          {/* Slots Fill Bar */}
          <div className="flex items-center gap-2 bg-black/40 px-2.5 py-1 rounded-xl border border-white/10">
            <Users className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span className="text-[11px] text-white/80 font-medium">
              Vagas: <strong className="text-[#C9A45C] font-bold">{availableSlots} restantes</strong> ({percentage}% preenchidas)
            </span>
            <div className="w-14 h-1.5 bg-white/20 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-[#C9A45C] rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 bg-black/60 px-3 py-1 rounded-xl border border-[#C9A45C]/30 text-[11px] font-mono font-bold text-[#E0BB70]">
            <Clock className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span className="tabular-nums">
              {formatDigit(timeLeft.hours)}:{formatDigit(timeLeft.minutes)}:{formatDigit(timeLeft.seconds)}
            </span>
          </div>

          {/* Action CTA */}
          <button
            onClick={() => {
              trackEvent('button_click', { button: 'order_modal_open', source: 'urgency_banner' });
              openOrderModal();
            }}
            className="px-3.5 py-1 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E0BB70] hover:brightness-110 text-black font-extrabold text-[11px] flex items-center gap-1 shadow-md transition transform active:scale-95 cursor-pointer shrink-0"
          >
            <span>Garantir Vaga</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
