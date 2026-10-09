import {
  Transaction,
  CryptoAsset,
  InvestmentHolding,
  WebhookIntegration,
  UserAccount,
  AppSettings,
  SavingsSuggestion
} from '../types';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'peanut_current_user_id',
  USERS: 'peanut_users_vault',
  TRANSACTIONS: 'peanut_transactions',
  CRYPTOS: 'peanut_cryptos',
  HOLDINGS: 'peanut_holdings',
  SETTINGS: 'peanut_settings',
  WEBHOOKS: 'peanut_webhooks',
  AUDIT_LOGS: 'peanut_audit_logs',
};

// Initial User 1 (Primary Account with PAFB access)
export const INITIAL_USER_1: UserAccount = {
  id: 1,
  name: 'Joaquim Pedro',
  email: 'jpjoaquimpedro@peanutbank.com.br',
  cpf: '123.456.789-00',
  phone: '(11) 98765-4321',
  accountNumber: '489201-9',
  agency: '0001',
  pinHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // will accept '1234' or any PIN on demo
  biometricRegistered: true,
  balance: 14850.75,
  savingsBalance: 5200.00,
  creditLimit: 12000.00,
  creditUsed: 2340.50,
  isLocked: false,
  createdAt: '2026-01-15T10:00:00.000Z',
};

// Initial Transactions categorized realistically
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_001',
    type: 'pix_received',
    title: 'Recebimento PIX - Tech Solutions',
    amount: 8500.00,
    date: '2026-10-05T09:30:00.000Z',
    category: 'salario',
    counterpart: {
      name: 'Tech Solutions LTDA',
      key: '12.345.678/0001-90',
      keyType: 'random',
      bank: '077 - Inter',
    },
    status: 'completed',
    receiptCode: 'PIX-982103810293',
    description: 'Pagamento de Honorários Dev Outubro',
  },
  {
    id: 'tx_002',
    type: 'pix_sent',
    title: 'PIX Enviado - Supermercado Pão de Ouro',
    amount: 542.80,
    date: '2026-10-06T14:15:00.000Z',
    category: 'alimentacao',
    counterpart: {
      name: 'Supermercado Pão de Ouro',
      key: 'contato@paodeouro.com.br',
      keyType: 'email',
      bank: '260 - Nubank',
    },
    status: 'completed',
    receiptCode: 'PIX-34190823412',
    description: 'Compras mensais de mantimentos',
  },
  {
    id: 'tx_003',
    type: 'boleto',
    title: 'Pagamento Boleto - Aluguel & Condomínio',
    amount: 1850.00,
    date: '2026-10-07T11:00:00.000Z',
    category: 'moradia',
    counterpart: {
      name: 'Imobiliária Morada Nobre',
      bank: '001 - Banco do Brasil',
    },
    status: 'completed',
    receiptCode: 'BOL-84729104820',
    description: 'Vencimento Ref. 10/2026',
  },
  {
    id: 'tx_004',
    type: 'pix_sent',
    title: 'PIX Enviado - Posto Ipiranga Shell',
    amount: 220.00,
    date: '2026-10-07T18:40:00.000Z',
    category: 'transporte',
    counterpart: {
      name: 'Auto Posto Jardins',
      key: '(11) 99123-4567',
      keyType: 'phone',
      bank: '033 - Santander',
    },
    status: 'completed',
    receiptCode: 'PIX-12093840291',
    description: 'Abastecimento Gasolina Comum',
  },
  {
    id: 'tx_005',
    type: 'investment_buy',
    title: 'Aplicação CDB Peanut 115% CDI',
    amount: 1500.00,
    date: '2026-10-08T10:15:00.000Z',
    category: 'investimentos',
    counterpart: {
      name: 'Peanut DTVM & Investimentos',
      bank: 'Peanut Bank',
    },
    status: 'completed',
    receiptCode: 'INV-492019482',
    description: 'Reserva de Emergência com Liquidez Diária',
  },
  {
    id: 'tx_006',
    type: 'pix_sent',
    title: 'PIX Enviado - Restaurante Terra Brasil',
    amount: 135.50,
    date: '2026-10-08T19:50:00.000Z',
    category: 'alimentacao',
    counterpart: {
      name: 'Restaurante Terra Brasil',
      key: '342.981.042-10',
      keyType: 'cpf',
      bank: '341 - Itaú',
    },
    status: 'completed',
    receiptCode: 'PIX-5829104829',
    description: 'Jantar em Família',
  },
  {
    id: 'tx_007',
    type: 'pix_received',
    title: 'Recebimento PIX - Mariana Silva',
    amount: 320.00,
    date: '2026-10-09T08:10:00.000Z',
    category: 'transferencia',
    counterpart: {
      name: 'Mariana Silva',
      key: 'mariana.silva@email.com',
      keyType: 'email',
      bank: '104 - Caixa',
    },
    status: 'completed',
    receiptCode: 'PIX-9018237418',
    description: 'Reembolso Despesas de Viagem',
  },
];

