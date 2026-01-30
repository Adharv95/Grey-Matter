
import React from 'react';
import { SectorDiagnostic as SectorType } from '../types';

interface SectorDiagnosticProps {
  sectors: SectorType[];
}

const SectorDiagnostic: React.FC<SectorDiagnosticProps> = ({ sectors }) => {
  return (
    <div className="bg-[#1f2937]/80 among-border p-4 rounded-3xl h-full flex flex-col border-4 border-black">
      <h3 className="font-orbitron text-[11px] font-black mb-4 text-[#f5f512] flex items-center gap-3 tracking-widest italic uppercase">
        <div className="w-3 h-3 bg-[#f5f512] rounded border-2 border-black"></div>
        SHIP_DIAGNOSTICS
      </h3>
      
      <div className="grid grid-cols-1 gap-3 flex-1 overflow-y-auto pr-1">
        {sectors.map((sector, idx) => (
          <div key={idx} className={`p-3 border-4 border-black rounded-2xl flex justify-between items-center transition-all ${sector.isBreached ? 'bg-[#c51111]/30' : 'bg-black/40'}`}>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`text-[12px] font-black tracking-widest uppercase italic ${sector.isBreached ? 'text-[#c51111]' : 'text-white'}`}>
                  {sector.name}
                </span>
                {sector.isBreached && <span className="text-[8px] bg-white text-black font-black px-1.5 rounded-full border border-black animate-bounce shadow-sm">FIX!</span>}
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 h-3 bg-black border-2 border-black rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                   <div 
                    className={`h-full border-r-2 border-black/30 ${sector.status < 30 ? 'bg-[#c51111]' : 'bg-[#50ef39]'}`} 
                    style={{ width: `${sector.status}%` }}
                   />
                </div>
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="text-[14px] font-orbitron font-black text-white">{sector.status}%</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t-2 border-black/50">
        <div className="text-[9px] text-white/40 font-black mb-2 flex justify-between uppercase italic">
          <span>Skeld Data Stream</span>
          <span className="text-[#38fedc]">OK</span>
        </div>
        <div className="font-mono text-[8px] text-[#38fedc]/60 h-8 overflow-hidden uppercase bg-black/40 p-1 rounded-lg">
          {Array.from({length: 2}).map((_, i) => (
            <div key={i} className="whitespace-nowrap overflow-hidden">
              >> SCAN_RESULT: NO_IMPOSTOR // LOC: {Math.random() > 0.5 ? 'SECURITY' : 'ADMIN'} // {Math.random().toString(36).slice(5)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectorDiagnostic;
