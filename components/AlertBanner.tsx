
import React from 'react';

interface AlertBannerProps {
  message: string;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ message }) => {
  return (
    <div className="bg-[#c51111] border-y-4 border-black py-3 px-6 overflow-hidden relative meeting-siren">
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-black animate-bounce shadow-md">
            <span className="text-[#c51111] font-black text-xs">!</span>
          </div>
          <span className="font-orbitron font-black text-white tracking-[0.3em] text-sm md:text-xl italic uppercase">
            SABOTAGE DETECTED: {message}
          </span>
        </div>
        <div className="hidden md:block font-mono text-[10px] text-white/80 font-black tracking-widest bg-black/20 px-3 py-1 rounded">
          STATUS: IMPOSTOR_ACTIVITY_HIGH
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 overflow-hidden">
        <div className="h-full bg-white animate-[marquee_2s_linear_infinite]" style={{ width: '30%' }}></div>
      </div>
    </div>
  );
};

export default AlertBanner;
