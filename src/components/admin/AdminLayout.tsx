import React, { useState } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { DashboardOverview } from './DashboardOverview';
import { ContentManager } from './ContentManager';
import { DesignManager } from './DesignManager';
import { NavManager } from './NavManager';
import { PackageManager } from './PackageManager';
import { PortfolioManager } from './PortfolioManager';
import { BeforeAfterManager } from './BeforeAfterManager';
import { TestimonialManager } from './TestimonialManager';
import { FaqManager } from './FaqManager';
import { OrderLeadManager } from './OrderLeadManager';
import { AnalyticsManager } from './AnalyticsManager';
import { PixelManager } from './PixelManager';
import { SettingsManager } from './SettingsManager';
import { HowItWorksManager } from './HowItWorksManager';
import { MusicManager } from './MusicManager';
import { motion, AnimatePresence } from 'motion/react';

import {
  LayoutDashboard,
  FileText,
  Palette,
  Compass,
  Package,
  Camera,
  MessageSquare,
  HelpCircle,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Save,
  CheckCircle2,
  Check,
  Zap,
  Music,
  SlidersHorizontal,
  Activity,
  Cloud,
  CloudCheck,
  RefreshCw
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const {
    siteSettings,
    logoutAdmin,
    toggleAdminMode,
    orders,
    saveAllData,
    hasUnsavedChanges,
    isCloudSynced,
    isCloudSaving,
    isSyncing,
    forceSyncData
  } = useBioSite();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Alterações gravadas no Firestore Cloud com sucesso!');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleGlobalSave = async () => {
    const success = await saveAllData();
    if (success) {
      setSaveSuccess(true);
      setToastMessage('Todas as alterações foram gravadas no Firestore com sucesso!');
      setShowToast(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowToast(false);
      }, 3500);
    } else {
      setToastMessage('Alterações salvas localmente e sincronizando em segundo plano.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3500);
    }
  };

  const handleForceSync = async () => {
    const success = await forceSyncData();
    setToastMessage(
      success
        ? 'Sincronização em Tempo Real concluída com sucesso!'
        : 'Sincronização realizada com os servidores.'
    );
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'novo' || o.status === 'aguardando_pagamento'
  ).length;

  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'content', label: 'Hero & Textos', icon: FileText },
    { id: 'how_it_works', label: 'Como Funciona (4 Passos)', icon: Zap },
    { id: 'music', label: 'Trilha Sonora (Música)', icon: Music },
    { id: 'design', label: 'Design & Temas', icon: Palette },
    { id: 'nav', label: 'Navegação', icon: Compass },
    { id: 'packages', label: 'Pacotes & Preços', icon: Package },
    { id: 'portfolio', label: 'Portfólio 4K', icon: Camera },
    { id: 'before_after', label: 'Antes & Depois', icon: SlidersHorizontal },
    { id: 'testimonials', label: 'Depoimentos', icon: MessageSquare },
    { id: 'faq', label: 'Perguntas FAQ', icon: HelpCircle },
    { id: 'orders', label: 'Pedidos & Leads', icon: ShoppingBag, badge: pendingOrdersCount },
    { id: 'pixels', label: 'Pixel & Anúncios (Meta/GA)', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Favicon & Configurações', icon: Settings }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'content':
        return <ContentManager />;
      case 'how_it_works':
        return <HowItWorksManager />;
      case 'music':
        return <MusicManager />;
      case 'design':
        return <DesignManager />;
      case 'nav':
        return <NavManager />;
      case 'packages':
        return <PackageManager />;
      case 'portfolio':
        return <PortfolioManager />;
      case 'before_after':
        return <BeforeAfterManager />;
      case 'testimonials':
        return <TestimonialManager />;
      case 'faq':
        return <FaqManager />;
      case 'orders':
        return <OrderLeadManager />;
      case 'pixels':
        return <PixelManager />;
      case 'analytics':
        return <AnalyticsManager />;
      case 'settings':
        return <SettingsManager />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-[#08080A] text-[#F5F2EA] flex flex-col font-sans selection:bg-[#C9A45C] selection:text-black">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#08080A]/90 backdrop-blur-md border-b border-[#C9A45C]/20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {siteSettings.logoUrl && siteSettings.logoEnabled ? (
            <img
              src={siteSettings.logoUrl}
              alt="Logo"
              className="w-9 h-9 rounded-full object-cover border border-[#C9A45C]/40"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#111114] border border-[#C9A45C]/40 flex items-center justify-center font-serif text-[#C9A45C] font-bold text-sm">
              CS
            </div>
          )}
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C9A45C] block">
              Painel de Gestão VIP
            </span>
            <h1 className="text-base font-serif font-light tracking-tight text-[#F5F2EA]">
              {siteSettings.brandName} Admin
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Cloud Firestore Status Badge with interactive Force Sync button */}
          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-[#C9A45C]/10 border border-white/10 hover:border-[#C9A45C]/40 text-xs font-semibold text-white/80 hover:text-[#E5BF70] transition cursor-pointer"
            title="Clique para forçar a busca das alterações mais recentes do Firestore em tempo real"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#C9A45C] ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isSyncing ? 'Sincronizando...' : 'Forçar Sincronização'}</span>
          </button>

          <button
            onClick={handleGlobalSave}
            disabled={isCloudSaving}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all duration-300 cursor-pointer shadow-lg ${
              saveSuccess
                ? 'bg-emerald-500 hover:bg-emerald-600 text-black shadow-emerald-500/30'
                : hasUnsavedChanges
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black animate-pulse shadow-amber-500/30 hover:scale-105'
                : 'bg-[#C9A45C] hover:bg-[#b8934b] text-black shadow-amber-500/20'
            }`}
            title="Salvar todas as alterações feitas no painel"
          >
            {isCloudSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4 text-black font-extrabold stroke-[3]" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span className="font-extrabold uppercase tracking-wider">
              {isCloudSaving
                ? 'Salvando na Nuvem...'
                : saveSuccess
                ? 'Salvo com Sucesso!'
                : 'Salvar Tudo'}
            </span>
            {hasUnsavedChanges && !saveSuccess && !isCloudSaving && (
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
            )}
          </button>

          <button
            onClick={() => toggleAdminMode(false)}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#F5F2EA] flex items-center gap-2 transition cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span className="hidden sm:inline">Ver BioSite Ao Vivo</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer"
            title="Sair do Painel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Save / Sync Success Toast Banner */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-black font-extrabold px-6 py-3 rounded-2xl shadow-2xl border-2 border-white/30 flex items-center gap-3"
          >
            <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-black stroke-[3]" />
            </div>
            <span className="text-sm tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 bg-[#111114] border-r border-[#C9A45C]/15 p-4 flex flex-row lg:flex-col gap-1 overflow-x-auto shrink-0 scrollbar-none">
          <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-[0.3em] text-[#C9A45C]/60 hidden lg:block mb-1">
            Menu de Controle
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#C9A45C]/15 text-[#C9A45C] border border-[#C9A45C]/40 font-bold shadow-lg'
                    : 'text-[#F5F2EA]/70 hover:text-[#F5F2EA] hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9A45C]' : 'text-white/40'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C9A45C] text-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Tab Panel View */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto relative pb-24">
          {renderActiveTab()}
        </main>
      </div>

      {/* Floating Save Button at Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleGlobalSave}
          className={`px-5 py-3.5 rounded-2xl font-bold text-xs flex items-center gap-2.5 shadow-2xl transition-all duration-300 cursor-pointer border border-white/20 hover:scale-105 active:scale-95 ${
            hasUnsavedChanges
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-extrabold ring-4 ring-amber-400/30'
              : 'bg-[#111114] text-[#C9A45C] hover:bg-[#1a1a20]'
          }`}
        >
          <Save className="w-5 h-5 text-current" />
          <span className="uppercase tracking-wider font-extrabold">Salvar Alterações</span>
          {hasUnsavedChanges && (
            <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold">
              Pendente
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
