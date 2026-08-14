import React, { useState, useEffect } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { fireMarketingEvent } from '../../lib/tracking';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Check,
  Send,
  Sparkles,
  ShieldCheck,
  Eye,
  ShoppingCart,
  UserCheck,
  MessageCircle,
  HelpCircle,
  ExternalLink,
  Zap,
  Info,
  Copy,
  CheckCircle2
} from 'lucide-react';

interface EventLog {
  id: string;
  name: string;
  timestamp: string;
  payload: Record<string, any>;
  targets: string[];
}

export const PixelManager: React.FC = () => {
  const { siteSettings, updateSiteSettings, trackEvent, saveAllData } = useBioSite();

  const [metaPixelId, setMetaPixelId] = useState(siteSettings.tracking?.metaPixelId || '');
  const [ga4Id, setGa4Id] = useState(siteSettings.tracking?.googleAnalyticsId || '');
  const [gtmId, setGtmId] = useState(siteSettings.tracking?.googleTagManagerId || '');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Live dispatched events log
  const [eventLogs, setEventLogs] = useState<EventLog[]>([
    {
      id: 'log-1',
      name: 'PageView',
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      payload: { page: 'BioSite Continental Studio', url: window.location.href },
      targets: ['Meta Pixel', 'Google Analytics 4']
    }
  ]);

  useEffect(() => {
    if (siteSettings.tracking) {
      setMetaPixelId(siteSettings.tracking.metaPixelId || '');
      setGa4Id(siteSettings.tracking.googleAnalyticsId || '');
      setGtmId(siteSettings.tracking.googleTagManagerId || '');
    }
  }, [siteSettings.tracking]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMeta = metaPixelId.trim();
    const cleanGa4 = ga4Id.trim();
    const cleanGtm = gtmId.trim();

    const updatedTracking = {
      metaPixelId: cleanMeta,
      googleAnalyticsId: cleanGa4,
      googleTagManagerId: cleanGtm,
      enabled: Boolean(cleanMeta || cleanGa4 || cleanGtm)
    };

    updateSiteSettings({
      tracking: updatedTracking
    });

    await saveAllData({
      siteSettings: {
        ...siteSettings,
        tracking: updatedTracking
      }
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);

    // Add log
    addLog('ConfigUpdated', {
      metaPixelId: cleanMeta ? 'Ativo' : 'Vazio',
      googleAnalyticsId: cleanGa4 ? 'Ativo' : 'Vazio',
      googleTagManagerId: cleanGtm ? 'Ativo' : 'Vazio'
    });
  };

  const addLog = (name: string, payload: Record<string, any>) => {
    const targets: string[] = [];
    if (metaPixelId.trim()) targets.push('Meta Pixel');
    if (ga4Id.trim()) targets.push('GA4');
    if (gtmId.trim()) targets.push('GTM');
    if (targets.length === 0) targets.push('Simulador Local');

    const newLog: EventLog = {
      id: 'log-' + Date.now(),
      name,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      payload,
      targets
    };

    setEventLogs((prev) => [newLog, ...prev.slice(0, 7)]);
  };

  const handleTestEvent = (
    eventName: 'PageView' | 'ViewContent' | 'InitiateCheckout' | 'Lead' | 'WhatsAppClick'
  ) => {
    let mockPayload: Record<string, any> = {};

    switch (eventName) {
      case 'ViewContent':
        mockPayload = {
          content_name: 'Pacote VIP Diamond 10 Fotos',
          content_category: 'Ensaio IA Ultra HD',
          value: 147.0,
          currency: 'BRL'
        };
        break;
      case 'InitiateCheckout':
        mockPayload = {
          content_name: 'Pacote Executivo Gold 5 Fotos',
          value: 97.0,
          currency: 'BRL',
          num_items: 5
        };
        break;
      case 'Lead':
        mockPayload = {
          content_name: 'Novo Lead Ensaio IA',
          customer_name: 'Cliente VIP Teste',
          value: 97.0,
          currency: 'BRL'
        };
        break;
      case 'WhatsAppClick':
        mockPayload = {
          action: 'whatsapp_direct_contact',
          source: 'floating_button_or_order',
          order_id: '#ord-test'
        };
        break;
      default:
        mockPayload = { page: 'BioSite Home' };
    }

    fireMarketingEvent(eventName, mockPayload);
    addLog(eventName, mockPayload);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A45C]/15 border border-[#C9A45C]/30 text-[#C9A45C] text-xs font-bold uppercase tracking-wider mb-2">
          <Activity className="w-3.5 h-3.5" />
          <span>Marketing & Tráfego Pago</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-black text-white mb-2">
          Pixels de Rastreio & Conversão
        </h2>
        <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
          Configure o <strong>Pixel do Facebook / Meta Ads</strong> e o <strong>Google Analytics 4</strong>. 
          O sistema dispara automaticamente os eventos de conversão de anúncios quando os visitantes interagem com seu BioSite.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-[#C9A45C]/35 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#C9A45C]" />
              Identificadores de Rastreio
            </h3>
            <p className="text-xs text-white/60">
              Basta colar o ID fornecido pelo Gerenciador de Anúncios. Não é necessário editar códigos.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                metaPixelId || ga4Id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/10 text-white/50 border border-white/10'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  metaPixelId || ga4Id ? 'bg-emerald-400 animate-ping' : 'bg-white/40'
                }`}
              />
              {metaPixelId || ga4Id ? 'Rastreio Ativado' : 'Aguardando IDs'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Facebook Meta Pixel ID */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#E0BB70]">
                ID do Pixel do Facebook (Meta Ads)
              </label>
              <span className="text-[10px] text-white/40 font-mono">fbq</span>
            </div>
            <input
              type="text"
              placeholder="Ex: 893452198012345"
              value={metaPixelId}
              onChange={(e) => setMetaPixelId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-sm focus:border-[#C9A45C] focus:outline-none transition"
            />
            <p className="text-[11px] text-white/50 leading-tight">
              Encontrado no <em>Gerenciador de Eventos da Meta</em> &gt; Fontes de Dados.
            </p>
          </div>

          {/* Google Analytics 4 Measurement ID */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#E0BB70]">
                Google Analytics 4 (ID da Métrica)
              </label>
              <span className="text-[10px] text-white/40 font-mono">gtag</span>
            </div>
            <input
              type="text"
              placeholder="Ex: G-XXXXXXXXXX"
              value={ga4Id}
              onChange={(e) => setGa4Id(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-sm focus:border-[#C9A45C] focus:outline-none transition"
            />
            <p className="text-[11px] text-white/50 leading-tight">
              Formato que começa com <code>G-</code> no painel do Google Analytics 4.
            </p>
          </div>

          {/* Google Tag Manager (GTM) */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#E0BB70]">
                Google Tag Manager (ID GTM)
              </label>
              <span className="text-[10px] text-white/40 font-mono">dataLayer</span>
            </div>
            <input
              type="text"
              placeholder="Ex: GTM-XXXXXXX"
              value={gtmId}
              onChange={(e) => setGtmId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-mono text-sm focus:border-[#C9A45C] focus:outline-none transition"
            />
            <p className="text-[11px] text-white/50 leading-tight">
              Opcional se você utiliza o contêiner GTM para gerenciar todas as tags.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="btn-primary px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 cursor-pointer shadow-xl transition transform active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>{isSaved ? 'Configurações de Rastreio Salvas com Sucesso!' : 'Salvar Códigos de Rastreio'}</span>
          </button>
        </div>
      </form>

      {/* Automatic Event Dispatches Matrix */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Disparos Automáticos Configurados
          </h3>
          <p className="text-xs sm:text-sm text-white/60">
            Estes 4 eventos principais já estão mapeados e são enviados automaticamente pelo BioSite nas ações dos clientes:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ViewContent */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold text-xs">
                  <Eye className="w-3 h-3" /> ViewContent
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Automático</span>
              </div>
              <p className="text-xs text-white/80 font-medium">
                Disparado quando o visitante navega pelos pacotes de fotos ou abre detalhes de um ensaio no BioSite.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleTestEvent('ViewContent')}
              className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-white/10"
            >
              <Send className="w-3 h-3 text-blue-400" />
              <span>Simular Disparo ViewContent</span>
            </button>
          </div>

          {/* InitiateCheckout */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
                  <ShoppingCart className="w-3 h-3" /> InitiateCheckout
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Automático</span>
              </div>
              <p className="text-xs text-white/80 font-medium">
                Disparado quando o cliente clica em "Fazer Meu Ensaio" ou inicia a escolha do pacote no modal de pedido.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleTestEvent('InitiateCheckout')}
              className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-white/10"
            >
              <Send className="w-3 h-3 text-amber-400" />
              <span>Simular Disparo InitiateCheckout</span>
            </button>
          </div>

          {/* Lead */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold text-xs">
                  <UserCheck className="w-3 h-3" /> Lead
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Automático</span>
              </div>
              <p className="text-xs text-white/80 font-medium">
                Disparado quando o cliente preenche Nome, WhatsApp e preferências para avançar com o ensaio fotográfico.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleTestEvent('Lead')}
              className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-white/10"
            >
              <Send className="w-3 h-3 text-purple-400" />
              <span>Simular Disparo Lead</span>
            </button>
          </div>

          {/* WhatsAppClick */}
          <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                  <MessageCircle className="w-3 h-3" /> WhatsAppClick
                </span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Automático</span>
              </div>
              <p className="text-xs text-white/80 font-medium">
                Disparado quando o cliente clica no botão de contato flutuante ou envia o pedido completo diretamente no WhatsApp.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleTestEvent('WhatsAppClick')}
              className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer border border-white/10"
            >
              <Send className="w-3 h-3 text-emerald-400" />
              <span>Simular Disparo WhatsAppClick</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Event Dispatch Feed / Log */}
      <div className="p-6 rounded-3xl bg-black/60 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#C9A45C]" />
            Log de Disparos em Tempo Real (Console de Conversão)
          </h4>
          <span className="text-[10px] text-white/40 font-mono">
            {eventLogs.length} eventos registrados nesta sessão
          </span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {eventLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono"
            >
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-[#C9A45C]/20 text-[#C9A45C] font-bold">
                  {log.name}
                </span>
                <span className="text-white/60 text-[11px]">
                  {JSON.stringify(log.payload)}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {log.targets.join(' + ')}
                </span>
                <span className="text-white/40 text-[10px]">{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Guide & Meta Pixel Helper Instructions */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5 text-xs text-white/70">
        <Info className="w-5 h-5 text-[#C9A45C] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white block font-bold">
            Como verificar se o seu Pixel está ativo no navegador:
          </strong>
          <p>
            Instale a extensão oficial <strong>Meta Pixel Helper</strong> ou <strong>Google Tag Assistant</strong> no Google Chrome. Ao abrir o seu BioSite, a extensão acenderá em verde mostrando o carregamento do Pixel e os eventos <code>PageView</code>, <code>ViewContent</code>, <code>InitiateCheckout</code>, <code>Lead</code> e <code>WhatsAppClick</code> sendo disparados com sucesso.
          </p>
        </div>
      </div>
    </div>
  );
};
