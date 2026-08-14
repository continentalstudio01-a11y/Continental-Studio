import React, { useState } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { FAQItem } from '../../types';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

export const FaqManager: React.FC = () => {
  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useBioSite();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<FAQItem | null>(null);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [enabled, setEnabled] = useState(true);

  const handleOpenCreate = () => {
    setEditing(null);
    setQuestion('');
    setAnswer('');
    setEnabled(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: FAQItem) => {
    setEditing(item);
    setQuestion(item.question);
    setAnswer(item.answer);
    setEnabled(item.enabled);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateFAQ(editing.id, { question, answer, enabled });
    } else {
      addFAQ({ question, answer, enabled, sortOrder: faqs.length + 1 });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Gerenciador de FAQ (Dúvidas)</h2>
          <p className="text-xs text-white/60">
            Adicione ou edite as respostas para as perguntas mais comuns dos clientes.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Pergunta</span>
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className={`p-5 rounded-3xl border flex items-start justify-between gap-4 ${
              faq.enabled ? 'bg-white/5 border-white/10' : 'bg-black/40 border-white/5 opacity-50'
            }`}
          >
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-amber-300">{faq.question}</h4>
              <p className="text-xs text-white/70 leading-relaxed">{faq.answer}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleOpenEdit(faq)}
                className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteFAQ(faq.id)}
                className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
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
              {editing ? 'Editar Pergunta' : 'Nova Pergunta (FAQ)'}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">Pergunta</label>
              <input
                type="text"
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ex: Como funciona a entrega?"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">Resposta Detalhada</label>
              <textarea
                rows={4}
                required
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Explicação simples e objetiva..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="accent-emerald-400 w-4 h-4"
                />
                Exibir na FAQ do site
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
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
