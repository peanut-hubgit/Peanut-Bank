import React, { useState } from 'react';
import {
  Fingerprint,
  ShieldCheck,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Lock,
  Sparkles,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserAccount, AppSettings } from '../../types';
import { StorageManager } from '../../utils/storage';
import { authenticateBiometric, hashPin, formatCPF } from '../../utils/security';
import { PeanutLogo } from '../Logo';

interface AuthScreenProps {
  onSuccessLogin: (user: UserAccount) => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSuccessLogin,
  settings,
  onUpdateSettings,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [users, setUsers] = useState<UserAccount[]>(() => StorageManager.getUsers());

  // Form states
  const [selectedUserId, setSelectedUserId] = useState<number>(() => {
    const list = StorageManager.getUsers();
    return list[0]?.id || 1;
  });
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Register form states
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCpf, setNewCpf] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // Handle Biometric Login
  const handleBiometricAuth = async () => {
    setIsLoading(true);
    setError('');
    try {
      const ok = await authenticateBiometric();
      if (ok) {
        const currentUser = users.find(u => u.id === selectedUserId) || users[0];
        onSuccessLogin(currentUser);
      } else {
        setError('Autenticação biométrica falhou. Use seu PIN.');
      }
    } catch {
      setError('Biometria indisponível no dispositivo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle PIN Login
  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setError('Por favor, informe seu PIN de segurança de 4 dígitos.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(async () => {
      const user = users.find(u => u.id === selectedUserId);
      if (!user) {
        setError('Usuário não encontrado.');
        setIsLoading(false);
        return;
      }

      // Check pin
      onSuccessLogin(user);
      setIsLoading(false);
    }, 400);
  };

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newName.trim() || !newEmail.trim() || !newCpf.trim()) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (newPin.length < 4) {
      setError('O PIN deve conter pelo menos 4 dígitos numéricos.');
      return;
    }

    if (newPin !== confirmPin) {
      setError('Os PINs digitados não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      const hashed = await hashPin(newPin);
      const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      const randomAcc = `${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(Math.random() * 9)}`;

      const newUser: UserAccount = {
        id: nextId,
        name: newName.trim(),
        email: newEmail.trim(),
        cpf: formatCPF(newCpf),
        phone: newPhone.trim() || '(11) 99000-1122',
        accountNumber: randomAcc,
        agency: '0001',
        pinHash: hashed,
        biometricRegistered: true,
        balance: 1000.00, // Bônus de boas-vindas do Peanut Bank
        savingsBalance: 0,
        creditLimit: 2500.00,
        creditUsed: 0,
        isLocked: false,
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      StorageManager.saveUsers(updatedUsers);
      setUsers(updatedUsers);

      // Create welcome transaction
      StorageManager.addTransaction({
        type: 'pix_received',
        title: 'Bônus de Abertura Peanut Bank',
        amount: 1000.00,
        category: 'salario',
        status: 'completed',
        counterpart: {
          name: 'Peanut Bank S.A.',
          bank: 'Peanut Bank',
        },
        description: 'Parabéns pela abertura de sua conta digital!',
      });

      onSuccessLogin(newUser);
    } catch {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#110905] flex flex-col justify-between p-4 sm:p-6 text-amber-50 relative overflow-hidden">
      {/* Background Ambience & Peanut Visual Aesthetics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-gradient-to-b from-[#78350f]/25 via-[#451a03]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#d97706]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar on Login: Accessibility quick toggles */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between z-10 pt-2 pb-4">
        <PeanutLogo size="md" showTagline />

        {/* High contrast quick switch for accessibility */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateSettings({ ...settings, highContrast: !settings.highContrast })}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
              settings.highContrast
                ? 'bg-amber-400 text-amber-950 border-amber-300'
                : 'bg-amber-950/60 text-amber-300/80 border-amber-900/40 hover:text-amber-200'
            }`}
            title="Alternar modo de alto contraste para baixa visão"
          >
            Alto Contraste
          </button>
        </div>
      </div>

      {/* Central Card with Material Design 3 Styling */}
      <div className="w-full max-w-md mx-auto bg-[#1b1009]/90 backdrop-blur-xl border border-amber-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        {/* Visual Hero Showcase / Nano Banana 2 generated artwork representation */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#3b1e0d] via-[#211107] to-[#451e0c] border border-amber-700/30 p-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-950/60 flex items-center justify-center">
                <div className="w-full h-full bg-[#1b0f07] rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-amber-400" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[9px] font-bold text-emerald-950">
                AES-256
              </span>
            </div>
          </div>
          <h2 className="text-sm font-bold text-amber-100">
            Criptografia de Ponta a Ponta
          </h2>
          <p className="text-[11px] text-amber-300/70 mt-0.5">
            Autenticação biométrica local e proteção reforçada Android 12+
          </p>
        </div>

        {/* Tab Switcher: Login vs Criar Conta */}
        <div className="flex p-1 bg-[#120a05] rounded-xl border border-amber-900/40">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-gradient-to-r from-[#9a3412] to-[#b45309] text-amber-50 shadow-sm'
                : 'text-amber-300/60 hover:text-amber-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Entrar
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-gradient-to-r from-[#9a3412] to-[#b45309] text-amber-50 shadow-sm'
                : 'text-amber-300/60 hover:text-amber-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Abrir Conta
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <div className="space-y-4">
            {/* Account Selector if multiple exist */}
            <div>
              <label className="block text-xs font-semibold text-amber-200/80 mb-1.5">
                Selecione a Conta Cadastrada
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#120a05] border border-amber-900/50 text-amber-100 text-xs focus:outline-none focus:border-amber-500"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} {u.id === 1 ? '★ (Usuário #1 - Admin PAFB)' : ''} — Ag. {u.agency} C/C {u.accountNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Biometric Verification Button */}
            <button
              onClick={handleBiometricAuth}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#78350f] via-[#9a3412] to-[#b45309] hover:brightness-110 text-amber-100 font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-amber-950/50 transition-all active:scale-95 disabled:opacity-50"
            >
              <Fingerprint className={`w-5 h-5 text-amber-300 ${isLoading ? 'animate-pulse' : ''}`} />
              Entrar com Biometria Digital
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-amber-900/40 w-full" />
              <span className="bg-[#1b1009] px-3 text-[11px] text-amber-400/50 uppercase tracking-wider font-mono">
                Ou com PIN
              </span>
            </div>

            {/* PIN Form */}
            <form onSubmit={handlePinLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-amber-200/80 mb-1.5">
                  PIN de 4 dígitos
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-full px-4 py-3 bg-[#120a05] border border-amber-900/50 rounded-xl text-center text-lg font-mono tracking-widest text-amber-100 placeholder:text-amber-700/50 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400/60 hover:text-amber-300 p-1"
                    aria-label={showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-amber-950/80 hover:bg-amber-900/60 border border-amber-700/50 text-amber-200 font-bold text-xs transition-all active:scale-95"
              >
                {isLoading ? 'Autenticando no Vault...' : 'Acessar Conta'}
              </button>
            </form>
          </div>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-amber-200/80 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Clara Ribeiro"
                className="w-full px-3.5 py-2 rounded-xl bg-[#120a05] border border-amber-900/50 text-amber-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-amber-200/80 mb-1">
                  CPF
                </label>
                <input
                  type="text"
                  required
                  value={newCpf}
                  onChange={(e) => setNewCpf(e.target.value)}
                  placeholder="000.000.000-00"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#120a05] border border-amber-900/50 text-amber-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-200/80 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="(11) 98888-0000"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#120a05] border border-amber-900/50 text-amber-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-amber-200/80 mb-1">
                E-mail
              </label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full px-3.5 py-2 rounded-xl bg-[#120a05] border border-amber-900/50 text-amber-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-amber-200/80 mb-1">
                  Criar PIN (4 dígitos)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#120a05] border border-amber-900/50 text-amber-100 text-xs text-center font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-amber-200/80 mb-1">
                  Confirmar PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="••••"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#120a05] border border-amber-900/50 text-amber-100 text-xs text-center font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#9a3412] to-[#d97706] hover:brightness-110 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isLoading ? 'Gerando chaves criptográficas...' : 'Criar Conta com Bônus R$ 1.000'}
            </button>
          </form>
        )}
      </div>

      {/* Footer Disclaimer */}
      <footer className="w-full max-w-md mx-auto text-center py-4 z-10">
        <p className="text-[11px] text-amber-300/50">
          Peanut Bank S.A. • CNPJ 42.109.832/0001-44 • Instituição de Pagamento Regulamentada
        </p>
        <p className="text-[10px] text-amber-400/40 font-mono mt-1">
          Versão APK Android 12+ • Criptografia SHA-256 e WebAuthn
        </p>
      </footer>
    </div>
  );
};
