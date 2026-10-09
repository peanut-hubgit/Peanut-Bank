import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  TrendingDown,
  TrendingUp,
  Lightbulb,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  PieChart
} from 'lucide-react';
import { Transaction, TransactionCategory, UserAccount } from '../../types';
import { formatCurrency } from '../../utils/security';
import { StorageManager } from '../../utils/storage';

interface StatementViewProps {
  user: UserAccount;
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
}

export const StatementView: React.FC<StatementViewProps> = ({
  user,
  transactions,
  onSelectTransaction,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateMonth] = useState('Outubro 2026');

  // Calculate monthly metrics
  let totalIncome = 0;
  let totalExpense = 0;
  const categoryTotals: Record<string, number> = {};

  transactions.forEach((tx) => {
    if (tx.type === 'pix_received' || tx.type === 'admin_credit' || tx.type === 'cashback') {
      totalIncome += tx.amount;
    } else {
      totalExpense += tx.amount;
      categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount;
    }
  });

  const netSavings = totalIncome - totalExpense;

  // Filter transactions
  const filteredTxs = transactions.filter((t) => {
    const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.counterpart?.name && t.counterpart.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const csvContent = StorageManager.exportToCSV(transactions);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PeanutBank_Extrato_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF / Print window
  const handleExportPDF = () => {
    window.print();
  };

  // Personalized Suggestions
  const suggestions = StorageManager.generateSuggestions(transactions);

  // Category labels and colors
  const categoryMeta: Record<string, { label: string; color: string }> = {
    alimentacao: { label: 'Alimentação & Mercado', color: '#f59e0b' },
    transporte: { label: 'Transporte & Posto', color: '#38bdf8' },
    moradia: { label: 'Moradia & Contas', color: '#ec4899' },
    investimentos: { label: 'Investimentos', color: '#10b981' },
    lazer: { label: 'Lazer & Entretenimento', color: '#8b5cf6' },
    salario: { label: 'Salário & Renda', color: '#22c55e' },
    servicos: { label: 'Serviços & Assinaturas', color: '#eab308' },
    transferencia: { label: 'Transferências Gerais', color: '#a855f7' },
    outros: { label: 'Outros', color: '#94a3b8' },
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner: Month Selector & Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#180e07] p-4 rounded-2xl border border-amber-900/30">
        <div>
          <span className="text-[11px] text-amber-400/70 font-semibold uppercase tracking-wider">
            Período de Análise
          </span>
          <h2 className="text-lg font-bold text-amber-100 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-amber-400" />
            Extrato Mensal • {dateMonth}
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none py-2 px-3 rounded-xl bg-amber-950/60 hover:bg-amber-900/40 border border-amber-800/40 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            title="Exportar como planilha Excel / CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Excel (CSV)
          </button>
          <button
            onClick={handleExportPDF}
            className="flex-1 sm:flex-none py-2 px-3 rounded-xl bg-amber-950/60 hover:bg-amber-900/40 border border-amber-800/40 text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            title="Exportar ou Imprimir Relatório PDF"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            PDF / Imprimir
          </button>
        </div>
      </div>

      {/* Summary 3 Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#140b06] border border-emerald-900/40 space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>Entradas do Mês</span>
          </div>
          <div className="text-xl font-black text-emerald-300 font-mono">
            {formatCurrency(totalIncome)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#140b06] border border-rose-900/40 space-y-1">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
            <TrendingDown className="w-4 h-4" />
            <span>Saídas e Pagamentos</span>
          </div>
          <div className="text-xl font-black text-rose-300 font-mono">
            {formatCurrency(totalExpense)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#140b06] border border-amber-800/40 space-y-1">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <DollarSign className="w-4 h-4" />
            <span>Economia Acumulada</span>
          </div>
          <div className={`text-xl font-black font-mono ${netSavings >= 0 ? 'text-amber-200' : 'text-rose-400'}`}>
            {formatCurrency(netSavings)}
          </div>
        </div>
      </div>

      {/* Categorized Spending Breakdown Bars */}
      <div className="p-5 rounded-3xl bg-[#180e07] border border-amber-900/40 space-y-4">
        <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
          Distribuição por Categorias Automáticas
        </h3>

        <div className="space-y-3">
          {Object.entries(categoryTotals).map(([cat, total]) => {
            const pct = totalExpense > 0 ? (total / totalExpense) * 100 : 0;
            const meta = categoryMeta[cat] || { label: cat, color: '#f59e0b' };

            return (
              <div key={cat} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-100 flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: meta.color }}
                    />
                    {meta.label}
                  </span>
                  <span className="font-mono text-amber-200">
                    {formatCurrency(total)} ({pct.toFixed(1)}%)
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-[#0d0704] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(5, pct))}%`,
                      backgroundColor: meta.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personalized AI Suggestions for Savings */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Sugestões Personalizadas de Economia (Peanut Advisor)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((sug) => (
            <div
              key={sug.id}
              className="p-4 rounded-2xl bg-gradient-to-br from-[#241308] to-[#160c06] border border-amber-800/40 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-100">{sug.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-bold border border-emerald-800/40">
                    +{formatCurrency(sug.potentialSavingsMonthly)}/mês
                  </span>
                </div>
                <p className="text-xs text-amber-200/70 leading-relaxed">
                  {sug.description}
                </p>
              </div>

              <button className="py-2 px-3 rounded-xl bg-amber-900/40 hover:bg-amber-900/70 border border-amber-700/40 text-amber-200 text-xs font-bold transition-colors text-center">
                {sug.actionText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Transaction List */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Todas as Movimentações ({filteredTxs.length})
          </h3>

          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-amber-400/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar movimentação..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#120a05] border border-amber-900/40 rounded-xl text-xs text-amber-100 placeholder:text-amber-700/50 focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-[#120a05] border border-amber-900/40 rounded-xl text-xs text-amber-100 focus:outline-none focus:border-amber-500 capitalize"
            >
              <option value="all">Todas as Categorias</option>
              {Object.keys(categoryMeta).map((cat) => (
                <option key={cat} value={cat}>
                  {categoryMeta[cat]?.label || cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-[#180e07] border border-amber-900/40 rounded-2xl divide-y divide-amber-950">
          {filteredTxs.map((t) => {
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
                    {isCredit ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-100 block">{t.title}</span>
                    <span className="text-[11px] text-amber-300/60 font-mono">
                      {new Date(t.date).toLocaleDateString('pt-BR')} • {t.category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-extrabold font-mono block ${
                      isCredit ? 'text-emerald-400' : 'text-amber-100'
                    }`}
                  >
                    {isCredit ? '+' : '-'} {formatCurrency(t.amount)}
                  </span>
                  <span className="text-[10px] text-amber-400/50 font-mono">Ver Comprovante</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
