
import React from 'react';
import { CrewStatus } from '../types';

interface BiometricMonitorProps {
  crew: CrewStatus[];
}

const CrewmateIcon = ({ color }: { color: string }) => (
  <svg width="40" height="50" viewBox="0 0 40 50" className="drop-shadow-md">
    {/* Body */}
    <path d="M5 15 Q5 5 20 5 Q35 5 35 15 L35 35 Q35 45 28 45 L25 45 L25 48 Q25 50 22 50 L18 50 Q15 50 15 48 L15 45 L12 45 Q5 45 5 35 Z" fill={color} stroke="black" strokeWidth="3" />
    {/* Visor */}
    <path d="M20 12 Q32 12 32 18 Q32 24 20 24 Q8 24 8 18 Q8 12 20 12" fill="#88d8f1" stroke="black" strokeWidth="2.5" />
    <path d="M15 15 Q25 15 25 18" fill="white" opacity="0.5" stroke="none" />
    {/* Backpack */}
    <path d="M2 18 Q0 18 0 23 L0 35 Q0 40 2 40" fill={color} stroke="black" strokeWidth="3" />
  </svg>
);

const BiometricMonitor: React.FC<BiometricMonitorProps> = ({ crew }) => {
  const getCrewHex = (name: string) => {
    if (name.includes('Red')) return '#c51111';
    if (name.includes('Cyan')) return '#38fedc';
    if (name.includes('Lime')) return '#50ef39';
    return '#717d7e';
  };

  return (
    <div className="among-panel p-6 h-full flex flex-col">
      <h3 className="font-orbitron text-sm font-black mb-6 text-white flex items-center gap-3 tracking-widest uppercase italic">
        <div className="w-4 h-4 bg-[#c51111] rounded-full border-4 border-black animate-pulse"></div>
        VITAL_SCANS
      </h3>
      
      <div className="space-y-4 flex-1">
        {crew.map((member) => (
          <div key={member.id} className="relative p-4 bg-black/40 border-4 border-black rounded-3xl overflow-hidden among-border">
            <div className="flex items-center gap-5">
              <CrewmateIcon color={getCrewHex(member.name)} />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[12px] font-black text-white uppercase italic tracking-tighter">{member.name}</span>
                  <span className={`text-[10px] font-black px-3 py-0.5 rounded-full border-2 border-black ${member.condition === 'CRITICAL' ? 'bg-[#c51111] text-white animate-pulse' : 'bg-white text-black'}`}>
                    {member.condition === 'CRITICAL' ? 'DEAD?' : member.condition === 'DISTRESS' ? 'SUS' : 'SAFE'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-black border-2 border-black rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${member.heartRate > 100 ? 'bg-[#c51111]' : 'bg-[#38fedc]'}`} 
                      style={{width: `${Math.min(100, member.heartRate/1.5)}%`}}
                    ></div>
                  </div>
                  <span className="text-[11px] font-black font-orbitron text-white">{member.heartRate.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BiometricMonitor;
