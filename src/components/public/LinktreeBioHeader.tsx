import React, { useState, useEffect } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { NavIcon } from '../common/NavIcon';
import { NavItem } from '../../types';
import { NavRestrictedModal } from './NavRestrictedModal';
import {
  Camera,
  Package,
  Image as ImageIcon,
  MessageCircle,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Share2,
  Instagram,
  Mail,
  Check,
  Star,
  Info,
  ChevronRight,
  ShieldCheck,
  Zap,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LinktreeBioHeader: React.FC = () => {
  const { siteSettings, openOrderModal, trackEvent, registerNavClick, navItems } = useBioSite();
  const [copiedToast, setCopiedToast] = useState(false);
  const [restrictedItemModal, setRestrictedItemModal] = useState<NavItem | null>(null);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobileScreen(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter items by schedule & device target
  const now = new Date();
  const activeNavItems = [...navItems]
    .filter((item) => {
      if (!item.enabled) return false;

      // Device target filter
      if (item.deviceTarget === 'mobile' && !isMobileScreen) return false;
      if (item.deviceTarget === 'desktop' && isMobileScreen) return false;

      // Schedule filter
      if (item.scheduleEnabled) {
        if (item.startDate && new Date(item.startDate) > now) {
          if (item.autoHideExpired) return false;
        }
        if (item.endDate && new Date(item.endDate) < now) {
          if (item.autoHideExpired) return false;
        }
      }

      return true;
    })
    .sort((a, b) => a.order - b.order);

  const performNavAction = (item: NavItem, variant: 'A' | 'B' = 'A') => {
    registerNavClick(item.id, variant);
    trackEvent('button_click', { button: 'linktree_button', target: item.target, label: item.label, variant });

    if (item.target === '#order_modal' || item.id === 'order') {
      trackEvent('button_click', { button: 'order_modal_open', source: 'linktree_nav' });
      openOrderModal();
      return;
    }

    if (item.targetType === 'whatsapp' || item.target.includes('wa.me')) {
      trackEvent('whatsapp_click', { source: 'linktree_nav_item', label: item.label });
      const phone = siteSettings.whatsappNumber || '5588997057623';
      const text = encodeURIComponent(`Olá! Vim pelo Link na Bio do ${siteSettings.brandName || 'Continental Studio'} e gostaria de fazer meu ensaio de fotos IA!`);
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
      return;
    }

    if (item.targetType === 'external' || item.target.startsWith('http')) {
      window.open(item.target, item.openInNewTab ? '_blank' : '_self');
      return;
    }

    const el = document.querySelector(item.target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavClick = (item: NavItem, variant: 'A' | 'B' = 'A') => {
    if (item.restrictedAccess) {
      setRestrictedItemModal(item);
      return;
    }
    performNavAction(item, variant);
  };

  const handleShare = () => {
    trackEvent('button_click', { button: 'share_biosite' });
    if (navigator.share) {
      navigator
        .share({
          title: siteSettings.brandName || 'Continental Studio BioSite',
          text: 'Confira os ensaios fotográficos com IA do Continental Studio!',
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  const handleWhatsAppDirect = () => {
    trackEvent('whatsapp_click', { source: 'whatsapp_linktree_direct' });
    const phone = siteSettings.whatsappNumber || '5588997057623';
    const text = encodeURIComponent(
      `Olá! Vim pelo Link na Bio do ${siteSettings.brandName || 'Continental Studio'} e gostaria de fazer meu ensaio de fotos IA!`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <section className="relative pt-6 pb-12 px-4 max-w-xl mx-auto text-center">
      {/* Toast alert for copied link */}
      <AnimatePresence>
        {copiedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-[#C9A45C] text-black font-bold text-xs shadow-2xl flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Link copiado para a área de transferência!</span>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Main Linktree Card Frame */}
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ borderRadius: 'var(--card-radius, 2rem)' }}
          className="relative bg-[var(--color-surface,#111114)]/95 border border-[var(--color-primary,#C9A45C)]/30 backdrop-blur-2xl p-4 sm:p-8 shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300"
        >
          {/* Top Glow Ambient effect inside card */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: 'var(--color-primary, #C9A45C)' }}
          />

          {/* Profile Header Block */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Avatar / Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-4 group cursor-pointer"
              onClick={handleShare}
            >
              <div className="absolute -inset-1 rounded-full blur-md bg-[var(--color-primary,#C9A45C)]/40 group-hover:bg-[var(--color-primary,#C9A45C)]/80 transition duration-300" />
              
              {siteSettings.logoEnabled && siteSettings.logoUrl ? (
                <img
                  src={siteSettings.logoUrl}
                  alt={siteSettings.brandName}
                  className="relative w-24 h-24 rounded-full object-cover border-2 border-[var(--color-primary,#C9A45C)] shadow-2xl"
                />
              ) : siteSettings.avatarUrl ? (
                <img
                  src={siteSettings.avatarUrl}
                  alt={siteSettings.brandName}
                  className="relative w-24 h-24 rounded-full object-cover border-2 border-[var(--color-primary,#C9A45C)] shadow-2xl"
                />
              ) : (
                <div className="relative w-24 h-24 rounded-full bg-[#1A1A20] border-2 border-[var(--color-primary,#C9A45C)] flex items-center justify-center font-heading text-[var(--color-primary,#C9A45C)] font-bold text-2xl shadow-2xl">
                  CS
                </div>
              )}

              {/* Verified Badge */}
              <div
                className="absolute bottom-0 right-0 p-1 bg-[var(--color-bg,#08080A)] rounded-full border border-[var(--color-primary,#C9A45C)]"
                title="Perfil Oficial Verificado"
              >
                <CheckCircle2 className="w-5 h-5 text-[var(--color-primary,#C9A45C)] fill-[var(--color-primary,#C9A45C)]/20" />
              </div>
            </motion.div>

            {/* Brand Title & Handle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-1.5 mb-1"
            >
              <h1 className="text-2xl font-heading font-bold text-[var(--color-text,#F5F2EA)] tracking-tight">
                {siteSettings.brandName || 'Continental Studio'}
              </h1>
              <CheckCircle2 className="w-5 h-5 text-[var(--color-primary,#C9A45C)] fill-[var(--color-primary,#C9A45C)]/20 shrink-0" />
            </motion.div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.26 }}
              className="text-xs font-mono text-[var(--color-primary,#C9A45C)] tracking-widest font-semibold mb-3"
            >
              @continentalstudio • BioSite Oficial
            </motion.span>

          {/* Online Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] uppercase font-bold tracking-wider mb-4"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Atendimento IA & WhatsApp Online</span>
          </motion.div>

          {/* Bio / Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.34 }}
            className="text-xs sm:text-sm text-[#F5F2EA]/80 max-w-md leading-relaxed font-sans mb-6"
          >
            {siteSettings.heroDescription ||
              'Transforme suas selfies em ensaios fotográficos profissionais com Inteligência Artificial. Selecione uma opção abaixo:'}
          </motion.p>

          {/* Quick Social & Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.38 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <button
              onClick={handleWhatsAppDirect}
              className="p-3 rounded-full bg-[#1A1A20] hover:bg-[#22222A] border border-[#C9A45C]/30 text-[#C9A45C] hover:text-white transition duration-200 cursor-pointer shadow-lg"
              title="Atendimento no WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            {siteSettings.instagramHandle && (
              <a
                href={`https://instagram.com/${siteSettings.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="p-3 rounded-full bg-[#1A1A20] hover:bg-[#22222A] border border-[#C9A45C]/30 text-[#C9A45C] hover:text-white transition duration-200 cursor-pointer shadow-lg"
                title="Siga no Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}

            <button
              onClick={handleShare}
              className="p-3 rounded-full bg-[#1A1A20] hover:bg-[#22222A] border border-[#C9A45C]/30 text-[#C9A45C] hover:text-white transition duration-200 cursor-pointer shadow-lg"
              title="Compartilhar Link na Bio"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>

        {/* ================= LINKTREE BUTTON STACK ================= */}
        <div className="space-y-3.5 relative z-10 text-left">
          {activeNavItems.map((item, index) => {
            // A/B test variant selection (50/50 split per session)
            const showVariantB = item.abTestEnabled && (index % 2 === 1 || item.id.length % 2 === 1);
            const activeVariant: 'A' | 'B' = showVariantB ? 'B' : 'A';

            const displayLabel = showVariantB && item.variantBLabel ? item.variantBLabel : item.label;
            const displaySubtitle = showVariantB && item.variantBSubtitle ? item.variantBSubtitle : item.subtitle;
            const displayBadge = showVariantB && item.variantBBadge ? item.variantBBadge : item.badge;
            const isFeatured = showVariantB && item.variantBFeatured !== undefined ? item.variantBFeatured : item.featured;

            // Attention Effect classes
            let attentionStyle = '';
            let motionAnimation = {};

            if (item.attentionEffect === 'pulse') {
              attentionStyle = 'ring-2 ring-amber-400/50';
              motionAnimation = { scale: [1, 1.015, 1], transition: { duration: 2, repeat: Infinity } };
            } else if (item.attentionEffect === 'wiggle') {
              motionAnimation = { rotate: [0, -1.5, 1.5, -1.5, 0], transition: { duration: 3, repeat: Infinity, repeatDelay: 2 } };
            } else if (item.attentionEffect === 'neonBorder') {
              attentionStyle = 'shadow-[0_0_25px_rgba(201,164,92,0.5)] border-amber-300';
            } else if (item.attentionEffect === 'bounce') {
              motionAnimation = { y: [0, -3, 0], transition: { duration: 2, repeat: Infinity } };
            }

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 22, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.55,
                  delay: 0.35 + index * 0.07,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ scale: 1.018, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleNavClick(item, activeVariant)}
                style={{ borderRadius: 'var(--button-radius, 1rem)' }}
                className={`w-full relative group p-4 font-sans transition-all duration-300 cursor-pointer shadow-lg border overflow-hidden ${attentionStyle} ${
                  isFeatured
                    ? 'bg-gradient-to-r from-[var(--color-primary,#C9A45C)] via-[#E0BB70] to-[var(--color-primary,#C9A45C)] text-[var(--color-bg,#08080A)] shadow-[0_8px_30px_rgba(201,164,92,0.35)] border-amber-300/60'
                    : 'bg-[var(--color-surface,#1A1A22)]/90 hover:bg-white/10 border-[var(--color-primary,#C9A45C)]/30 hover:border-[var(--color-primary,#C9A45C)] text-[var(--color-text,#F5F2EA)] hover:shadow-[0_8px_25px_rgba(201,164,92,0.15)]'
                }`}
              >
                {/* Shimmer effect overlay */}
                {item.attentionEffect === 'shimmer' && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
                  />
                )}

                <motion.div className="flex items-center justify-between relative z-10" {...motionAnimation}>
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                        isFeatured
                          ? 'bg-black/10 text-black'
                          : 'bg-[var(--color-primary,#C9A45C)]/15 text-[var(--color-primary,#C9A45C)] group-hover:bg-[var(--color-primary,#C9A45C)]/25'
                      }`}
                    >
                      <NavIcon
                        iconName={item.icon}
                        iconUrl={item.iconUrl}
                        className={`w-5 h-5 ${isFeatured ? 'text-black' : 'text-[var(--color-primary,#C9A45C)]'}`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-extrabold text-sm tracking-wide block transition-colors ${
                            isFeatured
                              ? 'uppercase tracking-wider text-black'
                              : 'text-[var(--color-text,#F5F2EA)] group-hover:text-[var(--color-primary,#C9A45C)]'
                          }`}
                        >
                          {displayLabel}
                        </span>

                        {displayBadge && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              isFeatured
                                ? 'bg-black text-[var(--color-primary,#C9A45C)]'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {displayBadge}
                          </span>
                        )}

                        {item.restrictedAccess && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                            <Lock className="w-2.5 h-2.5" />
                            VIP
                          </span>
                        )}
                      </div>

                      {displaySubtitle && (
                        <span
                          className={`text-[11px] block mt-0.5 ${
                            isFeatured ? 'font-medium text-black/80' : 'text-[var(--color-text,#F5F2EA)]/60'
                          }`}
                        >
                          {displaySubtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300 shrink-0 ${
                      isFeatured
                        ? 'text-black'
                        : 'text-[var(--color-primary,#C9A45C)]/60 group-hover:text-[var(--color-primary,#C9A45C)]'
                    }`}
                  />
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {/* Restricted Modal */}
        <AnimatePresence>
          {restrictedItemModal && (
            <NavRestrictedModal
              item={restrictedItemModal}
              onClose={() => setRestrictedItemModal(null)}
              onSuccess={() => {
                const targetItem = restrictedItemModal;
                setRestrictedItemModal(null);
                performNavAction(targetItem);
              }}
            />
          )}
        </AnimatePresence>

        {/* Footer Guarantee Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.85 }}
          className="mt-8 pt-6 border-t border-[#C9A45C]/20 flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#F5F2EA]/70"
        >
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>Garantia de Satisfação</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Entrega Rápida 24h</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
