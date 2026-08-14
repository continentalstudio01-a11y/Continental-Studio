import React, { useState, useEffect, useRef } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { visualStylesList, colorPalettesList, defaultDesignSettings } from '../../data/defaultData';
import {
  Palette,
  Sparkles,
  Check,
  Pipette,
  Save,
  RotateCcw,
  Type,
  Layers,
  Activity,
  Image as ImageIcon,
  Code,
  Eye,
  Sliders,
  Moon,
  Sun,
  Upload,
  RefreshCw,
  Database,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { DesignSettings, VisualStyleId, ColorPaletteId } from '../../types';
import { applyThemeCSSVariables } from '../../utils/theme';

const FONT_BODY_OPTIONS = [
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (Padrão Moderno)' },
  { id: 'Inter', name: 'Inter (Clean & Técnico)' },
  { id: 'Outfit', name: 'Outfit (Geométrico Premium)' },
  { id: 'Montserrat', name: 'Montserrat (Elegante & Corp)' },
  { id: 'Poppins', name: 'Poppins (Amigável & Redondo)' },
  { id: 'Manrope', name: 'Manrope (Minimalista Moderno)' }
];

const FONT_HEADING_OPTIONS = [
  { id: 'Playfair Display', name: 'Playfair Display (Editorial Luxo)' },
  { id: 'Cormorant Garamond', name: 'Cormorant Garamond (Alta Costura)' },
  { id: 'Cinzel', name: 'Cinzel (Imperial & Clássico)' },
  { id: 'Syne', name: 'Syne (Vanguardista & IA)' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (Clean Bold)' },
  { id: 'Inter', name: 'Inter (Direto & Preciso)' }
];

const BUTTON_RADIUS_OPTIONS = [
  { id: '0px', label: 'Reto (0px)' },
  { id: '8px', label: 'Suave (8px)' },
  { id: '12px', label: 'Padrão (12px)' },
  { id: '16px', label: 'Arredondado (16px)' },
  { id: '9999px', label: 'Pílula (Total)' }
];

const CARD_RADIUS_OPTIONS = [
  { id: '0px', label: 'Reto (0px)' },
  { id: '8px', label: 'Discreto (8px)' },
  { id: '16px', label: 'Padrão (16px)' },
  { id: '24px', label: 'Amplo (24px)' }
];

export const DesignManager: React.FC = () => {
  const {
    designSettings,
    updateDesignSettings,
    siteSettings,
    updateSiteSettings,
    saveAllData,
    isCloudSaving,
    diagnosticInfo,
    forceSyncData,
    isSyncing
  } = useBioSite();

  const [currentDesign, setCurrentDesign] = useState<DesignSettings>(designSettings);
  const [logoUrl, setLogoUrl] = useState(siteSettings.logoUrl || '');
  const [faviconUrl, setFaviconUrl] = useState(siteSettings.seo?.favicon || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'palette' | 'typography' | 'ui' | 'branding' | 'custom_css' | 'diagnostic'>('palette');

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentDesign(designSettings);
  }, [designSettings]);

  useEffect(() => {
    setLogoUrl(siteSettings.logoUrl || '');
    setFaviconUrl(siteSettings.seo?.favicon || '');
  }, [siteSettings.logoUrl, siteSettings.seo?.favicon]);

  // Update in real-time and apply live preview
  const handleUpdate = (updated: DesignSettings) => {
    setCurrentDesign(updated);
    updateDesignSettings(updated);
    applyThemeCSSVariables(updated);
  };

  const handleStyleSelect = (styleId: VisualStyleId) => {
    handleUpdate({
      ...currentDesign,
      currentStyleId: styleId
    });
  };

  const handlePaletteSelect = (paletteId: ColorPaletteId) => {
    const palette = colorPalettesList.find((p) => p.id === paletteId);
    if (!palette) return;

    handleUpdate({
      ...currentDesign,
      currentPaletteId: paletteId,
      customColors: {
        primary: palette.primary,
        secondary: palette.secondary,
        background: palette.background,
        surface: palette.surface || palette.secondary,
        text: palette.text,
        mutedText: palette.mutedText || '#9CA3AF',
        accent: palette.accent
      }
    });
  };

  const handleCustomColorChange = (key: keyof DesignSettings['customColors'], val: string) => {
    handleUpdate({
      ...currentDesign,
      currentPaletteId: 'custom',
      customColors: {
        ...currentDesign.customColors,
        [key]: val
      }
    });
  };

  const handleTypographyChange = (key: 'fontFamily' | 'headingFont', val: string) => {
    handleUpdate({
      ...currentDesign,
      typography: {
        fontFamily: currentDesign.typography?.fontFamily || 'Plus Jakarta Sans',
        headingFont: currentDesign.typography?.headingFont || 'Playfair Display',
        [key]: val
      }
    });
  };

  const handleUIPreferenceChange = (key: keyof NonNullable<DesignSettings['uiPreferences']>, val: any) => {
    handleUpdate({
      ...currentDesign,
      uiPreferences: {
        buttonRadius: currentDesign.uiPreferences?.buttonRadius || '12px',
        cardRadius: currentDesign.uiPreferences?.cardRadius || '16px',
        buttonStyle: currentDesign.uiPreferences?.buttonStyle || 'rounded',
        darkMode: currentDesign.uiPreferences?.darkMode ?? true,
        animationsEnabled: currentDesign.uiPreferences?.animationsEnabled ?? true,
        glassEffect: currentDesign.uiPreferences?.glassEffect ?? false,
        customCss: currentDesign.uiPreferences?.customCss || '',
        [key]: val
      }
    });
  };

  const handleRestoreDefaults = () => {
    if (window.confirm('Deseja restaurar o tema padrão (Obsidian Gold & Playfair Display)?')) {
      handleUpdate(defaultDesignSettings);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setLogoUrl(result);
        updateSiteSettings({ logoUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setFaviconUrl(result);
        updateSiteSettings({
          seo: {
            ...siteSettings.seo,
            favicon: result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = async () => {
    const ok = await saveAllData({
      designSettings: currentDesign,
      siteSettings: {
        ...siteSettings,
        logoUrl: logoUrl.trim(),
        seo: {
          ...siteSettings.seo,
          favicon: faviconUrl.trim()
        }
      }
    });

    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  const handleForceSync = async () => {
    const ok = await forceSyncData();
    if (ok) {
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header with Save / Reset actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <Palette className="w-6 h-6 text-amber-400" />
              Aparência & Design System Global
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Database First
            </span>
          </div>
          <p className="text-xs text-white/60 mt-1">
            Configure as cores, fontes, arredondamentos e estilo. Todas as alterações são salvas permanentemente no banco e aplicadas globalmente em todos os navegadores e dispositivos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRestoreDefaults}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5 cursor-pointer"
            title="Restaurar configurações padrão"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar Padrão
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isCloudSaving}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition duration-200 cursor-pointer shadow-xl ${
              saveSuccess
                ? 'bg-emerald-500 text-black'
                : 'btn-primary'
            }`}
          >
            {isCloudSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4 text-black stroke-[3]" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saveSuccess ? 'Alterações Salvas no Banco!' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        <button
          onClick={() => setActiveSubTab('palette')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'palette'
              ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Palette className="w-4 h-4" /> Cores & Paletas
        </button>

        <button
          onClick={() => setActiveSubTab('typography')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'typography'
              ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Type className="w-4 h-4" /> Tipografia & Fontes
        </button>

        <button
          onClick={() => setActiveSubTab('ui')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'ui'
              ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-4 h-4" /> Botões, Cards & Efeitos
        </button>

        <button
          onClick={() => setActiveSubTab('branding')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'branding'
              ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Logo & Favicon
        </button>

        <button
          onClick={() => setActiveSubTab('custom_css')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'custom_css'
              ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Code className="w-4 h-4" /> CSS Personalizado
        </button>

        <button
          onClick={() => setActiveSubTab('diagnostic')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'diagnostic'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Database className="w-4 h-4" /> Diagnóstico & Banco
        </button>
      </div>

      {/* Live Preview Bar */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-[var(--color-primary)] text-black font-black text-xs shadow-md">
            CS
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Prévia em Tempo Real (CSS Variables Ativas)</span>
            <span className="text-[11px] text-white/50">
              Primária: <span className="font-mono text-amber-300">{currentDesign.customColors?.primary}</span> • Fundo:{' '}
              <span className="font-mono text-white/70">{currentDesign.customColors?.background}</span> • Fonte:{' '}
              <span className="text-white/70">{currentDesign.typography?.fontFamily || 'Plus Jakarta Sans'}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="px-4 py-2 rounded-lg text-xs font-bold transition shadow-md"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#08080A',
              borderRadius: currentDesign.uiPreferences?.buttonRadius || '12px'
            }}
          >
            Botão Exemplo
          </div>
          <div
            className="px-4 py-2 rounded-lg text-xs font-medium border border-white/20 transition"
            style={{
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              borderRadius: currentDesign.uiPreferences?.cardRadius || '16px'
            }}
          >
            Card Exemplo
          </div>
        </div>
      </div>

      {/* TAB 1: CORES & PALETAS */}
      {activeSubTab === 'palette' && (
        <div className="space-y-6">
          {/* Visual Archetype */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Arquétipo & Estilo Visual
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visualStylesList.map((style) => {
                const isSelected = currentDesign.currentStyleId === style.id;
                return (
                  <div
                    key={style.id}
                    onClick={() => handleStyleSelect(style.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-xl'
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-white/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm">{style.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">{style.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preset Palettes */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Palette className="w-4 h-4" /> Paletas Pré-Configuradas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {colorPalettesList.map((palette) => {
                const isSelected = currentDesign.currentPaletteId === palette.id;
                return (
                  <div
                    key={palette.id}
                    onClick={() => handlePaletteSelect(palette.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-xl'
                        : 'bg-white/5 border-white/10 hover:border-white/20 text-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-sm">{palette.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: palette.primary }} title="Primária" />
                      <div className="w-6 h-6 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: palette.secondary }} title="Secundária" />
                      <div className="w-6 h-6 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: palette.background }} title="Fundo" />
                      <div className="w-6 h-6 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: palette.text }} title="Texto" />
                      <div className="w-6 h-6 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: palette.accent }} title="Destaque" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Color Fine-Tuning */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-5">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Pipette className="w-4 h-4" /> Ajuste Fino de Cores (CSS Tokens Globais)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-white/80 mb-1.5">Cor Primária</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentDesign.customColors?.primary || '#C9A45C'}
                    onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                    className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border border-white/20"
                  />
                  <span className="text-xs font-mono text-white/70">{currentDesign.customColors?.primary}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/80 mb-1.5">Secundária</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentDesign.customColors?.secondary || '#111114'}
                    onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                    className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border border-white/20"
                  />
                  <span className="text-xs font-mono text-white/70">{currentDesign.customColors?.secondary}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/80 mb-1.5">Fundo (BG)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentDesign.customColors?.background || '#08080A'}
                    onChange={(e) => handleCustomColorChange('background', e.target.value)}
                    className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border border-white/20"
                  />
                  <span className="text-xs font-mono text-white/70">{currentDesign.customColors?.background}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/80 mb-1.5">Cards / Surface</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentDesign.customColors?.surface || '#121216'}
                    onChange={(e) => handleCustomColorChange('surface', e.target.value)}
                    className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border border-white/20"
                  />
                  <span className="text-xs font-mono text-white/70">{currentDesign.customColors?.surface || '#121216'}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/80 mb-1.5">Texto Principal</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentDesign.customColors?.text || '#F5F2EA'}
                    onChange={(e) => handleCustomColorChange('text', e.target.value)}
                    className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border border-white/20"
                  />
                  <span className="text-xs font-mono text-white/70">{currentDesign.customColors?.text}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/80 mb-1.5">Texto Secundário</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentDesign.customColors?.mutedText || '#9CA3AF'}
                    onChange={(e) => handleCustomColorChange('mutedText', e.target.value)}
                    className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border border-white/20"
                  />
                  <span className="text-xs font-mono text-white/70">{currentDesign.customColors?.mutedText || '#9CA3AF'}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/80 mb-1.5">Destaque (Accent)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentDesign.customColors?.accent || '#E0BB70'}
                    onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                    className="w-9 h-9 rounded-xl cursor-pointer bg-transparent border border-white/20"
                  />
                  <span className="text-xs font-mono text-white/70">{currentDesign.customColors?.accent}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TIPOGRAFIA & FONTES */}
      {activeSubTab === 'typography' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Type className="w-4 h-4" /> Fontes & Tipografia
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Heading Font */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white">Fonte dos Títulos & Headings</label>
                <select
                  value={currentDesign.typography?.headingFont || 'Playfair Display'}
                  onChange={(e) => handleTypographyChange('headingFont', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none"
                >
                  {FONT_HEADING_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id} className="bg-neutral-900 text-white">
                      {f.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-white/50">
                  Aplicado em títulos de seções, cabeçalhos do Hero e cartões destacados.
                </p>
              </div>

              {/* Body Font */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white">Fonte dos Textos & Parágrafos</label>
                <select
                  value={currentDesign.typography?.fontFamily || 'Plus Jakarta Sans'}
                  onChange={(e) => handleTypographyChange('fontFamily', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-semibold focus:border-amber-400 focus:outline-none"
                >
                  {FONT_BODY_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id} className="bg-neutral-900 text-white">
                      {f.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-white/50">
                  Aplicado no corpo do texto, botões de ação, listas e formulários.
                </p>
              </div>
            </div>

            {/* Typography Sample Preview */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">Exemplo Visual da Combinação</span>
              <h4
                className="text-2xl font-bold text-white"
                style={{ fontFamily: `'${currentDesign.typography?.headingFont || 'Playfair Display'}', serif` }}
              >
                Continental Studio — Ensaios Fotográficos com IA
              </h4>
              <p
                className="text-xs text-white/70 leading-relaxed"
                style={{ fontFamily: `'${currentDesign.typography?.fontFamily || 'Plus Jakarta Sans'}', sans-serif` }}
              >
                Transforme fotos do seu dia a dia em produções editoriais de alto padrão em menos de 24 horas, com fidelidade visual impressionante.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BOTÕES, CARDS & EFEITOS */}
      {activeSubTab === 'ui' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Sliders className="w-4 h-4" /> Formas & Arredondamentos
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Button Radius */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white">Arredondamento dos Botões</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {BUTTON_RADIUS_OPTIONS.map((opt) => {
                    const isSelected = (currentDesign.uiPreferences?.buttonRadius || '12px') === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleUIPreferenceChange('buttonRadius', opt.id)}
                        className={`px-3 py-2 text-xs font-semibold transition border ${
                          isSelected
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-md'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                        style={{ borderRadius: opt.id }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Radius */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white">Arredondamento dos Cards</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CARD_RADIUS_OPTIONS.map((opt) => {
                    const isSelected = (currentDesign.uiPreferences?.cardRadius || '16px') === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleUIPreferenceChange('cardRadius', opt.id)}
                        className={`px-3 py-2 text-xs font-semibold transition border ${
                          isSelected
                            ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-md'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                        style={{ borderRadius: opt.id }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" /> Modos & Comportamentos Visuais
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Dark Mode */}
                <div
                  onClick={() => handleUIPreferenceChange('darkMode', !(currentDesign.uiPreferences?.darkMode ?? true))}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:border-white/20 transition"
                >
                  <div className="flex items-center gap-3">
                    {currentDesign.uiPreferences?.darkMode ?? true ? (
                      <Moon className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Sun className="w-5 h-5 text-yellow-400" />
                    )}
                    <div>
                      <span className="text-xs font-bold text-white block">Tema Escuro</span>
                      <span className="text-[11px] text-white/50">Ativa paleta obsidian de alta fidelidade</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentDesign.uiPreferences?.darkMode ?? true}
                    onChange={() => {}}
                    className="w-4 h-4 accent-amber-400"
                  />
                </div>

                {/* Glass Effect */}
                <div
                  onClick={() => handleUIPreferenceChange('glassEffect', !(currentDesign.uiPreferences?.glassEffect ?? false))}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:border-white/20 transition"
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Efeito Glass</span>
                      <span className="text-[11px] text-white/50">Vidro fosco e translucidez premium</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentDesign.uiPreferences?.glassEffect ?? false}
                    onChange={() => {}}
                    className="w-4 h-4 accent-amber-400"
                  />
                </div>

                {/* Animations */}
                <div
                  onClick={() => handleUIPreferenceChange('animationsEnabled', !(currentDesign.uiPreferences?.animationsEnabled ?? true))}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between cursor-pointer hover:border-white/20 transition"
                >
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="text-xs font-bold text-white block">Animações & Transições</span>
                      <span className="text-[11px] text-white/50">Efeitos de entrada e brilho</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentDesign.uiPreferences?.animationsEnabled ?? true}
                    onChange={() => {}}
                    className="w-4 h-4 accent-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BRANDING (LOGO & FAVICON) */}
      {activeSubTab === 'branding' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Identidade Visual: Logo & Favicon
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Logo URL & Upload */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white">Logomarca Oficial</label>
                  <span className="text-[10px] text-white/50 font-mono">PNG / SVG / WebP</span>
                </div>

                <div className="flex items-center gap-4">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Logo Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-white/20 bg-black/60 p-1"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-white/40 text-xs">
                      Sem Logo
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => {
                        setLogoUrl(e.target.value);
                        updateSiteSettings({ logoUrl: e.target.value });
                      }}
                      placeholder="https://exemplo.com/logo.png"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />

                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <Upload className="w-3 h-3" /> Fazer Upload do Computador
                    </button>
                  </div>
                </div>
              </div>

              {/* Favicon URL & Upload */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white">Favicon da Aba do Navegador</label>
                  <span className="text-[10px] text-white/50 font-mono">ICO / PNG (32x32)</span>
                </div>

                <div className="flex items-center gap-4">
                  {faviconUrl ? (
                    <img
                      src={faviconUrl}
                      alt="Favicon Preview"
                      className="w-12 h-12 rounded-xl object-contain border border-white/20 bg-black/60 p-1.5"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl border border-dashed border-white/20 flex items-center justify-center text-white/40 text-xs">
                      ICO
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={faviconUrl}
                      onChange={(e) => {
                        setFaviconUrl(e.target.value);
                        updateSiteSettings({
                          seo: {
                            ...siteSettings.seo,
                            favicon: e.target.value
                          }
                        });
                      }}
                      placeholder="https://exemplo.com/favicon.ico"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:border-amber-400 focus:outline-none"
                    />

                    <input
                      ref={faviconInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFaviconUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => faviconInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <Upload className="w-3 h-3" /> Fazer Upload do Favicon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CSS PERSONALIZADO */}
      {activeSubTab === 'custom_css' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <Code className="w-4 h-4" /> CSS Personalizado (Custom Stylesheet)
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Sanitizado contra injeções
              </span>
            </div>

            <p className="text-xs text-white/60">
              Insira regras CSS personalizadas que serão injetadas dinamicamente no cabeçalho do BioSite. Ideal para ajustes finos de espaçamento, efeitos de animação e sobreposições.
            </p>

            <textarea
              rows={8}
              value={currentDesign.uiPreferences?.customCss || ''}
              onChange={(e) => handleUIPreferenceChange('customCss', e.target.value)}
              placeholder={`/* Exemplo de custom CSS */\n.btn-primary {\n  letter-spacing: 0.15em;\n}\n.custom-glass {\n  backdrop-filter: blur(20px);\n}`}
              className="w-full p-4 rounded-2xl bg-black/60 border border-white/15 font-mono text-xs text-amber-200 focus:border-amber-400 focus:outline-none leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* TAB 6: DIAGNÓSTICO & PERSISTÊNCIA GLOBAL */}
      {activeSubTab === 'diagnostic' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                  <Database className="w-5 h-5" /> Auditoria & Diagnóstico de Persistência Cloud
                </h3>
                <p className="text-xs text-white/60 mt-1">
                  Monitoramento em tempo real do Google Cloud Firestore e das variáveis CSS ativas no navegador.
                </p>
              </div>

              <button
                type="button"
                onClick={handleForceSync}
                disabled={isSyncing}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-2 cursor-pointer transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sincronizando...' : syncSuccess ? 'Sincronizado com Sucesso!' : 'Forçar Sincronização Agora'}
              </button>
            </div>

            {/* Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Fonte de Dados Ativa</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="text-sm font-bold text-white">
                    {diagnosticInfo.dataSource === 'firestore' ? 'Firestore Database' : diagnosticInfo.dataSource === 'server_api' ? 'Server API' : 'Cache Local / Fallback'}
                  </span>
                </div>
                <span className="text-[10px] text-white/40 block">Prioridade máxima ao carregar</span>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Status do Firestore</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-emerald-400 uppercase">{diagnosticInfo.firestoreStatus}</span>
                </div>
                <span className="text-[10px] text-white/40 block">Doc: biosite_data/main_settings</span>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Última Sincronização</span>
                <div className="text-sm font-mono text-amber-300">{diagnosticInfo.lastSyncTimestamp}</div>
                <span className="text-[10px] text-white/40 block">Recebido via Firestore snapshot</span>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Paleta Aplicada</span>
                <div className="text-sm font-bold text-white capitalize">{diagnosticInfo.appliedPaletteId}</div>
                <span className="text-[10px] text-white/40 block">Injetada nas variáveis CSS globais</span>
              </div>
            </div>

            {/* Active CSS Variables Inspector */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Variáveis CSS Injetadas no Documento (:root)
                </span>
                <span className="text-[10px] font-mono text-white/50">document.documentElement.style</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] text-white/40 block">--color-primary</span>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded border border-white/20" style={{ backgroundColor: diagnosticInfo.appliedCSSVariables.primary }}></span>
                    <span className="text-white font-bold">{diagnosticInfo.appliedCSSVariables.primary}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] text-white/40 block">--color-bg</span>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded border border-white/20" style={{ backgroundColor: diagnosticInfo.appliedCSSVariables.background }}></span>
                    <span className="text-white font-bold">{diagnosticInfo.appliedCSSVariables.background}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] text-white/40 block">--color-surface</span>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded border border-white/20" style={{ backgroundColor: diagnosticInfo.appliedCSSVariables.surface }}></span>
                    <span className="text-white font-bold">{diagnosticInfo.appliedCSSVariables.surface}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] text-white/40 block">--button-radius</span>
                  <span className="text-white font-bold block">{diagnosticInfo.appliedCSSVariables.buttonRadius}</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Event Log */}
            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Log de Eventos de Persistência (Últimos Eventos)
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  console.table(window.__CONTINENTAL_DIAGNOSTICS__())
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono text-[11px] pr-2">
                {diagnosticInfo.events.map((evt, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-white/40 shrink-0">{evt.time}</span>
                    <span className="text-amber-300 font-bold shrink-0">[{evt.event}]</span>
                    <span className="text-white/70 truncate">
                      {typeof evt.details === 'object' ? JSON.stringify(evt.details) : evt.details || 'Concluído'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
