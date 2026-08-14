import React, { useState } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { Sparkles, SlidersHorizontal, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const BeforeAfterSection: React.FC = () => {
  const { beforeAfterItems, trackEvent } = useBioSite();
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const activeItems = beforeAfterItems.filter((i) => i.enabled).sort((a, b) => a.sortOrder - b.sortOrder);

  if (activeItems.length === 0) {
    return null;
  }

  const currentItem = activeItems[activeIndex] || activeItems[0];

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    if (position >= 0 && position <= 100) {
      setSliderPosition(position);
    }
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % activeItems.length;
    setActiveIndex(nextIdx);
    setSliderPosition(50);
    const item = activeItems[nextIdx];
    if (item) {
      trackEvent('package_click', {
        itemTitle: item.title,
        category: item.category || 'Antes & Depois',
        action: 'before_after_next'
      });
    }
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + activeItems.length) % activeItems.length;
    setActiveIndex(prevIdx);
    setSliderPosition(50);
    const item = activeItems[prevIdx];
    if (item) {
      trackEvent('package_click', {
        itemTitle: item.title,
        category: item.category || 'Antes & Depois',
        action: 'before_after_prev'
      });
    }
  };

  return (
    <section id="antes-depois" className="py-14 px-4 max-w-4xl mx-auto scroll-mt-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-3">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>TRANSFORMAÇÃO REAL DE CLIENTES</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-custom-text mb-3">
          Antes & Depois da Inteligência Artificial
        </h2>
        <p className="text-sm sm:text-base text-white/60 max-w-lg mx-auto">
          Arraste o divisor central para conferir a diferença surreal entre a foto original do celular e o ensaio fotográfico de estúdio em 4K.
        </p>
      </motion.div>

      {/* Selectors / Tabs if multiple comparisons exist */}
      {activeItems.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar"
        >
          {activeItems.map((item, idx) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => {
                setActiveIndex(idx);
                setSliderPosition(50);
              }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeIndex === idx
                  ? 'btn-primary shadow-lg ring-2 ring-amber-400/40'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
              }`}
            >
              <span>{item.title}</span>
              {item.category && (
                <span className="opacity-70 text-[10px] uppercase font-mono">({item.category})</span>
              )}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Comparison Slider Card */}
      <motion.div
        key={currentItem.id}
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl mx-auto"
      >
        {/* Info Header above slider */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-2 text-left">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>{currentItem.title}</span>
              {currentItem.category && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentItem.category}
                </span>
              )}
            </h3>
            {currentItem.subtitle && (
              <p className="text-xs text-white/60">{currentItem.subtitle}</p>
            )}
          </div>

          {currentItem.clientName && (
            <div className="flex items-center gap-1.5 text-xs text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10 self-start sm:self-auto">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentItem.clientName}</span>
            </div>
          )}
        </div>

        {/* Interactive Split Canvas */}
        <div
          className="relative w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl select-none cursor-ew-resize touch-none bg-black"
          onMouseMove={handleMove}
          onTouchMove={handleMove}
        >
          {/* AFTER Image (Full background layer) */}
          <img
            src={currentItem.afterImageUrl}
            alt="Depois - Ensaio 4K"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-500 text-black text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{currentItem.afterLabel || 'DEPOIS (IA STUDIO 4K)'}</span>
          </div>

          {/* BEFORE Image (Clipped layer from left) */}
          <div
            className="absolute top-0 left-0 bottom-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={currentItem.beforeImageUrl}
              alt="Antes - Foto original"
              className="absolute top-0 left-0 w-[600px] sm:w-[800px] max-w-none h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/85 border border-white/20 text-white text-xs font-black uppercase tracking-wider shadow-lg">
              {currentItem.beforeLabel || 'ANTES (FOTO COMUM)'}
            </div>
          </div>

          {/* Draggable Divider Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-10 flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="w-10 h-10 rounded-full bg-white text-black shadow-2xl flex items-center justify-center font-bold text-sm border-2 border-amber-500 animate-pulse">
              ↔
            </div>
          </div>

          {/* Arrow navigation over comparison if multiple */}
          {activeItems.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md shadow-xl transition cursor-pointer z-20"
                title="Transformação Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md shadow-xl transition cursor-pointer z-20"
                title="Próxima Transformação"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Caption Instructions */}
        <p className="text-[11px] text-white/50 mt-3 flex items-center justify-center gap-1.5">
          <span>💡 Dica: Deslize o dedo ou mouse para a esquerda e direita sobre a imagem.</span>
        </p>
      </motion.div>
    </section>
  );
};
