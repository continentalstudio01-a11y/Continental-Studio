import React, { useState } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { Testimonial } from '../../types';
import { Plus, Trash2, Edit2, Star, X } from 'lucide-react';

export const TestimonialManager: React.FC = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useBioSite();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);

  const [formName, setFormName] = useState('');
  const [formText, setFormText] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formPhoto, setFormPhoto] = useState('');
  const [formEnabled, setFormEnabled] = useState(true);

  const handleOpenCreate = () => {
    setEditing(null);
    setFormName('');
    setFormText('');
    setFormRating(5);
    setFormPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');
    setFormEnabled(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
    setEditing(item);
    setFormName(item.name);
    setFormText(item.text);
    setFormRating(item.rating);
    setFormPhoto(item.photoUrl);
    setFormEnabled(item.enabled);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateTestimonial(editing.id, {
        name: formName,
        text: formText,
        rating: formRating,
        photoUrl: formPhoto,
        enabled: formEnabled
      });
    } else {
      addTestimonial({
        name: formName,
        text: formText,
        rating: formRating,
        photoUrl: formPhoto,
        enabled: formEnabled,
        sortOrder: testimonials.length + 1
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Gerenciador de Depoimentos</h2>
          <p className="text-xs text-white/60">
            Cadastre depoimentos de clientes satisfeitos para reforçar a prova social do seu BioSite.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Depoimento</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className={`p-5 rounded-3xl border flex flex-col justify-between ${
              t.enabled ? 'bg-white/5 border-white/10' : 'bg-black/40 border-white/5 opacity-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < t.rating ? 'fill-amber-400' : 'text-white/20'}`}
                    />
                  ))}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                    t.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {t.enabled ? 'Ativo' : 'Inativo'}
                </span>
              </div>

              <p className="text-xs text-white/80 italic mb-4">"{t.text}"</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <img src={t.photoUrl} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                <span className="text-xs font-bold text-white">{t.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteTestimonial(t.id)}
                  className="p-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center">
          <form
            onSubmit={handleSave}
            className="w-full max-w-md bg-neutral-900 border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl relative"
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-2">
              {editing ? 'Editar Depoimento' : 'Novo Depoimento'}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">Nome do Cliente</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Carolina Mendes"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">Comentário / Depoimento</label>
              <textarea
                rows={3}
                required
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                placeholder="O que o cliente achou das fotos?"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Avaliação (1 a 5 Estrelas)</label>
                <select
                  value={formRating}
                  onChange={(e) => setFormRating(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-800 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                >
                  <option value={5}>5 Estrelas (⭐⭐⭐⭐⭐)</option>
                  <option value={4}>4 Estrelas (⭐⭐⭐⭐)</option>
                  <option value={3}>3 Estrelas (⭐⭐⭐)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">URL da Foto</label>
                <input
                  type="text"
                  value={formPhoto}
                  onChange={(e) => setFormPhoto(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={formEnabled}
                  onChange={(e) => setFormEnabled(e.target.checked)}
                  className="accent-emerald-400 w-4 h-4"
                />
                Ativo no Site
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold"
              >
                Salvar Depoimento
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
