import React, { useState } from 'react';
import {
  TrendingUp,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserAccount, CryptoAsset, InvestmentHolding, Transaction } from '../../types';
import { formatCurrency } from '../../utils/security';
import { StorageManager } from '../../utils/storage';

interface InvestmentsModalProps {
  user: UserAccount;
  onUpdateUser: (updated: Partial<UserAccount>) => void;
  onTransactionSuccess: (tx: Transaction) => void;
}

export const InvestmentsModal: React.FC<InvestmentsModalProps> = ({
  user,
  onUpdateUser,
  onTransactionSuccess,
}) => {
  const [cryptos, setCryptos] = useState<CryptoAsset[]>(() => StorageManager.getCryptos());
  const [holdings, setHoldings] = useState<InvestmentHolding[]>(() => StorageManager.getHoldings());

  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [selectedAsset, setSelectedAsset] = useState<{
    id: string;
    name: string;
    type: 'fixed' | 'crypto';
    price: number;
  }>({
    id: 'cdb_peanut',
    name: 'CDB Peanut Liquidez Diária 115% CDI',
    type: 'fixed',
    price: 1.00,
  });

  const [tradeAmount, setTradeAmount] = useState('500');
  const [tradeError, setTradeError] = useState('');
  const [tradeSuccess, setTradeSuccess] = useState('');

  // Calculate totals
  const totalInvested = holdings.reduce((sum, h) => sum + h.currentValue, 0);

  const handleOpenTrade = (asset: { id: string; name: string; type: 'fixed' | 'crypto'; price: number }, type: 'buy' | 'sell') => {
    setSelectedAsset(asset);
    setTradeType(type);
    setTradeError('');
    setTradeSuccess('');
    setTradeAmount('500');
    setTradeModalOpen(true);
  };

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setTradeError('');

    const val = parseFloat(tradeAmount.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      setTradeError('Informe um valor válido.');
      return;
    }

    if (tradeType === 'buy') {
      if (val > user.balance) {
        setTradeError(`Saldo insuficiente. Você possui ${formatCurrency(user.balance)} disponível.`);
        return;
      }

      // Execute buy
      const newBal = user.balance - val;
      onUpdateUser({ balance: newBal });

      // Update holdings
      const existingIdx = holdings.findIndex(h => h.assetId === selectedAsset.id);
      let updatedHoldings = [...holdings];

      if (existingIdx !== -1) {
        const h = updatedHoldings[existingIdx];
        const addQty = val / selectedAsset.price;
        const newTotalInvested = h.totalInvested + val;
        const newTotalVal = h.currentValue + val;
        updatedHoldings[existingIdx] = {
          ...h,
          quantity: h.quantity + addQty,
          currentValue: newTotalVal,
          totalInvested: newTotalInvested,
        };
      } else {
        const qty = val / selectedAsset.price;
        updatedHoldings.push({
          assetId: selectedAsset.id,
          name: selectedAsset.name,
          type: selectedAsset.type,
          quantity: qty,
          avgPrice: selectedAsset.price,
          currentValue: val,
          totalInvested: val,
          yieldPercent: 1.5,
        });
      }

      StorageManager.saveHoldings(updatedHoldings);
      setHoldings(updatedHoldings);

      const tx = StorageManager.addTransaction({
        type: 'investment_buy',
        title: `Aplicação - ${selectedAsset.name}`,
        amount: val,
        category: 'investimentos',
        counterpart: {
          name: 'Peanut DTVM Distribuidora',
          bank: 'Peanut Bank',
        },
        status: 'completed',
        description: `Compra efetuada a cotação de ${formatCurrency(selectedAsset.price)}`,
      });

      onTransactionSuccess(tx);
      setTradeSuccess(`Aplicação de ${formatCurrency(val)} realizada com sucesso!`);
      setTimeout(() => setTradeModalOpen(false), 1200);
    } else {
      // Sell / Resgatar
      const existing = holdings.find(h => h.assetId === selectedAsset.id);
      if (!existing || existing.currentValue < val) {
        setTradeError(`Saldo em custódia insuficiente para resgatar esse valor.`);
        return;
      }

      const newBal = user.balance + val;
      onUpdateUser({ balance: newBal });

      const updatedHoldings = holdings.map(h => {
        if (h.assetId === selectedAsset.id) {
          const ratio = (h.currentValue - val) / h.currentValue;
          return {
            ...h,
            quantity: h.quantity * ratio,
            currentValue: h.currentValue - val,
            totalInvested: Math.max(0, h.totalInvested * ratio),
          };
        }
        return h;
      }).filter(h => h.currentValue > 0.01);

      StorageManager.saveHoldings(updatedHoldings);
      setHoldings(updatedHoldings);

      const tx = StorageManager.addTransaction({
        type: 'investment_sell',
        title: `Resgate - ${selectedAsset.name}`,
        amount: val,
        category: 'investimentos',
        counterpart: {
          name: 'Peanut DTVM Distribuidora',
          bank: 'Peanut Bank',
        },
        status: 'completed',
        description: `Resgate creditado diretamente na conta corrente`,
      });

      onTransactionSuccess(tx);
      setTradeSuccess(`Resgate de ${formatCurrency(val)} creditado na conta!`);
      setTimeout(() => setTradeModalOpen(false), 1200);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Portfolio Total Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2a170b] via-[#1a0e06] to-[#3a1d0c] border border-amber-800/40 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Patrimônio Investido
            </span>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-700/40 font-mono">
            +4.85% Mês
          </span>
        </div>

        <div className="text-3xl font-black text-[#fef3c7] tracking-tight">
          {formatCurrency(totalInvested)}
        </div>
        <p className="text-xs text-amber-300/60 mt-1">
          Rendendo automaticamente com garantia do FGC até R$ 250.000,00
        </p>

        {/* Quick Action */}
        <div className="mt-5 flex gap-2">
          <button
            onClick={() => handleOpenTrade({ id: 'cdb_peanut', name: 'CDB Peanut 115% CDI', type: 'fixed', price: 1 }, 'buy')}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#b45309] to-[#d97706] hover:brightness-110 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Aplicar no CDB 115% CDI
          </button>
        </div>
      </div>

      {/* Renda Fixa Peanut */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          Renda Fixa & Liquidez Diária
        </h3>

        <div className="p-4 rounded-2xl bg-[#170e08] border border-amber-900/40 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-amber-100">CDB Peanut Liquidez Diária</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
                115% CDI
              </span>
            </div>
            <p className="text-[11px] text-amber-300/60 mt-0.5">
              Resgate 24/7 instantâneo • Rende mais que a poupança
            </p>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => handleOpenTrade({ id: 'cdb_peanut', name: 'CDB Peanut 115% CDI', type: 'fixed', price: 1 }, 'buy')}
              className="py-1.5 px-3 rounded-lg bg-amber-900/40 hover:bg-amber-900/80 text-amber-200 text-xs font-bold border border-amber-700/40"
            >
              Aplicar
            </button>
            <button
              onClick={() => handleOpenTrade({ id: 'cdb_peanut', name: 'CDB Peanut 115% CDI', type: 'fixed', price: 1 }, 'sell')}
              className="py-1.5 px-2.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/30 text-amber-400 text-xs font-medium border border-amber-900/30"
            >
              Resgatar
            </button>
          </div>
        </div>
      </div>

      {/* Criptoativos no Peanut Bank */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-amber-400" />
            Criptoativos & Moedas Digitais
          </h3>
          <span className="text-[10px] text-amber-300/50 font-mono">
            {cryptos.length} moedas ativas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cryptos.map((c) => {
            const isPositive = c.change24h >= 0;
            return (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-[#170e08] border border-amber-900/40 flex flex-col justify-between space-y-3 hover:border-amber-700/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-white shadow-sm"
                      style={{ backgroundColor: c.iconColor }}
                    >
                      {c.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-100">{c.name}</h4>
                      <span className="text-[10px] text-amber-300/60 font-mono">{c.symbol}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-amber-100 font-mono">
                      {formatCurrency(c.price)}
                    </div>
                    <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {c.change24h > 0 ? `+${c.change24h}%` : `${c.change24h}%`}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1 border-t border-amber-950">
                  <button
                    onClick={() => handleOpenTrade({ id: c.id, name: c.name, type: 'crypto', price: c.price }, 'buy')}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/40 text-emerald-300 text-xs font-bold transition-colors"
                  >
                    Comprar
                  </button>
                  <button
                    onClick={() => handleOpenTrade({ id: c.id, name: c.name, type: 'crypto', price: c.price }, 'sell')}
                    className="flex-1 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/40 border border-amber-900/40 text-amber-300 text-xs font-medium transition-colors"
                  >
                    Vender
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custódia Atual do Cliente */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
          Sua Custódia Atual
        </h3>

        <div className="bg-[#170e08] border border-amber-900/40 rounded-2xl divide-y divide-amber-950">
          {holdings.map((h) => (
            <div key={h.assetId} className="p-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-100 block">{h.name}</span>
                <span className="text-[11px] text-amber-300/60 font-mono">
                  Qtd: {h.quantity.toFixed(4)} • Rentab: +{h.yieldPercent}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-200 block font-mono">
                  {formatCurrency(h.currentValue)}
                </span>
                <span className="text-[10px] text-emerald-400">
                  Lucro: {formatCurrency(h.currentValue - h.totalInvested)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trade Modal */}
      {tradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1b1009] border border-amber-800/40 rounded-3xl max-w-sm w-full p-6 space-y-4 text-amber-50 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-amber-100">
                {tradeType === 'buy' ? 'Comprar / Aplicar' : 'Resgatar / Vender'}: {selectedAsset.name}
              </h3>
              <button onClick={() => setTradeModalOpen(false)} className="text-amber-400">
                ✕
              </button>
            </div>

            {tradeError && (
              <div className="p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl text-rose-300 text-xs">
                {tradeError}
              </div>
            )}

            {tradeSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs">
                {tradeSuccess}
              </div>
            )}

            <form onSubmit={handleExecuteTrade} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-amber-200/80 mb-1">
                  Valor em Reais (BRL)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-400">
                    R$
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#120a05] border border-amber-900/50 rounded-xl text-base font-bold text-amber-100 font-mono"
                  />
                </div>
              </div>

              <div className="text-[11px] text-amber-300/70 space-y-1">
                <div className="flex justify-between">
                  <span>Saldo em conta corrente:</span>
                  <span className="font-bold text-amber-100">{formatCurrency(user.balance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cotação do ativo:</span>
                  <span className="font-mono text-amber-200">{formatCurrency(selectedAsset.price)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#9a3412] to-[#d97706] text-amber-950 font-bold text-xs shadow-md"
              >
                Confirmar {tradeType === 'buy' ? 'Aplicação' : 'Resgate'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
