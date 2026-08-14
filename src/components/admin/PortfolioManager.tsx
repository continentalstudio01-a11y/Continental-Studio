import React, { useState } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { PortfolioItem } from '../../types';
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Images,
  X,
  Upload,
  Sparkles,
  Star,
  ArrowLeft,
  ArrowRight,
  Copy,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { ImageDropzone } from '../common/ImageDropzone';
import { motion, AnimatePresence } from 'motion/react';

export const PortfolioManager: React.FC = () => {
  const { portfolio, addPortfolioItem, updatePortfolioItem, deletePortfolioItem, saveAllData } = useBioSite();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Profissional');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formGallery, setFormGallery] = useState<string[]>([]);
  const [formBeforeUrl, setFormBeforeUrl] = useState('');
  const [formAfterUrl, setFormAfterUrl] = useState('');
  const [formEnabled, setFormEnabled] = useState(true);

  // Quick single URL adder inside gallery
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [batchIsDragging, setBatchIsDragging] = useState(false);

  const categories = [
    'Profissional',
    'Aniversário',
    'Gestante',
    'Casal',
    'Feminino',
    'Masculino',
    'Família',
    'Infantil',
    'Outros'
  ];

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('Profissional');
    setFormDescription('');
    setFormImageUrl('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800');
    setFormGallery([
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=1200'
    ]);
    setFormBeforeUrl('');
    setFormAfterUrl('');
    setFormEnabled(true);
    setCustomPhotoUrl('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormDescription(item.description || '');
    setFormImageUrl(item.imageUrl);
    // Ensure gallery has at least the main image or existing photos
    const currentGallery = item.gallery && item.gallery.length > 0 ? item.gallery : [item.imageUrl];
    setFormGallery(currentGallery);
    setFormBeforeUrl(item.beforeImageUrl || '');
    setFormAfterUrl(item.afterImageUrl || '');
    setFormEnabled(item.enabled);
    setCustomPhotoUrl('');
    setIsModalOpen(true);
  };

  const handleDuplicate = (item: PortfolioItem) => {
    addPortfolioItem({
      title: `${item.title} (Cópia)`,
      category: item.category,
      description: item.description,
      imageUrl: item.imageUrl,
      gallery: item.gallery ? [...item.gallery] : [item.imageUrl],
      beforeImageUrl: item.beforeImageUrl,
      afterImageUrl: item.afterImageUrl,
      enabled: true,
      sortOrder: portfolio.length + 1
    });
    saveAllData();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formImageUrl) {
      alert('Por favor, adicione uma foto principal de capa.');
      return;
    }

    // make sure gallery contains at least the main image
    let finalGallery = formGallery.filter(Boolean);
    if (finalGallery.length === 0) {
      finalGallery = [formImageUrl];
    } else if (!finalGallery.includes(formImageUrl)) {
      finalGallery = [formImageUrl, ...finalGallery];
    }

    if (editingItem) {
      updatePortfolioItem(editingItem.id, {
        title: formTitle || 'Ensaio Fotográfico IA',
        category: formCategory,
        description: formDescription,
        imageUrl: formImageUrl,
        gallery: finalGallery,
        beforeImageUrl: formBeforeUrl || undefined,
        afterImageUrl: formAfterUrl || undefined,
        enabled: formEnabled
      });
    } else {
      addPortfolioItem({
        title: formTitle || 'Novo Ensaio Fotográfico IA',
        category: formCategory,
        description: formDescription,
        imageUrl: formImageUrl,
        gallery: finalGallery,
        beforeImageUrl: formBeforeUrl || undefined,
        afterImageUrl: formAfterUrl || undefined,
        enabled: formEnabled,
        sortOrder: portfolio.length + 1
      });
    }
    saveAllData();
    setIsModalOpen(false);
  };

  // Gallery Helpers
  const handleAddPhotosToGallery = (newUrls: string[]) => {
    setFormGallery((prev) => [...prev, ...newUrls]);
    if (!formImageUrl && newUrls.length > 0) {
      setFormImageUrl(newUrls[0]);
    }
  };

  const handleRemovePhotoFromGallery = (index: number) => {
    const photoToRemove = formGallery[index];
    const updated = formGallery.filter((_, idx) => idx !== index);
    setFormGallery(updated);

    // If removed photo was the main cover, set the first remaining photo as cover
    if (photoToRemove === formImageUrl && updated.length > 0) {
      setFormImageUrl(updated[0]);
    }
  };

  const handleSetCoverPhoto = (photoUrl: string) => {
    setFormImageUrl(photoUrl);
  };

  const handleMoveGalleryPhoto = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formGallery.length) return;

    const updated = [...formGallery];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFormGallery(updated);
  };

  const handleAddCustomPhotoUrl = () => {
    if (!customPhotoUrl.trim()) return;
    setFormGallery((prev) => [...prev, customPhotoUrl.trim()]);
    if (!formImageUrl) {
      setFormImageUrl(customPhotoUrl.trim());
    }
    setCustomPhotoUrl('');
  };

  // Batch Drag and Drop on whole page to create new styles
  const handleBatchDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setBatchIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files: File[] = Array.from(e.dataTransfer.files).filter((file: File) =>
        file.type.startsWith('image/')
      ) as File[];

      if (files.length === 0) return;

      const filePromises = files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              resolve(event.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises).then((results) => {
        const validResults = results.filter(Boolean);
        if (validResults.length === 0) return;

        // Create a new style with these photos in its gallery
        addPortfolioItem({
          title: `Ensaio ${formCategory} (${validResults.length} Fotos)`,
          category: formCategory,
          description: `Ensaio completo com ${validResults.length} variações e looks em alta resolução.`,
          imageUrl: validResults[0],
          gallery: validResults,
          enabled: true,
          sortOrder: portfolio.length + 1
        });
        saveAllData();
      });
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-2">
            <Images className="w-3.5 h-3.5" />
            <span>Múltiplas Fotos por Ensaio</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Gerenciador de Portfólio & Ensaios</h2>
          <p className="text-xs text-white/60">
            Cadastre estilos de ensaio com <strong>múltiplas fotos</strong> para que seus clientes possam navegar por toda a galeria de cada estilo no BioSite!
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-xl self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Ensaio / Estilo</span>
        </button>
      </div>

      {/* Batch Drag Drop Banner */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setBatchIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setBatchIsDragging(false);
        }}
        onDrop={handleBatchDrop}
        className={`p-6 rounded-3xl border-2 border-dashed text-center transition-all cursor-pointer ${
          batchIsDragging
            ? 'border-amber-400 bg-amber-500/20 scale-[1.01]'
            : 'border-white/15 bg-white/5 hover:border-amber-400/50'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto mb-2">
          <Upload className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white">Arraste Múltiplas Fotos para Criar um Novo Ensaio</h4>
        <p className="text-xs text-white/50 mt-1 max-w-lg mx-auto">
          Selecione 3, 5 ou 10+ fotos do seu computador e solte aqui para criar automaticamente um novo estilo com todas as fotos agrupadas na galeria!
        </p>
      </div>

      {/* Portfolio Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolio.map((item, index) => {
          const photoCount = item.gallery && item.gallery.length > 0 ? item.gallery.length : 1;
          const displayGallery = item.gallery && item.gallery.length > 0 ? item.gallery : [item.imageUrl];

          return (
            <div
              key={item.id}
              className={`rounded-3xl border overflow-hidden transition flex flex-col justify-between backdrop-blur-xl ${
                item.enabled
                  ? 'bg-[#111114]/90 border-white/15 shadow-xl hover:border-amber-400/40'
                  : 'bg-black/40 border-white/5 opacity-50'
              }`}
            >
              {/* Cover Image & Badges */}
              <div className="relative aspect-[4/3] bg-black group overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 text-amber-300 text-[10px] font-bold border border-white/15 backdrop-blur-md">
                  {item.category}
                </div>

                {/* Photo Count Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-purple-500/90 text-white text-[11px] font-bold border border-white/20 shadow-lg flex items-center gap-1">
                  <Images className="w-3 h-3" />
                  <span>{photoCount} {photoCount === 1 ? 'Foto' : 'Fotos'}</span>
                </div>

                {/* Mini Gallery Strip on bottom */}
                {displayGallery.length > 1 && (
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 overflow-x-auto p-1 bg-black/70 backdrop-blur-md rounded-xl border border-white/10 no-scrollbar">
                    {displayGallery.slice(0, 5).map((imgUrl, i) => (
                      <div
                        key={i}
                        className={`w-7 h-7 rounded-lg overflow-hidden shrink-0 border ${
                          imgUrl === item.imageUrl ? 'border-amber-400 ring-1 ring-amber-400' : 'border-white/20'
                        }`}
                      >
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {displayGallery.length > 5 && (
                      <span className="text-[10px] text-white/70 font-bold px-1 whitespace-nowrap">
                        +{displayGallery.length - 5}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-bold text-sm text-white mb-1">{item.title}</h4>
                  {item.description && (
                    <p className="text-xs text-white/60 line-clamp-2">{item.description}</p>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                  <button
                    onClick={() => {
                      updatePortfolioItem(item.id, { enabled: !item.enabled });
                      saveAllData();
                    }}
                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase flex items-center gap-1 cursor-pointer transition ${
                      item.enabled
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {item.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{item.enabled ? 'Ativo' : 'Oculto'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDuplicate(item)}
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 transition cursor-pointer"
                      title="Duplicar Ensaio"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 cursor-pointer"
                      title="Gerenciar Fotos & Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Tem certeza que deseja excluir "${item.title}"?`)) {
                          deletePortfolioItem(item.id);
                          saveAllData();
                        }
                      }}
                      className="p-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 cursor-pointer"
                      title="Excluir Ensaio"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Edit/Create with Multi-Photo Gallery Manager */}
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
              className="w-full max-w-2xl bg-neutral-900 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {editingItem ? 'Editar Ensaio & Galeria de Fotos' : 'Novo Ensaio / Estilo de Fotos'}
                  </h3>
                  <p className="text-xs text-white/50">
                    Adicione quantas fotos desejar para este estilo de ensaio.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-6">
                {/* Title & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">
                      Título do Ensaio *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Ex: Ensaio Corporativo Executivo"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1.5">
                      Categoria
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

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Descrição do Estilo (Exibida para o cliente ao ampliar)
                  </label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Ex: Looks elegantes com blazer, iluminação cinematográfica de estúdio e poses imponentes."
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Multi-Photo Gallery Section */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/15 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Images className="w-4 h-4 text-purple-400" />
                        <span>Fotos do Ensaio ({formGallery.length} {formGallery.length === 1 ? 'Foto' : 'Fotos'})</span>
                      </h4>
                      <p className="text-[11px] text-white/50">
                        O cliente poderá deslizar por todas essas fotos no carrossel do ensaio.
                      </p>
                    </div>

                    <span className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 self-start sm:self-auto">
                      ⭐ Clique na estrela para definir a Capa
                    </span>
                  </div>

                  {/* Dropzone for Multi Photos */}
                  <ImageDropzone
                    multiple={true}
                    maxFiles={20}
                    onImagesSelected={(imgs) => handleAddPhotosToGallery(imgs)}
                    label="Clique ou arraste várias fotos aqui para adicionar à galeria"
                    sublabel="Formatos: JPG, PNG, WEBP (Selecione várias de uma vez)"
                    className="h-32"
                  />

                  {/* URL Input Helper */}
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Ou cole o link direto de uma imagem (URL)..."
                      value={customPhotoUrl}
                      onChange={(e) => setCustomPhotoUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/15 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomPhotoUrl}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
                    >
                      + Adicionar Link
                    </button>
                  </div>

                  {/* Gallery Thumbnails Strip */}
                  {formGallery.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <label className="block text-[11px] font-bold text-white/70 uppercase">
                        Fotos atuais na galeria deste ensaio:
                      </label>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {formGallery.map((imgUrl, idx) => {
                          const isCover = imgUrl === formImageUrl;

                          return (
                            <div
                              key={idx}
                              className={`relative rounded-xl overflow-hidden aspect-[3/4] border transition bg-black group ${
                                isCover
                                  ? 'border-amber-400 ring-2 ring-amber-400/50'
                                  : 'border-white/15 hover:border-white/40'
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Foto ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />

                              {/* Cover Indicator */}
                              {isCover && (
                                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase shadow-md flex items-center gap-1">
                                  <Star className="w-2.5 h-2.5 fill-black" />
                                  <span>Capa</span>
                                </div>
                              )}

                              {/* Hover Action Overlay */}
                              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-between p-2">
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-[10px] text-white/60 font-mono">#{idx + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePhotoFromGallery(idx)}
                                    className="p-1 rounded bg-rose-500/80 hover:bg-rose-500 text-white transition"
                                    title="Remover da galeria"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                <div className="flex items-center gap-1 w-full justify-center">
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => handleMoveGalleryPhoto(idx, 'left')}
                                    className="p-1 rounded bg-white/20 hover:bg-white/40 text-white disabled:opacity-20 transition"
                                    title="Mover para a esquerda"
                                  >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={idx === formGallery.length - 1}
                                    onClick={() => handleMoveGalleryPhoto(idx, 'right')}
                                    className="p-1 rounded bg-white/20 hover:bg-white/40 text-white disabled:opacity-20 transition"
                                    title="Mover para a direita"
                                  >
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {!isCover ? (
                                  <button
                                    type="button"
                                    onClick={() => handleSetCoverPhoto(imgUrl)}
                                    className="w-full py-1 rounded bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold transition flex items-center justify-center gap-1 shadow"
                                  >
                                    <Star className="w-3 h-3" />
                                    <span>Tornar Capa</span>
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-amber-400 font-bold">Foto de Capa</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Visibility Switch */}
                <div className="pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formEnabled}
                      onChange={(e) => setFormEnabled(e.target.checked)}
                      className="accent-emerald-400 w-4 h-4"
                    />
                    Exibir este ensaio publicamente no BioSite
                  </label>
                </div>

                {/* Modal Buttons */}
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
                    className="btn-primary px-7 py-2.5 rounded-xl text-xs font-bold cursor-pointer shadow-xl"
                  >
                    {editingItem ? 'Salvar Ensaio & Galeria' : 'Criar Ensaio'}
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
