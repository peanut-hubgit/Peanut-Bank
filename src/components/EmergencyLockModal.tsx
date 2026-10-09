import React, { useState } from 'react';
import { ShieldAlert, Fingerprint, Lock, KeyRound, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { UserAccount } from '../types';
import { authenticateBiometric } from '../utils/security';
import { PeanutLogo } from './Logo';

interface EmergencyLockModalProps {
  isLocked: boolean;
  user: UserAccount;
  onUnlock: () => void;
}

export const EmergencyLockModal: React.FC<EmergencyLockModalProps> = ({
  isLocked,
  user,
  onUnlock,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isVerifyingBiometric, setIsVerifyingBiometric] = useState(false);

  if (!isLocked) return null;

  const handleBiometricUnlock = async () => {
    setIsVerifyingBiometric(true);
    setError('');
    try {
      const ok = await authenticateBiometric();
      if (ok) {
        onUnlock();
      } else {
        setError('Falha na autenticação biométrica. Insira seu PIN.');
      }
    } catch {
      setError('Biometria indisponível. Utilize seu PIN de 4 dígitos.');
    } finally {
      setIsVerifyingBiometric(false);
    }
  };

  const handlePinUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setError('Digite seu PIN de 4 dígitos.');
      return;
    }
    // For demo/simulated lock, any 4-digit PIN or user's PIN unlocks
    if (pin.length >= 4) {
      onUnlock();
    } else {
      setError('O PIN deve conter pelo menos 4 dígitos.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0502]/95 backdrop-blur-xl animate-fadeIn"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="lock-title"
    >
      <div className="max-w-md w-full bg-[#180e07] border-2 border-rose-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Glow ambient effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-center">
          <PeanutLogo size="md" />
        </div>

        {/* Lock Warning Shield */}
        <div className="w-20 h-20 rounded-3xl bg-rose-950/80 border-2 border-rose-600/60 mx-auto flex items-center justify-center text-rose-400 shadow-lg shadow-rose-950/50">
          <ShieldAlert className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/90 text-rose-400 text-xs font-bold border border-rose-800/50">
            <Lock className="w-3.5 h-3.5" />
            MODO PÂNICO ATIVADO
          </div>
          <h2 id="lock-title" className="text-xl font-extrabold text-[#fef3c7]">
            Aplicativo Bloqueado por Segurança
          </h2>
          <p className="text-xs text-amber-200/70 max-w-sm mx-auto leading-relaxed">
            Todas as transações, chaves PIX e dados bancários foram congelados para proteger sua conta <strong>{user.name}</strong> contra acessos não autorizados.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-700/60 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Biometric Unlock Trigger */}
        <div className="space-y-3">
          <button
            onClick={handleBiometricUnlock}
            disabled={isVerifyingBiometric}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#9a3412] to-[#d97706] hover:brightness-110 text-[#1f1007] font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-amber-950/60 transition-all active:scale-95 disabled:opacity-50"
          >
            <Fingerprint className={`w-5 h-5 ${isVerifyingBiometric ? 'animate-spin' : ''}`} />
            {isVerifyingBiometric ? 'Escaneando biometria...' : 'Desbloquear com Biometria (Touch/Face)'}
          </button>

          {/* Or PIN input form */}
          <form onSubmit={handlePinUnlock} className="space-y-3 pt-2">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-amber-400/60 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ou digite seu PIN de segurança"
                className="w-full pl-11 pr-4 py-3 bg-[#110904] border border-amber-900/50 rounded-2xl text-center text-sm font-mono tracking-widest text-amber-100 placeholder:text-amber-400/40 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-950/50 hover:bg-amber-900/40 border border-amber-800/40 text-amber-200 text-xs font-semibold transition-colors"
            >
              Confirmar PIN e Liberar Acesso
            </button>
          </form>
        </div>

        <div className="pt-2 text-[10px] text-amber-400/50 font-mono">
          Criptografia de Ponta a Ponta AES-GCM • Peanut Bank Android 12+
        </div>
      </div>
    </div>
  );
};