// Initial Cryptocurrencies
export const INITIAL_CRYPTOS: CryptoAsset[] = [
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 368450.00,
    change24h: 3.42,
    iconColor: '#f7931a',
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 18920.00,
    change24h: 1.85,
    iconColor: '#627eea',
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    price: 1120.50,
    change24h: 5.60,
    iconColor: '#14f195',
  },
  {
    id: 'pnc',
    symbol: 'PNC',
    name: 'Peanut Coin (Governança)',
    price: 14.80,
    change24h: 8.90,
    iconColor: '#d97706',
    isCustom: true,
  },
];

// Initial Holdings
export const INITIAL_HOLDINGS: InvestmentHolding[] = [
  {
    assetId: 'cdb_peanut',
    name: 'CDB Peanut Liquidez Diária 115% CDI',
    type: 'fixed',
    quantity: 1,
    avgPrice: 6500.00,
    currentValue: 6780.40,
    totalInvested: 6500.00,
    yieldPercent: 4.31,
  },
  {
    assetId: 'btc',
    name: 'Bitcoin (BTC)',
    type: 'crypto',
    quantity: 0.012,
    avgPrice: 345000.00,
    currentValue: 4421.40,
    totalInvested: 4140.00,
    yieldPercent: 6.80,
  },
  {
    assetId: 'pnc',
    name: 'Peanut Coin (PNC)',
    type: 'crypto',
    quantity: 150,
    avgPrice: 12.00,
    currentValue: 2220.00,
    totalInvested: 1800.00,
    yieldPercent: 23.33,
  },
];

// Default App Settings
export const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'dark',
  highContrast: false,
  fontSize: 'medium',
  pixDayLimit: 10000.00,
  pixNightLimit: 1500.00,
  biometricsEnabled: true,
  notificationsEnabled: true,
  cloudBackupAuto: true,
  lastBackupDate: new Date().toISOString(),
  betaFeatures: {
    instantPixOffline: true,
    quantumCryptoVault: true,
    openFinance3: false,
    aiSmartAdvisor: true,
  },
};

export const INITIAL_WEBHOOKS: WebhookIntegration[] = [
  {
    id: 'wh_01',
    name: 'Notion Finance Automation',
    endpointUrl: 'https://api.thirdparty-hub.internal/v1/finance/sync',
    apiKey: 'pnt_sec_live_9a7d83fbc829',
    events: ['pix_sent', 'pix_received', 'deposit'],
    enabled: true,
    lastTriggered: '2026-10-09T08:10:00.000Z',
    lastStatus: '200_ok',
  },
];

