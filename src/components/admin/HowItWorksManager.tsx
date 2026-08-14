import React, { useState } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { HowItWorksStep, StepMotionEffect } from '../../types';
import { motion } from 'motion/react';
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Package,
  Upload,
  Cpu,
  Download,
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
  Palette,
  Eye,
  Check
} from 'lucide-react';

export const HowItWorksManager: React.FC = () => {
  const {
    siteSettings,
    updateSiteSettings,
    howItWorksSteps,
    updateHowItWorksStep,
    addHowItWorksStep,
    deleteHowItWorksStep,
    reorderHowItWorksSteps,
    saveAllData
  } = useBioSite();

  const [headerTitle, setHeaderTitle] = useState(
    siteSettings.howItWorksTitle || 'Como Funciona em 4 Passos'
  );
  const [headerSubtitle, setHeaderSubtitle] = useState(
    siteSettings.howItWorksSubtitle || 'Um processo simples, rápido e 100% online sem sair de casa.'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const availableIcons = [
    { name: 'Package', label: 'Pacote' },
    { name: 'Upload', label: 'Upload / Envio' },
    { name: 'Cpu', label: 'Processador / IA' },
    { name: 'Download', label: 'Download / Baixar' },
    { name: 'Sparkles', label: 'Brilho IA' },
    { name: 'Camera', label: 'Câmera' },
    { name: 'Zap', label: 'Raio / Rápido' },
    { name: 'CheckCircle2', label: 'Check / Sucesso' },
    { name: 'MessageCircle', label: 'WhatsApp' },
    { name: 'Star', label: 'Estrela' },
    { name: 'Gift', label: 'Presente' },
    { name: 'Image', label: 'Imagem / Foto' },
    { name: 'Wand2', label: 'Varinha / Mágica' },
    { name: 'ShieldCheck', label: 'Escudo / Seguro' },
    { name: 'Clock', label: 'Relógio / Tempo' },
    { name: 'Smartphone', label: 'Celular' },
    { name: 'Send', label: 'Enviar' },
    { name: 'Layers', label: 'Camadas' },
    { name: 'Heart', label: 'Coração' },
    { name: 'Palette', label: 'Paleta / Estilo' }
  ];

  const motionOptions: { id: StepMotionEffect; label: string; desc: string }[] = [
    { id: 'bounce', label: '⬆️ Pulo Suave', desc: 'Sobe e desce suavemente' },
    { id: 'float', label: '🌊 Flutuação 3D', desc: 'Movimento contínuo e orgânico' },
    { id: 'pulse', label: '💓 Pulso', desc: 'Aumenta e diminui o tamanho' },
    { id: 'spin', label: '🔄 Giro Lento', desc: 'Gira 360 graus continuamente' },
    { id: 'wiggle', label: '🔔 Balanço', desc: 'Balança pros lados chamando atenção' },
    { id: 'glow', label: '✨ Aura Brilhante', desc: 'Opacidade e brilho oscilante' }
  ];

  const colorOptions = [
    { id: 'amber', label: 'Dourado / Âmbar', textClass: 'text-amber-400', bgClass: 'bg-amber-500/20' },
    { id: 'sky', label: 'Azul / Sky', textClass: 'text-sky-400', bgClass: 'bg-sky-500/20' },
    { id: 'purple', label: 'Roxo / Violeta', textClass: 'text-purple-400', bgClass: 'bg-purple-500/20' },
    { id: 'emerald', label: 'Verde / Esmeralda', textClass: 'text-emerald-400', bgClass: 'bg-emerald-500/20' },
    { id: 'rose', label: 'Rosé / Rosa', textClass: 'text-rose-400', bgClass: 'bg-rose-500/20' }
  ];

  const renderLucideIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Package': return <Package className={className} />;
      case 'Upload': return <Upload className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Download': return <Download className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Camera': return <Camera className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'CheckCircle2': return <CheckCircle2 className={className} />;
      case 'MessageCircle': return <MessageCircle className={className} />;
      case 'Star': return <Star className={className} />;
      case 'Gift': return <Gift className={className} />;
      case 'Image': return <ImageIcon className={className} />;
      case 'Wand2': return <Wand2 className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Clock': return <Clock className={className} />;
      case 'Smartphone': return <Smartphone className={className} />;
      case 'Send': return <Send className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Heart': return <Heart className={className} />;
      case 'Palette': return <Palette className={className} />;
      default: return <Package className={className} />;
    }
  };

  const getMotionAnimation = (effect?: StepMotionEffect) => {
    switch (effect) {
      case 'bounce':
        return { animate: { y: [0, -6, 0] }, transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' } };
      case 'float':
        return { animate: { y: [0, -8, 0], x: [0, 2, 0] }, transition: { repeat: Infinity, duration: 3, ease: 'easeInOut' } };
      case 'pulse':
        return { animate: { scale: [1, 1.15, 1] }, transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' } };
      case 'spin':
        return { animate: { rotate: 360 }, transition: { repeat: Infinity, duration: 8, ease: 'linear' } };
      case 'wiggle':
        return { animate: { rotate: [-8, 8, -8] }, transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } };
      case 'glow':
        return { animate: { opacity: [0.6, 1, 0.6], scale: [1, 1.08, 1] }, transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' } };
      default:
        return { animate: { y: [0, -5, 0] }, transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } };
    }
  };

  const handleSaveAll = () => {
    updateSiteSettings({
      howItWorksTitle: headerTitle,
      howItWorksSubtitle: headerSubtitle
    });
    saveAllData();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...howItWorksSteps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;

    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;

    // Recalculate sort orders
    newSteps.forEach((s, idx) => {
      s.sortOrder = idx + 1;
    });

    reorderHowItWorksSteps(newSteps);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" /> Editor da Seção "Como Funciona em Passos"
          </h2>
          <p className="text-xs text-white/60">
            Personalize os títulos, ícones em Motion, cores e descrições do processo de 4 passos exibidos no BioSite.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="btn-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-xl self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? 'Salvo com Sucesso!' : 'Salvar Alterações'}</span>
        </button>
      </div>

      {/* Header Settings Card */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-amber-400">Título e Subtítulo do Bloco</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">
              Título da Seção
            </label>
            <input
              type="text"
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
              placeholder="Ex: Como Funciona em 4 Passos"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">
              Subtítulo Explicativo
            </label>
            <input
              type="text"
              value={headerSubtitle}
              onChange={(e) => setHeaderSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
              placeholder="Ex: Um processo simples, rápido e 100% online sem sair de casa."
            />
          </div>
        </div>
      </div>

      {/* Steps Editor List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Passos do Processo ({howItWorksSteps.length})
          </h3>

          <button
            onClick={addHowItWorksStep}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Passo</span>
          </button>
        </div>

        <div className="space-y-4">
          {howItWorksSteps.map((step, idx) => {
            const motionAnim = getMotionAnimation(step.motionEffect);

            return (
              <div
                key={step.id}
                className={`p-6 rounded-3xl border transition space-y-4 ${
                  step.enabled
                    ? 'bg-white/5 border-white/15'
                    : 'bg-white/2 border-white/5 opacity-60'
                }`}
              >
                {/* Step Top Bar Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-black text-sm flex items-center justify-center border border-amber-500/30">
                      {step.number || `0${idx + 1}`}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">{step.title}</h4>
                      <span className="text-[10px] text-white/40">Passo #{idx + 1}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Reorder Buttons */}
                    <button
                      onClick={() => moveStep(idx, 'up')}
                      disabled={idx === 0}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-20 cursor-pointer transition"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveStep(idx, 'down')}
                      disabled={idx === howItWorksSteps.length - 1}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-20 cursor-pointer transition"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {/* Enable Toggle */}
                    <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer ml-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                      <input
                        type="checkbox"
                        checked={step.enabled}
                        onChange={(e) =>
                          updateHowItWorksStep(step.id, { enabled: e.target.checked })
                        }
                        className="accent-amber-400"
                      />
                      <span>{step.enabled ? 'Ativo' : 'Oculto'}</span>
                    </label>

                    {/* Delete Step */}
                    <button
                      onClick={() => {
                        if (confirm('Deseja excluir este passo do processo?')) {
                          deleteHowItWorksStep(step.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition cursor-pointer ml-2"
                      title="Excluir Passo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Step Fields Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Number & Title */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Número do Passo (ex: 01, BÔNUS)
                    </label>
                    <input
                      type="text"
                      value={step.number}
                      onChange={(e) =>
                        updateHowItWorksStep(step.id, { number: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Título do Passo
                    </label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) =>
                        updateHowItWorksStep(step.id, { title: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none font-bold"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Descrição Detalhada do Passo
                  </label>
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) =>
                      updateHowItWorksStep(step.id, { description: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs leading-relaxed focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Icon Selection, Motion Effect & Color Theme */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {/* Icon Chooser */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Ícone do Passo
                    </label>
                    <select
                      value={step.icon}
                      onChange={(e) =>
                        updateHowItWorksStep(step.id, { icon: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none cursor-pointer"
                    >
                      {availableIcons.map((ic) => (
                        <option key={ic.name} value={ic.name} className="bg-black text-white">
                          {ic.label} ({ic.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Motion Effect Chooser */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Animação Motion do Ícone
                    </label>
                    <select
                      value={step.motionEffect || 'bounce'}
                      onChange={(e) =>
                        updateHowItWorksStep(step.id, {
                          motionEffect: e.target.value as StepMotionEffect
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none cursor-pointer font-medium"
                    >
                      {motionOptions.map((m) => (
                        <option key={m.id} value={m.id} className="bg-black text-white">
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Icon Color Theme */}
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Cor do Ícone
                    </label>
                    <select
                      value={step.iconColor || 'amber'}
                      onChange={(e) =>
                        updateHowItWorksStep(step.id, {
                          iconColor: e.target.value as any
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none cursor-pointer font-medium"
                    >
                      {colorOptions.map((c) => (
                        <option key={c.id} value={c.id} className="bg-black text-white">
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Live Step Mini Preview Box */}
                <div className="mt-3 p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                    <motion.div {...motionAnim}>
                      {renderLucideIcon(step.icon, 'w-6 h-6 text-amber-400')}
                    </motion.div>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-400 font-mono font-bold block uppercase tracking-wider">
                      Preview da Animação Motion em Tempo Real
                    </span>
                    <span className="text-xs text-white/80 font-bold block mt-0.5">
                      {step.title}
                    </span>
                    <span className="text-[11px] text-white/50 block line-clamp-1">
                      {step.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
