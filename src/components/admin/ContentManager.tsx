import React, { useState } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { Save, Image, Upload, Check, Sparkles, MessageSquare, Globe, Zap } from 'lucide-react';
import { ImageDropzone } from '../common/ImageDropzone';

export const ContentManager: React.FC = () => {
  const { siteSettings, updateSiteSettings, saveAllData } = useBioSite();
  const [formData, setFormData] = useState(siteSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const updateField = (partial: Partial<typeof formData>) => {
    const updated = { ...formData, ...partial };
    setFormData(updated);
    updateSiteSettings(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
    saveAllData();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleBadgeChange = (idx: number, val: string) => {
    const updated = [...formData.trustBadges];
    updated[idx] = val;
    updateField({ trustBadges: updated });
  };

  const addBadge = () => {
    updateField({ trustBadges: [...formData.trustBadges, '📸 Novo Selo'] });
  };

  const removeBadge = (idx: number) => {
    updateField({
      trustBadges: formData.trustBadges.filter((_, i) => i !== idx)
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Gerenciador de Conteúdo</h2>
          <p className="text-xs text-white/60">
            Edite os textos do Hero, informações da marca, slogans, selos e contatos do BioSite.
          </p>
        </div>

        <button
          type="submit"
          className="btn-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-xl"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? 'Salvo com Sucesso!' : 'Salvar Alterações'}</span>
        </button>
      </div>

      {/* Brand & Hero Identity */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Identidade da Marca e Hero
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Nome da Marca</label>
            <input
              type="text"
              value={formData.brandName}
              onChange={(e) => updateField({ brandName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Eyebrow (Selo Superior)</label>
            <input
              type="text"
              value={formData.eyebrow}
              onChange={(e) => updateField({ eyebrow: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/80 mb-1">Slogan Principal</label>
          <input
            type="text"
            value={formData.slogan}
            onChange={(e) => updateField({ slogan: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/80 mb-1">Título do Hero (Destaque)</label>
          <input
            type="text"
            value={formData.heroTitle}
            onChange={(e) => updateField({ heroTitle: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/80 mb-1">Descrição do Hero</label>
          <textarea
            rows={3}
            value={formData.heroDescription}
            onChange={(e) => updateField({ heroDescription: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Como Funciona Section Titles */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
          <Zap className="w-4 h-4" /> Cabeçalho da Seção "Como Funciona"
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Título da Seção "Como Funciona"</label>
            <input
              type="text"
              value={formData.howItWorksTitle || 'Como Funciona em 4 Passos'}
              onChange={(e) => updateField({ howItWorksTitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Subtítulo da Seção</label>
            <input
              type="text"
              value={formData.howItWorksSubtitle || 'Um processo simples, rápido e 100% online sem sair de casa.'}
              onChange={(e) => updateField({ howItWorksSubtitle: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <p className="text-xs text-amber-300/80 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
          👉 Para editar individualmente os ícones animados (Motion), títulos, ordens e descrições de cada passo, utilize a nova aba no menu lateral: <strong>Como Funciona (4 Passos)</strong>.
        </p>
      </div>

      {/* Buttons & Trust Badges */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-amber-400">Botões e Selos de Confiança</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Texto do Botão Principal</label>
            <input
              type="text"
              value={formData.primaryButtonText}
              onChange={(e) => setFormData({ ...formData, primaryButtonText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Texto do Botão Secundário</label>
            <input
              type="text"
              value={formData.secondaryButtonText}
              onChange={(e) => setFormData({ ...formData, secondaryButtonText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/80 mb-2">Selos de Confiança (Trust Badges)</label>
          <div className="space-y-2 mb-3">
            {formData.trustBadges.map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => handleBadgeChange(idx, e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeBadge(idx)}
                  className="p-2 rounded-xl bg-red-500/20 text-red-400 text-xs font-bold shrink-0 hover:bg-red-500/30"
                >
                  Remover
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addBadge}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
          >
            + Adicionar Selo
          </button>
        </div>
      </div>

      {/* Logo & Avatar Images */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
          <Image className="w-4 h-4" /> Logo e Avatar da Marca
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white/80">Logo do Topo</label>
              <input
                type="checkbox"
                checked={formData.logoEnabled}
                onChange={(e) => updateField({ logoEnabled: e.target.checked })}
                className="accent-amber-400 cursor-pointer"
              />
            </div>
            <ImageDropzone
              currentValue={formData.logoUrl}
              onImagesSelected={(imgs) => {
                const url = imgs.length > 0 ? imgs[0] : '';
                updateField({ logoUrl: url });
              }}
              label="Arraste ou clique para enviar a imagem do Logo"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white/80">Avatar de Perfil</label>
              <input
                type="checkbox"
                checked={formData.avatarEnabled}
                onChange={(e) => updateField({ avatarEnabled: e.target.checked })}
                className="accent-amber-400 cursor-pointer"
              />
            </div>
            <ImageDropzone
              currentValue={formData.avatarUrl}
              onImagesSelected={(imgs) => {
                const url = imgs.length > 0 ? imgs[0] : '';
                updateField({ avatarUrl: url });
              }}
              label="Arraste ou clique para enviar a imagem do Avatar"
            />
          </div>
        </div>
      </div>

      {/* WhatsApp & Contact */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> WhatsApp e Contatos
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Número do WhatsApp (com DDD)</label>
            <input
              type="text"
              value={formData.contact.whatsapp}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, whatsapp: e.target.value }
                })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Instagram (@usuario)</label>
            <input
              type="text"
              value={formData.contact.instagram}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, instagram: e.target.value }
                })
              }
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/80 mb-1">Template da Mensagem Automática do WhatsApp</label>
          <textarea
            rows={2}
            value={formData.messageTemplate}
            onChange={(e) => setFormData({ ...formData, messageTemplate: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
          />
          <span className="text-[10px] text-white/40 mt-1 block">
            Tags suportadas: &#123;package_name&#125;, &#123;customer_name&#125;, &#123;customer_whatsapp&#125;
          </span>
        </div>
      </div>
    </form>
  );
};
