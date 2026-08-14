import React from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { formatBRL, formatDateBR } from '../../lib/utils';
import {
  Eye,
  MessageCircle,
  Users,
  ShoppingBag,
  DollarSign,
  Camera,
  Activity,
  Trash2,
  CheckCircle2,
  Info
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

export const DashboardOverview: React.FC = () => {
  const { analyticsEvents, leads, orders, packages, clearOperationalData } = useBioSite();

  // STRICTLY REAL METRICS (No artificial offsets)
  const pageViews = analyticsEvents.filter((e) => e.type === 'page_view').length;
  const whatsappClicks = analyticsEvents.filter(
    (e) =>
      e.type === 'whatsapp_click' ||
      (e.type === 'button_click' &&
        (e.metadata?.targetType === 'whatsapp' || e.metadata?.navItemId === 'whatsapp'))
  ).length;
  const totalLeadsCount = leads.length;
  const totalOrdersCount = orders.length;

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalPhotosReceived = orders.reduce(
    (acc, o) => acc + (o.customerPhotos ? o.customerPhotos.length : 0),
    0
  );

  // Generate last 7 days real revenue chart
  const getLast7DaysData = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const result = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayName = days[d.getDay()];
      const dayStr = d.toISOString().split('T')[0];

      // Sum orders on this date
      const dayOrders = orders.filter((o) => {
        if (!o.createdAt) return false;
        return o.createdAt.startsWith(dayStr);
      });

      const dayRevenue = dayOrders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

      result.push({
        name: dayName,
        faturamento: dayRevenue,
        pedidos: dayOrders.length
      });
    }

    return result;
  };

  const revenueData = getLast7DaysData();

  // Package sales distribution (100% REAL)
  const packageSalesData = packages
    .map((pkg) => {
      const count = orders.filter(
        (o) => o.packageId === pkg.id || o.packageName === pkg.name
      ).length;
      return { name: pkg.name, value: count };
    })
    .filter((item) => item.value > 0);

  const COLORS = ['#C9A45C', '#4F8CFF', '#42D392', '#E98AAF', '#A98BFA'];

  const handleClearData = () => {
    if (
      window.confirm(
        'Tem certeza que deseja ZERAR todos os dados operacionais (pedidos, leads, contadores e histórico de analytics)?\n\nEssa ação deixará o painel totalmente limpo para uso real.'
      )
    ) {
      clearOperationalData();
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Operational Zero Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Visão Geral do BioSite</h2>
          <p className="text-xs text-white/60">
            Painel 100% operacional. Acompanhe tráfego, contatos e pedidos reais em tempo real.
          </p>
        </div>

        <button
          onClick={handleClearData}
          className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-md self-start sm:self-auto"
          title="Zerar todos os pedidos, leads e acessos acumulados"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span>Zerar Dados de Teste</span>
        </button>
      </div>

      {/* Zero Status Notification */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-200 leading-relaxed">
          <strong>Painel Zerado e Pronto Para Receber Clientes!</strong>
          <span className="block mt-0.5 text-white/70">
            Todas as métricas, contadores e gráficos abaixo são alimentados exclusivamente por interações reais. Quando novos visitantes acessarem seu BioSite, as métricas e pedidos aparecerão instantaneamente aqui.
          </span>
        </div>
      </div>

      {/* Real Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-white/60">Acessos Reais</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{pageViews}</div>
          <span className="text-[10px] text-white/40 mt-1 block">Visitas ao link</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-white/60">WhatsApp</span>
            <MessageCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{whatsappClicks}</div>
          <span className="text-[10px] text-emerald-400 font-medium mt-1 block">Cliques em conversa</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-white/60">Leads Reais</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{totalLeadsCount}</div>
          <span className="text-[10px] text-white/40 mt-1 block">Contatos salvos</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-white/60">Pedidos Reais</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{totalOrdersCount}</div>
          <span className="text-[10px] text-amber-400 font-medium mt-1 block">Ensaios solicitados</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-white/60">Faturamento</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-amber-400">{formatBRL(totalRevenue)}</div>
          <span className="text-[10px] text-emerald-400 font-medium mt-1 block">Receita real obtida</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-white/60">Selfies IA</span>
            <Camera className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{totalPhotosReceived}</div>
          <span className="text-[10px] text-white/40 mt-1 block">Fotos recebidas</span>
        </div>
      </div>

      {/* Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real Revenue Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/5 border border-white/10">
          <h3 className="text-base font-bold text-white mb-4 flex items-center justify-between">
            <span>Faturamento dos Últimos 7 Dias (R$)</span>
            <span className="text-xs text-amber-400 font-normal">Métricas reais</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  formatter={(val: any) => [formatBRL(Number(val)), 'Faturamento']}
                  contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '12px' }}
                />
                <Bar dataKey="faturamento" fill="#C9A45C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real Package Distribution */}
        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <h3 className="text-base font-bold text-white mb-2">Pacotes Vendidos (Real)</h3>
          
          {packageSalesData.length > 0 ? (
            <>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={packageSalesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {packageSalesData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 text-xs">
                {packageSalesData.map((p, idx) => (
                  <div key={p.name} className="flex items-center justify-between text-white/80">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      {p.name}
                    </span>
                    <span className="font-bold text-white">{p.value} vendas</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="my-auto text-center py-8">
              <Info className="w-8 h-8 text-white/30 mx-auto mb-2" />
              <p className="text-xs text-white/60">Ainda não há vendas registradas.</p>
              <span className="text-[11px] text-white/40 block mt-1">
                Os pacotes mais comprados aparecerão aqui assim que os clientes concluírem os pedidos.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Quick Table */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
        <h3 className="text-base font-bold text-white mb-4">Últimos Pedidos Recebidos</h3>
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-white/80">
              <thead className="bg-white/5 text-white/50 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Código</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Pacote</th>
                  <th className="p-3">Valor</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition">
                    <td className="p-3 font-bold text-amber-400">#{ord.id}</td>
                    <td className="p-3 font-semibold text-white">{ord.customerName}</td>
                    <td className="p-3">{ord.packageName}</td>
                    <td className="p-3 font-bold text-emerald-400">{formatBRL(ord.totalAmount)}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3 text-white/50">{formatDateBR(ord.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white/5 text-center text-white/50 text-xs border border-dashed border-white/10">
            Nenhum pedido recebido ainda. Divulgue seu link do BioSite no Instagram, TikTok e WhatsApp para começar a faturar!
          </div>
        )}
      </div>
    </div>
  );
};
