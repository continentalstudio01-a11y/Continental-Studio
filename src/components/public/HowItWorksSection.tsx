import React from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { motion } from 'motion/react';
import {
  Package,
  Upload,
  Cpu,
  Download,
  Sparkles,
  Camera,
  Zap,
  CheckCircle2,
  MessageCircle,
  Star,
  Gift,
  Image as ImageIcon,
  Wand2,
  ShieldCheck,
  Clock,
  Smartphone,
  Send,
  Layers,
  Heart,
  Palette
} from 'lucide-react';
import { StepMotionEffect } from '../../types';

export const HowItWorksSection: React.FC = () => {
  const { howItWorksSteps, siteSettings } = useBioSite();

  const enabledSteps = (howItWorksSteps || [])
    .filter((s) => s.enabled)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const renderLucideIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Package':
        return <Package className={className} />;
      case 'Upload':
        return <Upload className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Download':
        return <Download className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Camera':
        return <Camera className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'CheckCircle2':
        return <CheckCircle2 className={className} />;
      case 'MessageCircle':
        return <MessageCircle className={className} />;
      case 'Star':
        return <Star className={className} />;
      case 'Gift':
        return <Gift className={className} />;
      case 'Image':
        return <ImageIcon className={className} />;
      case 'Wand2':
        return <Wand2 className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Clock':
        return <Clock className={className} />;
      case 'Smartphone':
        return <Smartphone className={className} />;
      case 'Send':
        return <Send className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Heart':
        return <Heart className={className} />;
      case 'Palette':
        return <Palette className={className} />;
      default:
        return <Package className={className} />;
    }
  };

  const getColorClasses = (colorName?: string) => {
    switch (colorName) {
      case 'amber':
      case 'gold':
        return { text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
      case 'sky':
        return { text: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' };
      case 'purple':
        return { text: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' };
      case 'emerald':
        return { text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
      case 'rose':
        return { text: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' };
      default:
        return { text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    }
  };

  const getMotionAnimation = (effect?: StepMotionEffect) => {
    switch (effect) {
      case 'bounce':
        return {
          animate: { y: [0, -6, 0] },
          transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
        };
      case 'float':
        return {
          animate: { y: [0, -8, 0], x: [0, 2, 0] },
          transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' }
        };
      case 'pulse':
        return {
          animate: { scale: [1, 1.15, 1] },
          transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
        };
      case 'spin':
        return {
          animate: { rotate: 360 },
          transition: { repeat: Infinity, duration: 8, ease: 'linear' }
        };
      case 'wiggle':
        return {
          animate: { rotate: [-8, 8, -8] },
          transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
        };
      case 'glow':
        return {
          animate: { opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] },
          transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
        };
      default:
        return {
          animate: { y: [0, -5, 0] },
          transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }
        };
    }
  };

  const gridColsClass =
    enabledSteps.length === 1
      ? 'grid-cols-1 max-w-md mx-auto'
      : enabledSteps.length === 2
      ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
      : enabledSteps.length === 3
      ? 'grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

  return (
    <section id="como-funciona" className="py-12 px-4 max-w-5xl mx-auto scroll-mt-16">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PROCESSO 100% ONLINE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-custom-text mb-3">
          {siteSettings.howItWorksTitle || 'Como Funciona em 4 Passos'}
        </h2>
        <p className="text-sm sm:text-base text-white/60 max-w-lg mx-auto">
          {siteSettings.howItWorksSubtitle || 'Um processo simples, rápido e 100% online sem sair de casa.'}
        </p>
      </motion.div>

      <div className={`grid ${gridColsClass} gap-6`}>
        {enabledSteps.map((step, idx) => {
          const color = getColorClasses(step.iconColor);
          const motionConfig = getMotionAnimation(step.motionEffect);

          return (
            <motion.div
              key={step.id || idx}
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{
                duration: 0.55,
                delay: idx * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="relative p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-start hover:border-[#C9A45C]/40 hover:bg-white/[0.07] transition-all duration-300 group shadow-lg"
            >
              <div className="absolute top-4 right-4 text-3xl font-black text-white/10 group-hover:text-amber-500/30 transition">
                {step.number}
              </div>

              {/* Icon Container with Animated Icon */}
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${color.bg}`}
              >
                <motion.div {...motionConfig}>
                  {renderLucideIcon(step.icon, `w-6 h-6 ${color.text}`)}
                </motion.div>
              </div>

              <h3 className="text-lg font-bold text-custom-text mb-2">
                {step.title}
              </h3>

              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
