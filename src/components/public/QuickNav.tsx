import React from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { NavIcon } from '../common/NavIcon';
import { NavItem } from '../../types';

export const QuickNav: React.FC = () => {
  const { navItems, trackEvent, registerNavClick, openOrderModal, siteSettings } = useBioSite();

  const enabledItems = [...navItems]
    .filter((item) => item.enabled)
    .sort((a, b) => a.order - b.order);

  if (enabledItems.length === 0) return null;

  const handleNavClick = (item: NavItem) => {
    registerNavClick(item.id);
    trackEvent('button_click', { button: 'quick_nav', target: item.target, label: item.label });

    if (item.target === '#order_modal' || item.id === 'order') {
      trackEvent('button_click', { button: 'order_modal_open', source: 'quick_nav' });
      openOrderModal();
      return;
    }

    if (item.targetType === 'whatsapp' || item.target.includes('wa.me')) {
      trackEvent('whatsapp_click', { source: 'quick_nav_item', label: item.label });
      const phone = siteSettings.whatsappNumber || '5588997057623';
      const text = encodeURIComponent(`Olá! Quero tirar dúvidas sobre o BioSite de fotos com IA.`);
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

  return (
    <nav className="sticky top-2 z-40 my-6 px-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 overflow-x-auto py-2 px-3 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-md shadow-2xl no-scrollbar">
        {enabledItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition duration-200 cursor-pointer ${
              item.featured
                ? 'bg-amber-400 hover:bg-amber-300 text-black font-extrabold shadow-lg shadow-amber-500/20'
                : 'bg-white/5 hover:bg-white/15 border border-white/10 text-white/90 hover:text-white'
            }`}
          >
            <NavIcon
              iconName={item.icon}
              iconUrl={item.iconUrl}
              className={`w-4 h-4 ${item.featured ? 'text-black' : 'text-amber-400'}`}
            />
            <span>{item.label}</span>
            {item.badge && (
              <span
                className={`px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase tracking-wider ${
                  item.featured
                    ? 'bg-black text-amber-300'
                    : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
