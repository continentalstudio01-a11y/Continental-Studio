import React, { useState, useEffect } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { Order, OrderStatus } from '../../types';
import { formatBRL, formatDateBR, buildWhatsappUrl } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Sparkles,
  Camera,
  Layers,
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const {
    isOrderTrackingOpen,
    closeOrderTrackingModal,
    activeTrackingQuery,
    findOrderForTracking,
    orders,
    siteSettings,
    trackEvent
  } = useBioSite();

  const [searchQuery, setSearchQuery] = useState(activeTrackingQuery || '');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (activeTrackingQuery) {
      setSearchQuery(activeTrackingQuery);
      const res = findOrderForTracking(activeTrackingQuery);
      setFoundOrder(res || null);
      setHasSearched(true);
    } else if (orders.length > 0 && !foundOrder) {
      // Default to the most recent order for convenient preview
      setFoundOrder(orders[0]);
      setSearchQuery(orders[0].id);
      setHasSearched(true);
    }
  }, [activeTrackingQuery, isOrderTrackingOpen]);

  if (!isOrderTrackingOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    const result = findOrderForTracking(searchQuery);
    setFoundOrder(result || null);
    setHasSearched(true);
  };

  const getStepNumber = (status: OrderStatus): number => {
    switch (status) {
      case 'novo':
        return 1;
      case 'contatado':
      case 'aguardando_pagamento':
        return 2;
      case 'pago':
      case 'em_producao':
        return 3;
      case 'aguardando_entrega':
        return 4;
      case 'entregue':
        return 5;
      case 'cancelado':
        return 0;
      default:
        return 2;
    }
  };

  const currentStep = foundOrder ? getStepNumber(foundOrder.status) : 1;

  const stepsList = [
    {
      step: 1,
      title: 'Pedido Recebido',
      desc: 'Informações e referências cadastradas no sistema.'
    },
    {
      step: 2,
      title: 'Alinhamento & Análise',
      desc: 'Fotógrafo especialista validando iluminação e traços.'
    },
    {
      step: 3,
      title: 'Geração IA Ultra HD',
      desc: 'Processamento dos modelos e renderização 4K.'
    },
    {
      step: 4,
      title: 'Edição Final & Curadoria',
      desc: 'Tratamento fino de pele, contraste e texturas.'
    },
    {
      step: 5,
      title: 'Pronto / Entregue',
      desc: 'Ensaio finalizado e enviado para seu WhatsApp/Drive.'
    }
  ];

  const handleContactSupportForOrder = () => {
    if (!foundOrder) return;
    trackEvent('whatsapp_click', {
      source: 'order_tracking_modal',
      orderId: foundOrder.id,
      customerName: foundOrder.customerName,
      status: foundOrder.status
    });
    const phone = siteSettings.contact.whatsapp;
    const text = `Olá! Gostaria de acompanhar meu pedido #${foundOrder.id} (${foundOrder.packageName}) no nome de ${foundOrder.customerName}.`;
    window.open(buildWhatsappUrl(phone, text), '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-[#111114] border border-[#C9A45C]/35 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-7 my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={closeOrderTrackingModal}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer z-10"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="mb-5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A45C]/15 border border-[#C9A45C]/30 text-[#C9A45C] text-xs font-bold uppercase tracking-wider mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Área do Cliente • Rastreio em Tempo Real</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
            Acompanhar Status do Pedido
          </h3>
          <p className="text-xs sm:text-sm text-white/60">
            Digite seu WhatsApp ou o código do pedido para verificar o progresso do seu ensaio.
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ex: 88997057623 ou ord-1001"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:border-[#C9A45C] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="btn-primary px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-lg shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Buscar</span>
          </button>
        </form>

        {/* Modal Body: Search Results / Order Status */}
        <div className="overflow-y-auto flex-1 pr-1 pb-1">
          {foundOrder ? (
            <div className="space-y-6">
              {/* Top Order Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-[#C9A45C]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-white/50 uppercase font-mono">Pedido</span>
                    <strong className="text-base sm:text-lg font-black text-[#C9A45C] font-mono">
                      #{foundOrder.id}
                    </strong>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/80 text-[10px] font-bold">
                      {formatDateBR(foundOrder.createdAt)}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm sm:text-base">
                    {foundOrder.customerName}
                  </h4>
                  <p className="text-xs text-white/70">
                    Pacote: <strong className="text-white">{foundOrder.packageName}</strong> • {foundOrder.photoQuantity || '5'} Fotos Ultra HD
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-white/50 block">Previsão de Entrega:</span>
                  <strong className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center sm:justify-end gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {foundOrder.estimatedDelivery || 'Em até 24h'}
                  </strong>
                </div>
              </div>

              {/* Step Timeline */}
              <div className="p-4 sm:p-6 rounded-2xl bg-white/5 border border-white/10">
                <h5 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-5 flex items-center justify-between">
                  <span>Progresso do Ensaio</span>
                  <span className="text-[#C9A45C] font-extrabold">Etapa {currentStep} de 5</span>
                </h5>

                <div className="relative space-y-6 before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
                  {stepsList.map((item) => {
                    const isDone = item.step < currentStep;
                    const isCurrent = item.step === currentStep;
                    const isPending = item.step > currentStep;

                    return (
                      <div key={item.step} className="relative flex items-start gap-4 pl-1">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 relative z-10 transition-all ${
                            isDone
                              ? 'bg-emerald-500 text-black ring-4 ring-emerald-500/20'
                              : isCurrent
                              ? 'bg-[#C9A45C] text-black ring-4 ring-[#C9A45C]/30 animate-pulse'
                              : 'bg-neutral-800 text-white/40 border border-white/10'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h6
                              className={`text-sm font-bold ${
                                isCurrent
                                  ? 'text-[#C9A45C]'
                                  : isDone
                                  ? 'text-white'
                                  : 'text-white/40'
                              }`}
                            >
                              {item.title}
                            </h6>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-md bg-[#C9A45C]/20 text-[#C9A45C] text-[10px] font-black uppercase">
                                Em Andamento
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/60 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Message from Studio */}
              {foundOrder.statusMessage && (
                <div className="p-4 rounded-2xl bg-[#C9A45C]/10 border border-[#C9A45C]/30 text-xs text-white/90 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#C9A45C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#C9A45C] block mb-0.5 font-bold">
                      Recado do Fotógrafo / IA:
                    </strong>
                    <span>{foundOrder.statusMessage}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleContactSupportForOrder}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition"
                >
                  <MessageCircle className="w-4 h-4 fill-black" />
                  <span>Falar sobre este Pedido no WhatsApp</span>
                </button>

                <button
                  onClick={closeOrderTrackingModal}
                  className="btn-secondary px-5 py-3.5 rounded-2xl font-semibold text-xs text-center cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            </div>
          ) : hasSearched ? (
            <div className="text-center py-10 px-4">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white/40 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Nenhum Pedido Localizado</h4>
              <p className="text-xs text-white/60 max-w-sm mx-auto mb-5">
                Não encontramos nenhum pedido registrado com a chave "<strong>{searchQuery}</strong>".
                Verifique os dígitos do seu WhatsApp ou código do pedido.
              </p>
              <button
                onClick={() => {
                  const phone = siteSettings.contact.whatsapp;
                  const text = `Olá! Preciso de ajuda para localizar meu pedido com o número ${searchQuery}.`;
                  window.open(buildWhatsappUrl(phone, text), '_blank');
                }}
                className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pedir Ajuda no WhatsApp</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-white/50 text-xs">
              Digite seu número ou código acima para consultar.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
