import React, { useState, useRef, useEffect } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { PortfolioItem } from '../../types';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  X,
  Images,
  LayoutGrid,
  Sliders,
  CheckCircle,
  ArrowRight,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PortfolioSection: React.FC = () => {
  const { portfolio, trackEvent, openOrderModal, packages } = useBioSite();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [previewItem, setPreviewItem] = useState<PortfolioItem | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  // Carousel navigation state
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);

  const categories = [
    'Todos',
    'Profissional',
    'Aniversário',
    'Gestante',
    'Casal',
    'Feminino',
    'Masculino',
    'Família',
    'Infantil',
    'Outros'
  ];

  const enabledItems = portfolio
    .filter((item) => item.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const filteredItems =
    selectedCategory === 'Todos'
      ? enabledItems
      : enabledItems.filter((item) => item.category === selectedCategory);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setActiveCarouselIndex(0);
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
    trackEvent('button_click', { button: 'portfolio_category', category: cat });
  };

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Estimate active index based on item width
      const cardWidth = 320; // approximate card + gap width
      const index = Math.round(scrollLeft / cardWidth);
      setActiveCarouselIndex(Math.min(index, filteredItems.length - 1));
    }
  };

  useEffect(() => {
    checkScroll();
    const el = carouselRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [filteredItems]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleOpenPreview = (item: PortfolioItem) => {
    setPreviewItem(item);
    setCurrentPhotoIndex(0);
    trackEvent('package_click', {
      button: 'open_portfolio_gallery',
      itemTitle: item.title,
      category: item.category,
      value: 97.0
    });
  };

  const handleModalNextPhoto = (gallery: string[]) => {
    setCurrentPhotoIndex((prev) => (prev + 1) % gallery.length);
  };

  const handleModalPrevPhoto = (gallery: string[]) => {
    setCurrentPhotoIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleBookThisStyle = (item: PortfolioItem) => {
    setPreviewItem(null);
    // Find closest matching package or default
    const matchingPkg = packages.find(
      (p) => p.name.toLowerCase().includes(item.category.toLowerCase()) || p.featured
    ) || packages[0];

    if (matchingPkg) {
      trackEvent('button_click', {
        button: 'order_modal_open',
        package: matchingPkg.name,
        value: matchingPkg.price,
        styleSource: item.title
      });
      openOrderModal(matchingPkg);
    }
  };

  return (
    <section id="portfolio" className="py-14 px-4 max-w-6xl mx-auto scroll-mt-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GALERIA DE ENSAIOS ULTRA HD</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-custom-text mb-3">
          Portfólio de Estilos & Ensaios
        </h2>
        <p className="text-sm sm:text-base text-white/60 max-w-xl mx-auto">
          Clique em qualquer estilo para <strong>navegar por todas as fotos do ensaio</strong> e se inspirar para sua transformação.
        </p>

        {/* View Mode Switcher (Carrossel vs Grade) */}
        <div className="flex items-center justify-center gap-2 mt-5">
          <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => setViewMode('carousel')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'carousel'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Modo Carrossel</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Modo Grade</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Category Pills Bar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar justify-start sm:justify-center"
      >
        {categories.map((cat, catIdx) => (
          <motion.button
            key={cat}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: catIdx * 0.03 }}
            onClick={() => handleCategorySelect(cat)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat
                ? 'btn-primary shadow-lg ring-2 ring-amber-400/30'
                : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      {/* CAROUSEL VIEW */}
      {viewMode === 'carousel' && (
        <div className="relative group/carousel">
          {/* Carousel Arrows */}
          <button
            onClick={() => scrollCarousel('left')}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-20 p-3 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 backdrop-blur-md shadow-2xl transition cursor-pointer ${
              canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            title="Ver anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => scrollCarousel('right')}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-20 p-3 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 backdrop-blur-md shadow-2xl transition cursor-pointer ${
              canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            title="Ver próximo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Horizontal Track */}
          <div
            ref={carouselRef}
            className="flex items-stretch gap-5 overflow-x-auto py-4 px-2 snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredItems.length === 0 ? (
              <div className="w-full text-center py-16 text-white/40">
                Nenhum ensaio encontrado para a categoria "{selectedCategory}".
              </div>
            ) : (
              filteredItems.map((item) => {
                const galleryList = item.gallery && item.gallery.length > 0 ? item.gallery : [item.imageUrl];
                const count = galleryList.length;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    onClick={() => handleOpenPreview(item)}
                    className="min-w-[280px] sm:min-w-[340px] max-w-[340px] snap-center shrink-0 rounded-3xl overflow-hidden bg-[#111114]/90 border border-white/15 hover:border-amber-400/60 transition-all duration-300 group cursor-pointer shadow-xl flex flex-col justify-between"
                  >
                    {/* Cover Image */}
                    <div className="relative aspect-[3/4] bg-black overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-108"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-black/40 opacity-80 group-hover:opacity-90 transition" />

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-[11px] font-bold text-amber-300 shadow">
                        {item.category}
                      </div>

                      {/* Photo Count Badge */}
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-purple-600/90 text-white text-[11px] font-bold border border-white/20 shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                        <Images className="w-3.5 h-3.5" />
                        <span>{count} {count === 1 ? 'Foto' : 'Fotos'}</span>
                      </div>

                      {/* Zoom Indicator Icon */}
                      <div className="absolute bottom-4 right-4 p-2.5 rounded-full bg-amber-500 text-black shadow-xl opacity-90 group-hover:scale-110 transition">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition mb-1 line-clamp-1">
                          {item.title}
                        </h3>
                        {item.description ? (
                          <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        ) : (
                          <p className="text-xs text-white/50">
                            Ensaio com iluminação de estúdio e poses profissionais.
                          </p>
                        )}
                      </div>

                      {/* CTA inside Card */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <span>Ver todas as {count} fotos</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                        </span>
                        <span className="text-[10px] text-white/40 uppercase tracking-wider font-mono">4K Ultra HD</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Dots Indicator */}
          {filteredItems.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-4">
              {filteredItems.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => {
                    if (carouselRef.current) {
                      carouselRef.current.scrollTo({
                        left: dotIdx * 340,
                        behavior: 'smooth'
                      });
                    }
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeCarouselIndex === dotIdx
                      ? 'w-6 bg-amber-400'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  title={`Ir para ensaio ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-16 text-white/40">
              Nenhum ensaio encontrado para a categoria "{selectedCategory}".
            </div>
          ) : (
            filteredItems.map((item) => {
              const galleryList = item.gallery && item.gallery.length > 0 ? item.gallery : [item.imageUrl];
              const count = galleryList.length;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => handleOpenPreview(item)}
                  className="group relative rounded-3xl overflow-hidden bg-[#111114]/90 border border-white/15 hover:border-amber-400/50 cursor-pointer shadow-xl aspect-[3/4] flex flex-col justify-end p-5"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-85 group-hover:opacity-95 transition" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-bold text-amber-300">
                    {item.category}
                  </div>

                  <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-purple-600/90 text-white text-[11px] font-bold border border-white/20 shadow-lg flex items-center gap-1.5 backdrop-blur-md">
                    <Images className="w-3.5 h-3.5" />
                    <span>{count} Fotos</span>
                  </div>

                  {/* Bottom details */}
                  <div className="relative z-10 text-left space-y-1">
                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/70 line-clamp-1">
                      {item.description || 'Clique para visualizar todas as variações deste ensaio.'}
                    </p>
                    <div className="pt-2 flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Abrir Galeria do Ensaio ({count})</span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* MULTI-PHOTO GALLERY MODAL / FULLSCREEN CAROUSEL */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewItem(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl p-3 sm:p-6 flex items-center justify-center overflow-y-auto"
          >
            {(() => {
              const gallery = previewItem.gallery && previewItem.gallery.length > 0
                ? previewItem.gallery
                : [previewItem.imageUrl];
              const activePhoto = gallery[currentPhotoIndex] || gallery[0];

              return (
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-w-4xl w-full bg-neutral-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[95vh]"
                >
                  {/* Modal Header */}
                  <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {previewItem.category}
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                          {previewItem.title}
                        </h3>
                        <span className="text-xs text-white/50">
                          Foto {currentPhotoIndex + 1} de {gallery.length} neste estilo
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setPreviewItem(null)}
                      className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                      title="Fechar galeria"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Main Large Photo Carousel Viewer */}
                  <div className="relative flex-1 min-h-[350px] sm:min-h-[500px] max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activePhoto}
                        src={activePhoto}
                        alt={`${previewItem.title} - Foto ${currentPhotoIndex + 1}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="max-h-[58vh] w-auto max-w-full object-contain select-none"
                      />
                    </AnimatePresence>

                    {/* Left/Right Navigation Arrows */}
                    {gallery.length > 1 && (
                      <>
                        <button
                          onClick={() => handleModalPrevPhoto(gallery)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md shadow-2xl transition cursor-pointer"
                          title="Foto anterior"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => handleModalNextPhoto(gallery)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md shadow-2xl transition cursor-pointer"
                          title="Próxima foto"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}

                    {/* Top Counter Badge */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-mono border border-white/20 shadow">
                      {currentPhotoIndex + 1} / {gallery.length}
                    </div>
                  </div>

                  {/* Thumbnails Navigation Strip */}
                  {gallery.length > 1 && (
                    <div className="px-4 py-3 bg-black/60 border-t border-white/10 flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
                      {gallery.map((thumbUrl, thumbIdx) => (
                        <button
                          key={thumbIdx}
                          onClick={() => setCurrentPhotoIndex(thumbIdx)}
                          className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                            currentPhotoIndex === thumbIdx
                              ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
                              : 'border-white/20 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Modal Footer with Style Description and CTA */}
                  <div className="p-4 sm:p-5 bg-neutral-900 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left max-w-md">
                      {previewItem.description ? (
                        <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                          {previewItem.description}
                        </p>
                      ) : (
                        <p className="text-xs text-white/50">
                          Receba fotos ultra-realistas neste mesmo estilo profissional usando apenas suas selfies.
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleBookThisStyle(previewItem)}
                      className="btn-primary w-full sm:w-auto px-7 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-2xl cursor-pointer hover:scale-102 transition"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Quero um Ensaio Neste Estilo</span>
                    </button>
                  </div>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
