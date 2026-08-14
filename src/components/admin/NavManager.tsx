import React, { useState } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { NavItem } from '../../types';
import {
  Save,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit2,
  X,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Upload,
  Check,
  BarChart3,
  Calendar,
  Lock,
  Smartphone,
  Monitor,
  Flame,
  RotateCcw,
  Zap,
  Split
} from 'lucide-react';
import { NavIcon, ICON_OPTIONS } from '../common/NavIcon';
import { ImageDropzone } from '../common/ImageDropzone';

export const NavManager: React.FC = () => {
  const { navItems, updateNavItems, resetNavClickStats, saveAllData } = useBioSite();
  const [items, setItems] = useState<NavItem[]>(navItems);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editing Modal State
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalClicks = items.reduce((acc, item) => acc + (item.clickCount || 0), 0);

  const updateItemsState = (newItems: NavItem[]) => {
    setItems(newItems);
    updateNavItems(newItems);
  };

  const handleToggle = (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, enabled: !item.enabled } : item
    );
    updateItemsState(updated);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const updated = [...items];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= updated.length) return;

    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    const reordered = updated.map((item, i) => ({ ...item, order: i + 1 }));
    updateItemsState(reordered);
  };

  const handleSave = () => {
    updateNavItems(items);
    saveAllData();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleOpenEdit = (item: NavItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    const newItem: NavItem = {
      id: 'nav-' + Date.now(),
      label: 'Novo Botão',
      subtitle: 'Descrição curta opcional',
      target: '#pacotes',
      targetType: 'anchor',
      enabled: true,
      order: items.length + 1,
      icon: 'Sparkles',
      badgeColor: 'amber',
      clickCount: 0,
      clickCountA: 0,
      clickCountB: 0,
      attentionEffect: 'none',
      deviceTarget: 'all'
    };
    setEditingItem(newItem);
    setIsModalOpen(true);
  };

  const handleSaveModalItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const exists = items.some((i) => i.id === editingItem.id);
    let updated: NavItem[];

    if (exists) {
      updated = items.map((i) => (i.id === editingItem.id ? editingItem : i));
    } else {
      updated = [...items, editingItem];
    }

    updateItemsState(updated);
    saveAllData();
    setIsModalOpen(false);
  };

  const handleDeleteNav = (id: string) => {
    const filtered = items.filter((i) => i.id !== id);
    updateItemsState(filtered);
    saveAllData();
  };

  const handleResetStats = () => {
    resetNavClickStats();
    const resetItems = items.map((i) => ({ ...i, clickCount: 0, clickCountA: 0, clickCountB: 0 }));
    setItems(resetItems);
    saveAllData();
  };

  const standardAnchors = [
    { label: 'Pacotes & Preços (#pacotes)', value: '#pacotes' },
    { label: 'Portfólio 4K (#portfolio)', value: '#portfolio' },
    { label: 'Antes e Depois (#antes-depois)', value: '#antes-depois' },
    { label: 'Como Funciona (#como-funciona)', value: '#como-funciona' },
    { label: 'Depoimentos (#depoimentos)', value: '#depoimentos' },
    { label: 'FAQ (#faq)', value: '#faq' },
    { label: 'Contato (#contato)', value: '#contato' }
  ];

  const now = new Date();

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Gerenciador de Navegação & Links</h2>
          <p className="text-xs text-white/60">
            Configure agendamento de links, métricas de cliques em tempo real, animações de atenção, botões restritos com senha, regras de dispositivo e testes A/B.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreate}
            className="btn-secondary px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Botão</span>
          </button>

          <button
            onClick={handleSave}
            className="btn-primary px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xl"
          >
            <Save className="w-4 h-4" />
            <span>{savedSuccess ? 'Salvo!' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

      {/* TOP ANALYTICS DASHBOARD CARD */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-[#181822] border border-amber-500/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
              Métricas de Navegação
            </span>
            <div className="flex items-baseline gap-3">
              <h3 className="text-2xl font-extrabold text-white">{totalClicks} Cliques</h3>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                100% em Tempo Real
              </span>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              Acompanhe qual botão está gerando mais conversões de clientes no seu BioSite.
            </p>
          </div>
        </div>

        <button
          onClick={handleResetStats}
          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Zerar Estatísticas</span>
        </button>
      </div>

      {/* Nav List */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <div className="space-y-3">
          {items.map((item, idx) => {
            // Schedule calculation
            let scheduleBadge = null;
            if (item.scheduleEnabled) {
              if (item.startDate && new Date(item.startDate) > now) {
                scheduleBadge = <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">🟡 Agendado</span>;
              } else if (item.endDate && new Date(item.endDate) < now) {
                scheduleBadge = <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">🔴 Expirado</span>;
              } else {
                scheduleBadge = <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">🟢 Ativo na Agenda</span>;
              }
            }

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition flex flex-col md:flex-row items-center justify-between gap-4 ${
                  item.enabled ? 'bg-white/5 border-white/15' : 'bg-black/40 border-white/5 opacity-50'
                } ${item.featured ? 'ring-2 ring-amber-400/50 bg-amber-500/10' : ''}`}
              >
                {/* Left Column: Icon + Title + Subtitle */}
                <div className="flex items-center gap-3.5 w-full md:w-auto flex-1">
                  <button
                    onClick={() => handleToggle(item.id)}
                    className={`p-2.5 rounded-xl transition cursor-pointer shrink-0 ${
                      item.enabled
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/5 text-white/40 border border-white/10'
                    }`}
                    title={item.enabled ? 'Visível na navegação' : 'Oculto na navegação'}
                  >
                    {item.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Icon Box */}
                  <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/15 flex items-center justify-center text-amber-400 shrink-0">
                    <NavIcon iconName={item.icon} iconUrl={item.iconUrl} className="w-5 h-5 text-amber-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-white truncate">{item.label}</span>

                      {item.featured && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-400 text-black">
                          Destaque
                        </span>
                      )}

                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/10 text-amber-300 border border-white/15">
                          {item.badge}
                        </span>
                      )}

                      {scheduleBadge}

                      {item.restrictedAccess && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" /> VIP
                        </span>
                      )}

                      {item.abTestEnabled && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                          <Split className="w-2.5 h-2.5" /> Teste A/B
                        </span>
                      )}
                    </div>

                    {item.subtitle && (
                      <p className="text-xs text-white/50 truncate mt-0.5">{item.subtitle}</p>
                    )}

                    <div className="flex items-center gap-3 mt-1 text-[11px] font-medium text-white/60">
                      <span className="text-amber-400/90 font-mono truncate max-w-xs">{item.target}</span>
                      <span className="text-white/30">•</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" />
                        {item.clickCount || 0} cliques
                      </span>
                      {item.deviceTarget && item.deviceTarget !== 'all' && (
                        <>
                          <span className="text-white/30">•</span>
                          <span className="text-sky-300 uppercase font-semibold text-[10px]">
                            {item.deviceTarget === 'mobile' ? '📱 Mobile' : '💻 Desktop'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar Opções</span>
                  </button>

                  <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                    <button
                      onClick={() => moveItem(idx, 'up')}
                      disabled={idx === 0}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 disabled:opacity-30 cursor-pointer"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveItem(idx, 'down')}
                      disabled={idx === items.length - 1}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 disabled:opacity-30 cursor-pointer"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNav(item.id)}
                      className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleOpenCreate}
          className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/15 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Novo Botão de Navegação</span>
        </button>
      </div>

      {/* Edit Nav Item Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto">
          <form
            onSubmit={handleSaveModalItem}
            className="w-full max-w-2xl bg-neutral-900 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-8"
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Editar Configurações Avançadas do Botão</span>
            </h3>

            {/* Label & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Título Principal do Botão *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.label}
                  onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  placeholder="Ex: Fazer Meu Ensaio"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-bold focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Subtítulo / Descrição Curta
                </label>
                <input
                  type="text"
                  value={editingItem.subtitle || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, subtitle: e.target.value })}
                  placeholder="Ex: Entrega em até 24h"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {/* ICON SELECTION */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
                Ajustar Ícone do Botão
              </label>

              <div>
                <span className="block text-xs font-semibold text-white/80 mb-1">
                  Opção 1: Arraste e solte uma imagem de Ícone Personalizado
                </span>
                <ImageDropzone
                  currentValue={editingItem.iconUrl}
                  onImagesSelected={(imgs) => {
                    const url = imgs.length > 0 ? imgs[0] : '';
                    setEditingItem({ ...editingItem, iconUrl: url });
                  }}
                  label="Arraste ou clique para enviar ícone em foto (PNG/JPG)"
                  sublabel="Ideal para logos, ícones PNG transparentes ou imagens personalizadas"
                  aspectRatio="square"
                />
              </div>

              {!editingItem.iconUrl && (
                <div>
                  <span className="block text-xs font-semibold text-white/80 mb-2">
                    Opção 2: Selecionar um Ícone da Lista
                  </span>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-36 overflow-y-auto p-2 bg-black/40 rounded-xl border border-white/10">
                    {ICON_OPTIONS.map((opt) => {
                      const isSelected = editingItem.icon === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setEditingItem({ ...editingItem, icon: opt.id, iconUrl: undefined })}
                          className={`p-2.5 rounded-xl flex flex-col items-center justify-center transition cursor-pointer ${
                            isSelected
                              ? 'bg-amber-400 text-black font-bold scale-105 shadow-lg shadow-amber-500/20'
                              : 'bg-white/5 text-white/70 hover:bg-white/15 hover:text-white'
                          }`}
                          title={opt.label}
                        >
                          <NavIcon iconName={opt.id} className="w-5 h-5" animated={isSelected} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 1. ANIMAÇÕES DE ATENÇÃO ESPECIAIS */}
            <div className="p-4 rounded-2xl bg-white/5 border border-amber-500/20 space-y-3">
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Efeito de Animação de Atenção</span>
              </label>
              <p className="text-xs text-white/60">
                Escolha como chamar a atenção visual do cliente para este botão.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'none', label: 'Sem Efeito' },
                  { id: 'shimmer', label: '✨ Brilho Passando' },
                  { id: 'pulse', label: '💓 Pulso Contínuo' },
                  { id: 'wiggle', label: '🔔 Balanço de Atenção' },
                  { id: 'neonBorder', label: '🚨 Borda Neon' },
                  { id: 'bounce', label: '⬆️ Pulo Suave' }
                ].map((eff) => {
                  const active = (editingItem.attentionEffect || 'none') === eff.id;
                  return (
                    <button
                      key={eff.id}
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, attentionEffect: eff.id as any })}
                      className={`p-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        active
                          ? 'bg-amber-400 text-black border-amber-300 shadow-md'
                          : 'bg-black/30 text-white/80 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {eff.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. AGENDAMENTO & PROGRAMAÇÃO DE HORÁRIOS */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Programação & Validade do Botão</span>
                </label>
                <input
                  type="checkbox"
                  checked={editingItem.scheduleEnabled || false}
                  onChange={(e) => setEditingItem({ ...editingItem, scheduleEnabled: e.target.checked })}
                  className="accent-amber-400 w-4 h-4 cursor-pointer"
                />
              </div>

              {editingItem.scheduleEnabled && (
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-white/70 mb-1">
                        Data e Hora de Início
                      </label>
                      <input
                        type="datetime-local"
                        value={editingItem.startDate || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, startDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-white/70 mb-1">
                        Data e Hora de Término
                      </label>
                      <input
                        type="datetime-local"
                        value={editingItem.endDate || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, endDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs font-medium text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingItem.autoHideExpired ?? true}
                      onChange={(e) => setEditingItem({ ...editingItem, autoHideExpired: e.target.checked })}
                      className="accent-amber-400 w-4 h-4 cursor-pointer"
                    />
                    <span>Ocultar botão automaticamente quando fora do horário de agendamento</span>
                  </label>
                </div>
              )}
            </div>

            {/* 3. BOTÕES RESTRITOS POR SENHA OU CUPOM */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>Proteção por Senha / Código VIP</span>
                </label>
                <input
                  type="checkbox"
                  checked={editingItem.restrictedAccess || false}
                  onChange={(e) => setEditingItem({ ...editingItem, restrictedAccess: e.target.checked })}
                  className="accent-amber-400 w-4 h-4 cursor-pointer"
                />
              </div>

              {editingItem.restrictedAccess && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">
                      Senha / Código VIP Exigido
                    </label>
                    <input
                      type="text"
                      value={editingItem.requiredPassword || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, requiredPassword: e.target.value })}
                      placeholder="Ex: VIP2026 ou CONTINENTAL"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-mono font-bold focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-white/70 mb-1">
                      Mensagem no Pop-up
                    </label>
                    <input
                      type="text"
                      value={editingItem.restrictedMessage || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, restrictedMessage: e.target.value })}
                      placeholder="Ex: Área restrita para membros VIP"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 4. REGRAS DE DISPOSITIVO */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>Exibição por Dispositivo</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'all', label: '📱 + 💻 Todos', icon: Monitor },
                  { id: 'mobile', label: '📱 Só Celular', icon: Smartphone },
                  { id: 'desktop', label: '💻 Só Computador', icon: Monitor }
                ].map((d) => {
                  const active = (editingItem.deviceTarget || 'all') === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, deviceTarget: d.id as any })}
                      className={`p-2.5 rounded-xl text-xs font-bold transition cursor-pointer border flex items-center justify-center gap-1.5 ${
                        active
                          ? 'bg-amber-400 text-black border-amber-300 shadow-md'
                          : 'bg-black/30 text-white/80 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span>{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. TESTE A/B DE TÍTULOS E CORES */}
            <div className="p-4 rounded-2xl bg-white/5 border border-sky-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
                  <Split className="w-4 h-4 text-sky-400" />
                  <span>Teste A/B Automático (50/50)</span>
                </label>
                <input
                  type="checkbox"
                  checked={editingItem.abTestEnabled || false}
                  onChange={(e) => setEditingItem({ ...editingItem, abTestEnabled: e.target.checked })}
                  className="accent-sky-400 w-4 h-4 cursor-pointer"
                />
              </div>

              {editingItem.abTestEnabled && (
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-white/70 mb-1">
                        Título na Variante B
                      </label>
                      <input
                        type="text"
                        value={editingItem.variantBLabel || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, variantBLabel: e.target.value })}
                        placeholder="Ex: Garantir Fotos IA em 24h"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs font-bold focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-white/70 mb-1">
                        Subtítulo na Variante B
                      </label>
                      <input
                        type="text"
                        value={editingItem.variantBSubtitle || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, variantBSubtitle: e.target.value })}
                        placeholder="Ex: Sessão Fotográfica Ultra HD"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-white text-xs focus:border-sky-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs text-white/80">
                    <span>Métricas do Teste:</span>
                    <div className="flex items-center gap-3">
                      <span className="text-amber-400 font-bold">
                        A: {editingItem.clickCountA || 0} cliques
                      </span>
                      <span className="text-sky-300 font-bold">
                        B: {editingItem.clickCountB || 0} cliques
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* TARGET / LINK & TYPE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Tipo de Destino
                </label>
                <select
                  value={editingItem.targetType || 'anchor'}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      targetType: e.target.value as any
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                >
                  <option value="anchor">Seção da Página (#secao)</option>
                  <option value="whatsapp">Conversa Direta no WhatsApp</option>
                  <option value="external">URL / Link Externo (https://)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Destino / Link *
                </label>
                {editingItem.targetType === 'anchor' ? (
                  <select
                    value={editingItem.target}
                    onChange={(e) => setEditingItem({ ...editingItem, target: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                  >
                    {standardAnchors.map((anchor) => (
                      <option key={anchor.value} value={anchor.value}>
                        {anchor.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={editingItem.target}
                    onChange={(e) => setEditingItem({ ...editingItem, target: e.target.value })}
                    placeholder={
                      editingItem.targetType === 'whatsapp'
                        ? '#contato ou wa.me/5511999999999'
                        : 'https://seusite.com'
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                )}
              </div>
            </div>

            {/* BADGE / HIGHLIGHT / OPTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Selo de Destaque (Opcional)
                </label>
                <input
                  type="text"
                  value={editingItem.badge || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                  placeholder="Ex: DESTAQUE, NOVO, 4.9/5"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Cor do Selo
                </label>
                <select
                  value={editingItem.badgeColor || 'amber'}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      badgeColor: e.target.value as any
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                >
                  <option value="amber">Ouro / Amarelo</option>
                  <option value="emerald">Esmeralda / Verde</option>
                  <option value="purple">Roxo / Violeta</option>
                  <option value="rose">Rosa / Vermelho</option>
                  <option value="sky">Azul Céu</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.featured || false}
                  onChange={(e) => setEditingItem({ ...editingItem, featured: e.target.checked })}
                  className="accent-amber-400 w-4 h-4 cursor-pointer"
                />
                <span>Destacar este botão com fundo gradiente especial (Estilo Principal)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.openInNewTab || false}
                  onChange={(e) => setEditingItem({ ...editingItem, openInNewTab: e.target.checked })}
                  className="accent-amber-400 w-4 h-4 cursor-pointer"
                />
                <span>Abrir link em uma nova guia do navegador</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.enabled}
                  onChange={(e) => setEditingItem({ ...editingItem, enabled: e.target.checked })}
                  className="accent-emerald-400 w-4 h-4 cursor-pointer"
                />
                <span>Exibir este botão no BioSite público</span>
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Salvar Opções
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

