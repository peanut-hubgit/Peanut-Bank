/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserAccount, AppSettings, Transaction } from './types';
import { StorageManager } from './utils/storage';
import { AndroidHeader } from './components/AndroidHeader';
import { AndroidBottomNav, TabType } from './components/AndroidBottomNav';
import { AuthScreen } from './components/Auth/AuthScreen';
import { HomeView } from './components/Dashboard/HomeView';
import { StatementView } from './components/Statement/StatementView';
import { InvestmentsModal } from './components/Investments/InvestmentsModal';
import { PixDrawer } from './components/Pix/PixDrawer';
import { BoletoModal } from './components/Boleto/BoletoModal';
import { ReceiptModal } from './components/ReceiptModal';
import { EmergencyLockModal } from './components/EmergencyLockModal';
import { PAFBModal } from './components/PAFB/PAFBModal';
import { SupportChat } from './components/Support/SupportChat';
import { SettingsModal } from './components/Settings/SettingsModal';
import { NotificationsModal } from './components/NotificationsModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    // If user has previous session, start logged in, else null
    return StorageManager.getCurrentUser();
  });

  const [settings, setSettings] = useState<AppSettings>(() => StorageManager.getSettings());
  const [transactions, setTransactions] = useState<Transaction[]>(() => StorageManager.getTransactions());
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  // Modals & Drawers state
  const [isPixOpen, setIsPixOpen] = useState(false);
  const [isBoletoOpen, setIsBoletoOpen] = useState(false);
  const [isPAFBOpen, setIsPAFBOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<Transaction | null>(null);
  const [isEmergencyLocked, setIsEmergencyLocked] = useState(false);

  // Sync HTML accessibility attributes (font size, high contrast, theme)
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-font-size', settings.fontSize);

    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.themeMode === 'deep-black') {
      root.classList.add('dark', 'deep-black');
    } else if (settings.themeMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('deep-black');
    } else {
      root.classList.remove('dark', 'deep-black');
    }
  }, [settings]);

  // Handle Log In
  const handleSuccessLogin = (user: UserAccount) => {
    StorageManager.setCurrentUserId(user.id);
    setCurrentUser(user);
    setIsEmergencyLocked(false);
  };

  // Handle Log Out
  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Update user state helper
  const handleUpdateUser = (updates: Partial<UserAccount>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    StorageManager.updateCurrentUser(updates);
  };

  // On new transaction completed
  const handleTransactionSuccess = (tx: Transaction) => {
    setTransactions(StorageManager.getTransactions());
    setActiveReceipt(tx);
  };

  // Emergency Panic Lockdown
  const handleTriggerEmergencyLock = () => {
    setIsEmergencyLocked(true);
  };

  const handleUnlockEmergency = () => {
    setIsEmergencyLocked(false);
  };

  // If not logged in, render the AuthScreen
  if (!currentUser) {
    return (
      <AuthScreen
        onSuccessLogin={handleSuccessLogin}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0704] text-amber-50 flex flex-col items-center selection:bg-amber-600 selection:text-white">
      {/* Mobile/Tablet Android Container Frame */}
      <div className="w-full max-w-lg min-h-screen bg-[#140b06] shadow-2xl flex flex-col relative pb-16 border-x border-amber-950/40">
        {/* Android 12+ System Top Bar & App Bar */}
        <AndroidHeader
          user={currentUser}
          settings={settings}
          onOpenPAFB={() => setIsPAFBOpen(true)}
          onEmergencyLock={handleTriggerEmergencyLock}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onLogout={handleLogout}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-5 overflow-y-auto no-scrollbar">
          {currentTab === 'home' && (
            <HomeView
              user={currentUser}
              settings={settings}
              transactions={transactions}
              onOpenPix={() => setIsPixOpen(true)}
              onOpenBoleto={() => setIsBoletoOpen(true)}
              onOpenInvestments={() => setCurrentTab('investments')}
              onOpenStatement={() => setCurrentTab('statement')}
              onOpenPAFB={() => setIsPAFBOpen(true)}
              onEmergencyLock={handleTriggerEmergencyLock}
              onSelectTransaction={setActiveReceipt}
            />
          )}

          {currentTab === 'statement' && (
            <StatementView
              user={currentUser}
              transactions={transactions}
              onSelectTransaction={setActiveReceipt}
            />
          )}

          {currentTab === 'pix' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#190f08] rounded-2xl border border-amber-900/40 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-amber-100">Central de Transferências PIX</h2>
                  <p className="text-xs text-amber-300/60">Disponível 24 horas por dia, 7 dias por semana</p>
                </div>
                <button
                  onClick={() => setIsPixOpen(true)}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9a3412] to-[#d97706] text-amber-950 font-bold text-xs shadow-md"
                >
                  Abrir Área PIX
                </button>
              </div>

              {/* Quick Boleto Card */}
              <div className="p-4 bg-[#190f08] rounded-2xl border border-amber-900/40 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-amber-100">Pagamento de Boletos & Contas</h3>
                  <p className="text-xs text-amber-300/60">Contas de consumo, tributos e boletos bancários</p>
                </div>
                <button
                  onClick={() => setIsBoletoOpen(true)}
                  className="py-2.5 px-4 rounded-xl bg-amber-900/50 hover:bg-amber-900/80 text-amber-200 border border-amber-700/50 font-bold text-xs"
                >
                  Pagar Boleto
                </button>
              </div>

              {/* Statement summary */}
              <StatementView
                user={currentUser}
                transactions={transactions.filter(t => t.type === 'pix_sent' || t.type === 'pix_received' || t.type === 'boleto')}
                onSelectTransaction={setActiveReceipt}
              />
            </div>
          )}

          {currentTab === 'investments' && (
            <InvestmentsModal
              user={currentUser}
              onUpdateUser={handleUpdateUser}
              onTransactionSuccess={handleTransactionSuccess}
            />
          )}

          {currentTab === 'settings' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#190f08] rounded-2xl border border-amber-900/40 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-amber-100">Configurações Gerais</h2>
                  <p className="text-xs text-amber-300/60">Limites, modos de acessibilidade e backup</p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9a3412] to-[#d97706] text-amber-950 font-bold text-xs"
                >
                  Ajustar Preferências
                </button>
              </div>

              {/* Quick Access to PAFB if User 1 */}
              {currentUser.id === 1 && (
                <div className="p-4 bg-gradient-to-r from-[#311708] to-[#1c0e06] rounded-2xl border border-amber-600/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase">
                      Privilégio Especial: Usuário Administrador #1
                    </span>
                    <span className="text-[10px] bg-amber-500 text-amber-950 px-2 py-0.5 rounded-full font-bold">
                      PAFB Ativo
                    </span>
                  </div>
                  <p className="text-xs text-amber-200/80">
                    Você possui acesso ao Painel de Administração de Funções Beta para injeção de saldo, gestão do catálogo cripto e relatórios CSV.
                  </p>
                  <button
                    onClick={() => setIsPAFBOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-amber-950 border border-amber-600/50 text-amber-300 font-bold text-xs hover:bg-amber-900/50 transition-colors"
                  >
                    Abrir Painel Beta (PAFB)
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Material Design 3 Bottom Navigation Bar */}
        <AndroidBottomNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenSupport={() => setIsSupportOpen(true)}
        />

        {/* Global Modals & Drawers */}
        <PixDrawer
          isOpen={isPixOpen}
          onClose={() => setIsPixOpen(false)}
          user={currentUser}
          settings={settings}
          onTransactionSuccess={handleTransactionSuccess}
          onUpdateUser={handleUpdateUser}
        />

        <BoletoModal
          isOpen={isBoletoOpen}
          onClose={() => setIsBoletoOpen(false)}
          user={currentUser}
          onTransactionSuccess={handleTransactionSuccess}
          onUpdateUser={handleUpdateUser}
        />

        <ReceiptModal
          transaction={activeReceipt}
          onClose={() => setActiveReceipt(null)}
        />

        <EmergencyLockModal
          isLocked={isEmergencyLocked}
          user={currentUser}
          onUnlock={handleUnlockEmergency}
        />

        <PAFBModal
          isOpen={isPAFBOpen}
          onClose={() => setIsPAFBOpen(false)}
          user={currentUser}
          settings={settings}
          onUpdateUser={handleUpdateUser}
          onUpdateSettings={setSettings}
          onTransactionSuccess={handleTransactionSuccess}
        />

        <SupportChat
          isOpen={isSupportOpen}
          onClose={() => setIsSupportOpen(false)}
          userName={currentUser.name}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          user={currentUser}
          onUpdateSettings={setSettings}
          onUpdateUser={handleUpdateUser}
          onTriggerEmergencyLock={handleTriggerEmergencyLock}
        />

        <NotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          settings={settings}
        />
      </div>
    </div>
  );
}
