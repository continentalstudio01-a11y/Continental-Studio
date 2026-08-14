import React, { useState, useRef } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import {
  Key,
  Database,
  RefreshCw,
  Download,
  Upload,
  Check,
  ShieldAlert,
  Trash2,
  Activity,
  Flame,
  Sparkles,
  Send,
  Globe,
  Coins,
  Crown,
  Camera,
  Gem,
  Zap,
  Star,
  ExternalLink,
  Eye
} from 'lucide-react';
import { fireMarketingEvent } from '../../lib/tracking';
import { ImageDropzone } from '../common/ImageDropzone';

// Luxury Favicon Presets (SVG Data URIs formatted for crisp rendering across all browsers)
const FAVICON_PRESETS = [
  {
    id: 'gold_coin_cs',
    name: '🪙 Fivecoin / Moeda de Ouro CS',
    description: 'Moeda de ouro com borda cunhada e monograma VIP Continental',
    dataUrl: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='gold' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23FFE58F'/><stop offset='50%' stop-color='%23C9A45C'/><stop offset='100%' stop-color='%238A6726'/></linearGradient></defs><circle cx='50' cy='50' r='48' fill='url(%23gold)' stroke='%23FFF' stroke-width='1.5'/><circle cx='50' cy='50' r='42' fill='%2308080A' stroke='url(%23gold)' stroke-width='2' stroke-dasharray='2 2'/><circle cx='50' cy='50' r='38' fill='%23111114'/><text x='50' y='63' font-family='serif' font-size='36' font-weight='900' fill='url(%23gold)' text-anchor='middle'>CS</text></svg>`
  },
  {
    id: 'gold_coin_star',
    name: '🪙 Moeda Dourada com Estrela IA',
    description: 'Moeda refinada com estrela central brilhante em ouro polido',
    dataUrl: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='gold2' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23FFF0B3'/><stop offset='50%' stop-color='%23D4AF37'/><stop offset='100%' stop-color='%23997A15'/></linearGradient></defs><circle cx='50' cy='50' r='48' fill='url(%23gold2)'/><circle cx='50' cy='50' r='40' fill='%230A0A0C'/><path d='M50 20 L58 38 L78 40 L63 54 L68 74 L50 63 L32 74 L37 54 L22 40 L42 38 Z' fill='url(%23gold2)'/></svg>`
  },
  {
    id: 'camera_pro_gold',
    name: '📸 Câmera Dourada Pro 4K',
    description: 'Ícone de estúdio de fotografia editorial e alta definição',
    dataUrl: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='camg' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23FFE58F'/><stop offset='100%' stop-color='%23C9A45C'/></linearGradient></defs><rect width='100' height='100' rx='24' fill='%2308080A'/><circle cx='50' cy='50' r='46' fill='none' stroke='url(%23camg)' stroke-width='3'/><path d='M25 40 L35 40 L40 32 L60 32 L65 40 L75 40 A5 5 0 0 1 80 45 L80 70 A5 5 0 0 1 75 75 L25 75 A5 5 0 0 1 20 70 L20 45 A5 5 0 0 1 25 40 Z' fill='none' stroke='url(%23camg)' stroke-width='5' stroke-linejoin='round'/><circle cx='50' cy='57' r='12' fill='none' stroke='url(%23camg)' stroke-width='5'/><circle cx='68' cy='46' r='3' fill='url(%23camg)'/></svg>`
  },
  {
    id: 'crown_vip',
    name: '👑 Coroa Real VIP',
    description: 'Estética de luxo máxima para estúdios de alto escalão',
    dataUrl: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='crowng' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23FFF3BF'/><stop offset='100%' stop-color='%23D4AF37'/></linearGradient></defs><circle cx='50' cy='50' r='48' fill='%2308080A' stroke='url(%23crowng)' stroke-width='4'/><path d='M22 68 L78 68 L74 44 L60 56 L50 32 L40 56 L26 44 Z' fill='url(%23crowng)'/><circle cx='24' cy='42' r='4' fill='url(%23crowng)'/><circle cx='50' cy='30' r='5' fill='url(%23crowng)'/><circle cx='76' cy='42' r='4' fill='url(%23crowng)'/></svg>`
  },
  {
    id: 'diamond_luxury',
    name: '💎 Diamante Dourado',
    description: 'Símbolo de precisão, exclusividade e brilho refinado',
    dataUrl: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='diag' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23FFFFFF'/><stop offset='40%' stop-color='%23FFE58F'/><stop offset='100%' stop-color='%23C9A45C'/></linearGradient></defs><circle cx='50' cy='50' r='48' fill='%2308080A' stroke='url(%23diag)' stroke-width='3'/><path d='M30 35 L70 35 L82 50 L50 78 L18 50 Z' fill='none' stroke='url(%23diag)' stroke-width='4' stroke-linejoin='round'/><path d='M18 50 L82 50' stroke='url(%23diag)' stroke-width='3'/><path d='M30 35 L42 50 L50 78 L58 50 L70 35' fill='none' stroke='url(%23diag)' stroke-width='3'/><path d='M42 50 L58 50' stroke='url(%23diag)' stroke-width='3'/></svg>`
  },
  {
    id: 'neon_lightning',
    name: '⚡ Raio Flash IA',
    description: 'Estética futurista e veloz com tecnologia de Inteligência Artificial',
    dataUrl: `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='lightg' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%23FFE58F'/><stop offset='100%' stop-color='%23C9A45C'/></linearGradient></defs><circle cx='50' cy='50' r='48' fill='%2308080A' stroke='url(%23lightg)' stroke-width='3'/><path d='M54 18 L28 52 L48 52 L44 82 L72 46 L52 46 Z' fill='url(%23lightg)'/></svg>`
  }
];

