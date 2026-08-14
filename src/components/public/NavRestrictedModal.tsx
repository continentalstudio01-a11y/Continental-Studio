import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, KeyRound, ArrowRight, X, AlertCircle, ShieldCheck } from 'lucide-react';
import { NavItem } from '../../types';

interface NavRestrictedModalProps {
  item: NavItem;
  onClose: () => void;
  onSuccess: () => void;
}

export const NavRestrictedModal: React.FC<NavRestrictedModalProps> = ({
  item,
  onClose,
  onSuccess
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item.requiredPassword) {
      onSuccess();
      return;
    }

    if (passwordInput.trim().toLowerCase() === item.requiredPassword.trim().toLowerCase()) {
      setErrorMsg('');
      onSuccess();
    } else {
      setErrorMsg('Senha ou código VIP incorreto. Verifique e tente novamente.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={
          isShaking
            ? { x: [-10, 10, -10, 10, 0], opacity: 1, scale: 1, y: 0 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-[#121217] border border-amber-500/30 rounded-3xl p-6 relative shadow-2xl space-y-5"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30">
              Acesso Restrito VIP
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1">{item.label}</h3>
            <p className="text-xs text-white/60 mt-1">
              {item.restrictedMessage ||
                'Este link é exclusivo para clientes com senha ou código VIP. Digite abaixo para liberar o acesso:'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5">
              Senha ou Código VIP
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
              <input
                type="password"
                required
                autoFocus
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Digite a senha VIP..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-sm font-medium focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition"
              />
            </div>
          </div>

          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 font-bold text-xs cursor-pointer transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Liberar Acesso</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
