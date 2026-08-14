import React, { useState, useEffect } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { Package } from '../../types';
import { formatBRL, buildWhatsappUrl } from '../../lib/utils';
import { X, Upload, CheckCircle2, ArrowRight, ArrowLeft, Camera, Sparkles, QrCode, Copy, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageDropzone } from '../common/ImageDropzone';

export const OrderModal: React.FC = () => {
  const {
    siteSettings,
    packages,
    selectedPackageForOrder,
    closeOrderModal,
    createOrder,
    trackEvent,
    openOrderTrackingModal
  } = useBioSite();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(selectedPackageForOrder);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [stylePreference, setStylePreference] = useState('Executivo / Corporativo');
  const [observations, setObservations] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Completed State
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  useEffect(() => {
    if (selectedPackageForOrder) {
      setSelectedPkg(selectedPackageForOrder);
    } else if (packages.length > 0) {
      setSelectedPkg(packages[0]);
    }

    // Fire InitiateCheckout tracking
    trackEvent('button_click', {
      button: 'order_modal_open',
      package: selectedPackageForOrder?.name || 'Geral',
      value: selectedPackageForOrder?.price || 97.0
    });
  }, [selectedPackageForOrder, packages]);

  const styleOptions = [
    'Executivo / Corporativo (LinkedIn & Perfil Profissional)',
    'Aniversário Luxo / Festa & Celebração',
    'Gestante Sunset & Família',
    'Casual Chic / Lifestyle Moderno',
    'Moda / Editorial de Revista',
    'Sensual / Glamour & Estúdio Escuro',
    'Médico / Odonto / Profissionais de Saúde',
    'Advocacia & Direito Tradicional',
    'Fantasia / Cosplay / Tech'
  ];

  // Photo Uploader Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newPhotos: string[] = [];

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newPhotos.push(event.target.result as string);
          if (newPhotos.length === files.length) {
            setUploadedPhotos((prev) => [...prev, ...newPhotos].slice(0, 20));
            setIsUploading(false);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      if (!customerName || !customerWhatsapp) {
        alert('Por favor, preencha seu nome e WhatsApp para continuarmos.');
        return;
      }
      // Fire Lead tracking on step 2 completion
      trackEvent('lead_created', {
        name: customerName,
        whatsapp: customerWhatsapp,
        email: customerEmail,
        package: selectedPkg?.name,
        value: selectedPkg?.price
      });
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const buildCompleteWhatsappMessage = (ord: any) => {
    let msg = `✨ *NOVO PEDIDO DE ENSAIO IA - CONTINENTAL STUDIO*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🆔 *Código do Pedido:* #${ord.id}\n`;
    msg += `👤 *Nome:* ${ord.customerName}\n`;
    msg += `📱 *WhatsApp:* ${ord.customerWhatsapp}\n`;
    if (ord.customerEmail) {
      msg += `✉️ *E-mail:* ${ord.customerEmail}\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `📦 *Pacote:* ${ord.packageName}\n`;
    msg += `📸 *Fotos:* ${ord.photoQuantity} Fotos em Ultra HD 4K\n`;
    msg += `💰 *Valor:* ${formatBRL(ord.totalAmount)}\n`;
    msg += `🎨 *Estilo:* ${ord.stylePreference}\n`;
    if (ord.observations) {
      msg += `📝 *Observações:* ${ord.observations}\n`;
    }
    msg += `📁 *Fotos Carregadas:* ${ord.customerPhotos?.length || 0} fotos\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🚀 _Gostaria de confirmar os detalhes e iniciar a produção do meu ensaio!_`;
    return msg;
  };

  const handleFinalizeOrder = () => {
    if (!selectedPkg) return;

    // Save order in system
    const newOrder = createOrder({
      customerName,
      customerWhatsapp,
      customerEmail,
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      packagePrice: selectedPkg.price,
      photoQuantity: selectedPkg.photos,
      stylePreference,
      observations,
      customerPhotos: uploadedPhotos,
      status: 'novo',
      totalAmount: selectedPkg.price,
      estimatedDelivery: 'Em até 24 horas',
      statusMessage: 'Pedido registrado com sucesso. Aguardando envio no WhatsApp.'
    });

    setCompletedOrder(newOrder);
    setCurrentStep(5); // Confirmation screen

    trackEvent('whatsapp_click', {
      source: 'order_finalize_step',
      orderId: newOrder.id,
      package: newOrder.packageName,
      value: newOrder.totalAmount
    });
  };

  const handleOpenWhatsapp = () => {
    if (!completedOrder) return;
    const fullText = buildCompleteWhatsappMessage(completedOrder);
    const url = buildWhatsappUrl(siteSettings.contact.whatsapp, fullText);

    trackEvent('whatsapp_click', {
      source: 'order_confirmation_screen',
      orderId: completedOrder.id,
      package: completedOrder.packageName
    });

    window.open(url, '_blank');
  };

  const handleOpenTrackingFromConfirmation = () => {
    if (!completedOrder) return;
    closeOrderModal();
    openOrderTrackingModal(completedOrder.id);
  };

  const pixKeyMock = '00020126360014BR.GOV.BCB.PIX0114+5588997057623520400005303986540597.005802BR5918Continental Studio6009FORTALEZA62070503***6304E8A9';

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKeyMock);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-3 sm:p-6 flex items-center justify-center overflow-y-auto"
    >
      <div className="relative w-full max-w-xl bg-[#111114] border border-[#C9A45C]/30 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-7 my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={closeOrderModal}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer z-10"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="mb-5 shrink-0 pr-8">
          <div className="flex items-center justify-between text-xs font-bold text-white/50 mb-2">
            <span className="tracking-wider">PASSO {currentStep} DE 5</span>
            <span className="text-[#C9A45C] font-extrabold truncate max-w-[200px] text-right">
              {currentStep === 1 && 'Escolher Pacote'}
              {currentStep === 2 && 'Seus Dados'}
              {currentStep === 3 && 'Enviar Fotos'}
              {currentStep === 4 && 'Estilo & Preferências'}
              {currentStep === 5 && 'Pedido Confirmado!'}
            </span>
          </div>

          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C9A45C] transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto flex-1 pr-1 pb-1">
          {/* STEP 1: Select Package */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F2EA] mb-1">Selecione seu Pacote</h3>
              <p className="text-xs sm:text-sm text-white/60 mb-5">Escolha a quantidade de fotos ideal para o seu ensaio.</p>

              <div className="space-y-3 mb-6">
                {packages.filter((p) => p.enabled).map((pkg) => {
                  const isSelected = selectedPkg?.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkg(pkg)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#C9A45C]/15 border-[#C9A45C] text-white shadow-lg ring-1 ring-[#C9A45C]/50'
                          : 'bg-white/5 border-white/10 hover:border-white/20 text-white/80'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-base sm:text-lg text-white">{pkg.name}</span>
                          {pkg.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-[#C9A45C] text-black text-[10px] font-black uppercase tracking-wider">
                              {pkg.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/60 mt-0.5">
                          <strong className="text-white">{pkg.photos} {pkg.photos === 1 ? 'Foto' : 'Fotos'}</strong> em Ultra HD 4K
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xl sm:text-2xl font-black text-[#C9A45C] block">
                          {formatBRL(pkg.price)}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-semibold block">
                          Pix / Cartão
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextStep}
                  disabled={!selectedPkg}
                  className="btn-primary w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Continuar com {selectedPkg?.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Customer Info */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F2EA] mb-1">Informações Pessoais</h3>
              <p className="text-xs sm:text-sm text-white/60 mb-5">Para envio do resultado e atendimento personalizado via WhatsApp.</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">Seu Nome Completo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria Silva"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 focus:border-[#C9A45C] focus:outline-none text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">WhatsApp (com DDD) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 88 99705-7623"
                    value={customerWhatsapp}
                    onChange={(e) => setCustomerWhatsapp(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 focus:border-[#C9A45C] focus:outline-none text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">E-mail (opcional)</label>
                  <input
                    type="email"
                    placeholder="Ex: seuemail@exemplo.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 focus:border-[#C9A45C] focus:outline-none text-base"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrevStep}
                  className="btn-secondary px-5 py-3 rounded-xl font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>

                <button
                  onClick={handleNextStep}
                  className="btn-primary px-7 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Avançar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Upload Photos */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F2EA] mb-1">Envio das Suas Fotos</h3>
              <p className="text-xs sm:text-sm text-white/60 mb-5">
                Envie de 1 a 10 fotos nítidas do seu rosto (selfies do celular). A IA usará como referência.
              </p>

              {/* Drag and Drop Zone */}
              <ImageDropzone
                multiple={true}
                maxFiles={20}
                onImagesSelected={(base64List) => {
                  setUploadedPhotos((prev) => [...prev, ...base64List].slice(0, 20));
                }}
                label="Clique ou arraste suas selfies aqui"
                sublabel="Formatos aceitos: JPG, PNG, WEBP (Até 20 fotos)"
                showUrlInput={false}
                className="mb-5"
              />

              {/* Thumbnails preview */}
              {uploadedPhotos.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#C9A45C]">
                      {uploadedPhotos.length} foto(s) carregada(s):
                    </span>
                    <button
                      type="button"
                      onClick={() => setUploadedPhotos([])}
                      className="text-xs text-red-400 hover:underline cursor-pointer"
                    >
                      Limpar todas
                    </button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1.5 bg-black/40 rounded-2xl border border-white/10">
                    {uploadedPhotos.map((photo, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square border border-white/20">
                        <img src={photo} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white text-[10px] opacity-90 hover:opacity-100 cursor-pointer"
                          title="Remover foto"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrevStep}
                  className="btn-secondary px-5 py-3 rounded-xl font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>

                <button
                  onClick={handleNextStep}
                  className="btn-primary px-7 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>Avançar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Style Preference & Notes */}
          {currentStep === 4 && (
            <div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#F5F2EA] mb-1">Estilo & Observações</h3>
              <p className="text-xs sm:text-sm text-white/60 mb-5">Como você gostaria que fossem os cenários e estilo das suas fotos?</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">Estilo Principal Desejado</label>
                  <select
                    value={stylePreference}
                    onChange={(e) => setStylePreference(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-neutral-800 border border-white/15 text-white focus:border-[#C9A45C] focus:outline-none text-base"
                  >
                    {styleOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">Observações ou Pedidos Especiais</label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Roupas escuras, blazer executivo, fundo estúdio moderno..."
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 focus:border-[#C9A45C] focus:outline-none text-base"
                  />
                </div>

                {/* Summary recap box - High Contrast Pricing */}
                <div className="p-4 sm:p-5 rounded-2xl bg-black/60 border border-[#C9A45C]/30 text-xs sm:text-sm text-white/90 space-y-1.5">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-white/60">Pacote Escolhido:</span>
                    <strong className="text-white font-bold">{selectedPkg?.name} ({selectedPkg?.photos} fotos)</strong>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-white/60">Valor Total:</span>
                    <strong className="text-xl font-black text-[#C9A45C]">{formatBRL(selectedPkg?.price || 0)}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Cliente:</span>
                    <span className="font-semibold text-white">{customerName || 'Não informado'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handlePrevStep}
                  className="btn-secondary px-5 py-3 rounded-xl font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>

                <button
                  onClick={handleFinalizeOrder}
                  className="btn-primary px-7 py-3.5 rounded-xl font-extrabold text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-xl"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Finalizar Pedido</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Order Confirmation */}
          {currentStep === 5 && completedOrder && (
            <div className="text-center py-2 sm:py-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-black text-white mb-1">Informações Salvas!</h3>
              <p className="text-xs sm:text-sm text-white/70 max-w-sm mx-auto mb-4">
                Seu pedido <strong className="text-[#C9A45C] font-mono">#{completedOrder.id}</strong> foi cadastrado. Para iniciar a produção, envie os dados pelo WhatsApp.
              </p>

              {/* Total Value Pill */}
              <div className="inline-block px-5 py-2 rounded-2xl bg-[#C9A45C]/15 border border-[#C9A45C]/40 mb-5">
                <span className="text-xs text-white/60 block">Pacote {completedOrder.packageName}:</span>
                <span className="text-2xl sm:text-3xl font-black text-[#C9A45C]">{formatBRL(completedOrder.totalAmount)}</span>
              </div>

              {/* Actions */}
              <div className="space-y-3 mb-6 text-left">
                <button
                  onClick={handleOpenWhatsapp}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl cursor-pointer transition transform active:scale-98"
                >
                  <Send className="w-5 h-5 fill-black" />
                  <span>Enviar Dados Completos para o WhatsApp</span>
                </button>

                <button
                  onClick={handleOpenTrackingFromConfirmation}
                  className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A45C]" />
                  <span>Acompanhar Status do Pedido #{completedOrder.id}</span>
                </button>

                <div className="p-4 rounded-2xl bg-black/60 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-[#C9A45C]" /> Chave Pix Copia e Cola
                    </span>
                    <span className="text-xs font-extrabold text-[#C9A45C]">{formatBRL(completedOrder.totalAmount)}</span>
                  </div>

                  <div className="flex items-center gap-2 bg-neutral-900 p-2.5 rounded-xl border border-white/10">
                    <input
                      type="text"
                      readOnly
                      value={pixKeyMock}
                      className="w-full bg-transparent text-[11px] text-white/70 font-mono truncate focus:outline-none"
                    />
                    <button
                      onClick={copyPixKey}
                      className="px-3.5 py-2 rounded-lg bg-[#C9A45C] hover:bg-amber-300 text-black text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={closeOrderModal}
                className="text-xs text-white/60 hover:text-white underline cursor-pointer p-2"
              >
                Concluir e Voltar ao Site
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
