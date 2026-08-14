import React, { useState } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { Lock, Mail, Key, Sparkles, ArrowRight, Shield, ArrowLeft } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, toggleAdminMode } = useBioSite();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(email, password);
    if (!success) {
      setErrorMsg('E-mail ou senha incorretos. Use as credenciais de demonstração abaixo.');
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@continentalstudio.com');
    setPassword('admin123');
    loginAdmin('admin@continentalstudio.com', 'admin123');
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-sky-500" />

        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          <p className="text-xs text-white/60 mt-1">
            Continental Studio BioSite CMS
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">E-mail do Administrador</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@continentalstudio.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 focus:border-amber-400 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-1">Senha</label>
            <div className="relative">
              <Key className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 focus:border-amber-400 focus:outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl mt-2"
          >
            <span>Acessar Painel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
          <span className="text-[11px] text-amber-400 font-bold block flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Acesso Rápido de Teste (Demo)
          </span>
          <button
            onClick={handleDemoFill}
            className="w-full py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition cursor-pointer"
          >
            Entrar como Administrador com 1 Clique
          </button>

          <button
            onClick={() => toggleAdminMode(false)}
            className="w-full py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao BioSite Público</span>
          </button>
        </div>
      </div>
    </div>
  );
};
