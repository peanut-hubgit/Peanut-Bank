import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
}

export const PeanutLogo: React.FC<LogoProps> = ({ size = 'md', showTagline = false }) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', peanut: 22 },
    md: { icon: 'w-9 h-9', text: 'text-xl', peanut: 28 },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', peanut: 38 },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', peanut: 50 },
  };

  const current = sizeMap[size];

  return (
    <div className="flex items-center gap-3 select-none">
      <div
        className={`${current.icon} rounded-2xl bg-gradient-to-br from-[#854d0e] via-[#b45309] to-[#d97706] p-[2px] shadow-lg shadow-amber-950/30 flex items-center justify-center relative overflow-hidden`}
        aria-hidden="true"
      >
        <div className="w-full h-full rounded-[14px] bg-[#1d120a] flex items-center justify-center relative">
          {/* Peanut Stylized SVG Emblem */}
          <svg
            viewBox="0 0 40 40"
            className="w-4/5 h-4/5 text-[#f59e0b] drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top lobe */}
            <circle cx="16" cy="16" r="10" fill="url(#peanut-grad1)" />
            {/* Bottom lobe */}
            <circle cx="24" cy="24" r="11" fill="url(#peanut-grad2)" />
            {/* Bridge */}
            <path
              d="M12 21 C 18 19, 22 23, 28 20"
              stroke="#fef3c7"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
            {/* Organic texture lines */}
            <path
              d="M11 14 C 14 16, 17 14, 20 16"
              stroke="#78350f"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M20 25 C 23 27, 26 25, 29 27"
              stroke="#78350f"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="peanut-grad1" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f59e0b" />
                <stop offset="1" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="peanut-grad2" x1="13" y1="13" x2="35" y2="35" gradientUnits="userSpaceOnUse">
                <stop stopColor="#d97706" />
                <stop offset="1" stopColor="#78350f" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight ${current.text} text-[#fef3c7]`}>
            Peanut
          </span>
          <span className={`font-light tracking-tight ${current.text} text-[#d97706]`}>
            Bank
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] font-medium tracking-wide text-amber-200/70 uppercase mt-0.5">
            Banco Digital Seguro
          </span>
        )}
      </div>
    </div>
  );
};
