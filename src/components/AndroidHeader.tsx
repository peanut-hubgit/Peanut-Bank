import React, { useState, useEffect } from 'react';
import {
  Wifi,
  BatteryCharging,
  ShieldAlert,
  Bell,
  Cpu,
  LogOut,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { UserAccount, AppSettings } from '../types';

interface AndroidHeaderProps {
  user: UserAccount;
  settings: AppSettings;
  onOpenPAFB: () => void;
  onEmergencyLock: () => void;
  onOpenNotifications: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  user,
  settings,
  onOpenPAFB,
  onEmergencyLock,
  onOpenNotifications,
  onLogout,
  onOpenSettings,
}) => {
  const [time, setTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const isUserOne = user.id === 1;

  return (
    <header className="w-full bg-[#170e09]/95 backdrop-blur-md sticky top-0 z-30 border-b border-amber-900/20">
      {/* Android 12+ Top System Bar */}
      <div className="flex items-center justify-between px-4 py-1 text-[11px] font-mono text-amber-200/60 select-none">
        <span className="font-semibold text-amber-100">{time}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-amber-950/60 text-amber-400/90 px-1.5 py-0.5 rounded border border-amber-800/40 font-sans">
            Android 12+ Secure
          </span>
          <Wifi className="w-3.5 h-3.5 text-amber-300/80" />
          <span className="text-[10px]">5G</span>
          <div className="flex items-center gap-0.5 text-emerald-400">
            <BatteryCharging className="w-3.5 h-3.5" />
            <span>98%</span>
          </div>
        </div>
      </div>

      {/* Peanut Bank Top App Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* User Info & Switch */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9a3412] to-[#f59e0b] p-[2px] flex items-center justify-center text-white font-bold shadow-md hover:scale-105 transition-transform"
            title="Abrir configurações de perfil"
            aria-label="Configurações do usuário"
          >
            <div className="w-full h-full rounded-full bg-[#27150b] flex items-center justify-center text-sm font-semibold text-amber-100">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-amber-300/70 font-medium">Conta Corrente</span>
              <span className="text-[10px] text-amber-400/60 font-mono">Ag. {user.agency} • C/C {user.accountNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#fef3c7] leading-tight">
                Olá, {user.name.split(' ')[0]}
              </h1>
              {isUserOne && (
                <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  ADM #1
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1.5">
          {/* PAFB Button - ONLY FOR USER #1 */}
          {isUserOne && (
            <button
              onClick={onOpenPAFB}
              className="relative p-2 rounded-xl bg-amber-950/80 hover:bg-amber-900/60 border border-amber-600/40 text-amber-300 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              title="Painel de Administração de Funções Beta (PAFB)"
              aria-label="Abrir Painel PAFB"
            >
              <Cpu className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="text-xs font-bold hidden sm:inline text-amber-300">PAFB</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1 animate-ping" />
            </button>
          )}

          {/* Quick Emergency Lockdown Button */}
          <button
            onClick={onEmergencyLock}
            className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-700/50 text-rose-300 flex items-center justify-center transition-colors shadow-sm active:scale-95"
            title="Bloqueio Rápido de Emergência (Pânico)"
            aria-label="Bloquear acesso imediatamente"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-xl bg-[#24150c] hover:bg-[#341e12] border border-amber-900/30 text-amber-200 relative transition-colors active:scale-95"
            title="Notificações"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4 text-amber-200" />
            {settings.notificationsEnabled && (
              <span className="w-2 h-2 bg-amber-500 rounded-full absolute top-1.5 right-1.5" />
            )}
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-[#24150c] hover:bg-[#341e12] border border-amber-900/30 text-amber-400 transition-colors active:scale-95"
            title="Desconectar"
            aria-label="Sair da conta"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
