import React, { useState } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { Package } from '../../types';
import { formatBRL } from '../../lib/utils';
import { Plus, Edit2, Trash2, Copy, Star, Check, X, Zap } from 'lucide-react';

export const PackageManager: React.FC = () => {
  const { packages, addPackage, updatePackage, deletePackage, duplicatePackage } = useBioSite();

  const [editingPkg, setEditingPkg] = useState<Package | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formName, setFormName] = useState('');
  const [formPhotos, setFormPhotos] = useState(10);
  const [formPrice, setFormPrice] = useState(97.00);
  const [formDescription, setFormDescription] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formEnabled, setFormEnabled] = useState(true);

  const handleOpenCreate = () => {
    setEditingPkg(null);
    setFormName('');
    setFormPhotos(10);
    setFormPrice(97.00);
    setFormDescription('');
    setFormBadge('');
    setFormFeatured(false);
    setFormEnabled(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: Package) => {
    setEditingPkg(pkg);
    setFormName(pkg.name);
    setFormPhotos(pkg.photos);
    setFormPrice(pkg.price);
    setFormDescription(pkg.description);
    setFormBadge(pkg.badge || '');
    setFormFeatured(pkg.featured);
    setFormEnabled(pkg.enabled);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPkg) {
      updatePackage(editingPkg.id, {
        name: formName,
        photos: formPhotos,
        price: formPrice,
        description: formDescription,
        badge: formBadge || undefined,
        featured: formFeatured,
        enabled: formEnabled
      });
    } else {
      addPackage({
        name: formName,
        photos: formPhotos,
        price: formPrice,
        currency: 'BRL',
        description: formDescription,
        badge: formBadge || undefined,
        featured: formFeatured,
        enabled: formEnabled,
        sortOrder: packages.length + 1
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Gerenciador de Pacotes</h2>
          <p className="text-xs text-white/60">
            Crie, edite preços, quantidades de fotos e destaques comerciais sem alterar o código.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="btn-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-xl"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Pacote</span>
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`p-6 rounded-3xl border transition flex flex-col justify-between ${
              pkg.featured
                ? 'bg-amber-500/10 border-amber-500'
                : pkg.enabled
                ? 'bg-white/5 border-white/10'
                : 'bg-black/40 border-white/5 opacity-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                {pkg.badge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase">
                    {pkg.badge}
                  </span>
                )}
              </div>

              <div className="text-2xl font-black text-amber-400 mb-2">
                {formatBRL(pkg.price)}
              </div>

              <p className="text-xs text-white/60 mb-4 min-h-[36px]">{pkg.description}</p>

              <div className="text-xs text-white/80 font-semibold mb-6 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{pkg.photos} {pkg.photos === 1 ? 'Foto' : 'Fotos'} em Ultra HD</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
              <span
                className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                  pkg.enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}
              >
                {pkg.enabled ? 'Ativo' : 'Inativo'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => duplicatePackage(pkg.id)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80"
                  title="Duplicar"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenEdit(pkg)}
                  className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400"
                  title="Editar"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deletePackage(pkg.id)}
                  className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Edit/Create */}
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
              {editingPkg ? 'Editar Pacote' : 'Novo Pacote'}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">Nome do Pacote</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Ex: Mais Vendido"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Quantidade de Fotos</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formPhotos}
                  onChange={(e) => setFormPhotos(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">Descrição Comercial</label>
              <textarea
                rows={2}
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Descrição curta do pacote..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">Selo Especial (opcional)</label>
              <input
                type="text"
                placeholder="Ex: MAIS VENDIDO, OFERTA VIP"
                value={formBadge}
                onChange={(e) => setFormBadge(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="accent-amber-400 w-4 h-4"
                />
                Destaque Especial
              </label>

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
                Salvar Pacote
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
