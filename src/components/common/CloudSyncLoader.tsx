import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';

interface CloudSyncLoaderProps {
  isLoading: boolean;
  message?: string;
  brandName?: string;
  logoUrl?: string;
}

export const CloudSyncLoader: React.FC<CloudSyncLoaderProps> = ({
  isLoading,
  message = 'Sincronizando dados e portfólio em tempo real...',
  brandName = 'Continental Studio',
  logoUrl
}) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          id="cloud-sync-loader-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08080A] text-[#F5F2EA] overflow-hidden"
        >
          {/* Subtle Ambient Glows */}
          <div className="absolute w-96 h-96 rounded-full bg-[#C9A45C]/10 blur-3xl pointer-events-none -top-20 -left-20 animate-pulse" />
          <div className="absolute w-96 h-96 rounded-full bg-[#E5BF70]/5 blur-3xl pointer-events-none -bottom-20 -right-20 animate-pulse delay-700" />

          {/* Center Brand Identity Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative flex flex-col items-center max-w-sm px-6 text-center z-10"
          >
            {/* Pulsating Glowing Ring Logo Container */}
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
              {/* Outer rotating gold dashed ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-[#C9A45C]/40"
              />
              
              {/* Inner pulsing solid gold ring */}
              <motion.div
                animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-2 rounded-full border-2 border-[#C9A45C]/70 shadow-[0_0_25px_rgba(201,164,92,0.35)]"
              />

              {/* Inner Avatar / Monogram */}
              <div className="w-16 h-16 rounded-full bg-[#121216] border border-[#C9A45C]/30 flex items-center justify-center overflow-hidden shadow-inner">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={brandName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="font-serif text-xl font-bold tracking-wider text-[#C9A45C]">
                    CS
                  </span>
                )}
              </div>

              {/* Little gold sparkle icon badge */}
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#17171C] border border-[#C9A45C]/60 flex items-center justify-center text-[#E5BF70] shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </motion.div>
            </div>

            {/* Brand Title */}
            <h2 className="font-serif text-2xl font-light tracking-wide text-[#F5F2EA] mb-1">
              {brandName}
            </h2>
            <div className="flex items-center gap-1.5 justify-center mb-6">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C9A45C]">
                BioSite Luxury Experience
              </span>
            </div>

            {/* Status & Loader Bar */}
            <div className="w-full bg-[#18181E] border border-white/10 rounded-full h-1.5 overflow-hidden mb-4 relative shadow-inner">
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#C9A45C] to-transparent rounded-full shadow-[0_0_10px_#C9A45C]"
              />
            </div>

            {/* Sync Feedback text */}
            <div className="flex items-center justify-center gap-2 text-xs text-white/70">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C9A45C]" />
              <span className="font-medium tracking-wide">{message}</span>
            </div>

            {/* Security Guarantee badge */}
            <div className="mt-8 flex items-center justify-center gap-1.5 text-[11px] text-white/40">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/80" />
              <span>Conexão Segura em Nuvem Firestore</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
