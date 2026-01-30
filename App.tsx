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
  <div className="skeld-fly absolute pointer-events-none">
    <svg width="400" height="200" viewBox="0 0 400 200" filter="drop-shadow(0 0 20px rgba(255,255,255,0.2))">
      {/* The Skeld Shape */}
      <path d="M50 100 L150 50 L350 70 L380 100 L350 130 L150 150 Z" fill="#4a5568" stroke="#000" strokeWidth="4" />
      <path d="M150 50 L180 30 L320 50 L350 70" fill="#2d3748" stroke="#000" strokeWidth="4" />
      <circle cx="280" cy="85" r="20" fill="#88d8f1" stroke="#000" strokeWidth="3" /> {/* Visor-like deck window */}
      <rect x="70" y="70" width="40" height="15" fill="#e53e3e" /> {/* Engine lights */}
      <rect x="70" y="115" width="40" height="15" fill="#e53e3e" />
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
    <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
      <div className="mb-2 w-full max-w-2xl text-center">
        <h1 className="font-orbitron font-black text-6xl md:text-9xl tracking-widest neon-text mb-4">AMONG US</h1>
        <div className="bg-[#1a1111] border-2 border-[#522] py-2 px-12 inline-block shadow-lg">
          <span className="text-[#f5f512] font-orbitron font-bold tracking-[0.8em] text-xl">SECURE LOGIN</span>
        </div>
      </div>

      <div className="among-panel w-full max-w-2xl p-8 rounded-md mt-12 relative">
        {/* Screws */}
        <div className="screw top-2 left-2"></div>
        <div className="screw top-2 right-2"></div>
        <div className="screw bottom-2 left-2"></div>
        <div className="screw bottom-2 right-2"></div>

        <div className="flex justify-between items-center mb-6 border-b border-gray-600 pb-4">
          <div>
            <h2 className="text-white font-orbitron font-bold text-2xl tracking-widest uppercase italic">Identity Verify</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-[#50ef39]"></div>
              <span className="text-[#38fedc] text-[10px] font-bold tracking-widest">THE SKELD // TERM_04</span>
            </div>
          </div>
          <span className="text-[#ef7d0e] font-bold text-[10px] border border-[#ef7d0e] px-1 rounded">ASSET #932</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest block">Username</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
              </div>
              <input 
                type="text" 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full bg-white text-black font-mono text-sm px-10 py-2 border-r-8 border-gray-400 focus:outline-none input-glow" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest block">Email Address</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </div>
              <input 
                type="text" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-white text-black font-mono text-sm px-10 py-2 border-r-8 border-gray-400 focus:outline-none input-glow" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest block">Comms ID / Phone</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.47c-.31.17-.69.17-1 0L3.53 17.38c-.32-.17-.53-.5-.53-.88V7.5c0-.38.21-.71.53-.88l7.97-4.47c.31-.17.69-.17 1 0l7.97 4.47c.32.17.53.5.53.88v9z"/></svg>
              </div>
              <input 
                type="text" 
                value={formData.comms}
                onChange={e => setFormData({...formData, comms: e.target.value})}
                className="w-full bg-white text-black font-mono text-sm px-10 py-2 border-r-8 border-gray-400 focus:outline-none input-glow" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest block">Registration No.</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              </div>
              <input 
                type="text" 
                value={formData.reg}
                onChange={e => setFormData({...formData, reg: e.target.value})}
                className="w-full bg-white text-black font-mono text-sm px-10 py-2 border-r-8 border-gray-400 focus:outline-none input-glow" 
              />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-600 pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#f5f512] text-[9px] font-black uppercase italic tracking-widest">Pending Tasks:</span>
            <span className="text-[#f5f512] text-[9px] font-black uppercase tracking-widest">3 Remaining</span>
          </div>
          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden border border-black mb-4">
            <div className="h-full bg-[#f5f512]" style={{ width: '45%' }}></div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-gray-400 italic">
              <span className="text-[#50ef39]">✓</span> Calibrate Distributor
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-400 italic">
              <span className="text-[#c51111]">!</span> Fix Wiring (Electrical)
            </div>
          </div>
        </div>

        <button 
          onClick={onStart}
          className="w-full mt-8 py-4 login-button-bg text-white font-orbitron font-black text-2xl tracking-widest uppercase italic flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-95"
        >
          Initiate Login 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/></svg>
        </button>

        <div className="flex justify-between items-center mt-6 text-[8px] text-gray-500 font-bold tracking-widest">
          <span>SYS.05.99.2</span>
          <span>SECURE_LINK: ESTABLISHED</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-4 flex justify-between items-center text-[10px] text-gray-400 font-black tracking-widest border-t border-gray-800 bg-black/50">
        <div className="flex gap-4">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#50ef39]"></div> REACTORS: STABLE</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#f5f512]"></div> O2: FILTERING</span>
        </div>
        <div className="text-[#c51111] animate-pulse uppercase">Warning: Suspicious activity detected in ventilation systems // Sector 7G // Check</div>
        <div>MIRA_HQ // TERMINAL_ACCESS</div>
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
        const nextO2 = Math.max(0, prev.oxygen - 0.15);
        const nextCO2 = prev.co2Levels + 8;
        
        setCrew(prevCrew => prevCrew.map(c => ({
          ...c,
          heartRate: nextO2 < 35 ? 130 + (Math.random() * 30) : 75 + (Math.random() * 10),
          oxygenSat: Math.max(50, 98 - (3000 - nextCO2) / 100),
          condition: nextO2 < 30 ? 'CRITICAL' : (nextO2 < 45 ? 'DISTRESS' : 'STABLE')
        })));

        return {
          ...prev,
          oxygen: nextO2,
          power: Math.max(0, prev.power - 0.1),
          co2Levels: nextCO2,
          integrity: Math.max(0, prev.integrity - 0.05),
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
            newState.co2Levels = Math.max(400, prev.co2Levels - 1500);
            newState.power -= 12;
            setSectors(s => s.map(sec => sec.name === 'O2 Room' ? {...sec, isBreached: false, status: 95} : sec));
            break;
          case 'REROUTE_POWER':
            newState.power = Math.min(100, prev.power + 40);
            newState.integrity -= 15;
            setSectors(s => s.map(sec => sec.name === 'Electrical' ? {...sec, isBreached: false, status: 100} : sec));
            break;
          case 'SEAL_SECTOR':
            newState.integrity = Math.min(100, prev.integrity + 50);
            newState.oxygen -= 25;
            setSectors(s => s.map(sec => sec.name === 'Reactor' ? {...sec, isBreached: false, status: 85} : sec));
            break;
          case 'STABILIZE_LS':
            newState.oxygen = Math.min(100, prev.oxygen + 30);
            newState.temperature = 20.0;
            break;
        }
        return newState;
      });

      audioService.playSuccess();
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        level: 'INFO',
        message: `TASK: ${action} COMPLETED.`
      };
      setLogs(prev => [newLog, ...prev].slice(0, 15));
      setIsProcessing(false);
    }, 1500);
  }, []);

  if (phase === 'INTRO') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative cursor-pointer overflow-hidden"
        onClick={() => {
          audioService.init();
          audioService.playSuccess();
          setPhase('LOGIN');
        }}
      >
        <SkeldShip />
        <div className="z-10 text-center animate-pulse">
          <h1 className="font-orbitron font-black text-white text-4xl mb-4 tracking-widest drop-shadow-2xl italic uppercase">Terminal Link Detected</h1>
          <p className="font-mono text-[#38fedc] text-sm uppercase tracking-[0.5em] italic">Click to Initiate Secure Handshake</p>
        </div>
      </div>
    );
  }

  if (phase === 'LOGIN') {
    return <LoginPanel onStart={() => setPhase('DASHBOARD')} />;
  }

  return (
    <div className="min-h-screen relative overflow-y-auto bg-transparent">
      {/* Dashboard Header */}
      <header className="relative z-20 border-b-8 border-black bg-[#121b28]/95 p-6 sticky top-0">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-[#c51111] border-8 border-black among-border rounded-3xl flex items-center justify-center font-orbitron font-black text-white italic text-4xl shadow-[8px_8px_0px_rgba(0,0,0,0.5)]">
               !!!
            </div>
            <div>
              <h1 className="font-orbitron font-black text-4xl tracking-tight text-[#38fedc] italic uppercase drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">Skeld_Distress_Terminal</h1>
              <p className="text-sm text-white/40 font-black tracking-[0.6em] uppercase italic">Priority One Override Active</p>
            </div>
          </div>
          <div className="flex gap-16 items-center">
             <div className="text-right">
              <div className="text-[14px] text-white/40 font-black uppercase italic tracking-widest">Atmosphere</div>
              <div className={`font-orbitron text-4xl font-black ${systemState.oxygen < 30 ? 'text-[#c51111] animate-pulse' : 'text-[#38fedc]'}`}>{systemState.oxygen.toFixed(1)}%</div>
            </div>
            <div className="h-20 w-3 bg-black rounded-full"></div>
            <div className="text-right">
              <div className="text-[14px] text-white/40 font-black uppercase italic tracking-widest">Hull Health</div>
              <div className={`font-orbitron text-4xl font-black ${systemState.integrity < 30 ? 'text-[#c51111] animate-pulse' : 'text-white'}`}>{systemState.integrity.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </header>

      <AlertBanner message="SABOTAGE DETECTED IN O2 ROOM // ELECTRICAL OVERLOAD // FIX TASKS" />

      {/* Main Grid */}
      <main className="max-w-[1800px] mx-auto p-10 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 min-h-[calc(100vh-280px)] mb-24">
        <div className="lg:col-span-3 flex flex-col gap-12">
          <BiometricMonitor crew={crew} />
          <TelemetryOverlay state={systemState} />
        </div>

        <div className="lg:col-span-6 flex flex-col gap-12">
          <div className="among-panel relative overflow-hidden group border-[10px] border-black aspect-video flex-shrink-0 shadow-[20px_20px_0px_rgba(0,0,0,0.5)]">
             <div className="absolute inset-0 bg-[#000] pointer-events-none flex items-center justify-center">
                <div className="absolute top-10 right-10 flex items-center gap-4 z-10">
                   <div className="w-6 h-6 bg-red-600 rounded-full animate-pulse border-4 border-black"></div>
                   <span className="text-white font-black text-lg uppercase italic tracking-widest">CAM_01 (NAV)</span>
                </div>
                
                <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 text-white/5 opacity-50">
                   <path d="M10 30 L30 10 L70 10 L90 30 L90 70 L70 90 L30 90 L10 70 Z" fill="none" stroke="currentColor" strokeWidth="4" />
                   <path d="M40 30 L60 30 L60 70 L40 70 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="10 10" />
                   {sectors.filter(s => s.isBreached).map((s, i) => (
                     <g key={i}>
                        <circle cx={20 + (i * 30)} cy={20 + (i * 30)} r="8" fill="#c51111" className="animate-ping" />
                        <text x={20 + (i * 30)} y={20 + (i * 30) - 15} fill="#c51111" fontSize="10" fontWeight="900" textAnchor="middle">SABOTAGE</text>
                     </g>
                   ))}
                </svg>
             </div>
             
             <div className="absolute top-12 left-12 font-orbitron text-2xl text-[#f5f512] uppercase italic font-black drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] z-10">
               LOCATION: NAVIGATION<br/>
               <span className="text-[#38fedc] text-lg">GRID: {systemState.power.toFixed(1)}%</span>
             </div>

            <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black via-black/90 to-transparent z-10">
              <SystemControls onAction={handleAction} disabled={isProcessing} />
            </div>
          </div>
          
          <div className="among-panel p-8 overflow-hidden flex flex-col border-[10px] border-black min-h-[300px] shadow-[20px_20px_0px_rgba(0,0,0,0.5)]">
            <h3 className="text-sm font-black text-white/50 mb-6 tracking-[0.4em] uppercase italic">Ship Status Logs</h3>
            <div className="flex-1 overflow-y-auto space-y-3 font-black">
              {logs.map(log => (
                <div key={log.id} className="text-[13px] border-l-[10px] border-black pl-6 bg-black/40 p-4 rounded-3xl">
                  <span className="text-white/30 italic">[{log.timestamp}]</span>{' '}
                  <span className={log.level === 'CRITICAL' ? 'text-[#c51111]' : 'text-[#38fedc]'}>{log.level}:</span>{' '}
                  <span className="text-white uppercase italic tracking-tight">{log.message}</span>
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

      <footer className="fixed bottom-0 left-0 w-full border-t-8 border-black bg-[#121b28] p-6 z-50">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center text-[14px] font-black text-white/40 tracking-[0.4em] uppercase italic">
          <div className="flex gap-20">
            <span className="text-[#38fedc] flex items-center gap-5">
               <div className="w-5 h-5 rounded-full bg-[#38fedc] border-4 border-black"></div> COMMS_OK
            </span>
            <span className="text-[#c51111] flex items-center gap-5 animate-pulse">
               <div className="w-5 h-5 rounded-full bg-[#c51111] border-4 border-black"></div> DANGER_SABOTAGE
            </span>
          </div>
          <div className="hidden sm:block text-white/5 font-orbitron text-lg">SYSTEM_SKELD_CORE_VER_05.99.2</div>
        </div>
      </footer>
    </div>
  );
};

export default App;