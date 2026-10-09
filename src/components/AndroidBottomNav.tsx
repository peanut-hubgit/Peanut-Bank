import React from 'react';
import {
  Home,
  PieChart,
  ArrowLeftRight,
  TrendingUp,
  Settings,
  Headphones
} from 'lucide-react';

export type TabType = 'home' | 'statement' | 'pix' | 'investments' | 'settings' | 'support';

interface AndroidBottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenSupport: () => void;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenSupport,
}) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'statement', label: 'Extrato', icon: PieChart },
    { id: 'pix', label: 'PIX & Pagar', icon: ArrowLeftRight },
    { id: 'investments', label: 'Investir', icon: TrendingUp },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-[#160d08]/95 backdrop-blur-md border-t border-amber-900/30 px-2 py-1 max-w-lg mx-auto sm:rounded-t-2xl shadow-2xl"
      aria-label="Navegação principal"
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id as TabType)}
              className="flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] transition-all group focus:outline-none"
              aria-current={isActive ? 'page' : undefined}
            >
              {/* MD3 Active Indicator Pill */}
              <div
                className={`flex items-center justify-center w-12 h-7 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-amber-600/30 text-amber-300 scale-105'
                    : 'text-amber-200/50 hover:text-amber-200'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'stroke-[2.4px] scale-110 text-amber-300' : 'stroke-[1.8px]'
                  }`}
                />
              </div>
              <span
                className={`text-[11px] font-medium mt-1 transition-colors ${
                  isActive ? 'text-amber-200 font-semibold' : 'text-amber-200/50'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* 24/7 Support floating button in bottom bar */}
        <button
          onClick={onOpenSupport}
          className="flex flex-col items-center justify-center py-1.5 px-2 min-w-[50px] transition-all group focus:outline-none"
          title="Suporte 24/7"
          aria-label="Abrir Suporte 24/7"
        >
          <div className="flex items-center justify-center w-10 h-7 rounded-full text-amber-400/80 hover:text-amber-300 transition-colors">
            <Headphones className="w-5 h-5 stroke-[1.8px]" />
          </div>
          <span className="text-[11px] font-medium text-amber-300/60 mt-1">
            Ajuda
          </span>
        </button>
      </div>

      {/* Android 12 Home Gesture Pill Bar indicator */}
      <div className="w-32 h-1 bg-amber-800/40 rounded-full mx-auto mt-1 mb-0.5" />
    </nav>
  );
};
