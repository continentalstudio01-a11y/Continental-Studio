import React, { useState } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { Key, Database, RefreshCw, Download, Check, ShieldAlert, Trash2, Activity, Flame, Sparkles, Send } from 'lucide-react';
import { fireMarketingEvent } from '../../lib/tracking';

export const SettingsManager: React.FC = () => {
  const { siteSettings, updateSiteSettings, updateAdminCredentials, resetToDefaults, clearOperationalData, trackEvent } = useBioSite();

  // Admin Credentials
  const [adminEmail, setAdminEmail] = useState('continentalstudio01@gmail.com');
  const [adminPass, setAdminPass] = useState('admin123');
  const [passSaved, setPassSaved] = useState(false);

  // Marketing Tracking Pixels
  const [metaPixelId, setMetaPixelId] = useState(siteSettings.tracking?.metaPixelId || '');
  const [ga4Id, setGa4Id] = useState(siteSettings.tracking?.googleAnalyticsId || '');
  const [gtmId, setGtmId] = useState(siteSettings.tracking?.googleTagManagerId || '');
  const [trackingSaved, setTrackingSaved] = useState(false);
  const [testEventSent, setTestEventSent] = useState(false);

  // Urgency & Scarcity Settings
  const [urgencyEnabled, setUrgencyEnabled] = useState(siteSettings.urgency?.enabled ?? true);
  const [availableSlots, setAvailableSlots] = useState(siteSettings.urgency?.availableSlots ?? 3);
  const [totalSlots, setTotalSlots] = useState(siteSettings.urgency?.totalSlots ?? 15);
  const [countdownHours, setCountdownHours] = useState(siteSettings.urgency?.countdownHours ?? 3);
  const [highlightBadge, setHighlightBadge] = useState(siteSettings.urgency?.highlightBadge ?? 'Vagas da Semana');
  const [bannerText, setBannerText] = useState(siteSettings.urgency?.bannerText ?? 'Vagas limitadas para entrega em até 24h!');
  const [showInHeader, setShowInHeader] = useState(siteSettings.urgency?.showInHeader ?? true);
  const [showInPackages, setShowInPackages] = useState(siteSettings.urgency?.showInPackages ?? true);
  const [urgencySaved, setUrgencySaved] = useState(false);

  // Supabase
  const [supabaseUrl, setSupabaseUrl] = useState(siteSettings.supabaseConfig?.url || '');
  const [supabaseKey, setSupabaseKey] = useState(siteSettings.supabaseConfig?.anonKey || '');
  const [supabaseSaved, setSupabaseSaved] = useState(false);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminCredentials(adminEmail, adminPass);
    setPassSaved(true);
    setTimeout(() => setPassSaved(false), 3000);
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      tracking: {
        metaPixelId: metaPixelId.trim(),
        googleAnalyticsId: ga4Id.trim(),
        googleTagManagerId: gtmId.trim(),
        enabled: Boolean(metaPixelId.trim() || ga4Id.trim() || gtmId.trim())
      }
    });
    setTrackingSaved(true);
    setTimeout(() => setTrackingSaved(false), 3000);
  };

  const handleSendTestEvent = () => {
    fireMarketingEvent('Lead', {
      source: 'admin_test_event',
      value: 97.00,
      currency: 'BRL',
      test: true
    });
    setTestEventSent(true);
    setTimeout(() => setTestEventSent(false), 4000);
  };

  const handleSaveUrgency = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      urgency: {
        enabled: urgencyEnabled,
        availableSlots: Number(availableSlots),
        totalSlots: Number(totalSlots),
        countdownHours: Number(countdownHours),
        highlightBadge: highlightBadge.trim(),
        bannerText: bannerText.trim(),
        showInHeader,
        showInPackages
      }
    });
    setUrgencySaved(true);
    setTimeout(() => setUrgencySaved(false), 3000);
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      supabaseConfig: {
        url: supabaseUrl,
        anonKey: supabaseKey,
        connected: Boolean(supabaseUrl && supabaseKey)
      }
    });
    setSupabaseSaved(true);
    setTimeout(() => setSupabaseSaved(false), 3000);
  };

  const handleExportJSON = () => {
    const data = {
      siteSettings,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `continental_biosite_backup_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Configurações Gerais & Marketing</h2>
        <p className="text-xs text-white/60">
          Gerencie Pixels de rastreio, gatilhos de urgência, senhas de acesso e banco de dados.
        </p>
      </div>

      {/* Meta Pixel & Google Analytics Marketing Suite */}
      <form onSubmit={handleSaveTracking} className="p-6 rounded-3xl bg-white/5 border border-[#C9A45C]/35 space-y-5 shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-bold text-[#C9A45C] flex items-center gap-2">
            <Activity className="w-4 h-4" /> Pixel do Meta (Facebook / Instagram Ads) & Google Analytics
          </h3>
          <span className="px-3 py-1 rounded-full bg-[#C9A45C]/15 text-[#C9A45C] text-[11px] font-bold">
            Disparos Automáticos Ativos
          </span>
        </div>

        <p className="text-xs text-white/70 leading-relaxed">
          Ao preencher os IDs abaixo, os eventos <strong>PageView</strong>, <strong>ViewContent</strong>, <strong>InitiateCheckout</strong>, <strong>Lead</strong> e <strong>WhatsAppClick</strong> serão disparados automaticamente para suas campanhas de tráfego pago.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">
              Meta / Facebook Pixel ID
            </label>
            <input
              type="text"
              placeholder="Ex: 123456789012345"
              value={metaPixelId}
              onChange={(e) => setMetaPixelId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:border-[#C9A45C] focus:outline-none"
            />
            <span className="text-[10px] text-white/40 mt-1 block">Ex: 15 dígitos numéricos</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">
              Google Analytics 4 (GA4 ID)
            </label>
            <input
              type="text"
              placeholder="Ex: G-ABC123XYZ"
              value={ga4Id}
              onChange={(e) => setGa4Id(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:border-[#C9A45C] focus:outline-none"
            />
            <span className="text-[10px] text-white/40 mt-1 block">Formato: G-XXXXXXXXXX</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">
              Google Tag Manager (GTM ID)
            </label>
            <input
              type="text"
              placeholder="Ex: GTM-ABCDEF"
              value={gtmId}
              onChange={(e) => setGtmId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:border-[#C9A45C] focus:outline-none"
            />
            <span className="text-[10px] text-white/40 mt-1 block">Formato: GTM-XXXXXX</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            className="btn-primary px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Check className="w-4 h-4" />
            <span>{trackingSaved ? 'Pixels Salvos e Ativados!' : 'Salvar Códigos de Rastreio'}</span>
          </button>

          <button
            type="button"
            onClick={handleSendTestEvent}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer border border-white/15 transition"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>{testEventSent ? 'Evento de Teste Disparado (Lead)!' : 'Testar Disparo de Evento'}</span>
          </button>
        </div>
      </form>

      {/* Urgency & Scarcity Manager */}
      <form onSubmit={handleSaveUrgency} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" /> Gatilhos de Urgência & Escassez (Vagas da Semana)
          </h3>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={urgencyEnabled}
              onChange={(e) => setUrgencyEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-0"
            />
            <span className="text-xs font-bold text-white">Ativar Gatilho de Escassez</span>
          </label>
        </div>

        <p className="text-xs text-white/60">
          Aumente a taxa de conversão mostrando vagas limitadas e contador regressivo ao vivo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Vagas Restantes</label>
            <input
              type="number"
              min="1"
              max="100"
              value={availableSlots}
              onChange={(e) => setAvailableSlots(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Total de Vagas da Semana</label>
            <input
              type="number"
              min="1"
              max="200"
              value={totalSlots}
              onChange={(e) => setTotalSlots(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Duração do Contador (Horas)</label>
            <input
              type="number"
              min="1"
              max="72"
              value={countdownHours}
              onChange={(e) => setCountdownHours(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Texto da Tag / Badge</label>
            <input
              type="text"
              value={highlightBadge}
              onChange={(e) => setHighlightBadge(e.target.value)}
              placeholder="Ex: Vagas da Semana"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Frase de Urgência</label>
            <input
              type="text"
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              placeholder="Ex: Vagas limitadas para entrega em até 24h!"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
            <input
              type="checkbox"
              checked={showInHeader}
              onChange={(e) => setShowInHeader(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500"
            />
            <span>Exibir Banner no Topo (Header)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80">
            <input
              type="checkbox"
              checked={showInPackages}
              onChange={(e) => setShowInPackages(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500"
            />
            <span>Exibir Destaque na Seção de Pacotes</span>
          </label>
        </div>

        <button
          type="submit"
          className="btn-primary px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xl"
        >
          <Check className="w-4 h-4" />
          <span>{urgencySaved ? 'Gatilhos de Urgência Salvos!' : 'Salvar Gatilhos de Urgência'}</span>
        </button>
      </form>

      {/* Admin Credentials */}
      <form onSubmit={handleSaveCredentials} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
          <Key className="w-4 h-4" /> Credenciais de Acesso do Administrador
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">E-mail Administrativo</label>
            <input
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Nova Senha</label>
            <input
              type="password"
              required
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xl"
        >
          <Check className="w-4 h-4" />
          <span>{passSaved ? 'Credenciais Atualizadas!' : 'Salvar Novas Credenciais'}</span>
        </button>
      </form>

      {/* Supabase Integration */}
      <form onSubmit={handleSaveSupabase} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
          <Database className="w-4 h-4" /> Integração com Supabase (PostgreSQL & Storage)
        </h3>

        <div>
          <label className="block text-xs font-semibold text-white/80 mb-1">Supabase Project URL</label>
          <input
            type="text"
            placeholder="https://xyz.supabase.co"
            value={supabaseUrl}
            onChange={(e) => setSupabaseUrl(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-white/80 mb-1">Supabase Anon Key</label>
          <input
            type="password"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
            value={supabaseKey}
            onChange={(e) => setSupabaseKey(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="btn-primary px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xl"
        >
          <Check className="w-4 h-4" />
          <span>{supabaseSaved ? 'Configurações Salvas!' : 'Conectar Supabase'}</span>
        </button>
      </form>

      {/* Clear Operational Data Section */}
      <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 space-y-3">
        <h3 className="text-base font-bold text-rose-300 flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-400" /> Zerar Painel Operacional (Limpeza de Dados de Teste)
        </h3>
        <p className="text-xs text-rose-200/80 leading-relaxed">
          Remove todos os pedidos de teste, cadastros de leads, contadores de cliques nos botões de navegação e histórico de acessos. Ideal para iniciar a operação comercial 100% limpa e com métricas reais.
        </p>

        <button
          onClick={() => {
            if (
              confirm(
                'Tem certeza que deseja ZERAR todos os dados de teste (pedidos, leads e histórico de acessos)?\n\nEssa ação deixará o painel totalmente pronto para produção comercial.'
              )
            ) {
              clearOperationalData();
              alert('Painel zerado com sucesso! Prontinho para uso real.');
            }
          }}
          className="px-5 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition"
        >
          <Trash2 className="w-4 h-4" />
          <span>Zerar Pedidos, Leads e Analytics Agora</span>
        </button>
      </div>

      {/* Backup and Restore */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Backup e Restauração de Dados
        </h3>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleExportJSON}
            className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/15 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Backup do Sistema (JSON)</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Tem certeza que deseja restaurar as configurações originais de fábrica?')) {
                resetToDefaults();
                alert('Dados restaurados com sucesso!');
              }
            }}
            className="px-5 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-xs flex items-center gap-2 border border-red-500/30 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Restaurar Dados Originais de Fábrica</span>
          </button>
        </div>
      </div>
    </div>
  );
};
