import React, { useState } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { BeforeAfterItem } from '../../types';
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown,
  X,
  Check,
  RotateCcw,
  Copy,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { ImageDropzone } from '../common/ImageDropzone';
import { motion, AnimatePresence } from 'motion/react';

export const BeforeAfterManager: React.FC = () => {
  const {
    beforeAfterItems,
    addBeforeAfterItem,
    updateBeforeAfterItem,
    deleteBeforeAfterItem,
    reorderBeforeAfterItems,
    saveAllData
  } = useBioSite();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BeforeAfterItem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState('Profissional');
  const [formClientName, setFormClientName] = useState('');
  const [formBeforeUrl, setFormBeforeUrl] = useState('');
  const [formAfterUrl, setFormAfterUrl] = useState('');
  const [formBeforeLabel, setFormBeforeLabel] = useState('Foto Original (Selfie)');
  const [formAfterLabel, setFormAfterLabel] = useState('Transformação IA 4K');
  const [formEnabled, setFormEnabled] = useState(true);

  // Preview Slider inside Modal
  const [modalSliderPos, setModalSliderPos] = useState<number>(50);

  const categories = [
    'Profissional',
    'Aniversário',
    'Gestante',
    'Masculino',
    'Feminino',
    'Casal',
    'Infantil',
    'Outros'
  ];

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormCategory('Profissional');
    setFormClientName('');
    setFormBeforeUrl('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1000');
    setFormAfterUrl('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000');
    setFormBeforeLabel('Foto Original (Selfie)');
    setFormAfterLabel('Transformação IA 4K');
    setFormEnabled(true);
    setModalSliderPos(50);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: BeforeAfterItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormSubtitle(item.subtitle || '');
    setFormCategory(item.category || 'Profissional');
    setFormClientName(item.clientName || '');
    setFormBeforeUrl(item.beforeImageUrl);
    setFormAfterUrl(item.afterImageUrl);
    setFormBeforeLabel(item.beforeLabel || 'Foto Original (Selfie)');
    setFormAfterLabel(item.afterLabel || 'Transformação IA 4K');
    setFormEnabled(item.enabled);
    setModalSliderPos(50);
    setIsModalOpen(true);
  };

  const handleDuplicate = (item: BeforeAfterItem) => {
    addBeforeAfterItem({
      title: `${item.title} (Cópia)`,
      subtitle: item.subtitle,
      category: item.category,
      clientName: item.clientName,
      beforeImageUrl: item.beforeImageUrl,
      afterImageUrl: item.afterImageUrl,
      beforeLabel: item.beforeLabel,
      afterLabel: item.afterLabel,
      enabled: true,
      sortOrder: beforeAfterItems.length + 1
    });
    saveAllData();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBeforeUrl || !formAfterUrl) {
      alert('Por favor, adicione tanto a foto de "Antes" quanto a de "Depois".');
      return;
    }

    if (editingItem) {
      updateBeforeAfterItem(editingItem.id, {
        title: formTitle || 'Transformação IA',
        subtitle: formSubtitle,
        category: formCategory,
        clientName: formClientName,
        beforeImageUrl: formBeforeUrl,
        afterImageUrl: formAfterUrl,
        beforeLabel: formBeforeLabel || 'Antes',
        afterLabel: formAfterLabel || 'Depois',
        enabled: formEnabled
      });
    } else {
      addBeforeAfterItem({
        title: formTitle || 'Transformação IA',
        subtitle: formSubtitle,
        category: formCategory,
        clientName: formClientName,
        beforeImageUrl: formBeforeUrl,
        afterImageUrl: formAfterUrl,
        beforeLabel: formBeforeLabel || 'Antes',
        afterLabel: formAfterLabel || 'Depois',
        enabled: formEnabled,
        sortOrder: beforeAfterItems.length + 1
      });
    }

    saveAllData();
    setIsModalOpen(false);
  };

  const moveOrder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= beforeAfterItems.length) return;

    const updated = [...beforeAfterItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // update sortOrder
    const finalItems = updated.map((item, idx) => ({ ...item, sortOrder: idx + 1 }));
    reorderBeforeAfterItems(finalItems);
    saveAllData();
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Comparador Interativo</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Editor de Antes & Depois</h2>
          <p className="text-xs text-white/60">
            Adicione fotos reais de clientes comparando a foto original do celular com o ensaio final gerado pela IA.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-xl self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Antes & Depois</span>
        </button>
      </div>

      {/* List of Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {beforeAfterItems.map((item, index) => (
          <div
            key={item.id}
            className={`relative rounded-2xl border p-5 transition backdrop-blur-xl ${
              item.enabled
                ? 'bg-[#111114]/90 border-white/15 shadow-xl'
                : 'bg-black/40 border-white/5 opacity-60'
            }`}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {item.category || 'Ensaio'}
                </span>
                {item.clientName && (
                  <span className="text-xs text-white/50 truncate max-w-[140px]">
                    👤 {item.clientName}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {/* Reorder Buttons */}
                <button
                  onClick={() => moveOrder(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 disabled:opacity-20 transition cursor-pointer"
                  title="Mover para cima"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveOrder(index, 'down')}
                  disabled={index === beforeAfterItems.length - 1}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 disabled:opacity-20 transition cursor-pointer"
                  title="Mover para baixo"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Toggle Enabled */}
                <button
                  onClick={() => {
                    updateBeforeAfterItem(item.id, { enabled: !item.enabled });
                    saveAllData();
                  }}
                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                    item.enabled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 text-white/40'
                  }`}
                  title={item.enabled ? 'Visível no site' : 'Oculto'}
                >
                  {item.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h3 className="text-base font-bold text-white mb-1 truncate">{item.title}</h3>
            {item.subtitle && (
              <p className="text-xs text-white/60 mb-3 line-clamp-2">{item.subtitle}</p>
            )}

            {/* Dual Mini Visual Preview */}
            <div className="grid grid-cols-2 gap-2 mb-4 rounded-xl overflow-hidden bg-black/50 p-2 border border-white/10">
              <div className="relative rounded-lg overflow-hidden aspect-[4/5] bg-black">
                <img
                  src={item.beforeImageUrl}
                  alt="Antes"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white/90 text-center truncate">
                  {item.beforeLabel || 'Antes'}
                </div>
              </div>
              <div className="relative rounded-lg overflow-hidden aspect-[4/5] bg-black">
                <img
                  src={item.afterImageUrl}
                  alt="Depois"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-0.5 rounded bg-amber-500/90 text-black text-[10px] font-black text-center truncate">
                  {item.afterLabel || 'Depois 4K'}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-[11px] text-white/40 font-mono">Ordem #{index + 1}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDuplicate(item)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition cursor-pointer"
                  title="Duplicar comparação"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition cursor-pointer"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Tem certeza que deseja excluir "${item.title}"?`)) {
                      deleteBeforeAfterItem(item.id);
                      saveAllData();
                    }
                  }}
                  className="p-2 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition cursor-pointer"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {beforeAfterItems.length === 0 && (
        <div className="text-center py-16 bg-white/5 rounded-3xl border border-dashed border-white/15 p-8">
          <SlidersHorizontal className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Nenhum Antes & Depois Cadastrado</h3>
          <p className="text-xs text-white/60 mb-6 max-w-md mx-auto">
            Crie sua primeira comparação de transformação para encantar seus clientes no BioSite com o comparador interativo!
          </p>
          <button
            onClick={handleOpenCreate}
            className="btn-primary px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Primeiro Antes & Depois</span>
          </button>
        </div>
      )}

      {/* Modal for Create/Edit with Live Comparison Slider Preview */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-900 border border-white/15 rounded-3xl p-6 sm:p-8 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {editingItem ? 'Editar Antes & Depois' : 'Novo Antes & Depois'}
                  </h3>
                  <p className="text-xs text-white/50">
                    Defina as fotos e textos da transformação visual.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">
                      Título do Ensaio *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Executivo & Liderança"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">
                      Categoria do Ensaio
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c} className="bg-neutral-900 text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">
                      Nome do Cliente (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Dra. Mariana Costa"
                      value={formClientName}
                      onChange={(e) => setFormClientName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">
                      Legenda / Descrição
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: De selfie básica para foto digna de revista."
                      value={formSubtitle}
                      onChange={(e) => setFormSubtitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Photos Upload Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-black/30 p-4 rounded-2xl border border-white/10">
                  {/* Before Photo */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-sky-400 uppercase tracking-wide">
                      📸 1. Foto do ANTES (Original / Celular)
                    </label>
                    <input
                      type="text"
                      placeholder="Tag: Selfie Original"
                      value={formBeforeLabel}
                      onChange={(e) => setFormBeforeLabel(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs mb-2"
                    />
                    <ImageDropzone
                      label="Arraste a foto do ANTES"
                      sublabel="Selfie comum enviada pelo cliente"
                      currentValue={formBeforeUrl}
                      onImagesSelected={(base64List) => {
                        if (base64List[0]) setFormBeforeUrl(base64List[0]);
                      }}
                      aspectRatio="cover"
                      className="h-44"
                    />
                  </div>

                  {/* After Photo */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-amber-400 uppercase tracking-wide">
                      ✨ 2. Foto do DEPOIS (Ensaio IA 4K)
                    </label>
                    <input
                      type="text"
                      placeholder="Tag: Transformação IA 4K"
                      value={formAfterLabel}
                      onChange={(e) => setFormAfterLabel(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-xs mb-2"
                    />
                    <ImageDropzone
                      label="Arraste a foto do DEPOIS"
                      sublabel="Resultado final do ensaio em Ultra HD"
                      currentValue={formAfterUrl}
                      onImagesSelected={(base64List) => {
                        if (base64List[0]) setFormAfterUrl(base64List[0]);
                      }}
                      aspectRatio="cover"
                      className="h-44"
                    />
                  </div>
                </div>

                {/* Live Preview Slider */}
                {formBeforeUrl && formAfterUrl && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white/80 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Pré-visualização do Slider Interativo (Teste arrastando):
                      </span>
                      <span className="text-[11px] text-white/50">{modalSliderPos}%</span>
                    </div>

                    <div
                      className="relative w-full h-64 rounded-2xl overflow-hidden border border-white/20 select-none cursor-ew-resize touch-none bg-black"
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        setModalSliderPos(Math.max(0, Math.min(100, Math.round((x / rect.width) * 100))));
                      }}
                      onTouchMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.touches[0].clientX - rect.left;
                        setModalSliderPos(Math.max(0, Math.min(100, Math.round((x / rect.width) * 100))));
                      }}
                    >
                      {/* After */}
                      <img
                        src={formAfterUrl}
                        alt="Depois"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase">
                        {formAfterLabel || 'DEPOIS'}
                      </div>

                      {/* Before */}
                      <div
                        className="absolute inset-y-0 left-0 overflow-hidden"
                        style={{ width: `${modalSliderPos}%` }}
                      >
                        <img
                          src={formBeforeUrl}
                          alt="Antes"
                          className="absolute inset-y-0 left-0 w-[600px] max-w-none h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/80 border border-white/20 text-white text-[10px] font-bold uppercase">
                          {formBeforeLabel || 'ANTES'}
                        </div>
                      </div>

                      {/* Slider Line */}
                      <div
                        className="absolute inset-y-0 w-1 bg-white shadow-2xl z-10 flex items-center justify-center pointer-events-none"
                        style={{ left: `${modalSliderPos}%` }}
                      >
                        <div className="w-7 h-7 rounded-full bg-white text-black shadow-lg flex items-center justify-center font-bold text-xs border-2 border-amber-500">
                          ↔
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Switch */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="modal-enabled"
                    checked={formEnabled}
                    onChange={(e) => setFormEnabled(e.target.checked)}
                    className="w-5 h-5 rounded bg-black border-white/20 text-amber-500 focus:ring-amber-400"
                  />
                  <label htmlFor="modal-enabled" className="text-sm text-white font-medium cursor-pointer">
                    Exibir esta comparação ativa no BioSite público
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm font-semibold transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary px-7 py-2.5 rounded-xl text-sm font-bold shadow-xl cursor-pointer"
                  >
                    {editingItem ? 'Salvar Alterações' : 'Adicionar Antes & Depois'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
