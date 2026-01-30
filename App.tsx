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

const SkeldShip = () => (
  <div className="skeld-fly absolute pointer-events-none opacity-40">
    <svg width="450" height="220" viewBox="0 0 400 200">
      <path d="M50 100 L150 50 L350 70 L380 100 L350 130 L150 150 Z" fill="#2d3748" stroke="#000" strokeWidth="2" />
      <circle cx="280" cy="85" r="18" fill="#1a202c" />
      <rect x="70" y="80" width="30" height="10" fill="#c51111" />
      <rect x="70" y="110" width="30" height="10" fill="#c51111" />
    </svg>
  </div>
);

const LoginPanel = ({ onStart }: { onStart: () => void }) => {
  const [formData, setFormData] = useState({
    username: 'CREWMATE_01',
    email: 'user@mira.hq',
    comms: 'CH-192-883',
    reg: 'ID-734-X2'
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 p-6 bg-[#000]/20">
      <div className="mb-12 text-center">
        <h1 className="font-orbitron font-black text-6xl md:text-[10rem] tracking-tight neon-text leading-none">AMONG US</h1>
        <div className="secure-login-plaque inline-block mt-4 py-3 px-16">
          <span className="text-[#f5f512] font-orbitron font-bold tracking-[0.6em] text-2xl uppercase">Secure Login</span>
        </div>
      </div>

      <div className="identity-panel w-full max-w-3xl p-10 rounded-lg relative overflow-hidden">
        <div className="screw top-3 left-3"></div>
        <div className="screw top-3 right-3"></div>
        <div className="screw bottom-3 left-3"></div>
        <div className="screw bottom-3 right-3"></div>

        <div className="flex justify-between items-start mb-8 border-b border-gray-600 pb-6">
          <div>
            <h2 className="text-white font-orbitron font-bold text-3xl tracking-widest uppercase italic">Identity Verify</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#50ef39]"></div>
              <span className="text-[#38fedc] text-xs font-bold tracking-[0.2em]">THE SKELD // TERM_04</span>
            </div>
          </div>
          <span className="text-[#ef7d0e] font-bold text-xs border border-[#ef7d0e] px-2 py-0.5 rounded uppercase">Asset #932</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          {[
            { label: 'Username', key: 'username', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
            { label: 'Email Address', key: 'email', icon: 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' },
            { label: 'Comms ID / Phone', key: 'comms', icon: 'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z' },
            { label: 'Registration No.', key: 'reg', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' }
          ].map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] block">{field.label}</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d={field.icon}/></svg>
                </div>
                <input 
                  type="text" 
                  value={(formData as any)[field.key]}
                  onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                  className="w-full input-field px-12 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-[#38fedc]/50 transition-all" 
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-600 pt-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[#f5f512] text-[11px] font-black uppercase italic tracking-[0.3em]">Pending Tasks:</span>
            <span className="text-[#f5f512] text-[11px] font-black uppercase tracking-widest">3 Remaining</span>
          </div>
          <div className="progress-track w-full mb-6">
            <div className="progress-fill" style={{ width: '45%' }}></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-xs text-gray-400 italic">
              <span className="text-[#50ef39] font-bold">✓</span> Calibrate Distributor
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400 italic">
              <span className="text-[#c51111] font-bold">!</span> Fix Wiring (Electrical)
            </div>
          </div>
        </div>

        <button 
          onClick={onStart}
          className="w-full mt-10 py-5 login-button-textured text-white font-orbitron font-black text-3xl tracking-[0.3em] uppercase italic flex items-center justify-center gap-4 transition-transform hover:brightness-110 active:scale-95"
        >
          Initiate Login 
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/></svg>
        </button>

        <div className="flex justify-between items-center mt-8 text-[10px] text-gray-500 font-bold tracking-[0.4em]">
          <span>SYS.05.99.2</span>
          <span>SECURE_LINK: ESTABLISHED</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-6 flex justify-between items-center text-[11px] text-gray-400 font-black tracking-[0.2em] footer-access z-50">
        <div className="flex gap-8">
          <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#50ef39]"></div> REACTORS: STABLE</span>
          <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#f5f512]"></div> O2: FILTERING</span>
        </div>
        <div className="text-[#c51111] animate-pulse uppercase italic tracking-widest hidden lg:block">Warning: Suspicious activity detected in ventilation systems // Sector 7G // Check</div>
        <div className="font-orbitron">MIRA_HQ // TERMINAL_ACCESS</div>
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
        const nextCO2 = prev.co2Levels + 12;
        
        setCrew(prevCrew => prevCrew.map(c => ({
          ...c,
          heartRate: nextO2 < 35 ? 140 + (Math.random() * 20) : 72 + (Math.random() * 15),
          oxygenSat: Math.max(45, 98 - (nextCO2 / 100)),
          condition: nextO2 < 25 ? 'CRITICAL' : (nextO2 < 40 ? 'DISTRESS' : 'STABLE')
        })));

        return {
          ...prev,
          oxygen: nextO2,
          power: Math.max(0, prev.power - 0.15),
          co2Levels: nextCO2,
          integrity: Math.max(0, prev.integrity - 0.1),
        };
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [phase]);

  const handleAction = useCallback((action: EmergencyAction) => {
    setIsProcessing(true);
    audioService.playWhir();
    
    setTimeout(() => {
      setSystemState(prev => {
        let newState = { ...prev };
        switch (action) {
          case 'VENT_CO2':
            newState.co2Levels = Math.max(400, prev.co2Levels - 1800);
            newState.power -= 10;
            break;
          case 'REROUTE_POWER':
            newState.power = Math.min(100, prev.power + 50);
            break;
          case 'SEAL_SECTOR':
            newState.integrity = Math.min(100, prev.integrity + 40);
            break;
          case 'STABILIZE_LS':
            newState.oxygen = Math.min(100, prev.oxygen + 40);
            break;
        }
        return newState;
      });

      audioService.playSuccess();
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        level: 'INFO',
        message: `PROTOCOL: ${action} EXECUTED.`
      };
      setLogs(prev => [newLog, ...prev].slice(0, 10));
      setIsProcessing(false);
    }, 1200);
  }, []);

  if (phase === 'INTRO') {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center relative cursor-pointer overflow-hidden bg-black"
        onClick={() => {
          audioService.init();
          audioService.playSuccess();
          setPhase('LOGIN');
        }}
      >
        <SkeldShip />
        <div className="z-20 text-center space-y-6">
          <h1 className="font-orbitron font-black text-white text-5xl mb-2 tracking-[0.4em] drop-shadow-2xl italic uppercase animate-pulse">
            System Detected
          </h1>
          <p className="font-mono text-[#38fedc] text-sm uppercase tracking-[0.6em] opacity-80">
            Click to Establish Secure Link
          </p>
        </div>
      </div>
    );
  }

  if (phase === 'LOGIN') {
    return <LoginPanel onStart={() => setPhase('DASHBOARD')} />;
  }

  return (
    <div className="min-h-screen relative overflow-y-auto bg-black/30 pb-32">
      <header className="relative z-20 border-b-8 border-black bg-[#121b28] p-8 sticky top-0 shadow-2xl">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-10">
            <div className="w-24 h-24 bg-[#c51111] border-[10px] border-black among-border rounded-[2rem] flex items-center justify-center font-orbitron font-black text-white italic text-5xl shadow-[10px_10px_0px_rgba(0,0,0,0.5)]">
               !!!
            </div>
            <div>
              <h1 className="font-orbitron font-black text-5xl tracking-tighter text-[#38fedc] italic uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">Terminal_Skeld_Core</h1>
              <p className="text-sm text-white/40 font-black tracking-[0.8em] uppercase italic mt-1">Priority Override Active</p>
            </div>
          </div>
          <div className="flex gap-20 items-center">
             <div className="text-right">
              <div className="text-[14px] text-white/40 font-black uppercase italic tracking-[0.2em]">O2 Scrubber</div>
              <div className={`font-orbitron text-5xl font-black ${systemState.oxygen < 30 ? 'text-[#c51111] animate-pulse' : 'text-[#38fedc]'}`}>{systemState.oxygen.toFixed(1)}%</div>
            </div>
            <div className="h-24 w-4 bg-black rounded-full"></div>
            <div className="text-right">
              <div className="text-[14px] text-white/40 font-black uppercase italic tracking-[0.2em]">Hull Plating</div>
              <div className={`font-orbitron text-5xl font-black ${systemState.integrity < 30 ? 'text-[#c51111] animate-pulse' : 'text-white'}`}>{systemState.integrity.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </header>

      <AlertBanner message="SYSTEM COMPROMISED // FIX SHIP TASKS" />

      <main className="max-w-[1800px] mx-auto p-12 grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
        <div className="lg:col-span-3 flex flex-col gap-16">
          <BiometricMonitor crew={crew} />
          <TelemetryOverlay state={systemState} />
        </div>

        <div className="lg:col-span-6 flex flex-col gap-16">
          <div className="among-panel relative overflow-hidden group border-[12px] border-black aspect-video shadow-[25px_25px_0px_rgba(0,0,0,0.6)] rounded-[3rem]">
             <div className="absolute inset-0 bg-black pointer-events-none flex items-center justify-center">
                <div className="absolute top-12 right-12 flex items-center gap-6 z-10">
                   <div className="w-8 h-8 bg-red-600 rounded-full animate-pulse border-4 border-black"></div>
                   <span className="text-white font-black text-xl uppercase italic tracking-widest">NAV_CAM_01</span>
                </div>
                
                <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 text-white/5">
                   <path d="M10 30 L30 10 L70 10 L90 30 L90 70 L70 90 L30 90 L10 70 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                   {sectors.filter(s => s.isBreached).map((s, i) => (
                     <g key={i}>
                        <circle cx={20 + (i * 40)} cy={20 + (i * 30)} r="10" fill="#c51111" className="animate-ping" />
                     </g>
                   ))}
                </svg>
             </div>
             
             <div className="absolute top-12 left-12 font-orbitron text-3xl text-[#f5f512] uppercase italic font-black drop-shadow-[5px_5px_0px_rgba(0,0,0,1)] z-10">
               LOC: NAVIGATION<br/>
               <span className="text-[#38fedc] text-xl">PWR: {systemState.power.toFixed(1)}%</span>
             </div>

            <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
              <SystemControls onAction={handleAction} disabled={isProcessing} />
            </div>
          </div>
          
          <div className="among-panel p-10 flex flex-col border-[10px] border-black min-h-[350px] shadow-[25px_25px_0px_rgba(0,0,0,0.6)] rounded-[3rem]">
            <h3 className="text-base font-black text-white/50 mb-8 tracking-[0.5em] uppercase italic">Diagnostic Output</h3>
            <div className="flex-1 overflow-y-auto space-y-4 font-black">
              {logs.map(log => (
                <div key={log.id} className="text-[15px] border-l-[12px] border-black pl-8 bg-black/40 p-5 rounded-[2rem]">
                  <span className="text-white/30 italic">[{log.timestamp}]</span>{' '}
                  <span className={log.level === 'CRITICAL' ? 'text-[#c51111]' : 'text-[#38fedc]'}>{log.level}:</span>{' '}
                  <span className="text-white uppercase italic tracking-tight">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-16">
           <AIAssistant systemState={systemState} />
           <SectorDiagnostic sectors={sectors} />
        </div>
      </main>
    </div>
  );
};

export default App;