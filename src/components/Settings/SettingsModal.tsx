import React, { useState } from 'react';
import {
  X,
  Sliders,
  Moon,
  Sun,
  Eye,
  Type,
  Shield,
  Cloud,
  Download,
  Upload,
  Bell,
  Fingerprint,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Lock,
  Smartphone
} from 'lucide-react';
import { AppSettings, UserAccount } from '../../types';
import { formatCurrency, createEncryptedBackup, restoreEncryptedBackup } from '../../utils/security';
import { StorageManager } from '../../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  user: UserAccount;
  onUpdateSettings: (settings: AppSettings) => void;
  onUpdateUser: (updated: Partial<UserAccount>) => void;
  onTriggerEmergencyLock: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  user,
  onUpdateSettings,
  onUpdateUser,
  onTriggerEmergencyLock,
}) => {
  const [dayLimit, setDayLimit] = useState(settings.pixDayLimit.toString());
  const [nightLimit, setNightLimit] = useState(settings.pixNightLimit.toString());
  const [feedback, setFeedback] = useState('');
  const [isBackingUp, setIsBackingUp] = useState(false);

  if (!isOpen) return null;

  const handleSaveLimits = (e: React.FormEvent) => {
    e.preventDefault();
    const d = parseFloat(dayLimit);
    const n = parseFloat(nightLimit);
    if (isNaN(d) || isNaN(n) || d < 0 || n < 0) {
      setFeedback('Valores de limites inválidos.');
      return;
    }

    const updated: AppSettings = {
      ...settings,
      pixDayLimit: d,
      pixNightLimit: n,
    };
    onUpdateSettings(updated);
    StorageManager.saveSettings(updated);
    setFeedback('Limites atualizados com sucesso!');
    setTimeout(() => setFeedback(''), 2500);
  };

  // Encrypted Cloud Backup
  const handleExportBackup = async () => {
    setIsBackingUp(true);
    setFeedback('');
    try {
      const fullVault = {
        user,
        transactions: StorageManager.getTransactions(),
        holdings: StorageManager.getHoldings(),
        cryptos: StorageManager.getCryptos(),
        settings,
      };

      const encrypted = await createEncryptedBackup(fullVault, 'peanut_master_seed');
      const blob = new Blob([encrypted], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PeanutBank_EncryptedVault_${new Date().toISOString().slice(0, 10)}.pntbk`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const updatedSettings = {
        ...settings,
        lastBackupDate: new Date().toISOString(),
      };
      onUpdateSettings(updatedSettings);
      StorageManager.saveSettings(updatedSettings);

      setFeedback('Backup criptografado gerado e sincronizado com o cofre Peanut Cloud!');
    } catch {
      setFeedback('Erro ao gerar backup criptografado.');
    } finally {
      setIsBackingUp(false);
      setTimeout(() => setFeedback(''), 3500);
    }
  };

  // Restore Backup
  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      const res = await restoreEncryptedBackup(content);
      if (res.valid && res.data) {
        if (res.data.user) {
          StorageManager.updateCurrentUser(res.data.user);
          onUpdateUser(res.data.user);
        }
        if (res.data.settings) {
          StorageManager.saveSettings(res.data.settings);
          onUpdateSettings(res.data.settings);
        }
        setFeedback('Cofre restaurado com sucesso com verificação de integridade!');
      } else {
        setFeedback(res.error || 'Falha ao restaurar dados.');
      }
      setTimeout(() => setFeedback(''), 3500);
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#190f08] border border-amber-800/40 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-amber-50">
        {/* Header */}
        <div className="p-5 bg-[#22130a] border-b border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-amber-100">Ajustes & Acessibilidade</h2>
              <p className="text-[11px] text-amber-300/60 font-mono">
                Material Design 3 • Android 12+ Experience
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
        <div className="p-5 overflow-y-auto no-scrollbar space-y-6">
          {feedback && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-600/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {/* 1. ACESSIBILIDADE VISUAL & TEMA */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Acessibilidade & Modo Noturno Profundo
            </span>

            {/* Theme mode: Dark / Deep Black / Light */}
            <div className="p-4 rounded-2xl bg-[#120a05] border border-amber-900/40 space-y-3">
              <label className="block text-xs font-semibold text-amber-200">
                Tema de Visualização
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'dark' as const, label: 'Marrom Peanut', icon: Moon },
                  { id: 'deep-black' as const, label: 'Preto Profundo (OLED)', icon: Shield },
                  { id: 'light' as const, label: 'Amendoim Claro', icon: Sun },
                ].map((th) => {
                  const Icon = th.icon;
                  const isActive = settings.themeMode === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => {
                        const updated = { ...settings, themeMode: th.id };
                        onUpdateSettings(updated);
                        StorageManager.saveSettings(updated);
                      }}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                        isActive
                          ? 'bg-amber-800/40 border-amber-500 text-amber-200 shadow-sm'
                          : 'bg-[#180e07] border-amber-900/30 text-amber-400/60 hover:text-amber-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-amber-400" />
                      <span className="text-[11px]">{th.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* High Contrast Toggle for Low Vision */}
              <div
                onClick={() => {
                  const updated = { ...settings, highContrast: !settings.highContrast };
                  onUpdateSettings(updated);
                  StorageManager.saveSettings(updated);
                }}
                className="pt-2 flex items-center justify-between cursor-pointer border-t border-amber-950"
              >
                <div>
                  <span className="text-xs font-bold text-amber-100 block">
                    Modo de Alto Contraste (Baixa Visão)
                  </span>
                  <span className="text-[11px] text-amber-300/60">
                    Otimiza saturação, contornos e visibilidade para melhor leitura
                  </span>
                </div>
                <div
                  className={`w-10 h-6 rounded-full p-1 transition-colors ${
                    settings.highContrast ? 'bg-amber-500' : 'bg-amber-950'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.highContrast ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Font Sizing */}
            <div className="p-4 rounded-2xl bg-[#120a05] border border-amber-900/40 space-y-2">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-100">
                  Tamanho Dinâmico da Fonte
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'small' as const, label: 'Pequeno (14px)' },
                  { id: 'medium' as const, label: 'Médio (16px)' },
                  { id: 'large' as const, label: 'Grande (18px)' },
                  { id: 'xlarge' as const, label: 'Extra (20px)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      const updated = { ...settings, fontSize: f.id };
                      onUpdateSettings(updated);
                      StorageManager.saveSettings(updated);
                    }}
                    className={`py-2 px-1 rounded-xl text-center text-xs border transition-colors ${
                      settings.fontSize === f.id
                        ? 'bg-amber-800/40 border-amber-500 text-amber-200 font-bold'
                        : 'bg-[#180e07] border-amber-900/30 text-amber-300/60'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. LIMITES CUSTOMIZÁVEIS DE SEGURANÇA */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Limites Customizáveis de Transações
            </span>

            <form onSubmit={handleSaveLimits} className="p-4 rounded-2xl bg-[#120a05] border border-amber-900/40 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-amber-300/70 mb-1">
                    Limite Diurno (06h às 20h)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400">
                      R$
                    </span>
                    <input
                      type="number"
                      step="100"
                      value={dayLimit}
                      onChange={(e) => setDayLimit(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#180e07] border border-amber-900/40 rounded-xl text-xs font-mono font-bold text-amber-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-amber-300/70 mb-1">
                    Limite Noturno (20h às 06h)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-400">
                      R$
                    </span>
                    <input
                      type="number"
                      step="100"
                      value={nightLimit}
                      onChange={(e) => setNightLimit(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#180e07] border border-amber-900/40 rounded-xl text-xs font-mono font-bold text-amber-100"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-900/50 hover:bg-amber-900/80 border border-amber-700/50 text-amber-200 text-xs font-bold"
              >
                Salvar Novos Limites
              </button>
            </form>
          </div>

          {/* 3. BACKUP EM NUVEM CRIPTOGRAFADO AUTOMÁTICO */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              Backup em Nuvem Criptografado
            </span>

            <div className="p-4 rounded-2xl bg-[#120a05] border border-amber-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-100">
                    Sincronização Automática
                  </span>
                </div>
                <div
                  onClick={() => {
                    const updated = { ...settings, cloudBackupAuto: !settings.cloudBackupAuto };
                    onUpdateSettings(updated);
                    StorageManager.saveSettings(updated);
                  }}
                  className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${
                    settings.cloudBackupAuto ? 'bg-amber-500' : 'bg-amber-950'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.cloudBackupAuto ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              <p className="text-[11px] text-amber-300/60 leading-relaxed">
                Seus saldos, extratos e carteira são codificados com SHA-256 e protegidos por sua chave biométrica local.
              </p>

              <div className="flex gap-2 pt-1 border-t border-amber-950">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  disabled={isBackingUp}
                  className="flex-1 py-2 px-3 rounded-xl bg-amber-900/40 hover:bg-amber-900/70 border border-amber-800/40 text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  Baixar Cofre (.pntbk)
                </button>

                <label className="flex-1 py-2 px-3 rounded-xl bg-amber-950/60 hover:bg-amber-900/40 border border-amber-800/40 text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Restaurar</span>
                  <input
                    type="file"
                    accept=".pntbk,.json"
                    onChange={handleRestoreFile}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 4. BOTÃO DE EMERGÊNCIA / PÂNICO */}
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/50 space-y-2">
            <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block">
              Zona de Segurança Máxima
            </span>
            <p className="text-xs text-rose-200/70">
              Precisa bloquear seu app imediatamente por perda ou furto do celular? O Bloqueio Rápido congela todas as operações na hora.
            </p>
            <button
              onClick={() => {
                onClose();
                onTriggerEmergencyLock();
              }}
              className="w-full py-2.5 rounded-xl bg-rose-900/60 hover:bg-rose-900/90 border border-rose-600/60 text-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Lock className="w-4 h-4 text-rose-400" />
              Ativar Bloqueio Rápido de Acesso Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