// Storage Helper Functions
export const StorageManager = {
  getUsers(): UserAccount[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      const initial = [INITIAL_USER_1];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [INITIAL_USER_1];
    }
  },

  saveUsers(users: UserAccount[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getCurrentUserId(): number {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return raw ? parseInt(raw, 10) : 1;
  },

  setCurrentUserId(id: number) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id.toString());
  },

  getCurrentUser(): UserAccount {
    const users = this.getUsers();
    const id = this.getCurrentUserId();
    const found = users.find(u => u.id === id);
    if (found) return found;
    return users[0] || INITIAL_USER_1;
  },

  updateCurrentUser(updates: Partial<UserAccount>) {
    const users = this.getUsers();
    const id = this.getCurrentUserId();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      this.saveUsers(users);
    }
  },

  getTransactions(): Transaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  },

  addTransaction(tx: Omit<Transaction, 'id' | 'receiptCode' | 'date'> & { date?: string }): Transaction {
    const list = this.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      receiptCode: `PNT-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      date: tx.date || new Date().toISOString(),
    };
    const updated = [newTx, ...list];
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));

    // Also trigger webhooks
    this.dispatchWebhooks(newTx);
    return newTx;
  },

  getCryptos(): CryptoAsset[] {
    const raw = localStorage.getItem(STORAGE_KEYS.CRYPTOS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CRYPTOS, JSON.stringify(INITIAL_CRYPTOS));
      return INITIAL_CRYPTOS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_CRYPTOS;
    }
  },

  saveCryptos(cryptos: CryptoAsset[]) {
    localStorage.setItem(STORAGE_KEYS.CRYPTOS, JSON.stringify(cryptos));
  },

  getHoldings(): InvestmentHolding[] {
    const raw = localStorage.getItem(STORAGE_KEYS.HOLDINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.HOLDINGS, JSON.stringify(INITIAL_HOLDINGS));
      return INITIAL_HOLDINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_HOLDINGS;
    }
  },

  saveHoldings(holdings: InvestmentHolding[]) {
    localStorage.setItem(STORAGE_KEYS.HOLDINGS, JSON.stringify(holdings));
  },

  getSettings(): AppSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getWebhooks(): WebhookIntegration[] {
    const raw = localStorage.getItem(STORAGE_KEYS.WEBHOOKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.WEBHOOKS, JSON.stringify(INITIAL_WEBHOOKS));
      return INITIAL_WEBHOOKS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_WEBHOOKS;
    }
  },

  saveWebhooks(webhooks: WebhookIntegration[]) {
    localStorage.setItem(STORAGE_KEYS.WEBHOOKS, JSON.stringify(webhooks));
  },

  dispatchWebhooks(tx: Transaction) {
    const webhooks = this.getWebhooks();
    const now = new Date().toISOString();
    const updated = webhooks.map(wh => {
      if (wh.enabled) {
        // Log simulated API call trigger
        return { ...wh, lastTriggered: now, lastStatus: '200_ok' as const };
      }
      return wh;
    });
    this.saveWebhooks(updated);
  },

  // Generate Personalized Savings Suggestions based on transactions
  generateSuggestions(txs: Transaction[]): SavingsSuggestion[] {
    const categoryTotals: Record<string, number> = {};
    let totalSpent = 0;

    txs.forEach(t => {
      if (t.type === 'pix_sent' || t.type === 'boleto') {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        totalSpent += t.amount;
      }
    });

    const suggestions: SavingsSuggestion[] = [];

    if ((categoryTotals['alimentacao'] || 0) > 400) {
      const foodVal = categoryTotals['alimentacao'];
      const pot = Math.round(foodVal * 0.22);
      suggestions.push({
        id: 'sug_food',
        category: 'alimentacao',
        title: 'Otimização com Refeições e Delivery',
        description: `Gastos de R$ ${foodVal.toFixed(2)} em alimentação identificados este mês. O planejamento semanal de compras pode economizar até 22%.`,
        potentialSavingsMonthly: pot,
        actionText: 'Definir teto de alimentação',
      });
    }

    if ((categoryTotals['transporte'] || 0) > 200) {
      const pot = Math.round((categoryTotals['transporte'] || 0) * 0.18);
      suggestions.push({
        id: 'sug_transport',
        category: 'transporte',
        title: 'Rotas Integradas e Combustível',
        description: 'Seus abastecimentos e corridas somaram um valor expressivo. Pagando no posto com cashback Peanut você recupera 3.5%.',
        potentialSavingsMonthly: pot,
        actionText: 'Ativar cashback em postos',
      });
    }

    suggestions.push({
      id: 'sug_invest',
      category: 'investimentos',
      title: 'Aceleração do CDB 115% CDI',
      description: 'Sua conta possui saldo líquido que pode render R$ 138,40 adicionais todo mês se alocado na Liquidez Diária Peanut.',
      potentialSavingsMonthly: 138.40,
      actionText: 'Aplicar na Liquidez Diária',
    });

    return suggestions;
  },

  // Export transactions to CSV
  exportToCSV(txs: Transaction[]): string {
    const headers = ['ID', 'Data', 'Tipo', 'Título', 'Categoria', 'Valor (R$)', 'Status', 'Código Comprovante', 'Destinatário/Origem'];
    const rows = txs.map(t => [
      t.id,
      new Date(t.date).toLocaleString('pt-BR'),
      t.type,
      `"${t.title.replace(/"/g, '""')}"`,
      t.category,
      t.amount.toFixed(2),
      t.status,
      t.receiptCode,
      `"${(t.counterpart?.name || 'N/A').replace(/"/g, '""')}"`,
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },
};
