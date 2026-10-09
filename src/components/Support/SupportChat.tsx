import React, { useState } from 'react';
import {
  X,
  Send,
  Headphones,
  Bot,
  User,
  ShieldCheck,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { PeanutLogo } from '../Logo';

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const SupportChat: React.FC<SupportChatProps> = ({ isOpen, onClose, userName }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Olá ${userName.split(' ')[0]}! Eu sou o assistente virtual do Peanut Bank 24/7. Como posso ajudar com sua conta, transferências PIX ou investimentos hoje?`,
      time: 'Agora',
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const quickQuestions = [
    'Como funciona o limite noturno do PIX?',
    'Quando rende o CDB Peanut 115% CDI?',
    'Como funciona o Bloqueio Rápido?',
    'O que é o painel beta PAFB?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Generate intelligent assistant answer
    setTimeout(() => {
      let botReply = 'Entendi sua solicitação! Nossa equipe Peanut 24/7 está monitorando suas transações. Todas as operações contam com proteção SPI e criptografia de ponta a ponta.';

      const lower = text.toLowerCase();
      if (lower.includes('noturno') || lower.includes('limite')) {
        botReply = 'O limite noturno é uma medida de proteção do Banco Central válida entre 20h e 06h. Você pode ajustar esse limite livremente na aba Ajustes > Limites Customizáveis de Segurança.';
      } else if (lower.includes('cdb') || lower.includes('rende') || lower.includes('investimento')) {
        botReply = 'O CDB Peanut rende 115% do CDI com liquidez diária e proteção do FGC (Fundo Garantidor de Créditos) até R$ 250 mil. Os rendimentos caem todo dia útil na sua conta de investimentos!';
      } else if (lower.includes('bloqueio') || lower.includes('pânico') || lower.includes('emergência')) {
        botReply = 'O botão de Bloqueio Rápido (escudo vermelho no topo) congela imediatamente todos os acessos da sua conta caso você perca seu telefone. Para reativar, basta confirmar sua biometria ou PIN mestre.';
      } else if (lower.includes('pafb') || lower.includes('beta')) {
        botReply = 'O PAFB (Painel de Administração de Funções Beta) é exclusivo para o Usuário #1 (Administrador). Ele permite injetar saldo em conta, catalogar novas criptomoedas, ver logs de auditoria e testar inovações antes do lançamento oficial!';
      }

      const botMsg: Message = {
        id: `b_${Date.now()}`,
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[#190f08] border border-amber-800/40 rounded-t-3xl sm:rounded-3xl max-w-lg w-full h-[85vh] flex flex-col shadow-2xl text-amber-50 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#23140b] border-b border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-amber-100">Suporte Peanut 24/7</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-emerald-400 font-medium">Online agora • Resposta imediata</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-amber-900/40 text-amber-300"
            aria-label="Fechar suporte"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3 bg-[#130a05]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                  m.sender === 'user'
                    ? 'bg-amber-600 text-amber-950 font-bold'
                    : 'bg-amber-950 border border-amber-700/50 text-amber-300'
                }`}
              >
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`p-3.5 rounded-2xl max-w-[80%] text-xs leading-relaxed space-y-1 ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-[#9a3412] to-[#b45309] text-amber-50 rounded-tr-none'
                    : 'bg-[#1c1109] border border-amber-900/40 text-amber-100 rounded-tl-none'
                }`}
              >
                <p>{m.text}</p>
                <span className="text-[10px] text-amber-400/50 block text-right">
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {/* Quick FAQ Pills */}
          <div className="pt-2">
            <span className="text-[10px] text-amber-400/60 font-semibold uppercase block mb-1.5">
              Dúvidas frequentes:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSendMessage(q)}
                  className="px-2.5 py-1 rounded-xl bg-[#20120a] hover:bg-[#2b170c] border border-amber-900/40 text-amber-200 text-[11px] text-left transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Field */}
        <div className="p-3 bg-[#190f08] border-t border-amber-900/40 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua dúvida ou comando..."
            className="flex-1 px-4 py-2.5 bg-[#120a05] border border-amber-900/50 rounded-2xl text-xs text-amber-100 placeholder:text-amber-700/50 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-[#9a3412] to-[#d97706] hover:brightness-110 text-amber-950 font-bold transition-all active:scale-95"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