export const SettingsManager: React.FC = () => {
  const {
    siteSettings,
    updateSiteSettings,
    updateAdminCredentials,
    resetToDefaults,
    clearOperationalData,
    exportAllDataJSON,
    importAllDataJSON,
    trackEvent
  } = useBioSite();

  // Active Sub-Tab
  const [activeSubTab, setActiveSubTab] = useState<'favicon' | 'tracking' | 'urgency' | 'credentials' | 'backup'>('favicon');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Favicon (Fivecoin) & SEO Settings
  const [faviconUrl, setFaviconUrl] = useState(
    siteSettings.seo?.favicon || FAVICON_PRESETS[0].dataUrl
  );
  const [pageTitle, setPageTitle] = useState(
    siteSettings.seo?.pageTitle || `${siteSettings.brandName} | Ensaios Fotográficos com IA`
  );
  const [metaDescription, setMetaDescription] = useState(
    siteSettings.seo?.metaDescription || 'Transforme suas fotos em ensaios profissionais com IA.'
  );
  const [faviconSaved, setFaviconSaved] = useState(false);

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

  // Favicon Saver Handler
  const handleSaveFavicon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSiteSettings({
      seo: {
        ...siteSettings.seo,
        favicon: faviconUrl.trim(),
        pageTitle: pageTitle.trim(),
        metaDescription: metaDescription.trim()
      }
    });
    setFaviconSaved(true);
    setTimeout(() => setFaviconSaved(false), 3000);
  };

  const handleSelectPreset = (presetUrl: string) => {
    setFaviconUrl(presetUrl);
    updateSiteSettings({
      seo: {
        ...siteSettings.seo,
        favicon: presetUrl,
        pageTitle: pageTitle.trim(),
        metaDescription: metaDescription.trim()
      }
    });
    setFaviconSaved(true);
    setTimeout(() => setFaviconSaved(false), 3000);
  };

  const handleCustomFaviconUpload = (base64List: string[]) => {
    if (base64List.length > 0) {
      const newFavicon = base64List[0];
      setFaviconUrl(newFavicon);
      updateSiteSettings({
        seo: {
          ...siteSettings.seo,
          favicon: newFavicon,
          pageTitle: pageTitle.trim(),
          metaDescription: metaDescription.trim()
        }
      });
      setFaviconSaved(true);
      setTimeout(() => setFaviconSaved(false), 3000);
    }
  };

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
    const jsonStr = exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `continental_biosite_backup_completo_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importAllDataJSON(content);
        if (success) {
          setImportStatus('success');
          setTimeout(() => setImportStatus('idle'), 4000);
          alert('Backup restaurado com sucesso! Todas as suas configurações, pacotes e fotos foram recuperados.');
        } else {
          setImportStatus('error');
          setTimeout(() => setImportStatus('idle'), 4000);
          alert('Erro ao ler o arquivo de backup. Certifique-se de que é um arquivo JSON válido exportado pelo sistema.');
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Configurações Gerais & Identidade</h2>
        <p className="text-xs text-white/60">
          Gerencie o Favicon (ícone da aba do navegador), pixels de rastreio, gatilhos de urgência e banco em nuvem.
        </p>
      </div>

      {/* Settings Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
        <button
          onClick={() => setActiveSubTab('favicon')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
            activeSubTab === 'favicon'
              ? 'bg-[#C9A45C] text-black shadow-lg shadow-[#C9A45C]/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>🪙 Favicon / Fivecoin (Aba)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tracking')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
            activeSubTab === 'tracking'
              ? 'bg-[#C9A45C] text-black shadow-lg shadow-[#C9A45C]/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>🎯 Pixels & Anúncios</span>
        </button>

        <button
          onClick={() => setActiveSubTab('urgency')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
            activeSubTab === 'urgency'
              ? 'bg-[#C9A45C] text-black shadow-lg shadow-[#C9A45C]/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>🔥 Gatilhos de Urgência</span>
        </button>

        <button
          onClick={() => setActiveSubTab('credentials')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
            activeSubTab === 'credentials'
              ? 'bg-[#C9A45C] text-black shadow-lg shadow-[#C9A45C]/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>🔑 Senhas & Acesso</span>
        </button>

        <button
          onClick={() => setActiveSubTab('backup')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition whitespace-nowrap cursor-pointer ${
            activeSubTab === 'backup'
              ? 'bg-[#C9A45C] text-black shadow-lg shadow-[#C9A45C]/20'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>💾 Nuvem & Backup</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. FAVICON (FIVECOIN) & BROWSER TAB MANAGER */}
      {/* ========================================================================= */}
      {activeSubTab === 'favicon' && (
        <div className="space-y-6">
          {/* Live Browser Tab Preview */}
          <div className="p-6 rounded-3xl bg-[#111114] border border-[#C9A45C]/35 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C9A45C]" />
                <h3 className="text-sm font-bold text-[#C9A45C] uppercase tracking-wider">
                  Prévia em Tempo Real da Aba do Navegador
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">
                Ao Vivo no Navegador
              </span>
            </div>

            {/* Simulated Browser Chrome Tab */}
            <div className="rounded-2xl bg-[#1A1A1E] p-3 border border-white/10 shadow-inner">
              <div className="flex items-center gap-2 mb-2 px-1">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                <span className="text-[11px] text-white/40 ml-2 font-mono">Google Chrome / Safari</span>
              </div>

              {/* Active Tab Mockup */}
              <div className="max-w-md bg-[#08080A] rounded-t-xl px-4 py-2.5 border-t border-x border-white/15 flex items-center gap-3 shadow-lg">
                {faviconUrl ? (
                  <img
                    src={faviconUrl}
                    alt="Favicon Preview"
                    className="w-5 h-5 rounded-sm object-contain flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FAVICON_PRESETS[0].dataUrl;
                    }}
                  />
                ) : (
                  <div className="w-5 h-5 rounded bg-[#C9A45C] flex items-center justify-center text-[10px] text-black font-bold">
                    CS
                  </div>
                )}
                <span className="text-xs font-semibold text-white truncate max-w-[260px]">
                  {pageTitle || `${siteSettings.brandName} — BioSite AI`}
                </span>
                <span className="text-white/40 text-xs ml-auto hover:text-white cursor-default">×</span>
              </div>

              {/* Address bar mockup */}
              <div className="bg-[#08080A] rounded-b-xl px-4 py-1.5 border-x border-b border-white/15 flex items-center gap-2">
                <span className="text-[10px] text-emerald-400 font-mono">🔒 https://</span>
                <span className="text-[11px] text-white/70 font-mono truncate">
                  {siteSettings.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br
                </span>
              </div>
            </div>
          </div>

          {/* Quick Presets Gallery */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#C9A45C]" /> Escolha um Favicon Pronto (Presets de Alta Resolução)
              </h3>
              <span className="text-[11px] text-white/50">Clique em qualquer um para aplicar</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {FAVICON_PRESETS.map((preset) => {
                const isSelected = faviconUrl === preset.dataUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.dataUrl)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-center gap-3 cursor-pointer group ${
                      isSelected
                        ? 'bg-[#C9A45C]/15 border-[#C9A45C] shadow-lg shadow-[#C9A45C]/20 scale-[1.02]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#08080A] border border-white/15 flex items-center justify-center p-1.5 flex-shrink-0 shadow-md">
                      <img
                        src={preset.dataUrl}
                        alt={preset.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate block">
                          {preset.name}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#C9A45C] animate-pulse" />
                        )}
                      </div>
                      <span className="text-[10px] text-white/50 block line-clamp-1">
                        {preset.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Upload or URL */}
          <form onSubmit={handleSaveFavicon} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#C9A45C]" /> Enviar Ícone / Favicon Personalizado
            </h3>

            <div className="space-y-4">
              <ImageDropzone
                onImagesSelected={handleCustomFaviconUpload}
                currentValue={faviconUrl}
                label="Clique ou arraste o ícone da aba do seu site (Favicon)"
                sublabel="Recomendado: Imagem quadrada (PNG transparente, ICO, SVG ou JPG)"
                aspectRatio="square"
                showUrlInput={true}
              />

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Título da Aba no Navegador (Título SEO)
                </label>
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  placeholder="Ex: Continental Studio | Ensaios Fotográficos com IA"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-[#C9A45C] focus:outline-none"
                />
                <span className="text-[10px] text-white/40 mt-1 block">
                  Este texto aparece no topo da aba do Chrome, Safari, Edge e nas buscas do Google.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">
                  Descrição do Site (Meta Description)
                </label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Transforme suas fotos em ensaios profissionais de estúdio com Inteligência Artificial."
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-[#C9A45C] focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="btn-primary px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>{faviconSaved ? 'Favicon & Título Salvos!' : 'Salvar Favicon & SEO'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MARKETING TRACKING PIXELS */}
      {/* ========================================================================= */}
      {activeSubTab === 'tracking' && (
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
      )}

      {/* ========================================================================= */}
      {/* 3. URGENCY & SCARCITY */}
      {/* ========================================================================= */}
      {activeSubTab === 'urgency' && (
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
      )}

      {/* ========================================================================= */}
      {/* 4. ADMIN CREDENTIALS */}
      {/* ========================================================================= */}
      {activeSubTab === 'credentials' && (
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
      )}

      {/* ========================================================================= */}
      {/* 5. BACKUP, DATABASE & TOOLS */}
      {/* ========================================================================= */}
      {activeSubTab === 'backup' && (
        <div className="space-y-6">
          {/* Cloud Firestore Status */}
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-emerald-300 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" /> Banco de Dados em Nuvem (Firebase Firestore)
              </h3>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Conectado & Ativo
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Seus dados, pacotes, fotos e configurações estão sendo sincronizados continuamente com o banco de dados em nuvem da Google. Qualquer alteração fica salva permanentemente mesmo após reiniciar ou recarregar a página.
            </p>
          </div>

          {/* Supabase Integration (Optional secondary backend) */}
          <form onSubmit={handleSaveSupabase} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Database className="w-4 h-4" /> Integração Opcional com Supabase (PostgreSQL & Storage)
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

          {/* Backup and Restore */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Backup Completo e Restauração de Dados
            </h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Gere um arquivo de segurança com <strong>todas as suas fotos, pacotes, preços, botões, depoimentos e configurações</strong>. Você pode restaurar esse arquivo a qualquer momento em caso de atualização ou troca de dispositivo.
            </p>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExportJSON}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/15 cursor-pointer shadow-md transition"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Baixar Backup Completo (JSON)</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-3 rounded-xl bg-[#C9A45C]/15 hover:bg-[#C9A45C]/25 text-[#C9A45C] hover:text-white font-bold text-xs flex items-center gap-2 border border-[#C9A45C]/35 cursor-pointer shadow-md transition"
              >
                <Upload className="w-4 h-4" />
                <span>Restaurar Backup (Carregar Arquivo)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Tem certeza que deseja restaurar as configurações originais de fábrica?')) {
                    resetToDefaults();
                    alert('Dados restaurados para o padrão com sucesso!');
                  }
                }}
                className="px-5 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs flex items-center gap-2 border border-red-500/20 cursor-pointer ml-auto"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Restaurar Padrão de Fábrica</span>
              </button>
            </div>

            {importStatus === 'success' && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Backup restaurado com sucesso! Todos os dados foram atualizados.</span>
              </div>
            )}
          </div>

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
        </div>
      )}
    </div>
  );
};

