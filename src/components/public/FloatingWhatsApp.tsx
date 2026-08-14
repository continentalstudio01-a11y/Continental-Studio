import React, { useState, useEffect } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { buildWhatsappUrl } from '../../lib/utils';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingWhatsApp: React.FC = () => {
  const { siteSettings, trackEvent } = useBioSite();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [viewportBottomOffset, setViewportBottomOffset] = useState(0);

  // Show a polite floating helper tooltip after 4 seconds of initial page visit
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Detect virtual keyboard on mobile devices using visualViewport API and focus events
  useEffect(() => {
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        // If the visual viewport is significantly smaller than window height, keyboard is active
        const keyboardHeight = windowHeight - viewportHeight;
        if (keyboardHeight > 150) {
          setIsKeyboardOpen(true);
          setViewportBottomOffset(keyboardHeight);
        } else {
          setIsKeyboardOpen(false);
          setViewportBottomOffset(0);
        }
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        setIsKeyboardOpen(true);
      }
    };

    const handleFocusOut = () => {
      // Small delay to allow new focus or keyboard dismiss
      setTimeout(() => {
        const active = document.activeElement;
        if (
          !active ||
          (active.tagName !== 'INPUT' &&
            active.tagName !== 'TEXTAREA' &&
            active.tagName !== 'SELECT' &&
            !(active as HTMLElement).isContentEditable)
        ) {
          setIsKeyboardOpen(false);
          setViewportBottomOffset(0);
        }
      }, 150);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
    }
    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
        window.visualViewport.removeEventListener('scroll', handleViewportChange);
      }
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  const handleWhatsappClick = () => {
    trackEvent('whatsapp_click', { source: 'floating_button' });
    const url = buildWhatsappUrl(
      siteSettings.contact.whatsapp,
      siteSettings.defaultWhatsappMessage || 'Olá! Vim pelo BioSite.'
    );
    window.open(url, '_blank');
  };

  return (
    <motion.div
      animate={{
        bottom: isKeyboardOpen ? Math.max(viewportBottomOffset + 16, 80) : 16,
        opacity: isKeyboardOpen ? 0.35 : 1,
        scale: isKeyboardOpen ? 0.85 : 1,
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed right-4 sm:right-6 sm:!bottom-6 z-40 flex items-center select-none"
    >
      {/* Dynamic Engagement Helper Tooltip (hidden when keyboard is open) */}
      <AnimatePresence>
        {showTooltip && !isKeyboardOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mr-3 hidden sm:flex items-center gap-2 bg-[#111114]/95 text-white text-xs font-semibold px-3.5 py-2 rounded-2xl border border-emerald-500/30 shadow-[0_10px_25px_rgba(0,0,0,0.5)] backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="text-white/90">Dúvidas? Fale no WhatsApp</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              className="ml-1 text-white/40 hover:text-white text-xs p-0.5"
              title="Fechar dica"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Button Container */}
      <div className="relative">
        {/* Radar Pulse Background Wave Effect */}
        {!isKeyboardOpen && (
          <motion.div
            animate={{
              scale: [1, 1.4, 1.8],
              opacity: [0.6, 0.25, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              repeatDelay: 2.6,
              ease: 'easeOut',
            }}
            className="absolute inset-0 rounded-full bg-emerald-500 pointer-events-none"
          />
        )}

        {/* Main Floating Button with Periodic Bounce Keyframes */}
        <motion.button
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{
            opacity: 1,
            scale: isKeyboardOpen ? 1 : [1, 1, 1.08, 0.98, 1.05, 1],
            y: isKeyboardOpen ? 0 : [0, 0, -8, 2, -4, 0],
            rotate: isKeyboardOpen ? 0 : [0, 0, -6, 6, -3, 0],
          }}
          transition={{
            opacity: { duration: 0.4, delay: 0.8 },
            scale: { repeat: isKeyboardOpen ? 0 : Infinity, repeatDelay: 5, duration: 1.2, ease: 'easeInOut' },
            y: { repeat: isKeyboardOpen ? 0 : Infinity, repeatDelay: 5, duration: 1.2, ease: 'easeInOut' },
            rotate: { repeat: isKeyboardOpen ? 0 : Infinity, repeatDelay: 5, duration: 1.2, ease: 'easeInOut' },
          }}
          whileHover={{ scale: 1.12, y: -2, rotate: 0 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleWhatsappClick}
          aria-label="Atendimento no WhatsApp"
          className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white shadow-[0_10px_30px_rgba(16,185,129,0.45)] flex items-center justify-center cursor-pointer border-2 border-white/25 group transition-shadow"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-white text-emerald-600 drop-shadow-sm" />

          {/* Active Online Green Dot Badge */}
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-neutral-900" />
          </span>

          {/* Hover Tooltip for Desktop */}
          <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-black/90 text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/15 pointer-events-none hidden sm:block shadow-xl">
            Atendimento WhatsApp
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};
