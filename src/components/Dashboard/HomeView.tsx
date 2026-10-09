import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  ArrowUpRight,
  Barcode,
  TrendingUp,
  ShieldAlert,
  CreditCard,
  Copy,
  Check,
  Sparkles,
  Lightbulb,
  ChevronRight,
  ArrowDownLeft,
  PieChart,
  Cpu,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { UserAccount, Transaction, AppSettings } from '../../types';
import { formatCurrency } from '../../utils/security';
import { StorageManager } from '../../utils/storage';

interface HomeViewProps {
  user: UserAccount;
  settings: AppSettings;
  transactions: Transaction[];
  onOpenPix: () => void;
  onOpenBoleto: () => void;
  onOpenInvestments: () => void;
  onOpenStatement: () => void;
  onOpenPAFB: () => void;
  onEmergencyLock: () => void;
  onSelectTransaction: (tx: Transaction) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  settings,
  transactions,
  onOpenPix,
  onOpenBoleto,
  onOpenInvestments,
  onOpenStatement,
  onOpenPAFB,
  onEmergencyLock,
  onSelectTransaction,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [copiedAcc, setCopiedAcc] = useState(false);

  // Compute monthly figures
  let totalMonthIncome = 0;
  let totalMonthExpense = 0;
  transactions.forEach((tx) => {
    if (tx.type === 'pix_received' || tx.type === 'admin_credit' || tx.type === 'cashback') {
      totalMonthIncome += tx.amount;
    } else {
      totalMonthExpense += tx.amount;
    }
  });

