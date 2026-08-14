import React, { useState, useMemo } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { formatDateBR } from '../../lib/utils';
import {
  BarChart3,
  Download,
  Activity,
  Eye,
  MousePointer,
  Smartphone,
  Laptop,
  Globe,
  Share2,
  Trash2,
  Filter,
  CheckCircle,
  ShoppingBag,
  TrendingUp,
  Search,
  MessageCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AnalyticsManager: React.FC = () => {
  const { analyticsEvents, navItems, orders, leads, clearOperationalData } = useBioSite();

  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'all'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');

  // Filter events by date range
  const filteredEvents = useMemo(() => {
    const now = new Date();
    return analyticsEvents.filter((ev) => {
      if (!ev.timestamp) return false;
      const evDate = new Date(ev.timestamp);

      if (dateFilter === 'today') {
        return evDate.toDateString() === now.toDateString();
      }
      if (dateFilter === '7days') {
        const diffDays = (now.getTime() - evDate.getTime()) / (1000 * 3600 * 24);
        return diffDays <= 7;
      }
      if (dateFilter === '30days') {
        const diffDays = (now.getTime() - evDate.getTime()) / (1000 * 3600 * 24);
        return diffDays <= 30;
      }
      return true;
    });
  }, [analyticsEvents, dateFilter]);

  // Log table filter
  const tableEvents = useMemo(() => {
    return filteredEvents.filter((ev) => {
      const matchesType = eventTypeFilter === 'all' || ev.type === eventTypeFilter;
      const jsonStr = JSON.stringify(ev).toLowerCase();
      const matchesSearch = !searchFilter || jsonStr.includes(searchFilter.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [filteredEvents, eventTypeFilter, searchFilter]);

  // Metric breakdown calculations
  const totalPageViews = useMemo(
    () => filteredEvents.filter((e) => e.type === 'page_view').length,
    [filteredEvents]
  );

  const totalButtonClick = useMemo(
    () => filteredEvents.filter((e) => e.type === 'button_click').length,
    [filteredEvents]
  );

  const totalWhatsappClicks = useMemo(
    () =>
      filteredEvents.filter(
        (e) =>
          e.type === 'whatsapp_click' ||
          (e.type === 'button_click' &&
            (e.metadata?.targetType === 'whatsapp' || e.metadata?.navItemId === 'whatsapp'))
      ).length,
    [filteredEvents]
  );

  const totalOrderModalOpens = useMemo(
    () =>
      filteredEvents.filter(
        (e) =>
          e.metadata?.button === 'order_modal_open' ||
          e.type === 'package_click' ||
          e.type === 'button_click' && e.metadata?.navItemId === 'order'
      ).length,
    [filteredEvents]
  );

  const totalOrdersCreated = useMemo(
    () => filteredEvents.filter((e) => e.type === 'order_created').length || orders.length,
    [filteredEvents, orders]
  );

  // Conversion Rate (Orders / Pageviews)
  const conversionRate = useMemo(() => {
    if (totalPageViews === 0) return '0.0%';
    return ((totalOrdersCreated / totalPageViews) * 100).toFixed(1) + '%';
  }, [totalPageViews, totalOrdersCreated]);

  // Traffic Source Breakdown (Referrers)
  const referrerData = useMemo(() => {
    const pageViews = filteredEvents.filter((e) => e.type === 'page_view');
    const counts: Record<string, number> = {};

    pageViews.forEach((ev) => {
      const ref = ev.metadata?.referrer || 'Direto / Instagram Bio';
      counts[ref] = (counts[ref] || 0) + 1;
    });

    return Object.keys(counts).map((refKey) => ({
      name: refKey,
      value: counts[refKey]
    }));
  }, [filteredEvents]);

  // Device Breakdown (Mobile vs Desktop vs Tablet)
  const deviceData = useMemo(() => {
    const pageViews = filteredEvents.filter((e) => e.type === 'page_view');
    const counts: Record<string, number> = {
      'Celular (Mobile)': 0,
      'Computador (Desktop)': 0,
      Tablet: 0
    };

    pageViews.forEach((ev) => {
      const dev = ev.metadata?.device || 'Celular (Mobile)';
      counts[dev] = (counts[dev] || 0) + 1;
    });

    return Object.keys(counts)
      .map((k) => ({ name: k, value: counts[k] }))
      .filter((i) => i.value > 0);
  }, [filteredEvents]);

  const COLORS = ['#C9A45C', '#4F8CFF', '#42D392', '#E98AAF', '#A98BFA'];

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'ID,Tipo,Timestamp,Dispositivo,Referrer,Metadados\n';
    const rows = filteredEvents
      .map((e) => {
        const meta = e.metadata || {};
        return `"${e.id}","${e.type}","${e.timestamp}","${meta.device || ''}","${meta.referrer || ''}","${JSON.stringify(meta).replace(/"/g, '""')}"`;
      })
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics_real_${dateFilter}_${Date.now()}.csv`;
    a.click();
  };

  const handleClearAnalytics = () => {
    if (
      window.confirm(
        'Deseja realmente zerar todos os registros de analytics e contadores de cliques dos botões?'
      )
    ) {
      clearOperationalData();
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-white">Analytics 100% Real</h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] uppercase border border-emerald-500/30">
              ● Ao Vivo
            </span>
          </div>
          <p className="text-xs text-white/60">
            Métricas puras e reais calculadas a partir das interações diretas dos seus clientes no BioSite.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="btn-primary px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={handleClearAnalytics}
            className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-2 cursor-pointer transition shadow-lg"
            title="Zerar dados de acessos e cliques"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Zerar Analytics</span>
          </button>
        </div>
      </div>

      {/* Date Range Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 w-fit">
        <button
          onClick={() => setDateFilter('today')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            dateFilter === 'today'
              ? 'bg-[#C9A45C] text-black shadow-md'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Hoje
        </button>
        <button
          onClick={() => setDateFilter('7days')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            dateFilter === '7days'
              ? 'bg-[#C9A45C] text-black shadow-md'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Últimos 7 dias
        </button>
        <button
          onClick={() => setDateFilter('30days')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            dateFilter === '30days'
              ? 'bg-[#C9A45C] text-black shadow-md'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Últimos 30 dias
        </button>
        <button
          onClick={() => setDateFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            dateFilter === 'all'
              ? 'bg-[#C9A45C] text-black shadow-md'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Todos os Tempos
        </button>
      </div>

      {/* Real Core KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-white/60">Acessos BioSite</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{totalPageViews}</div>
          <span className="text-[10px] text-white/40 mt-1 block">Visualizações de página</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-white/60">Cliques em Links</span>
            <MousePointer className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{totalButtonClick}</div>
          <span className="text-[10px] text-white/40 mt-1 block">Interações com botões</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-white/60">Conversas WhatsApp</span>
            <MessageCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{totalWhatsappClicks}</div>
          <span className="text-[10px] text-emerald-400 font-medium mt-1 block">Cliques diretos</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-white/60">Formulários Abertos</span>
            <ShoppingBag className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{totalOrderModalOpens}</div>
          <span className="text-[10px] text-white/40 mt-1 block">Interesse no ensaio</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-white/60">Taxa de Conversão</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{conversionRate}</div>
          <span className="text-[10px] text-emerald-400 font-medium mt-1 block">Pedidos / Acessos</span>
        </div>
      </div>

      {/* Real Sales Funnel & Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Real Funnel Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" /> Funil de Conversão Real
            </span>
            <span className="text-xs text-white/50 font-normal">{filteredEvents.length} eventos totais</span>
          </h3>

          <div className="space-y-3 pt-2">
            {/* Step 1: Page View */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 font-black text-xs flex items-center justify-center">
                  1
                </span>
                <div>
                  <div className="text-xs font-bold text-white">Visualizações do BioSite</div>
                  <div className="text-[10px] text-white/50">Visitantes que abriram o link</div>
                </div>
              </div>
              <span className="text-sm font-extrabold text-white">{totalPageViews}</span>
            </div>

            {/* Step 2: Button Interaction */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center">
                  2
                </span>
                <div>
                  <div className="text-xs font-bold text-white">Interações com Botões</div>
                  <div className="text-[10px] text-white/50">Cliques nos links do Linktree</div>
                </div>
              </div>
              <span className="text-sm font-extrabold text-white">{totalButtonClick}</span>
            </div>

            {/* Step 3: Order Modal Open */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 font-black text-xs flex items-center justify-center">
                  3
                </span>
                <div>
                  <div className="text-xs font-bold text-white">Abertura do Formulário de Pedido</div>
                  <div className="text-[10px] text-white/50">Seleção de pacotes & fotos</div>
                </div>
              </div>
              <span className="text-sm font-extrabold text-white">{totalOrderModalOpens}</span>
            </div>

            {/* Step 4: Order Created */}
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-emerald-500 text-black font-black text-xs flex items-center justify-center">
                  4
                </span>
                <div>
                  <div className="text-xs font-bold text-emerald-300">Pedidos Concluídos</div>
                  <div className="text-[10px] text-emerald-200/70">Ensaios solicitados com sucesso</div>
                </div>
              </div>
              <span className="text-sm font-extrabold text-emerald-400">{totalOrdersCreated}</span>
            </div>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-sky-400" /> Dispositivos Reais
          </h3>

          {deviceData.length > 0 ? (
            <>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {deviceData.map((_, index) => (
                        <Cell key={`cell-dev-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 text-xs">
                {deviceData.map((d, idx) => (
                  <div key={d.name} className="flex items-center justify-between text-white/80">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      {d.name}
                    </span>
                    <span className="font-bold text-white">{d.value} acessos</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="my-auto text-center py-6">
              <Laptop className="w-8 h-8 text-white/20 mx-auto mb-2" />
              <p className="text-xs text-white/50">Aguardando primeiros acessos...</p>
            </div>
          )}
        </div>
      </div>

      {/* Button Click Ranking & A/B Test Results */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
        <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
          <span>Desempenho dos Botões da Navegação (Real)</span>
          <span className="text-xs text-white/50 font-normal">Contagem acumulada</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/80">
            <thead className="bg-white/5 text-white/50 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Botão / Título</th>
                <th className="p-3">Destino</th>
                <th className="p-3 text-center">Cliques Totais</th>
                <th className="p-3 text-center">Variante A</th>
                <th className="p-3 text-center">Variante B (Teste A/B)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {navItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition">
                  <td className="p-3 font-semibold text-white">
                    <div>{item.label}</div>
                    {item.subtitle && (
                      <div className="text-[10px] text-white/40">{item.subtitle}</div>
                    )}
                  </td>
                  <td className="p-3 font-mono text-[11px] text-white/60">{item.target}</td>
                  <td className="p-3 text-center">
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold">
                      🔥 {item.clickCount || 0}
                    </span>
                  </td>
                  <td className="p-3 text-center font-bold text-white/80">
                    {item.clickCountA || 0}
                  </td>
                  <td className="p-3 text-center">
                    {item.abTestEnabled ? (
                      <span className="font-bold text-rose-300">
                        {item.clickCountB || 0}
                      </span>
                    ) : (
                      <span className="text-white/30 italic">Inativo</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Event Log Table with Filters */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" /> Log em Tempo Real ({tableEvents.length})
          </h3>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar evento..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-white/10 border border-white/15 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Event Type Filter */}
            <select
              value={eventTypeFilter}
              onChange={(e) => setEventTypeFilter(e.target.value)}
              className="bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all" className="bg-black text-white">Todos os Tipos</option>
              <option value="page_view" className="bg-black text-white">Visualização (page_view)</option>
              <option value="button_click" className="bg-black text-white">Clique (button_click)</option>
              <option value="whatsapp_click" className="bg-black text-white">WhatsApp (whatsapp_click)</option>
              <option value="package_click" className="bg-black text-white">Pacote (package_click)</option>
              <option value="order_created" className="bg-black text-white">Pedido (order_created)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/80">
            <thead className="bg-white/5 text-white/50 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Tipo de Evento</th>
                <th className="p-3">Dispositivo / Origem</th>
                <th className="p-3">Detalhes / Metadados</th>
                <th className="p-3">Data e Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {tableEvents.slice(0, 30).map((ev) => (
                <tr key={ev.id} className="hover:bg-white/5 transition">
                  <td className="p-3 text-white/40 text-[10px]">{ev.id}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                        ev.type === 'page_view'
                          ? 'bg-sky-500/20 text-sky-300'
                          : ev.type === 'order_created'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : ev.type === 'whatsapp_click'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {ev.type}
                    </span>
                  </td>
                  <td className="p-3 text-white/70">
                    <div>{ev.metadata?.device || '—'}</div>
                    {ev.metadata?.referrer && (
                      <div className="text-[10px] text-white/40">{ev.metadata.referrer}</div>
                    )}
                  </td>
                  <td className="p-3 text-white/70 max-w-xs truncate">
                    {ev.metadata ? JSON.stringify(ev.metadata) : '—'}
                  </td>
                  <td className="p-3 text-white/50 text-[11px]">
                    {formatDateBR(ev.timestamp)}
                  </td>
                </tr>
              ))}

              {tableEvents.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-white/40 text-xs italic">
                    Nenhum evento registrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
