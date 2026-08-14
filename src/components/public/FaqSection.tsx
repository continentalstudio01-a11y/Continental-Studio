import React, { useState } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FaqSection: React.FC = () => {
  const { faqs } = useBioSite();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const enabledFaqs = faqs
    .filter((f) => f.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (enabledFaqs.length === 0) return null;

  return (
    <section id="faq" className="py-12 px-4 max-w-3xl mx-auto scroll-mt-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>DÚVIDAS FREQUENTES</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-custom-text mb-3">
          Perguntas Frequentes
        </h2>
        <p className="text-sm sm:text-base text-white/60">
          Tire todas as suas dúvidas antes de fazer seu ensaio com IA.
        </p>
      </motion.div>

      <div className="space-y-4">
        {enabledFaqs.map((faq, idx) => {
          const isOpen = openId === faq.id;
          return (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.5,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 overflow-hidden transition-colors shadow-md"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-custom-text hover:bg-white/5 transition cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[#C9A45C] shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="p-5 pt-0 text-xs sm:text-sm text-white/75 leading-relaxed border-t border-white/5">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
