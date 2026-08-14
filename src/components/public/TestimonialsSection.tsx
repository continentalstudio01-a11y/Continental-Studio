import React from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useBioSite();

  const enabledTestimonials = testimonials
    .filter((t) => t.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (enabledTestimonials.length === 0) return null;

  return (
    <section id="depoimentos" className="py-12 px-4 max-w-5xl mx-auto scroll-mt-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
          <Star className="w-3.5 h-3.5 fill-emerald-400" />
          <span>AVALIAÇÕES 5 ESTRELAS</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-custom-text mb-3">
          O que dizem nossos clientes
        </h2>
        <p className="text-sm sm:text-base text-white/60 max-w-lg mx-auto">
          Veja a experiência real de quem já transformou suas fotos com a Continental Studio.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {enabledTestimonials.map((t, idx) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{
              duration: 0.55,
              delay: idx * 0.12,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between relative group hover:border-[#C9A45C]/40 hover:bg-white/[0.07] transition-all duration-300 shadow-xl"
          >
            <Quote className="absolute top-4 right-4 w-8 h-8 text-white/10 group-hover:text-amber-500/20 transition" />

            <div>
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < t.rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`}
                  />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-white/80 italic mb-6 leading-relaxed">
                "{t.text}"
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/10">
              <img
                src={t.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                alt={t.name}
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />
              <div>
                <h4 className="text-sm font-bold text-custom-text">{t.name}</h4>
                <span className="text-[11px] text-emerald-400 font-medium">Cliente Verificado</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
