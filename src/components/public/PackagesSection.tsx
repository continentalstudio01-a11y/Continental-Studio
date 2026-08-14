import React from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { formatBRL } from '../../lib/utils';
import { Check, Sparkles, Star, Zap, Flame, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export const PackagesSection: React.FC = () => {
  const { packages, openOrderModal, trackEvent, siteSettings } = useBioSite();
  const urgency = siteSettings?.urgency;

  const enabledPackages = packages
    .filter((p) => p.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (enabledPackages.length === 0) return null;

  const handleSelectPackage = (pkg: any) => {
    trackEvent('package_click', {
      package: pkg.name,
      price: pkg.price,
      photos: pkg.photos
    });
    openOrderModal(pkg);
  };

  return (
    <section id="pacotes" className="py-10 sm:py-16 px-3.5 sm:px-6 max-w-5xl mx-auto scroll-mt-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-8 sm:mb-12 px-2"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold uppercase tracking-wider bg-amber-500/10 text-[#C9A45C] border border-[#C9A45C]/30 mb-3.5 shadow-sm">
          <Zap className="w-3.5 h-3.5" />
          <span>ESCOLHA SEU PACOTE VIP</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F5F2EA] mb-3 tracking-tight">
          Pacotes de Ensaios com IA
        </h2>
        <p className="text-xs sm:text-base text-[#F5F2EA]/70 max-w-lg mx-auto leading-relaxed">
          Selecione a quantidade de fotos ideais para sua transformação digital. Qualidade Ultra HD 4K com entrega rápida.
        </p>

        {/* Urgency Highlight in Packages */}
        {urgency?.enabled && urgency.showInPackages && (
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-2xl bg-amber-500/10 border border-[#C9A45C]/35 text-xs text-[#E0BB70]">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-bold">
              {urgency.highlightBadge || 'Apenas 4 vagas restantes nesta semana para entrega expressa em 24h!'}
            </span>
          </div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        {enabledPackages.map((pkg, idx) => {
          const isFeatured = pkg.featured;
          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 35, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{
                duration: 0.55,
                delay: idx * 0.12,
                ease: [0.16, 1, 0.3, 1]
              }}
              className={`relative flex flex-col justify-between p-5 sm:p-7 rounded-3xl transition-all duration-300 ${
                isFeatured
                  ? 'bg-gradient-to-b from-[#C9A45C]/20 via-[#111114] to-[#0a0a0d] border-2 border-[#C9A45C] shadow-[0_12px_40px_rgba(201,164,92,0.25)] ring-1 ring-[#C9A45C]/40'
                  : 'bg-[#111114]/90 border border-white/10 hover:border-[#C9A45C]/40 shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
              }`}
            >
              {/* Badge for featured packages */}
              {pkg.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-[#C9A45C] text-black shadow-xl flex items-center gap-1.5 whitespace-nowrap z-10">
                  <Star className="w-3.5 h-3.5 fill-black" />
                  <span>{pkg.badge}</span>
                </div>
              )}

              <div>
                {/* Header of card */}
                <div className="flex items-center justify-between gap-2 mb-3 pt-1">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F2EA]">{pkg.name}</h3>
                  <div className="px-3 py-1 rounded-full bg-[#C9A45C]/20 border border-[#C9A45C]/40 text-xs font-extrabold text-[#C9A45C] shrink-0">
                    {pkg.photos} {pkg.photos === 1 ? 'Foto' : 'Fotos'}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#F5F2EA]/65 mb-5 leading-relaxed min-h-[36px]">
                  {pkg.description}
                </p>

                {/* Price Display Box - Ultra Legible on Mobile */}
                <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-black/60 border border-[#C9A45C]/30 text-center shadow-inner">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-[#F5F2EA]/60 uppercase tracking-wider mb-1">
                    <span>Investimento Único</span>
                  </div>
                  
                  {/* Big Bold Price Tag */}
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#C9A45C] tracking-tight font-sans my-1">
                    {formatBRL(pkg.price)}
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 mt-2 pt-2 border-t border-white/10 text-[11px]">
                    <span className="font-semibold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Pix ou até 12x no cartão
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/70 font-medium">Entrega em 24h</span>
                  </div>
                </div>

                {/* Features list */}
                <ul className="space-y-2.5 mb-7 text-xs sm:text-sm text-[#F5F2EA]/85">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span><strong className="text-white font-bold">{pkg.photos} {pkg.photos === 1 ? 'foto profissional' : 'fotos profissionais'}</strong> em Ultra HD</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Preservação 100% dos seus traços reais</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Iluminação & Cenários cinematográficos</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>Atendimento VIP e suporte individual</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleSelectPackage(pkg)}
                className={`w-full min-h-[50px] py-3.5 px-5 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition duration-200 cursor-pointer shadow-lg active:scale-95 ${
                  isFeatured
                    ? 'btn-primary shadow-[#C9A45C]/30 text-black'
                    : 'bg-white/10 hover:bg-[#C9A45C] text-white hover:text-black border border-white/20 hover:border-[#C9A45C]'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Garantir Pacote {pkg.name}</span>
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
