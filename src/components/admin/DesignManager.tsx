import React, { useState } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { visualStylesList, colorPalettesList } from '../../data/defaultData';
import { Palette, Sparkles, Check, Pipette } from 'lucide-react';

export const DesignManager: React.FC = () => {
  const { designSettings, updateDesignSettings } = useBioSite();
  const [current, setCurrent] = useState(designSettings);

  const handleStyleSelect = (styleId: any) => {
    const updated = { ...current, currentStyleId: styleId };
    setCurrent(updated);
    updateDesignSettings(updated);
  };

  const handlePaletteSelect = (paletteId: any) => {
    const updated = { ...current, currentPaletteId: paletteId };
    setCurrent(updated);
    updateDesignSettings(updated);
  };

  const handleCustomColorChange = (key: string, val: string) => {
    const updated = {
      ...current,
      currentPaletteId: 'custom' as const,
      customColors: {
        ...current.customColors,
        [key]: val
      }
    };
    setCurrent(updated);
    updateDesignSettings(updated);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Design System & Temas Visual</h2>
        <p className="text-xs text-white/60">
          Personalize a estética do BioSite em tempo real com paletas de luxo, estilos e cores personalizadas.
        </p>
      </div>

      {/* Visual Styles */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Estilo Visual Principal
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visualStylesList.map((style) => {
            const isSelected = current.currentStyleId === style.id;
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

      {/* Color Palettes */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
          <Palette className="w-4 h-4" /> Paletas de Cores de Luxo
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {colorPalettesList.map((palette) => {
            const isSelected = current.currentPaletteId === palette.id;
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

                {/* Color swatches */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: palette.primary }} title="Primária" />
                  <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: palette.secondary }} title="Secundária" />
                  <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: palette.background }} title="Fundo" />
                  <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: palette.text }} title="Texto" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
          <Pipette className="w-4 h-4" /> Cores Personalizadas (Avançado)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Cor Primária</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={current.customColors.primary}
                onChange={(e) => handleCustomColorChange('primary', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none"
              />
              <span className="text-xs font-mono text-white/70">{current.customColors.primary}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Cor Secundária</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={current.customColors.secondary}
                onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none"
              />
              <span className="text-xs font-mono text-white/70">{current.customColors.secondary}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Fundo (BG)</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={current.customColors.background}
                onChange={(e) => handleCustomColorChange('background', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none"
              />
              <span className="text-xs font-mono text-white/70">{current.customColors.background}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Texto</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={current.customColors.text}
                onChange={(e) => handleCustomColorChange('text', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none"
              />
              <span className="text-xs font-mono text-white/70">{current.customColors.text}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Acento</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={current.customColors.accent}
                onChange={(e) => handleCustomColorChange('accent', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none"
              />
              <span className="text-xs font-mono text-white/70">{current.customColors.accent}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
