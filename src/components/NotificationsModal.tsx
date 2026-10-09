import React from 'react';
import { X, Bell, CheckCircle2, ShieldCheck, ArrowDownLeft, TrendingUp } from 'lucide-react';
import { AppSettings } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: 'PIX Recebido no Valor de R$ 8.500,00',
      time: 'Ontem às 09:30',
      desc: 'Tech Solutions LTDA enviou uma transferência instantânea para sua conta.',
      icon: ArrowDownLeft,
      color: 'text-emerald-400 bg-emerald-950/60',
    },
    {
      id: 'n2',
      title: 'Rendimento Creditado: CDB Peanut 115% CDI',
      time: 'Hoje às 06:00',
      desc: 'Sua aplicação rendeu +R$ 4,82 nas últimas 24 horas.',
      icon: TrendingUp,
      color: 'text-amber-400 bg-amber-950/60',
    },
    {
      id: 'n3',
      title: 'Autenticação Biométrica Android 12+ Registrada',
      time: 'Hoje às 08:00',
      desc: 'Seu cofre de segurança local está ativo e protegido por criptografia ponta a ponta.',
      icon: ShieldCheck,
      color: 'text-blue-400 bg-blue-950/60',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#190f08] border border-amber-800/40 rounded-3xl max-w-md w-full p-6 shadow-2xl text-amber-50 space-y-4">
        <div className="flex items-center justify-between border-b border-amber-900/30 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-amber-100">Notificações em Tempo Real</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-amber-900/40 text-amber-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto no-scrollbar">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div key={n.id} className="p-3.5 bg-[#120a05] rounded-2xl border border-amber-900/40 flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-100">{n.title}</h4>
                  <p className="text-[11px] text-amber-300/70 mt-0.5 leading-snug">{n.desc}</p>
                  <span className="text-[10px] text-amber-400/50 font-mono mt-1 block">{n.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-950/60 hover:bg-amber-900/40 border border-amber-800/40 text-amber-200 text-xs font-semibold"
          >
            Marcar todas como lidas
          </button>
        </div>
      </div>
    </div>
  );
};
