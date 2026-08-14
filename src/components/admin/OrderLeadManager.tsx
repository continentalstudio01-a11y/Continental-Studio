import React, { useState } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { Order, OrderStatus } from '../../types';
import { formatBRL, formatDateBR, buildWhatsappUrl } from '../../lib/utils';
import { ShoppingBag, Users, MessageSquare, MessageCircle, Eye, Trash2, X, Download, FileText, CheckCircle } from 'lucide-react';

export const OrderLeadManager: React.FC = () => {
  const { siteSettings, orders, leads, updateOrderStatus, updateOrderTrackingDetails, deleteOrder, deleteLead } = useBioSite();
  const [activeTab, setActiveTab] = useState<'orders' | 'leads'>('orders');

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editEstimatedDelivery, setEditEstimatedDelivery] = useState('');
  const [editStatusMessage, setEditStatusMessage] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const statusList: { id: OrderStatus; label: string; color: string }[] = [
    { id: 'novo', label: '1. Novo Pedido', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { id: 'contatado', label: '2. Contatado', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { id: 'aguardando_pagamento', label: '2. Aguardando Pagamento', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { id: 'pago', label: '3. Pago', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { id: 'em_producao', label: '3. Em Produção IA Ultra HD', color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    { id: 'aguardando_entrega', label: '4. Edição 4K / Aguardando Entrega', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
    { id: 'entregue', label: '5. Pronto & Entregue', color: 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50' },
    { id: 'cancelado', label: 'Cancelado', color: 'bg-red-500/20 text-red-400 border-red-500/30' }
  ];

  const handleOpenOrderDetails = (ord: Order) => {
    setSelectedOrder(ord);
    setEditNotes(ord.adminNotes || '');
    setEditEstimatedDelivery(ord.estimatedDelivery || 'Em até 24h');
    setEditStatusMessage(ord.statusMessage || '');
  };

  const handleUpdateStatus = (status: OrderStatus) => {
    if (!selectedOrder) return;
    updateOrderStatus(selectedOrder.id, status, editNotes);
    if (updateOrderTrackingDetails) {
      updateOrderTrackingDetails(selectedOrder.id, editEstimatedDelivery, editStatusMessage);
    }
    setSelectedOrder({
      ...selectedOrder,
      status,
      adminNotes: editNotes,
      estimatedDelivery: editEstimatedDelivery,
      statusMessage: editStatusMessage
    });
  };

  const handleSaveAllTrackingDetails = () => {
    if (!selectedOrder) return;
    if (updateOrderTrackingDetails) {
      updateOrderTrackingDetails(selectedOrder.id, editEstimatedDelivery, editStatusMessage);
    }
    updateOrderStatus(selectedOrder.id, selectedOrder.status, editNotes);
    setSelectedOrder({
      ...selectedOrder,
      estimatedDelivery: editEstimatedDelivery,
      statusMessage: editStatusMessage,
      adminNotes: editNotes
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSendTrackingLinkToCustomer = () => {
    if (!selectedOrder) return;
    const phone = selectedOrder.customerWhatsapp;
    const text = `✨ *CONTINENTAL STUDIO - ATUALIZAÇÃO DO SEU ENSAIO*\n\nOlá ${selectedOrder.customerName}! Seu ensaio #${selectedOrder.id} está no status: *${selectedOrder.status.toUpperCase()}*.\n\nPrevisão de entrega: ${editEstimatedDelivery || 'Em até 24h'}.\n${editStatusMessage ? `Recado da equipe: "${editStatusMessage}"\n` : ''}\nVocê pode acompanhar seu pedido digitando ${selectedOrder.customerWhatsapp} na aba "Acompanhar Pedido" no nosso BioSite!`;
    window.open(buildWhatsappUrl(phone, text), '_blank');
  };

  const handleOpenWhatsappCustomer = (phone: string, name: string) => {
    const text = `Olá ${name}! Aqui é da Continental Studio referente ao seu pedido no BioSite. Como posso te ajudar hoje?`;
    window.open(buildWhatsappUrl(phone, text), '_blank');
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Gerenciador de Pedidos e Leads</h2>
          <p className="text-xs text-white/60">
            Gerencie o pipeline de produção dos ensaios de IA, fotos recebidas e contatos.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'orders' ? 'btn-primary' : 'text-white/60 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Pedidos ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'leads' ? 'btn-primary' : 'text-white/60 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Leads ({leads.length})</span>
          </button>
        </div>
      </div>

      {/* Orders View */}
      {activeTab === 'orders' && (
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="bg-white/5 text-white/50 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">Código</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">WhatsApp</th>
                  <th className="p-3">Pacote</th>
                  <th className="p-3">Fotos Enviadas</th>
                  <th className="p-3">Valor</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-white/40">
                      Nenhum pedido recebido ainda.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => {
                    const statusObj = statusList.find((s) => s.id === ord.status);
                    return (
                      <tr key={ord.id} className="hover:bg-white/5 transition">
                        <td className="p-3 font-mono font-bold text-amber-400">#{ord.id}</td>
                        <td className="p-3 font-semibold text-white">{ord.customerName}</td>
                        <td className="p-3">
                          <button
                            onClick={() => handleOpenWhatsappCustomer(ord.customerWhatsapp, ord.customerName)}
                            className="flex items-center gap-1 text-emerald-400 hover:underline font-mono"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            {ord.customerWhatsapp}
                          </button>
                        </td>
                        <td className="p-3">{ord.packageName}</td>
                        <td className="p-3 font-bold text-amber-300">
                          {ord.customerPhotos.length} foto(s)
                        </td>
                        <td className="p-3 font-bold text-emerald-400">{formatBRL(ord.totalAmount)}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${statusObj?.color}`}>
                            {statusObj?.label || ord.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenOrderDetails(ord)}
                              className="p-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 flex items-center gap-1 px-2.5"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Ver Fotos</span>
                            </button>
                            <button
                              onClick={() => deleteOrder(ord.id)}
                              className="p-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400"
                              title="Excluir"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Leads View */}
      {activeTab === 'leads' && (
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="bg-white/5 text-white/50 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3">Nome</th>
                  <th className="p-3">WhatsApp</th>
                  <th className="p-3">E-mail</th>
                  <th className="p-3">Pacote de Interesse</th>
                  <th className="p-3">Data</th>
                  <th className="p-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-white/40">
                      Nenhum lead gravado ainda.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/5 transition">
                      <td className="p-3 font-semibold text-white">{lead.name}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleOpenWhatsappCustomer(lead.whatsapp, lead.name)}
                          className="flex items-center gap-1 text-emerald-400 hover:underline font-mono"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          {lead.whatsapp}
                        </button>
                      </td>
                      <td className="p-3 text-white/60">{lead.email || '—'}</td>
                      <td className="p-3 font-semibold text-amber-300">{lead.packageName}</td>
                      <td className="p-3 text-white/50">{formatDateBR(lead.createdAt)}</td>
                      <td className="p-3">
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="p-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-white/15 rounded-3xl p-6 space-y-6 shadow-2xl my-8">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold text-white">Pedido #{selectedOrder.id}</span>
                <span className="px-3 py-0.5 rounded-full bg-amber-400 text-black text-xs font-black">
                  {selectedOrder.packageName}
                </span>
              </div>
              <p className="text-xs text-white/60">
                Cliente: <strong>{selectedOrder.customerName}</strong> ({selectedOrder.customerWhatsapp})
              </p>
            </div>

            {/* Status Change Buttons */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-2">Alterar Status do Pedido</label>
              <div className="flex flex-wrap gap-2">
                {statusList.map((s) => {
                  const isCurrent = selectedOrder.status === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleUpdateStatus(s.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        isCurrent
                          ? 'bg-amber-400 text-black border-amber-400 shadow-lg'
                          : 'bg-white/5 hover:bg-white/15 text-white/70 border-white/10'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Photos */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                Fotos de Referência Enviadas ({selectedOrder.customerPhotos.length})
              </h4>
              {selectedOrder.customerPhotos.length === 0 ? (
                <p className="text-xs text-white/40 italic">Nenhuma foto anexada pelo cliente.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1">
                  {selectedOrder.customerPhotos.map((photo, idx) => (
                    <a
                      key={idx}
                      href={photo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative rounded-xl overflow-hidden aspect-square border border-white/20 block"
                    >
                      <img src={photo} alt={`Foto ${idx}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <Download className="w-5 h-5 text-white" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Client Real-Time Tracking Details Configuration */}
            <div className="p-4 rounded-2xl bg-[#C9A45C]/10 border border-[#C9A45C]/30 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A45C] flex items-center justify-between">
                <span>Painel de Rastreio Público do Cliente</span>
                <span className="text-[10px] text-white/60 lowercase">visível na consulta do cliente</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-white/80 mb-1">
                    Previsão de Entrega
                  </label>
                  <input
                    type="text"
                    value={editEstimatedDelivery}
                    onChange={(e) => setEditEstimatedDelivery(e.target.value)}
                    placeholder="Ex: Em até 24h ou Hoje às 20h"
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-[#C9A45C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-white/80 mb-1">
                    Recado Público para o Cliente
                  </label>
                  <input
                    type="text"
                    value={editStatusMessage}
                    onChange={(e) => setEditStatusMessage(e.target.value)}
                    placeholder="Ex: Suas fotos estão na etapa final de renderização 4K."
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/15 text-white text-xs focus:border-[#C9A45C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveAllTrackingDetails}
                  className="px-4 py-1.5 rounded-xl bg-[#C9A45C] hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{saveSuccess ? 'Dados Atualizados!' : 'Salvar Alterações de Rastreio'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendTrackingLinkToCustomer}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-emerald-500/30"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Enviar Status no WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Internal Notes */}
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">Notas Internas do Administrador</label>
              <textarea
                rows={2}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Anotações internas do pedido (privadas)..."
                className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleOpenWhatsappCustomer(selectedOrder.customerWhatsapp, selectedOrder.customerName)}
                className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar no WhatsApp</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
