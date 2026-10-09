export type TransactionCategory =
  | 'alimentacao'
  | 'transporte'
  | 'moradia'
  | 'lazer'
  | 'investimentos'
  | 'salario'
  | 'servicos'
  | 'transferencia'
  | 'outros';

export type TransactionType =
  | 'pix_sent'
  | 'pix_received'
  | 'boleto'
  | 'investment_buy'
  | 'investment_sell'
  | 'admin_credit'
  | 'cashback';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  date: string; // ISO string
  category: TransactionCategory;
  counterpart?: {
    name: string;
    key?: string;
    keyType?: 'cpf' | 'email' | 'phone' | 'random';
    bank?: string;
    agency?: string;
    account?: string;
  };
  status: 'completed' | 'processing' | 'failed';
  receiptCode: string;
  description?: string;
}

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  iconColor: string;
  isCustom?: boolean;
}

export interface InvestmentHolding {
  assetId: string;
  name: string;
  type: 'fixed' | 'crypto';
  quantity: number;
  avgPrice: number;
  currentValue: number;
  totalInvested: number;
  yieldPercent: number;
}

export interface WebhookIntegration {
  id: string;
  name: string;
  endpointUrl: string;
  apiKey: string;
  events: ('pix_sent' | 'pix_received' | 'deposit' | 'investment')[];
  enabled: boolean;
  lastTriggered?: string;
  lastStatus?: '200_ok' | 'failed';
}

export interface UserAccount {
  id: number; // 1 for first user (Admin PAFB authorized)
  name: string;
  email: string;
  cpf: string;
  phone: string;
  accountNumber: string;
  agency: string;
  pinHash: string;
  biometricRegistered: boolean;
  balance: number;
  savingsBalance: number;
  creditLimit: number;
  creditUsed: number;
  isLocked: boolean;
  createdAt: string;
}

export interface AppSettings {
  themeMode: 'dark' | 'deep-black' | 'light';
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  pixDayLimit: number;
  pixNightLimit: number;
  biometricsEnabled: boolean;
  notificationsEnabled: boolean;
  cloudBackupAuto: boolean;
  lastBackupDate?: string;
  betaFeatures: {
    instantPixOffline: boolean;
    quantumCryptoVault: boolean;
    openFinance3: boolean;
    aiSmartAdvisor: boolean;
  };
}

export interface SavingsSuggestion {
  id: string;
  category: TransactionCategory;
  title: string;
  description: string;
  potentialSavingsMonthly: number;
  actionText: string;
}
