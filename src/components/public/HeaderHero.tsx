import React from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { Sparkles, ShieldCheck, ArrowRight, Camera } from 'lucide-react';
import { motion } from 'motion/react';

export const HeaderHero: React.FC = () => {
  const { siteSettings, openOrderModal, trackEvent } = useBioSite();

  const scrollToSection = (target: string) => {
    trackEvent('button_click', { button: 'scroll_section', target });
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenOrder = () => {
    trackEvent('button_click', { button: 'order_modal_open', source: 'header_hero_primary' });
    openOrderModal();
  };

  return (
    <section className="relative pt-10 pb-16 px-4 max-w-5xl mx-auto text-center overflow-hidden">
      {/* Background radial ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ backgroundColor: '#C9A45C' }}
      />

      {/* Side Editorial Vertical Text */}
      <div
        className="fixed right-2 top-1/2 -translate-y-1/2 rotate-180 py-12 px-2 hidden xl:block pointer-events-none z-30"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="font-sans text-[9px] uppercase tracking-[0.5em] text-[#C9A45C]/40">
          Fotografia Digital • Inteligência Artificial • Exclusividade
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Avatar & Logo Header */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {siteSettings.logoEnabled && siteSettings.logoUrl && (
            <div className="relative group">
              <div
                className="absolute -inset-1 rounded-full blur-md opacity-40 group-hover:opacity-100 transition duration-300"
                style={{ backgroundColor: '#C9A45C' }}
              />
              <img
                src={siteSettings.logoUrl}
                alt={siteSettings.brandName}
                className="relative w-16 h-16 rounded-full object-cover border-2 border-[#C9A45C]/40 shadow-2xl"
              />
            </div>
          )}

          {siteSettings.avatarEnabled && siteSettings.avatarUrl && (
            <div className="relative">
              <img
                src={siteSettings.avatarUrl}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-[#C9A45C]/40 shadow-2xl"
              />
              <div
                className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-[#08080A] rounded-full"
                title="Online agora"
              />
            </div>
          )}
        </div>

        {/* Brand Name Tagline */}
        <span className="text-[#C9A45C] text-xs tracking-[0.4em] uppercase font-sans font-bold mb-3">
          {siteSettings.brandName || 'Continental Studio'}
        </span>

        {/* Eyebrow Badge */}
        {siteSettings.eyebrow && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-[0.2em] bg-[#C9A45C]/10 border border-[#C9A45C]/30 text-[#C9A45C] mb-6 backdrop-blur-sm shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#C9A45C] animate-pulse" />
            <span>{siteSettings.eyebrow}</span>
          </div>
        )}

        {/* Hero Title - Editorial Style */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-light tracking-tight leading-[1.05] max-w-3xl mb-6 text-[#F5F2EA]">
          {siteSettings.heroTitle ? (
            siteSettings.heroTitle
          ) : (
            <>
              Transforme suas fotos <br />
              em ensaios <span className="text-[#C9A45C] font-normal italic">profissionais.</span>
            </>
          )}
        </h1>

        {/* Hero Description */}
        <p className="text-base sm:text-lg font-sans text-[#F5F2EA]/70 max-w-2xl mb-10 leading-relaxed font-normal">
          {siteSettings.heroDescription ||
            'Utilizando a potência da Inteligência Artificial para criar retratos de alta fidelidade que elevam sua marca pessoal e digital.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-12">
          <button
            onClick={handleOpenOrder}
            className="btn-primary w-full sm:w-auto px-10 py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 cursor-pointer shadow-2xl"
          >
            <Camera className="w-4 h-4" />
            <span>{siteSettings.primaryButtonText || 'Fazer meu ensaio'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollToSection('#portfolio')}
            className="btn-secondary w-full sm:w-auto px-8 py-4 rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{siteSettings.secondaryButtonText || 'Ver portfólio'}</span>
          </button>
        </div>

        {/* Trust Badges */}
        {siteSettings.trustBadges && siteSettings.trustBadges.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-3xl">
            {siteSettings.trustBadges.map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111114] border border-[#C9A45C]/20 text-[11px] font-sans font-medium text-[#F5F2EA]/80 shadow-md"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A45C]" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
};
