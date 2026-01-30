
import React from 'react';
import { EmergencyAction } from '../types';
import { audioService } from '../services/audioService';

interface SystemControlsProps {
  onAction: (action: EmergencyAction) => void;
  disabled: boolean;
}

const SystemControls: React.FC<SystemControlsProps> = ({ onAction, disabled }) => {
  const handleClick = (action: EmergencyAction) => {
    audioService.playClick();
    onAction(action);
  };

  const TaskButton = ({ label, action, color, accent }: { label: string; action: EmergencyAction; color: string; accent: string }) => (
    <button
      onClick={() => handleClick(action)}
      onMouseEnter={() => !disabled && audioService.playClick()}
      disabled={disabled}
      className={`group relative overflow-hidden p-6 border-4 border-black transition-all active:translate-y-1 active:translate-x-1 disabled:opacity-40 disabled:grayscale ${color} among-border rounded-2xl`}
    >
      <div className={`absolute top-0 left-0 w-full h-2 ${accent} opacity-50`}></div>
      <div className="relative z-10 font-orbitron font-black text-[11px] md:text-sm tracking-tighter uppercase text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
        {label}
      </div>
      <div className="mt-2 text-[8px] font-black text-black/40 uppercase italic">Task ID: {action}</div>
    </button>
  );

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      <TaskButton 
        label="Clear O2 Scrubber" 
        action="VENT_CO2" 
        color="bg-[#38fedc]" 
        accent="bg-white"
      />
      <TaskButton 
        label="Fix Electrical Link" 
        action="REROUTE_POWER" 
        color="bg-[#f5f512]" 
        accent="bg-white"
      />
      <TaskButton 
        label="Seal Skeld Breach" 
        action="SEAL_SECTOR" 
        color="bg-[#c51111]" 
        accent="bg-white"
      />
      <TaskButton 
        label="Reboot MedBay LSS" 
        action="STABILIZE_LS" 
        color="bg-[#50ef39]" 
        accent="bg-white"
      />
    </div>
  );
};

export default SystemControls;