  const suggestions = StorageManager.generateSuggestions(transactions);
  const recentTransactions = transactions.slice(0, 4);

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(`Peanut Bank - Ag: ${user.agency} C/C: ${user.accountNumber} - ${user.name}`);
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  const isUserOne = user.id === 1;

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Account Card - Peanut Black Edition */}
      <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#301a0d] via-[#1c1008] to-[#45220f] border border-amber-800/40 shadow-2xl text-amber-50 overflow-hidden">
        {/* Subtle Decorative Golden Glow Circles */}
        <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-[#9a3412]/15 blur-3xl pointer-events-none" />

        {/* Top Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-300/80 uppercase tracking-wider">
              Saldo em Conta
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-amber-400/80 hover:text-amber-200 p-1"
              title={showBalance ? 'Ocultar saldo' : 'Exibir saldo'}
              aria-label={showBalance ? 'Ocultar saldo' : 'Exibir saldo'}
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={handleCopyAccount}
            className="flex items-center gap-1.5 text-[11px] font-mono text-amber-300/70 hover:text-amber-200 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/40 transition-colors"
            title="Copiar dados da conta"
          >
            {copiedAcc ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Ag {user.agency} • C/C {user.accountNumber}</span>
              </>
            )}
          </button>
        </div>

        {/* Balance Display */}
        <div className="mt-2 mb-4">
          <div className="text-3xl sm:text-4xl font-extrabold text-[#fef3c7] tracking-tight font-sans">
            {showBalance ? formatCurrency(user.balance) : 'R$ •••••••'}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-amber-300/70">Rendimento diário 115% CDI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">+R$ 4,82 hoje</span>
          </div>
        </div>

        {/* Credit Card Mini Chip & Virtual Card Status */}
        <div className="pt-4 border-t border-amber-900/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-5 rounded bg-gradient-to-tr from-amber-400 to-amber-600 shadow-sm flex items-center justify-center p-0.5">
              <div className="w-full h-full border border-amber-950/30 rounded-xs" />
            </div>
            <div>
              <span className="font-mono text-amber-200 block text-[11px]">Cartão Peanut Metal •••• 4892</span>
              <span className="text-[10px] text-amber-400/60">Limite: {formatCurrency(user.creditLimit - user.creditUsed)} disponível</span>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-400 text-[10px] font-bold border border-amber-800/50">
            Virtual Ativo
          </span>
        </div>
      </div>

      {/* Quick Banking Actions Row (Material Design 3 rounded pills/buttons) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Ações Rápidas
          </span>
          <span className="text-[11px] text-amber-300/50">Segurança Criptografada</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
          {/* PIX */}
          <button
            onClick={onOpenPix}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1c1109] hover:bg-[#28170c] border border-amber-800/40 text-amber-100 transition-all shadow-sm active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9a3412] to-[#b45309] flex items-center justify-center text-amber-100 mb-1.5 shadow-md group-hover:scale-105 transition-transform">
              <ArrowUpRight className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-amber-100">Área PIX</span>
          </button>

          {/* Pagar Boleto */}
          <button
            onClick={onOpenBoleto}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1c1109] hover:bg-[#28170c] border border-amber-800/40 text-amber-100 transition-all shadow-sm active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9a3412] to-[#b45309] flex items-center justify-center text-amber-100 mb-1.5 shadow-md group-hover:scale-105 transition-transform">
              <Barcode className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-amber-100">Boletos</span>
          </button>

          {/* Investimentos */}
          <button
            onClick={onOpenInvestments}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#1c1109] hover:bg-[#28170c] border border-amber-800/40 text-amber-100 transition-all shadow-sm active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9a3412] to-[#b45309] flex items-center justify-center text-amber-100 mb-1.5 shadow-md group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-amber-100">Investir</span>
          </button>

          {/* Bloqueio Rápido de Emergência */}
          <button
            onClick={onEmergencyLock}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-800/40 text-rose-200 transition-all shadow-sm active:scale-95 group"
            title="Bloquear imediatamente o app em caso de emergência"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-800 to-rose-950 flex items-center justify-center text-rose-300 mb-1.5 shadow-md group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-rose-300">Bloqueio</span>
          </button>

          {/* PAFB - Exclusive for User #1 */}
          {isUserOne && (
            <button
              onClick={onOpenPAFB}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-950/40 hover:bg-amber-900/40 border border-amber-600/50 text-amber-300 transition-all shadow-sm active:scale-95 group col-span-4 sm:col-span-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-amber-100 mb-1.5 shadow-md group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <span className="text-xs font-bold text-amber-300">PAFB Beta</span>
            </button>
          )}
        </div>
      </div>

      {/* Monthly Summary Widget (Resumo Intuitivo das Movimentações Mensais) */}
      <div className="p-5 rounded-3xl bg-[#180e07] border border-amber-900/40 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Resumo Mensal • Outubro 2026
            </h3>
            <p className="text-[11px] text-amber-300/60">Categorização automática por Inteligência de Dados</p>
          </div>
          <button
            onClick={onOpenStatement}
            className="flex items-center gap-1 text-xs text-amber-400 font-bold hover:underline"
          >
            Ver Extrato <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-[#120a05] border border-emerald-950">
            <span className="text-[10px] text-emerald-400/80 font-semibold block uppercase">
              Entradas Totais
            </span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              +{formatCurrency(totalMonthIncome)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#120a05] border border-rose-950">
            <span className="text-[10px] text-rose-400/80 font-semibold block uppercase">
              Saídas & Pagamentos
            </span>
            <span className="text-lg font-black text-rose-400 font-mono">
              -{formatCurrency(totalMonthExpense)}
            </span>
          </div>
        </div>
      </div>

      {/* Peanut Advisor: Sugestões Personalizadas de Economia */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Sugestões de Economia
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-800/40">
            Economia Potencial: +R$ 378/mês
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {suggestions.slice(0, 2).map((sug) => (
            <div
              key={sug.id}
              className="p-4 rounded-2xl bg-[#180e07] border border-amber-900/40 flex items-center justify-between gap-3 hover:border-amber-700/40 transition-colors"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-amber-100 block">{sug.title}</span>
                <p className="text-xs text-amber-200/70 leading-snug">{sug.description}</p>
              </div>
              <button
                onClick={onOpenInvestments}
                className="shrink-0 py-2 px-3 rounded-xl bg-amber-900/40 hover:bg-amber-900/70 border border-amber-800/40 text-amber-200 text-xs font-bold transition-colors"
              >
                {sug.actionText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Movements List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Últimas Movimentações
          </span>
          <button
            onClick={onOpenStatement}
            className="text-xs text-amber-400 font-bold hover:underline"
          >
            Ver todas ({transactions.length})
          </button>
        </div>

        <div className="bg-[#180e07] border border-amber-900/40 rounded-2xl divide-y divide-amber-950 overflow-hidden">
          {recentTransactions.map((t) => {
            const isCredit = t.type === 'pix_received' || t.type === 'admin_credit' || t.type === 'cashback';
            return (
              <button
                key={t.id}
                onClick={() => onSelectTransaction(t)}
                className="w-full p-4 flex items-center justify-between hover:bg-amber-950/20 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isCredit
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                        : 'bg-amber-950 text-amber-400 border border-amber-900/40'
                    }`}
                  >
                    {isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-100 block">{t.title}</span>
                    <span className="text-[11px] text-amber-300/60 font-mono capitalize">
                      {new Date(t.date).toLocaleDateString('pt-BR')} • {t.category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-bold font-mono block ${
                      isCredit ? 'text-emerald-400' : 'text-amber-100'
                    }`}
                  >
                    {isCredit ? '+' : '-'} {formatCurrency(t.amount)}
                  </span>
                  <span className="text-[10px] text-amber-400/50 font-mono">Comprovante</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Android 12+ APK Security Seal */}
      <div className="p-4 rounded-2xl bg-[#120a05] border border-amber-900/30 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-700/30 flex items-center justify-center text-amber-400 shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div>
          <span className="text-xs font-bold text-amber-200 block">
            Peanut Bank APK Security Engine (Android 12+)
          </span>
          <p className="text-[11px] text-amber-300/60 leading-snug">
            Proteção de hardware Knox / StrongBox, isolamento biométrico local e conformidade estrita com o Banco Central.
          </p>
        </div>
      </div>
    </div>
  );
};
