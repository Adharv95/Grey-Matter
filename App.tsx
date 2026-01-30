import React, { useState, useEffect, useCallback } from 'react';
import AlertBanner from './components/AlertBanner';
import TelemetryOverlay from './components/TelemetryOverlay';
import SystemControls from './components/SystemControls';
import AIAssistant from './components/AIAssistant';
import BiometricMonitor from './components/BiometricMonitor';
import SectorDiagnostic from './components/SectorDiagnostic';
import { SystemState, LogEntry, EmergencyAction, CrewStatus, SectorDiagnostic as SectorType } from './types';
import { audioService } from './services/audioService';

type Phase = 'INTRO' | 'LOGIN' | 'DASHBOARD';

const SkeldSilhouette = () => (
  <div className="skeld-silhouette absolute pointer-events-none opacity-20">
    <svg width="600" height="300" viewBox="0 0 400 200" className="animate-[pulse_10s_infinite]">
      <path d="M50 100 L150 50 L350 70 L380 100 L350 130 L150 150 Z" fill="#2d3748" stroke="#38fedc" strokeWidth="2" />
      <circle cx="280" cy="85" r="15" fill="#1a202c" />
    </svg>
  </div>
);

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [formData] = useState({
    username: 'CREWMATE_01',
    email: 'user@mira.hq',
    comms: 'CH-192-883',
    reg: 'ID-734-X2'
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a0808]/40 p-4 relative overflow-hidden">
      <div className="mb-12 text-center z-10">
        <h1 className="neon-logo text-7xl md:text-[10rem] mb-4">AMONG US</h1>
        <div className="login-header-banner inline-block px-12 py-2 border-2 border-[#5a1111] bg-[#2a0a0a]">
          <span className="text-[#f5f512] font-orbitron font-black text-xl md:text-2xl tracking-[0.5em] uppercase">Emergency Terminal</span>
        </div>
      </div>

      <div className="identity-verify-window w-full max-w-2xl p-8 rounded-md z-10 relative">
        <div className="flex justify-between items-center mb-6 border-b border-gray-600 pb-4">
          <div>
            <h2 className="text-white font-orbitron font-bold text-2xl tracking-widest uppercase italic">Identity Verify</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-[#50ef39]"></div>
              <span className="text-[#38fedc] text-[10px] font-bold tracking-widest uppercase italic">Station_Skeld // Aegis-7</span>
            </div>
          </div>
          <span className="text-[#ef7d0e] font-bold text-[10px] border border-[#ef7d0e] px-2 py-1 rounded uppercase">Level 5 Auth</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { label: 'Username', val: formData.username },
            { label: 'Email Address', val: formData.email },
            { label: 'Comms ID', val: formData.comms },
            { label: 'Registration No.', val: formData.reg }
          ].map((field) => (
            <div key={field.label} className="space-y-1.5">
              <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest block">{field.label}</label>
              <input readOnly value={field.val} className="w-full bg-white text-black p-2 font-bold text-sm border-r-8 border-[#cbd5e0] focus:outline-none" />
            </div>
          ))}
        </div>

        <button 
          onClick={onLogin}
          className="w-full mt-6 py-5 login-button-cyan text-white font-orbitron font-black text-3xl tracking-widest uppercase italic shadow-[0_5px_0_#064e3b] transition-transform active:translate-y-1"
        >
          Access Terminal
        </button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [phase, setPhase] = useState<Phase>('INTRO');
  const [systemState, setSystemState] = useState<SystemState>({
    oxygen: 45.5,
    power: 28.2,
    water: 70.1,
    integrity: 35.8,
    temperature: 28.5,
    co2Levels: 1750,
  });

  const [crew] = useState<CrewStatus[]>([
    { id: 'RED-01', name: 'RED CREWMATE', heartRate: 75, oxygenSat: 98, condition: 'STABLE' },
    { id: 'CYAN-02', name: 'CYAN CREWMATE', heartRate: 82, oxygenSat: 97, condition: 'STABLE' },
    { id: 'LIME-03', name: 'LIME CREWMATE', heartRate: 70, oxygenSat: 99, condition: 'STABLE' }
  ]);

  const [sectors] = useState<SectorType[]>([
    { name: 'Electrical', status: 40, load: 85, isBreached: true },
    { name: 'O2 Room', status: 32, load: 12, isBreached: true },
    { name: 'MedBay', status: 95, load: 20, isBreached: false },
    { name: 'Reactor', status: 18, load: 95, isBreached: true }
  ]);

  const [logs] = useState<LogEntry[]>([
    { id: '1', timestamp: '14:22:01', level: 'CRITICAL', message: 'Oxygen sabotaged in O2 Room.' },
    { id: '2', timestamp: '14:23:45', level: 'WARN', message: 'Lights flickering in Electrical.' },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (phase !== 'DASHBOARD') return;
    const timer = setInterval(() => {
      setSystemState(prev => ({
        ...prev,
        oxygen: Math.max(0, prev.oxygen - 0.2),
        power: Math.max(0, prev.power - 0.1),
        integrity: Math.max(0, prev.integrity - 0.05),
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, [phase]);

  const handleAction = useCallback((action: EmergencyAction) => {
    setIsProcessing(true);
    audioService.playWhir();
    setTimeout(() => {
      setSystemState(prev => {
        let newState = { ...prev };
        if (action === 'VENT_CO2') newState.co2Levels = 500;
        if (action === 'STABILIZE_LS') newState.oxygen = 100;
        return newState;
      });
      setIsProcessing(false);
      audioService.playSuccess();
    }, 1500);
  }, []);

  if (phase === 'INTRO') {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center cursor-pointer bg-black overflow-hidden"
        onClick={() => {
          audioService.init();
          setPhase('LOGIN');
        }}
      >
        <SkeldSilhouette />
        <div className="z-10 text-center animate-pulse">
          <h1 className="font-orbitron font-black text-white text-5xl mb-4 tracking-[0.4em] italic uppercase">Aegis-7 Station</h1>
          <p className="font-mono text-[#38fedc] text-sm uppercase tracking-widest opacity-70 italic">Click to Initiate Handshake</p>
        </div>
      </div>
    );
  }

  if (phase === 'LOGIN') {
    return <LoginPage onLogin={() => {
      audioService.playSuccess();
      setPhase('DASHBOARD');
    }} />;
  }

  return (
    <div className="min-h-screen bg-[#121b28]/50 pb-20">
      <header className="relative z-20 border-b-8 border-black bg-[#121b28] p-8 sticky top-0 shadow-2xl">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-10">
            <div className="w-20 h-20 bg-[#c51111] border-[8px] border-black rounded-3xl flex items-center justify-center font-orbitron font-black text-white italic text-4xl shadow-[8px_8px_0px_rgba(0,0,0,0.5)]">!</div>
            <div>
              <h1 className="font-orbitron font-black text-4xl tracking-tighter text-[#38fedc] italic uppercase">Terminal_Skeld_Override</h1>
              <p className="text-xs text-white/40 font-black tracking-[0.6em] uppercase italic mt-1">Priority_Emergency_Level_4</p>
            </div>
          </div>
          <div className="flex gap-16 items-center">
            <div className="text-right">
              <div className="text-[12px] text-white/40 font-black uppercase italic tracking-widest">O2 Status</div>
              <div className={`font-orbitron text-4xl font-black ${systemState.oxygen < 30 ? 'text-[#c51111] animate-pulse' : 'text-[#38fedc]'}`}>{systemState.oxygen.toFixed(1)}%</div>
            </div>
            <div className="h-16 w-3 bg-black rounded-full"></div>
            <div className="text-right">
              <div className="text-[12px] text-white/40 font-black uppercase italic tracking-widest">Hull Health</div>
              <div className={`font-orbitron text-4xl font-black ${systemState.integrity < 30 ? 'text-[#c51111] animate-pulse' : 'text-white'}`}>{systemState.integrity.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </header>

      <AlertBanner message="CRITICAL SYSTEM FAILURE: FIX SHIP TASKS" />

      <main className="max-w-[1800px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4">
        <div className="lg:col-span-3 flex flex-col gap-12">
          <BiometricMonitor crew={crew} />
          <TelemetryOverlay state={systemState} />
        </div>

        <div className="lg:col-span-6 flex flex-col gap-12">
          <div className="among-panel relative overflow-hidden group border-[10px] border-black aspect-video rounded-[2rem] shadow-[15px_15px_0px_rgba(0,0,0,0.4)]">
             <div className="absolute inset-0 bg-black/40 pointer-events-none z-0"></div>
             <div className="absolute top-10 right-10 flex items-center gap-4 z-10 text-white font-black uppercase italic">
                <div className="w-5 h-5 bg-red-600 rounded-full animate-pulse border-4 border-black"></div>
                <span>NAV_CAM_ONLINE</span>
             </div>
             
             <div className="absolute top-10 left-10 font-orbitron text-2xl text-[#f5f512] font-black italic z-10">
               LOC: NAVIGATION<br/>
               <span className="text-[#38fedc] text-lg">PWR_LEVEL: {systemState.power.toFixed(1)}%</span>
             </div>

            <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
              <SystemControls onAction={handleAction} disabled={isProcessing} />
            </div>
          </div>
          
          <div className="among-panel p-8 border-[8px] border-black min-h-[300px]">
            <h3 className="text-sm font-black text-white/50 mb-6 tracking-widest uppercase italic">Diagnostic_Feed</h3>
            <div className="space-y-3">
              {logs.map(log => (
                <div key={log.id} className="text-[13px] border-l-8 border-black pl-4 bg-black/30 p-3 rounded-2xl">
                  <span className="text-white/30 italic">[{log.timestamp}]</span>{' '}
                  <span className={log.level === 'CRITICAL' ? 'text-[#c51111]' : 'text-[#38fedc]'}>{log.level}:</span>{' '}
                  <span className="text-white uppercase italic">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-12">
           <AIAssistant systemState={systemState} />
           <SectorDiagnostic sectors={sectors} />
        </div>
      </main>
    </div>
  );
};

export default App;