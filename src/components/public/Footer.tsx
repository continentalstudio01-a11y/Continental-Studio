import React from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { Instagram, Lock, Mail, MessageCircle, Share2, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export const Footer: React.FC = () => {
  const { siteSettings, toggleAdminMode, trackEvent } = useBioSite();

  return (
    <motion.footer
      id="contato"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mt-16 border-t border-white/10 bg-black/60 pt-12 pb-8 px-4 relative z-10"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Brand Header */}
        <h3 className="text-xl font-bold uppercase tracking-wider text-custom-primary mb-2 font-serif">
          {siteSettings.brandName || 'Continental Studio'}
        </h3>
        <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto mb-6">
          {siteSettings.slogan}
        </p>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {siteSettings.contact.instagram && (
            <a
              href={`https://instagram.com/${siteSettings.contact.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('button_click', { button: 'instagram_footer' })}
              className="p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition hover:scale-105"
              title="Instagram"
            >
              <Instagram className="w-5 h-5 text-rose-400" />
            </a>
          )}

          {siteSettings.contact.whatsapp && (
            <a
              href={`https://wa.me/${siteSettings.contact.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('whatsapp_click', { source: 'footer_icon' })}
              className="p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition hover:scale-105"
              title="WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
            </a>
          )}

          {siteSettings.contact.email && (
            <a
              href={`mailto:${siteSettings.contact.email}`}
              className="p-3 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition hover:scale-105"
              title="E-mail"
            >
              <Mail className="w-5 h-5 text-amber-400" />
            </a>
          )}
        </div>

        {/* Divider */}
        <div className="w-16 h-0.5 bg-white/10 mx-auto mb-6" />

        {/* Admin Link & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 max-w-xl mx-auto">
          <span>
            © {new Date().getFullYear()} {siteSettings.brandName || 'Continental Studio'}. Todos os direitos reservados.
          </span>

          <button
            onClick={() => toggleAdminMode(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C9A45C]/10 hover:bg-[#C9A45C]/20 border border-[#C9A45C]/30 text-[#C9A45C] hover:text-white transition cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span className="font-semibold">Painel de Gestão (Admin)</span>
          </button>
        </div>
      </div>
    </motion.footer>
  );
};
