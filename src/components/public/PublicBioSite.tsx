import React, { useEffect } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { LinktreeBioHeader } from './LinktreeBioHeader';
import { PackagesSection } from './PackagesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { PortfolioSection } from './PortfolioSection';
import { BeforeAfterSection } from './BeforeAfterSection';
import { TestimonialsSection } from './TestimonialsSection';
import { FaqSection } from './FaqSection';
import { Footer } from './Footer';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { BackgroundAudioPlayer } from './BackgroundAudioPlayer';
import { OrderModal } from './OrderModal';
import { UrgencyBanner } from './UrgencyBanner';
import { OrderTrackingModal } from './OrderTrackingModal';
import { AnimatePresence, motion } from 'motion/react';
import { Settings, Sparkles, Search, PackageCheck } from 'lucide-react';

export const PublicBioSite: React.FC = () => {
  const { isOrderModalOpen, isOrderTrackingOpen, openOrderTrackingModal, toggleAdminMode, siteSettings, trackEvent } = useBioSite();

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    let deviceType = isMobile ? 'Celular (Mobile)' : 'Computador (Desktop)';
    if (/iPad|Android(?!.*Mobile)/i.test(navigator.userAgent)) {
      deviceType = 'Tablet';
    }

    let rawRef = document.referrer;
    let ref = 'Direto / Instagram Bio';
    if (rawRef) {
      try {
        ref = new URL(rawRef).hostname.replace('www.', '');
      } catch {
        ref = rawRef;
      }
    }

    trackEvent('page_view', {
      device: deviceType,
      referrer: ref,
      screenResolution: `${window.screen.width}x${window.screen.height}`
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#08080A] text-[#F5F2EA] relative selection:bg-[#C9A45C] selection:text-black overflow-x-hidden">
      {/* Subtle Luxury Ambient Background Glows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#C9A45C]/20 via-[#C9A45C]/5 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-[45%] -left-32 w-[450px] h-[450px] bg-purple-900/10 rounded-full blur-[100px]" />
        <div className="absolute top-[75%] -right-32 w-[450px] h-[450px] bg-[#C9A45C]/10 rounded-full blur-[100px]" />
      </motion.div>

      {/* Top Banner Accent & Admin Navigation Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 bg-[#08080A]/95 backdrop-blur-md border-b border-[#C9A45C]/20 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-[#C9A45C] animate-ping shrink-0" />
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] font-bold text-[#C9A45C] truncate">
            {siteSettings.brandName || 'Continental Studio'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Client Order Tracking Button */}
          <button
            onClick={() => openOrderTrackingModal()}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white/90 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            title="Acompanhar o status do seu ensaio em tempo real"
          >
            <PackageCheck className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span className="hidden sm:inline">Acompanhar Pedido</span>
            <span className="sm:hidden">Rastrear</span>
          </button>

          {/* Admin Toggle */}
          <button
            onClick={() => toggleAdminMode(true)}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#C9A45C]/15 hover:bg-[#C9A45C]/25 border border-[#C9A45C]/40 text-[#C9A45C] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-md"
            title="Acessar o Painel de Gestão e Configurações"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Painel Admin</span>
            <span className="sm:hidden">Admin</span>
          </button>
        </div>
      </motion.header>

      {/* Urgency & Scarcity Countdown Banner */}
      <UrgencyBanner />

      {/* Main Linktree Bio Header */}
      <div className="relative z-10">
        <LinktreeBioHeader />
      </div>

      {/* In-Page Content Sections */}
      <main className="space-y-4 relative z-10">
        <PackagesSection />
        <HowItWorksSection />
        <PortfolioSection />
        <BeforeAfterSection />
        <TestimonialsSection />
        <FaqSection />
      </main>

      <Footer />

      {/* Floating Elements */}
      <FloatingWhatsApp />
      <BackgroundAudioPlayer />

      {/* Order Flow Modal */}
      <AnimatePresence>
        {isOrderModalOpen && <OrderModal />}
      </AnimatePresence>

      {/* Client Order Tracking Modal */}
      <AnimatePresence>
        {isOrderTrackingOpen && <OrderTrackingModal />}
      </AnimatePresence>
    </div>
  );
};
