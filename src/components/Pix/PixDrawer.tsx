import React, { useState } from 'react';
import {
  X,
  Send,
  QrCode,
  Copy,
  Check,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Smartphone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserAccount, Transaction, AppSettings } from '../../types';
import { formatCurrency, formatCPF } from '../../utils/security';
import { StorageManager } from '../../utils/storage';

interface PixDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  settings: AppSettings;
  onTransactionSuccess: (tx: Transaction) => void;
  onUpdateUser: (updated: Partial<UserAccount>) => void;
}

export const PixDrawer: React.FC<PixDrawerProps> = ({
  isOpen,
  onClose,
  user,
  settings,
  onTransactionSuccess,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'send' | 'receive' | 'copy_paste'>('send');

  // Send state
  const [keyType, setKeyType] = useState<'cpf' | 'email' | 'phone' | 'random'>('cpf');
  const [pixKey, setPixKey] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [destName, setDestName] = useState('Mariana Alves de Oliveira');
  const [destBank, setDestBank] = useState('260 - Nubank');
  const [step, setStep] = useState<'input' | 'confirm'>('input');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Receive state
  const [receiveAmount, setReceiveAmount] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  // Validate Limits
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 20 || currentHour < 6;
  const currentLimit = isNight ? settings.pixNightLimit : settings.pixDayLimit;

  const handleNextToSendConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const val = parseFloat(amount.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      setError('Informe um valor válido maior que zero.');
      return;
    }

    if (val > user.balance) {
      setError(`Saldo insuficiente. Seu saldo disponível é ${formatCurrency(user.balance)}.`);
      return;
    }

    if (val > currentLimit) {
      setError(`O valor excede seu limite de segurança ${isNight ? 'noturno' : 'diurno'} (${formatCurrency(currentLimit)}). Altere nos Ajustes se necessário.`);
      return;
    }

    if (!pixKey.trim()) {
      setError('Informe a chave PIX de destino.');
      return;
    }

    setStep('confirm');
  };

  const handleExecutePix = () => {
    setIsProcessing(true);
    setError('');

    const val = parseFloat(amount.replace(',', '.'));

    setTimeout(() => {
      // Deduct balance
      const newBal = user.balance - val;
      onUpdateUser({ balance: newBal });

      // Create transaction
      const newTx = StorageManager.addTransaction({
        type: 'pix_sent',
        title: `PIX Enviado - ${destName}`,
        amount: val,
        category: 'transferencia',
        counterpart: {
          name: destName,
          key: pixKey,
          keyType,
          bank: destBank,
        },
        status: 'completed',
        description: description || 'Transferência instantânea PIX',
      });

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#b45309', '#fef3c7'],
        });
      } catch {
        // Safe fallback
      }

      setIsProcessing(false);
      onTransactionSuccess(newTx);
      setStep('input');
      setAmount('');
      setPixKey('');
      setDescription('');
      onClose();
    }, 800);
  };

  // Receive QR payload mock
  const receiveValNumber = parseFloat(receiveAmount.replace(',', '.')) || 0;
  const simulatedPixPayload = `00020126580014br.gov.bcb.pix0136${user.cpf.replace(/\D/g, '')}520400005303986540${receiveValNumber > 0 ? receiveValNumber.toFixed(2) : '0.00'}5802BR5920${user.name.slice(0, 20)}6009SAO PAULO62070503***6304PEANUT`;

  const handleCopyPixPayload = () => {
    navigator.clipboard.writeText(simulatedPixPayload);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#190f08] border border-amber-800/40 rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-amber-50">
        {/* Top Header */}
        <div className="p-5 border-b border-amber-900/40 flex items-center justify-between bg-[#21130a]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-amber-100">Área PIX Peanut</h2>
              <p className="text-[11px] text-amber-300/60">
                Transferências instantâneas 24h sem tarifas
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

        {/* Tab Switcher */}
        <div className="p-3 bg-[#130b06] border-b border-amber-950 flex gap-2">
          <button
            onClick={() => { setActiveTab('send'); setStep('input'); }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'send'
                ? 'bg-gradient-to-r from-[#9a3412] to-[#b45309] text-amber-50'
                : 'text-amber-300/60 hover:text-amber-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            Transferir PIX
          </button>

          <button
            onClick={() => setActiveTab('receive')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'receive'
                ? 'bg-gradient-to-r from-[#9a3412] to-[#b45309] text-amber-50'
                : 'text-amber-300/60 hover:text-amber-200'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            Receber PIX
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* SEND TAB - STEP 1 INPUT */}
          {activeTab === 'send' && step === 'input' && (
            <form onSubmit={handleNextToSendConfirm} className="space-y-4">
              {/* Saldo Disponível Card */}
              <div className="p-3.5 rounded-2xl bg-[#120a05] border border-amber-900/40 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-amber-300/60">Saldo em Conta</span>
                  <div className="text-base font-bold text-amber-100">
                    {formatCurrency(user.balance)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-amber-400/60">
                    Limite {isNight ? 'Noturno' : 'Diurno'}
                  </span>
                  <div className="text-xs font-semibold text-amber-300">
                    {formatCurrency(currentLimit)}
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-semibold text-amber-200/80 mb-1">
                  Qual valor você deseja transferir?
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-amber-400">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-12 pr-4 py-3 bg-[#120a05] border border-amber-900/50 rounded-2xl text-xl font-bold text-amber-100 placeholder:text-amber-700/50 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Key Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-amber-200/80 mb-1.5">
                  Tipo de Chave PIX
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['cpf', 'email', 'phone', 'random'] as const).map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setKeyType(k)}
                      className={`py-2 rounded-xl text-xs font-medium capitalize border transition-colors ${
                        keyType === k
                          ? 'bg-amber-800/40 border-amber-500 text-amber-200 font-bold'
                          : 'bg-[#120a05] border-amber-900/30 text-amber-300/60'
                      }`}
                    >
                      {k === 'random' ? 'Aleatória' : k.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pix Key Input */}
              <div>
                <label className="block text-xs font-semibold text-amber-200/80 mb-1">
                  Digite a Chave PIX
                </label>
                <input
                  type="text"
                  required
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                  placeholder={
                    keyType === 'cpf'
                      ? '000.000.000-00'
                      : keyType === 'email'
                      ? 'chave@email.com'
                      : keyType === 'phone'
                      ? '(11) 98888-7777'
                      : 'chave-evp-aleatoria'
                  }
                  className="w-full px-4 py-2.5 bg-[#120a05] border border-amber-900/50 rounded-xl text-xs text-amber-100 placeholder:text-amber-700/50 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-amber-200/80 mb-1">
                  Mensagem ou Descrição (Opcional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Almoço de domingo, Pagamento serviço"
                  className="w-full px-4 py-2 bg-[#120a05] border border-amber-900/50 rounded-xl text-xs text-amber-100 placeholder:text-amber-700/50 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#9a3412] to-[#d97706] hover:brightness-110 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                Continuar para Confirmação
              </button>
            </form>
          )}

          {/* SEND TAB - STEP 2 CONFIRM */}
          {activeTab === 'send' && step === 'confirm' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#120a05] border border-amber-800/40 rounded-2xl space-y-3">
                <span className="text-[11px] text-amber-400/70 font-semibold uppercase tracking-wider">
                  Revisão da Transferência
                </span>

                <div className="text-2xl font-black text-amber-100">
                  {formatCurrency(parseFloat(amount.replace(',', '.')) || 0)}
                </div>

                <div className="space-y-2 pt-2 border-t border-amber-900/30 text-xs">
                  <div className="flex justify-between">
                    <span className="text-amber-300/60">Para</span>
                    <span className="font-semibold text-amber-100">{destName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300/60">Instituição</span>
                    <span className="text-amber-200">{destBank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-300/60">Chave PIX</span>
                    <span className="font-mono text-amber-200">{pixKey}</span>
                  </div>
                  {description && (
                    <div className="flex justify-between">
                      <span className="text-amber-300/60">Descrição</span>
                      <span className="text-amber-200">{description}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-amber-300/60">Tarifa Peanut Bank</span>
                    <span className="text-emerald-400 font-semibold">R$ 0,00 (Gratuito)</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-800/30 flex items-center gap-2 text-xs text-amber-200/80">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>O valor será debitado imediatamente e transferido com confirmação do Banco Central.</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-950/60 hover:bg-amber-900/40 border border-amber-800/40 text-amber-200 text-xs font-semibold"
                >
                  Voltar e Editar
                </button>
                <button
                  type="button"
                  onClick={handleExecutePix}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#9a3412] to-[#d97706] hover:brightness-110 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                >
                  {isProcessing ? 'Enviando...' : 'Confirmar e Transferir'}
                </button>
              </div>
            </div>
          )}

          {/* RECEIVE TAB */}
          {activeTab === 'receive' && (
            <div className="space-y-4 text-center">
              <div>
                <label className="block text-xs font-medium text-amber-200/80 mb-1 text-left">
                  Definir valor a receber (opcional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={receiveAmount}
                  onChange={(e) => setReceiveAmount(e.target.value)}
                  placeholder="R$ 0,00 (Valor aberto)"
                  className="w-full px-4 py-2 bg-[#120a05] border border-amber-900/50 rounded-xl text-xs text-amber-100 placeholder:text-amber-700/50 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* QR Code Container */}
              <div className="p-5 bg-white rounded-3xl inline-block mx-auto shadow-xl">
                <svg
                  viewBox="0 0 140 140"
                  className="w-40 h-40 text-amber-950"
                  fill="currentColor"
                >
                  {/* Generated Stylized QR matrix representation */}
                  <rect x="0" y="0" width="35" height="35" rx="4" />
                  <rect x="5" y="5" width="25" height="25" fill="white" />
                  <rect x="10" y="10" width="15" height="15" fill="black" />

                  <rect x="105" y="0" width="35" height="35" rx="4" />
                  <rect x="110" y="5" width="25" height="25" fill="white" />
                  <rect x="115" y="10" width="15" height="15" fill="black" />

                  <rect x="0" y="105" width="35" height="35" rx="4" />
                  <rect x="5" y="110" width="25" height="25" fill="white" />
                  <rect x="10" y="115" width="15" height="15" fill="black" />

                  {/* QR Data Dots */}
                  <rect x="45" y="15" width="10" height="10" />
                  <rect x="65" y="15" width="10" height="10" />
                  <rect x="85" y="25" width="10" height="10" />
                  <rect x="45" y="45" width="20" height="10" />
                  <rect x="75" y="45" width="10" height="20" />
                  <rect x="95" y="45" width="10" height="10" />
                  <rect x="15" y="55" width="15" height="10" />
                  <rect x="45" y="65" width="10" height="25" />
                  <rect x="65" y="75" width="25" height="10" />
                  <rect x="105" y="65" width="25" height="10" />
                  <rect x="45" y="105" width="15" height="10" />
                  <rect x="70" y="105" width="10" height="25" />
                  <rect x="90" y="105" width="25" height="10" />
                  <rect x="120" y="95" width="10" height="15" />
                </svg>
              </div>

              <div>
                <p className="text-xs font-bold text-amber-100">
                  {user.name}
                </p>
                <p className="text-[11px] text-amber-300/60 font-mono">
                  Chave CPF: {user.cpf} • Peanut Bank (392)
                </p>
                {receiveValNumber > 0 && (
                  <p className="text-sm font-extrabold text-amber-400 mt-1">
                    Cobrança: {formatCurrency(receiveValNumber)}
                  </p>
                )}
              </div>

              {/* Copia e Cola Payload */}
              <div className="p-3 bg-[#120a05] rounded-xl border border-amber-900/40 text-left">
                <span className="text-[10px] text-amber-400/60 font-mono block mb-1">
                  Código Pix Copia e Cola
                </span>
                <p className="text-[11px] font-mono text-amber-200/80 truncate">
                  {simulatedPixPayload}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyPixPayload}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#9a3412] to-[#d97706] hover:brightness-110 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-950" />
                    Código Copiado com Sucesso!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar Código Pix Copia e Cola
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
