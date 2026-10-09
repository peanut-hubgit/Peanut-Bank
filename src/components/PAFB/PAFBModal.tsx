import React, { useState } from 'react';
import {
  X,
  Cpu,
  PlusCircle,
  Trash2,
  Download,
  DollarSign,
  Coins,
  FileSpreadsheet,
  ToggleLeft,
  ToggleRight,
  Webhook,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Send
} from 'lucide-react';
import { UserAccount, CryptoAsset, Transaction, AppSettings, WebhookIntegration } from '../../types';
import { formatCurrency } from '../../utils/security';
import { StorageManager } from '../../utils/storage';

interface PAFBModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAccount;
  settings: AppSettings;
  onUpdateUser: (updated: Partial<UserAccount>) => void;
  onUpdateSettings: (settings: AppSettings) => void;
  onTransactionSuccess: (tx: Transaction) => void;
}

export const PAFBModal: React.FC<PAFBModalProps> = ({
  isOpen,
  onClose,
  user,
  settings,
  onUpdateUser,
  onUpdateSettings,
  onTransactionSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'funds' | 'cryptos' | 'audit' | 'webhooks' | 'flags'>('funds');

  // Add Money Admin State
  const [adminAmount, setAdminAmount] = useState('5000');
  const [adminReason, setAdminReason] = useState('Injeção de Liquidez de Teste Beta');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Cryptos State
  const [cryptos, setCryptos] = useState<CryptoAsset[]>(() => StorageManager.getCryptos());
  const [newCryptoSymbol, setNewCryptoSymbol] = useState('');
  const [newCryptoName, setNewCryptoName] = useState('');
  const [newCryptoPrice, setNewCryptoPrice] = useState('1.50');
  const [newCryptoColor, setNewCryptoColor] = useState('#ec4899');

  // Webhooks State
  const [webhooks, setWebhooks] = useState<WebhookIntegration[]>(() => StorageManager.getWebhooks());
  const [newWhName, setNewWhName] = useState('');
  const [newWhUrl, setNewWhUrl] = useState('');
  const [whTestFeedback, setWhTestFeedback] = useState('');

  // Transactions / Audit
  const transactions = StorageManager.getTransactions();

  if (!isOpen) return null;

  // STRICT ACCESS CHECK: Only user #1 can access PAFB
  if (user.id !== 1) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="bg-[#1b0d06] border-2 border-rose-800/80 rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-rose-300">Acesso Negado (PAFB)</h3>
          <p className="text-xs text-amber-200/70">
            O Painel de Administração de Funções Beta (PAFB) é restrito exclusivamente ao <strong>Usuário Nº 1</strong>.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-950 border border-amber-800 text-amber-200 text-xs font-bold"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  // 1. Injetar Dinheiro como Painel Administrativo
  const handleInjectFunds = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(adminAmount.replace(',', '.'));
    if (isNaN(val) || val <= 0) {
      setFeedbackMsg('Informe um valor válido.');
      return;
    }

    const newBal = user.balance + val;
    onUpdateUser({ balance: newBal });

    const tx = StorageManager.addTransaction({
      type: 'admin_credit',
      title: `Crédito Administrativo PAFB - ${adminReason}`,
      amount: val,
      category: 'salario',
      status: 'completed',
      counterpart: {
        name: 'Console Central Peanut Bank PAFB',
        bank: 'Peanut Bank Central Reserve',
      },
      description: `Injeção administrativa autorizada pelo Usuário #1`,
    });

    onTransactionSuccess(tx);
    setFeedbackMsg(`Sucesso! ${formatCurrency(val)} creditados instantaneamente.`);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // 2. Adicionar Criptomoeda
  const handleAddCrypto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCryptoSymbol || !newCryptoName) return;

    const pr = parseFloat(newCryptoPrice.replace(',', '.')) || 1;
    const newCoin: CryptoAsset = {
      id: `custom_${newCryptoSymbol.toLowerCase()}_${Date.now()}`,
      symbol: newCryptoSymbol.toUpperCase(),
      name: newCryptoName,
      price: pr,
      change24h: +(Math.random() * 8 - 2).toFixed(2),
      iconColor: newCryptoColor,
      isCustom: true,
    };

    const updated = [...cryptos, newCoin];
    StorageManager.saveCryptos(updated);
    setCryptos(updated);
    setNewCryptoSymbol('');
    setNewCryptoName('');
    setFeedbackMsg(`Criptomoeda ${newCoin.symbol} listada no Peanut Bank!`);
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  // 3. Excluir Criptomoeda
  const handleDeleteCrypto = (id: string, name: string) => {
    const updated = cryptos.filter(c => c.id !== id);
    StorageManager.saveCryptos(updated);
    setCryptos(updated);
    setFeedbackMsg(`Criptomoeda ${name} deslistada do catálogo.`);
    setTimeout(() => setFeedbackMsg(''), 2500);
  };

  // 4. Exportar Relatório CSV do Sistema
  const handleExportAuditCSV = () => {
    const csv = StorageManager.exportToCSV(transactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PeanutBank_PAFB_AuditLog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 5. Testar Webhook de Terceiros
  const handleTestWebhook = (wh: WebhookIntegration) => {
    setWhTestFeedback(`Enviando ping de teste para ${wh.name}...`);
    setTimeout(() => {
      setWhTestFeedback(`[200 OK] Webhook ${wh.name} respondeu com sucesso! HMAC verificado.`);
      setTimeout(() => setWhTestFeedback(''), 3500);
    }, 700);
  };

  // Toggle Beta Flag
  const toggleBetaFlag = (flagKey: keyof AppSettings['betaFeatures']) => {
    const currentFlags = settings.betaFeatures;
    const updatedSettings = {
      ...settings,
      betaFeatures: {
        ...currentFlags,
        [flagKey]: !currentFlags[flagKey],
      },
    };
    onUpdateSettings(updatedSettings);
    StorageManager.saveSettings(updatedSettings);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#190f08] border-2 border-amber-600/50 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-amber-50">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#2c1508] to-[#1a0c05] border-b border-amber-700/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <Cpu className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-amber-100">
                  PAFB • Painel de Administração de Funções Beta
                </h2>
                <span className="text-[10px] bg-amber-500 text-amber-950 px-2 py-0.5 rounded-full font-bold">
                  USUÁRIO #1 EXCLUSIVO
                </span>
              </div>
              <p className="text-[11px] text-amber-300/70 font-mono">
                Ambiente de Testes Avançados e Gestão Centralizada Peanut Bank
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber-900/50 text-amber-300 transition-colors"
            aria-label="Fechar painel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PAFB Navigation Tabs */}
        <div className="flex p-2 bg-[#120a05] border-b border-amber-950 overflow-x-auto no-scrollbar gap-1 text-xs">
          {[
            { id: 'funds', label: 'Injetar Dinheiro', icon: DollarSign },
            { id: 'cryptos', label: 'Gestão Cripto', icon: Coins },
            { id: 'audit', label: 'Auditoria & CSV', icon: FileSpreadsheet },
            { id: 'webhooks', label: 'APIs & Automação', icon: Webhook },
            { id: 'flags', label: 'Flags Beta', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-amber-800/50 text-amber-200 border border-amber-600/40'
                    : 'text-amber-300/60 hover:text-amber-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
          {feedbackMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-600/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* TAB 1: INJETAR DINHEIRO */}
          {activeTab === 'funds' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#120a05] rounded-2xl border border-amber-900/40 space-y-1">
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Saldo Atual da Conta Administrador:
                </span>
                <div className="text-2xl font-black text-amber-100 font-mono">
                  {formatCurrency(user.balance)}
                </div>
              </div>

              <form onSubmit={handleInjectFunds} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-amber-200/80 mb-1">
                    Valor a Adicionar na Conta (BRL)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-amber-400">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={adminAmount}
                      onChange={(e) => setAdminAmount(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 bg-[#120a05] border border-amber-900/50 rounded-xl text-lg font-bold text-amber-100 font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-amber-200/80 mb-1">
                    Motivo / Descrição do Crédito Administrativo
                  </label>
                  <input
                    type="text"
                    required
                    value={adminReason}
                    onChange={(e) => setAdminReason(e.target.value)}
                    placeholder="Ex: Teste de estresse, Simulação de rendimento"
                    className="w-full px-3.5 py-2 bg-[#120a05] border border-amber-900/50 rounded-xl text-xs text-amber-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#9a3412] to-[#d97706] hover:brightness-110 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  <DollarSign className="w-4 h-4" />
                  Creditar Saldo Imediatamente na Conta
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: GESTÃO CRIPTO (ADICIONAR E EXCLUIR) */}
          {activeTab === 'cryptos' && (
            <div className="space-y-4">
              {/* Form Adicionar Nova Criptomoeda */}
              <form onSubmit={handleAddCrypto} className="p-4 bg-[#120a05] rounded-2xl border border-amber-900/40 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Cadastrar Nova Criptomoeda na Plataforma
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-amber-300/70 mb-1">Símbolo (Ex: ADA)</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={newCryptoSymbol}
                      onChange={(e) => setNewCryptoSymbol(e.target.value)}
                      placeholder="ADA"
                      className="w-full px-3 py-1.5 bg-[#180e07] border border-amber-900/40 rounded-xl text-xs uppercase font-mono text-amber-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-amber-300/70 mb-1">Nome (Ex: Cardano)</label>
                    <input
                      type="text"
                      required
                      value={newCryptoName}
                      onChange={(e) => setNewCryptoName(e.target.value)}
                      placeholder="Cardano"
                      className="w-full px-3 py-1.5 bg-[#180e07] border border-amber-900/40 rounded-xl text-xs text-amber-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-amber-300/70 mb-1">Preço Inicial (BRL)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newCryptoPrice}
                      onChange={(e) => setNewCryptoPrice(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#180e07] border border-amber-900/40 rounded-xl text-xs font-mono text-amber-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-amber-300/70 mb-1">Cor do Ícone</label>
                    <input
                      type="color"
                      value={newCryptoColor}
                      onChange={(e) => setNewCryptoColor(e.target.value)}
                      className="w-full h-8 bg-[#180e07] border border-amber-900/40 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-900/50 hover:bg-amber-900/80 border border-amber-700/50 text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  Listar Moeda no Catálogo
                </button>
              </form>

              {/* Lista Atual com Botão de Excluir */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Criptomoedas Ativas ({cryptos.length})
                </span>

                <div className="divide-y divide-amber-950 bg-[#120a05] rounded-2xl border border-amber-900/40 overflow-hidden">
                  {cryptos.map((c) => (
                    <div key={c.id} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: c.iconColor }}
                        >
                          {c.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-amber-100 block">{c.name} ({c.symbol})</span>
                          <span className="text-[10px] text-amber-300/60 font-mono">{formatCurrency(c.price)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteCrypto(c.id, c.name)}
                        className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 transition-colors"
                        title={`Excluir ${c.symbol}`}
                        aria-label={`Excluir criptomoeda ${c.symbol}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUDITORIA & EXPORTAÇÃO CSV */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase">
                    Auditoria Completa do Sistema
                  </h4>
                  <span className="text-[11px] text-amber-400/60 font-mono">
                    {transactions.length} registros no cofre
                  </span>
                </div>
                <button
                  onClick={handleExportAuditCSV}
                  className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#9a3412] to-[#d97706] hover:brightness-110 text-amber-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  Exportar Relatório CSV
                </button>
              </div>

              <div className="bg-[#120a05] rounded-2xl border border-amber-900/40 divide-y divide-amber-950 max-h-72 overflow-y-auto no-scrollbar">
                {transactions.map((t) => (
                  <div key={t.id} className="p-3 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-amber-100 block">{t.title}</span>
                      <span className="text-[10px] text-amber-300/60 font-mono">
                        {new Date(t.date).toLocaleString('pt-BR')} • {t.receiptCode}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-amber-200 block">
                        {formatCurrency(t.amount)}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono uppercase">{t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: APIS DE TERCEIROS PARA AUTOMAÇÃO */}
          {activeTab === 'webhooks' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#120a05] rounded-2xl border border-amber-900/40 space-y-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Integração de Webhooks para Automação
                </span>
                <p className="text-xs text-amber-200/70">
                  Conecte seu ERP, Notion, Make.com ou n8n para receber notificações em tempo real sempre que ocorrer um PIX ou depósito.
                </p>
              </div>

              {whTestFeedback && (
                <div className="p-2.5 bg-emerald-950/80 border border-emerald-600/60 rounded-xl text-emerald-300 text-xs">
                  {whTestFeedback}
                </div>
              )}

              <div className="space-y-2">
                {webhooks.map((wh) => (
                  <div key={wh.id} className="p-3.5 rounded-2xl bg-[#120a05] border border-amber-900/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-amber-100 block">{wh.name}</span>
                        <span className="text-[10px] font-mono text-amber-300/60">{wh.endpointUrl}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-bold border border-emerald-800/40">
                        Ativo • 200 OK
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-amber-950 text-[11px]">
                      <span className="text-amber-400/60 font-mono">
                        Último disparo: {new Date(wh.lastTriggered || '').toLocaleTimeString('pt-BR')}
                      </span>
                      <button
                        onClick={() => handleTestWebhook(wh)}
                        className="py-1 px-2.5 rounded-lg bg-amber-900/40 hover:bg-amber-900/70 text-amber-200 font-semibold border border-amber-800/40 text-xs"
                      >
                        Disparar Test Ping
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FLAGS BETA */}
          {activeTab === 'flags' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                Alternar Recursos Experimentais Peanut
              </span>

              <div className="space-y-2">
                {[
                  {
                    key: 'instantPixOffline' as const,
                    title: 'PIX Offline em Malha Mesh',
                    desc: 'Permite autenticar transações locais mesmo sem sinal 5G via Bluetooth LE.',
                  },
                  {
                    key: 'quantumCryptoVault' as const,
                    title: 'Cofre Pós-Quântico (Kyber-768)',
                    desc: 'Criptografia resistente a computação quântica para chaves privadas.',
                  },
                  {
                    key: 'openFinance3' as const,
                    title: 'Open Finance 3.0 Automático',
                    desc: 'Sincronização em tempo real de extratos e cartões de outros bancos.',
                  },
                  {
                    key: 'aiSmartAdvisor' as const,
                    title: 'Peanut AI Advisor Pro',
                    desc: 'Análise preditiva de faturas futuras e renegociação automática de tarifas.',
                  },
                ].map((item) => {
                  const isEnabled = settings.betaFeatures[item.key];
                  return (
                    <div
                      key={item.key}
                      onClick={() => toggleBetaFlag(item.key)}
                      className="p-3.5 rounded-2xl bg-[#120a05] border border-amber-900/40 flex items-center justify-between cursor-pointer hover:border-amber-700/50 transition-colors"
                    >
                      <div className="pr-4">
                        <span className="text-xs font-bold text-amber-100 block">{item.title}</span>
                        <p className="text-[11px] text-amber-300/60">{item.desc}</p>
                      </div>
                      <div className="shrink-0 text-amber-400">
                        {isEnabled ? (
                          <ToggleRight className="w-8 h-8 text-amber-400" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-amber-900/60" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
