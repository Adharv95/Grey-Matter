import React, { useState, useEffect, useCallback } from 'react';
import AlertBanner from './components/AlertBanner.tsx';
import TelemetryOverlay from './components/TelemetryOverlay.tsx';
import SystemControls from './components/SystemControls.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import BiometricMonitor from './components/BiometricMonitor.tsx';
import SectorDiagnostic from './components/SectorDiagnostic.tsx';
import { SystemState, LogEntry, EmergencyAction, CrewStatus, SectorDiagnostic as SectorType } from './types.ts';
import { audioService } from './services/audioService.ts';

type Phase = 'INTRO' | 'LOGIN' | 'DASHBOARD';

const SkeldSilhouette = () => (
  <div className="skeld-silhouette absolute pointer-events-none">
    <svg width="600" height="300" viewBox="0 0 400 200">
      <path d="M50 100 L150 50 L350 70 L380 100 L350 130 L150 150 Z" fill="#2d3748" />
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1a0808]/40 p-4">
      <div className="mb-12 text-center">
        <h1 className="neon-logo text-7xl md:text-[10rem] mb-4">AMONG US</h1>
        <div className="login-header-banner inline-block">
          <span className="text-[#f5f512] font-orbitron font-black text-xl md:text-2xl tracking-[0.5em] uppercase">Secure Login</span>
        </div>
      </div>

      <div className="identity-verify-window w-full max-w-2xl p-8 rounded-md">
        <div className="window-corner-screw top-2 left-2"></div>
        <div className="window-corner-screw top-2 right-2"></div>
        <div className="window-corner-screw bottom-2 left-2"></div>
        <div className="window-corner-screw bottom-2 right-2"></div>

        <div className="flex justify-between items-center mb-6 border-b border-gray-600 pb-4">
          <div>
            <h2 className="text-white font-orbitron font-bold text-2xl tracking-widest uppercase italic">Identity Verify</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-[#50ef39]"></div>
              <span className="text-[#38fedc] text-[10px] font-bold tracking-widest uppercase">The Skeld // Term_04</span>
            </div>
          </div>
          <span className="text-[#ef7d0e] font-bold text-[10px] border border-[#ef7d0e] px-1.5 py-0.5 rounded uppercase">Asset #932</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { label: 'Username', val: formData.username, icon: 'user' },
            { label: 'Email Address', val: formData.email, icon: 'mail' },
            { label: 'Comms ID / Phone', val: formData.comms, icon: 'phone' },
            { label: 'Registration No.', val: formData.reg, icon: 'tag' }
          ].map((field) => (
            <div key={field.label} className="space-y-1.5">
              <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest block">{field.label}</label>
              <div className="relative">
                <input readOnly value={field.val} className="w-full input-box focus:outline-none" />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-600 pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#f5f512] text-[10px] font-black uppercase italic tracking-widest">Pending Tasks:</span>
            <span className="text-[#f5f512] text-[10px] font-black uppercase tracking-widest">3 Remaining</span>
          </div>
          <div className="task-progress-container w-full mb-4">
            <div className="task-progress-fill" style={{ width: '45%' }}></div>
          </div>
          <div className="space-y-1 text-gray-400 italic text-[10px] tracking-widest">
            <div><span className="text-[#50ef39]">✓</span> Calibrate Distributor</div>
            <div><span className="text-[#c51111]">!</span> Fix Wiring (Electrical)</div>
          </div>
        </div>

        <button 
          onClick={onLogin}
          className="w-full mt-10 py-5 login-button-cyan text-white font-orbitron font-black text-3xl tracking-widest uppercase italic flex items-center justify-center gap-4"
        >
          Initiate Login 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/></svg>
        </button>

        <div className="flex justify-between items-center mt-6 text-[9px] text-gray-500 font-bold tracking-widest uppercase">
          <span>Sys.05.99.2</span>
          <span>Secure_Link: Established</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full station-footer p-5 flex justify-between items-center z-50">
        <div className="flex gap-8">
          <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#50ef39]"></div> REACTORS: STABLE</span>
          <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#f5f512]"></div> O2: FILTERING</span>
        </div>
        <div className="text-[#c51111] overflow-hidden whitespace-nowrap flex-1 mx-10 hidden lg:block">
          <div className="marquee-warning uppercase italic tracking-[0.2em]">Warning: Suspicious activity detected in ventilation systems // Sector 7G // Check</div>
        </div>
        <div className="font-orbitron uppercase text-gray-400">Mira_HQ // Terminal_Access</div>
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

  const [crew, setCrew] = useState<CrewStatus[]>([
    { id: 'RED-01', name: 'RED CREWMATE', heartRate: 75, oxygenSat: 98, condition: 'STABLE' },
    { id: 'CYAN-02', name: 'CYAN CREWMATE', heartRate: 82, oxygenSat: 97, condition: 'STABLE' },
    { id: 'LIME-03', name: 'LIME CREWMATE', heartRate: 70, oxygenSat: 99, condition: 'STABLE' }
  ]);

  const [sectors, setSectors] = useState<SectorType[]>([
    { name: 'Electrical', status: 40, load: 85, isBreached: true },
    { name: 'O2 Room', status: 32, load: 12, isBreached: true },
    { name: 'MedBay', status: 95, load: 20, isBreached: false },
    { name: 'Reactor', status: 18, load: 95, isBreached: true }
  ]);

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '14:22:01', level: 'CRITICAL', message: 'Oxygen sabotaged in O2 Room.' },
    { id: '2', timestamp: '14:23:45', level: 'WARN', message: 'Lights flickering in Electrical.' },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (phase !== 'DASHBOARD') return;
    const timer = setInterval(() => {
      setSystemState(prev => {
        const nextO2 = Math.max(0, prev.oxygen - 0.2);
        return {
          ...prev,
          oxygen: nextO2,
          power: Math.max(0, prev.power - 0.1),
          integrity: Math.max(0, prev.integrity - 0.05),
        };
      });
    }, 3000);
    return () => clearInterval(timer);
  }, [phase]);

  const handleAction = useCallback((action: EmergencyAction) => {
    setIsProcessing(true);
    audioService.playWhir();
    setTimeout(() => {
      setSystemState(prev => {
        let newState = { ...prev };
        if (action === 'VENT_CO2') newState.co2Levels -= 1000;
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
        className="min-h-screen flex flex-col items-center justify-center relative cursor-pointer bg-black overflow-hidden"
        onClick={() => {
          audioService.init();
          setPhase('LOGIN');
        }}
      >
        <SkeldSilhouette />
        <div className="z-10 text-center animate-pulse">
          <h1 className="font-orbitron font-black text-white text-5xl mb-4 tracking-[0.4em] italic">System Overload</h1>
          <p className="font-mono text-[#38fedc] text-sm uppercase tracking-widest opacity-70 italic">Establish Handshake</p>
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
            <div className="w-20 h-20 bg-[#c51111] border-[8px] border-black rounded-3xl flex items-center justify-center font-orbitron font-black text-white italic text-4xl shadow-[8px_8px_0px_rgba(0,0,0,0.5)]">
               !!!
            </div>
            <div>
              <h1 className="font-orbitron font-black text-4xl tracking-tighter text-[#38fedc] italic uppercase">Terminal_Skeld_Override</h1>
              <p className="text-xs text-white/40 font-black tracking-[0.6em] uppercase italic mt-1">Priority Override Active</p>
            </div>
          </div>
          <div className="flex gap-16 items-center">
             <div className="text-right">
              <div className="text-[12px] text-white/40 font-black uppercase italic tracking-widest">Atmosphere</div>
              <div className={`font-orbitron text-4xl font-black ${systemState.oxygen < 30 ? 'text-[#c51111] animate-pulse' : 'text-[#38fedc]'}`}>{systemState.oxygen.toFixed(1)}%</div>
            </div>
            <div className="h-16 w-3 bg-black rounded-full"></div>
            <div className="text-right">
              <div className="text-[12px] text-white/40 font-black uppercase italic tracking-widest">Integrity</div>
              <div className={`font-orbitron text-4xl font-black ${systemState.integrity < 30 ? 'text-[#c51111] animate-pulse' : 'text-white'}`}>{systemState.integrity.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </header>

      <AlertBanner message="SYSTEM COMPROMISED // FIX SHIP TASKS" />

      <main className="max-w-[1800px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-4">
        <div className="lg:col-span-3 flex flex-col gap-12">
          <BiometricMonitor crew={crew} />
          <TelemetryOverlay state={systemState} />
        </div>

        <div className="lg:col-span-6 flex flex-col gap-12">
          <div className="among-panel relative overflow-hidden group border-[10px] border-black aspect-video rounded-[2rem] shadow-[15px_15px_0px_rgba(0,0,0,0.4)]">
             <div className="absolute inset-0 bg-black pointer-events-none">
                <div className="absolute top-10 right-10 flex items-center gap-4 z-10 text-white font-black uppercase italic">
                   <div className="w-5 h-5 bg-red-600 rounded-full animate-pulse border-4 border-black"></div>
                   <span>NAV_CAM_01</span>
                </div>
                <svg viewBox="0 0 100 100" className="w-full h-full text-white/5">
                   <path d="M10 30 L30 10 L70 10 L90 30 L90 70 L70 90 L30 90 L10 70 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
             </div>
             
             <div className="absolute top-10 left-10 font-orbitron text-2xl text-[#f5f512] font-black italic drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] z-10">
               LOC: NAVIGATION<br/>
               <span className="text-[#38fedc] text-lg">PWR: {systemState.power.toFixed(1)}%</span>
             </div>

            <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black via-black/90 to-transparent z-10">
              <SystemControls onAction={handleAction} disabled={isProcessing} />
            </div>
          </div>
          
          <div className="among-panel p-8 border-[8px] border-black rounded-[2rem] min-h-[300px]">
            <h3 className="text-sm font-black text-white/50 mb-6 tracking-widest uppercase italic">Diagnostic Feed</h3>
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