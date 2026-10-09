import React, { useState } from 'react';
import {
  X,
  Barcode,
  Receipt,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Building
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount, Transaction } from '../../types';
import { formatCurrency } from '../../utils/security';
import { StorageManager } from '../../utils/storage';

interface BoletoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  onTransactionSuccess: (tx: Transaction) => void;
  onUpdateUser: (updated: Partial<UserAccount>) => void;
}

export const BoletoModal: React.FC<BoletoModalProps> = ({
  isOpen,
  onClose,
  user,
  onTransactionSuccess,
  onUpdateUser,
}) => {
  const [barcode, setBarcode] = useState('');
  const [beneficiary, setBeneficiary] = useState('Enel Distribuição São Paulo');
  const [amount, setAmount] = useState('184.50');
  const [dueDate, setDueDate] = useState('2026-10-15');
  const [category, setCategory] = useState<'moradia' | 'servicos' | 'outros'>('moradia');
  const [description, setDescription] = useState('Conta de Energia Elétrica');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  // Preset boletos for easy testing
  const presets = [
    {
      name: 'Enel Energia',
      code: '23793.38128 60007.827139 97000.063304 9 98710000018450',
      beneficiary: 'Enel Distribuição SP',
      val: '184.50',
      cat: 'moradia' as const,
      desc: 'Conta de Energia Elétrica',
    },
    {
      name: 'Vivo Fibra Internet',
      code: '34191.09008 61078.200192 48100.910283 1 98720000012990',
      beneficiary: 'Telefônica Brasil S.A. (Vivo)',
      val: '129.90',
      cat: 'servicos' as const,
      desc: 'Plano Vivo Fibra 500MB',
    },
    {
      name: 'Condomínio Residencial',
      code: '03399.01928 47102.839102 74819.019283 5 98730000062000',
      beneficiary: 'Administradora Predial Lello',
      val: '620.00',
      cat: 'moradia' as const,
      desc: 'Condomínio Edifício Amendoeiras',
    },
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setBarcode(p.code);
    setBeneficiary(p.beneficiary);
    setAmount(p.val);
    setCategory(p.cat);
    setDescription(p.desc);
    setError('');
  };

  const handlePayBoleto = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const val = parseFloat(amount.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      setError('Valor inválido.');
      return;
    }

    if (val > user.balance) {
      setError(`Saldo insuficiente para pagamento do boleto (${formatCurrency(user.balance)} disponível).`);
      return;
    }

    if (barcode.replace(/\D/g, '').length < 10) {
      setError('Por favor, informe uma linha digitável válida (ou selecione um boleto pré-definido).');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      // Deduct balance
      const newBal = user.balance - val;
      onUpdateUser({ balance: newBal });

      // Create transaction
      const newTx = StorageManager.addTransaction({
        type: 'boleto',
        title: `Pagamento Boleto - ${beneficiary}`,
        amount: val,
        category,
        counterpart: {
          name: beneficiary,
          bank: 'Câmara Interbancária de Pagamentos (CIP)',
        },
        status: 'completed',
        description: `${description} • Código: ${barcode.slice(0, 15)}...`,
      });

      // Confetti
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#b45309'],
        });
      } catch {}

      setIsProcessing(false);
      onTransactionSuccess(newTx);
      onClose();
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#190f08] border border-amber-800/40 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-amber-50">
        {/* Header */}
        <div className="p-5 border-b border-amber-900/40 flex items-center justify-between bg-[#21130a]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-amber-100">Pagamento de Boletos</h2>
              <p className="text-[11px] text-amber-300/60">
                Pague contas de consumo, tributos e boletos bancários
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber-900/40 text-amber-300"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick presets */}
          <div>
            <span className="text-[11px] text-amber-400/80 font-medium block mb-2">
              Boletos em Aberto no seu DDA Peanut:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {presets.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="p-2.5 rounded-xl bg-[#120a05] hover:bg-[#251308] border border-amber-900/40 text-left transition-colors"
                >
                  <span className="text-xs font-bold text-amber-200 block truncate">
                    {p.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {formatCurrency(parseFloat(p.val))}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handlePayBoleto} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-amber-200/80 mb-1">
                Linha Digitável / Código de Barras
              </label>
              <textarea
                rows={2}
                required
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="23793.38128 60007.827139 97000.063304 9 98710000018450"
                className="w-full px-3.5 py-2.5 bg-[#120a05] border border-amber-900/50 rounded-xl text-xs font-mono text-amber-100 placeholder:text-amber-700/50 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-amber-200/80 mb-1">
                  Beneficiário
                </label>
                <input
                  type="text"
                  required
                  value={beneficiary}
                  onChange={(e) => setBeneficiary(e.target.value)}
                  className="w-full px-3 py-2 bg-[#120a05] border border-amber-900/50 rounded-xl text-xs text-amber-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-amber-200/80 mb-1">
                  Valor a Pagar
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-[#120a05] border border-amber-900/50 rounded-xl text-xs font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="p-3 bg-[#120a05] rounded-xl border border-amber-900/30 flex items-center justify-between text-xs">
              <span className="text-amber-300/60">Saldo em Conta:</span>
              <span className="font-bold text-amber-100">{formatCurrency(user.balance)}</span>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#9a3412] to-[#d97706] hover:brightness-110 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isProcessing ? 'Processando Boleto...' : `Confirmar Pagamento (${formatCurrency(parseFloat(amount) || 0)})`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
