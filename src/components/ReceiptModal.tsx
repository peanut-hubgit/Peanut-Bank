import React from 'react';
import { X, CheckCircle2, Share2, Download, Printer, ShieldCheck } from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency } from '../utils/security';
import { PeanutLogo } from './Logo';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Comprovante Peanut Bank - ${transaction.receiptCode}`,
          text: `Comprovante de pagamento de ${formatCurrency(transaction.amount)} via Peanut Bank. Autenticação: ${transaction.receiptCode}`,
        });
      } catch {
        // Fallback copy
        navigator.clipboard.writeText(`Peanut Bank - Comprovante ${transaction.receiptCode} - ${formatCurrency(transaction.amount)}`);
      }
    } else {
      navigator.clipboard.writeText(`Peanut Bank - Comprovante ${transaction.receiptCode} - ${formatCurrency(transaction.amount)}`);
      alert('Código do comprovante copiado para a área de transferência!');
    }
  };

  const formattedDate = new Date(transaction.date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="receipt-title"
    >
      <div className="bg-[#1c120a] border border-amber-800/40 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative text-amber-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3e1f0e] to-[#251307] p-6 pb-4 border-b border-amber-900/30 flex items-center justify-between">
          <PeanutLogo size="sm" />
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber-900/40 text-amber-300 transition-colors"
            aria-label="Fechar comprovante"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Status Badge */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-600/50 flex items-center justify-center text-emerald-400 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">
              Transação Concluída com Sucesso
            </span>
            <div className="text-3xl font-extrabold text-[#fef3c7] tracking-tight">
              {formatCurrency(transaction.amount)}
            </div>
            <p className="text-xs text-amber-200/70 max-w-xs">
              {transaction.title}
            </p>
          </div>

          {/* Details Table */}
          <div className="bg-[#140b06] border border-amber-900/40 rounded-2xl p-4 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-amber-950">
              <span className="text-amber-300/60">Data e Horário</span>
              <span className="font-mono text-amber-100 text-right">{formattedDate}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-amber-950">
              <span className="text-amber-300/60">Tipo de Operação</span>
              <span className="font-medium text-amber-100 uppercase">{transaction.type.replace('_', ' ')}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-amber-950">
              <span className="text-amber-300/60">Categoria Automática</span>
              <span className="font-medium text-amber-300 capitalize">{transaction.category}</span>
            </div>

            {transaction.counterpart && (
              <>
                <div className="flex justify-between py-1 border-b border-amber-950">
                  <span className="text-amber-300/60">Destinatário / Pagador</span>
                  <span className="font-medium text-amber-100 text-right">{transaction.counterpart.name}</span>
                </div>
                {transaction.counterpart.bank && (
                  <div className="flex justify-between py-1 border-b border-amber-950">
                    <span className="text-amber-300/60">Instituição</span>
                    <span className="text-amber-100">{transaction.counterpart.bank}</span>
                  </div>
                )}
                {transaction.counterpart.key && (
                  <div className="flex justify-between py-1 border-b border-amber-950">
                    <span className="text-amber-300/60">Chave PIX / Doc</span>
                    <span className="font-mono text-amber-200">{transaction.counterpart.key}</span>
                  </div>
                )}
              </>
            )}

            {transaction.description && (
              <div className="flex justify-between py-1 border-b border-amber-950">
                <span className="text-amber-300/60">Descrição</span>
                <span className="text-amber-200 text-right max-w-[200px] truncate">{transaction.description}</span>
              </div>
            )}

            <div className="flex justify-between py-1">
              <span className="text-amber-300/60">Código de Autenticação</span>
              <span className="font-mono text-amber-400 font-semibold">{transaction.receiptCode}</span>
            </div>
          </div>

          {/* Security Hash Stamp */}
          <div className="p-3 bg-amber-950/40 rounded-xl border border-amber-800/30 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-[11px] text-amber-200/80 leading-snug">
              Autenticado pelo Banco Central do Brasil sob protocolo SPI criptografado SHA-256 Peanut Bank Vault.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleShare}
              className="flex-1 py-3 px-4 rounded-xl bg-amber-900/40 hover:bg-amber-900/70 border border-amber-700/40 text-amber-200 font-medium text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#b45309] to-[#d97706] hover:brightness-110 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Imprimir / PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
