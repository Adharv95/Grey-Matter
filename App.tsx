
import React, { useState, useEffect, useCallback } from 'react';
import AlertBanner from './components/AlertBanner';
import TelemetryOverlay from './components/TelemetryOverlay';
import SystemControls from './components/SystemControls';
import AIAssistant from './components/AIAssistant';
import BiometricMonitor from './components/BiometricMonitor';
import SectorDiagnostic from './components/SectorDiagnostic';
import { SystemState, LogEntry, EmergencyAction, CrewStatus, SectorDiagnostic as SectorType } from './types';
import { audioService } from './services/audioService';

const FloatingCrewmate = ({ color, top, delay }: { color: string, top: string, delay: string }) => (
  <div className="floating-crewmate" style={{ top, animationDelay: delay }}>
    <svg width="40" height="50" viewBox="0 0 40 50">
      <path d="M5 15 Q5 5 20 5 Q35 5 35 15 L35 35 Q35 45 28 45 L25 45 L25 48 Q25 50 22 50 L18 50 Q15 50 15 48 L15 45 L12 45 Q5 45 5 35 Z" fill={color} stroke="black" strokeWidth="3" />
      <path d="M20 12 Q32 12 32 18 Q32 24 20 24 Q8 24 8 18 Q8 12 20 12" fill="#88d8f1" stroke="black" strokeWidth="2.5" />
    </svg>
  </div>
);

const CrewmateLogo = ({ color, size = "w-48 h-60" }: { color: string, size?: string }) => (
  <div className={`${size} relative animate-bounce flex items-center justify-center drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]`}>
    <svg width="100%" height="100%" viewBox="0 0 40 50">
      <path d="M5 15 Q5 5 20 5 Q35 5 35 15 L35 35 Q35 45 28 45 L25 45 L25 48 Q25 50 22 50 L18 50 Q15 50 15 48 L15 45 L12 45 Q5 45 5 35 Z" fill={color} stroke="black" strokeWidth="3" />
      <path d="M20 12 Q32 12 32 18 Q32 24 20 24 Q8 24 8 18 Q8 12 20 12" fill="#88d8f1" stroke="black" strokeWidth="2.5" />
      <path d="M15 15 Q25 15 25 18" fill="white" opacity="0.5" stroke="none" />
      <path d="M2 18 Q0 18 0 23 L0 35 Q0 40 2 40" fill={color} stroke="black" strokeWidth="3" />
    </svg>
  </div>
);

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [crewName, setCrewName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#c51111');
  const [systemState, setSystemState] = useState<SystemState>({
    oxygen: 45.5,
    power: 28.2,
    water: 70.1,
    integrity: 35.8,
    temperature: 28.5,
    co2Levels: 1750,
  });

  const [crew, setCrew] = useState<CrewStatus[]>([
    { id: 'RED-01', name: 'Red Crewmate', heartRate: 75, oxygenSat: 98, condition: 'STABLE' },
    { id: 'CYAN-02', name: 'Cyan Crewmate', heartRate: 82, oxygenSat: 97, condition: 'STABLE' },
    { id: 'LIME-03', name: 'Lime Crewmate', heartRate: 70, oxygenSat: 99, condition: 'STABLE' }
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

  const colors = [
    { name: 'Red', hex: '#c51111' },
    { name: 'Cyan', hex: '#38fedc' },
    { name: 'Lime', hex: '#50ef39' },
    { name: 'Blue', hex: '#132ed1' },
    { name: 'Yellow', hex: '#f5f512' },
    { name: 'Orange', hex: '#ef7d0e' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crewName.trim()) return;
    
    audioService.init();
    setIsLoggedIn(true);
    audioService.playSuccess();
    
    setCrew(prev => [{ 
      id: 'PLAYER-01', 
      name: `${crewName} (${colors.find(c => c.hex === selectedColor)?.name})`, 
      heartRate: 72, 
      oxygenSat: 98, 
      condition: 'STABLE' 
    }, ...prev]);
  };

  useEffect(() => {
    if (!isLoggedIn) return;
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
  }, [isLoggedIn]);

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

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <FloatingCrewmate color="#c51111" top="15%" delay="0s" />
        <FloatingCrewmate color="#38fedc" top="75%" delay="12s" />
        <FloatingCrewmate color="#f5f512" top="40%" delay="6s" />

        <div className="z-10 w-full max-w-2xl flex flex-col items-center">
          <CrewmateLogo color={selectedColor} />
          
          <h1 className="mt-8 font-orbitron font-black text-5xl md:text-7xl text-white uppercase italic tracking-tighter drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] text-center mb-12">
            THE SKELD
          </h1>

          <div className="w-full bg-[#222a35] among-border p-10 rounded-[3rem] border-8 border-black">
            <form onSubmit={handleLogin} className="space-y-8">
              <div>
                <label className="block text-xs font-black text-white/50 uppercase italic mb-3 tracking-[0.3em]">Enter Crewmate Identity</label>
                <input 
                  autoFocus
                  type="text" 
                  maxLength={15}
                  value={crewName}
                  onChange={(e) => setCrewName(e.target.value)}
                  className="w-full bg-black border-4 border-black rounded-2xl p-5 text-2xl text-white font-black uppercase italic focus:outline-none focus:border-[#38fedc] transition-all shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)] placeholder-white/10"
                  placeholder="PLAYER NAME"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-white/50 uppercase italic mb-4 tracking-[0.3em]">Select Suit Color</label>
                <div className="flex flex-wrap justify-center gap-4">
                  {colors.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setSelectedColor(c.hex)}
                      className={`w-12 h-12 rounded-full border-4 border-black among-button transition-transform ${selectedColor === c.hex ? 'scale-125 border-white ring-4 ring-[#38fedc]/50' : 'hover:scale-110'}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                disabled={!crewName.trim()}
                className="w-full p-8 border-8 border-black bg-[#38fedc] text-black font-orbitron font-black text-4xl tracking-widest hover:scale-105 active:scale-95 transition-all among-button italic uppercase disabled:opacity-30 disabled:grayscale disabled:scale-100"
              >
                JOIN GAME
              </button>
            </form>
          </div>

          <div className="mt-12 flex gap-10 items-center">
            <div className="text-center">
              <div className="text-[10px] text-white/30 font-black uppercase italic tracking-widest">Region</div>
              <div className="text-[#50ef39] font-black uppercase italic">North America</div>
            </div>
            <div className="w-1 h-8 bg-white/10"></div>
            <div className="text-center">
              <div className="text-[10px] text-white/30 font-black uppercase italic tracking-widest">Server Status</div>
              <div className="text-[#38fedc] font-black uppercase italic">Online</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-y-auto">
      <FloatingCrewmate color="#c51111" top="20%" delay="0s" />
      <FloatingCrewmate color="#38fedc" top="60%" delay="10s" />
      <FloatingCrewmate color="#50ef39" top="10%" delay="5s" />

      {/* Header */}
      <header className="relative z-20 border-b-8 border-black bg-[#121b28]/95 p-5 sticky top-0">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <div className="w-16 h-16 bg-[#c51111] border-4 border-black among-border rounded-2xl flex items-center justify-center font-orbitron font-black text-white italic text-3xl shadow-[6px_6px_0px_rgba(0,0,0,0.5)]">
               !!!
            </div>
            <div>
              <h1 className="font-orbitron font-black text-3xl tracking-tight text-[#38fedc] italic uppercase drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">The Skeld_Dashboard</h1>
              <p className="text-xs text-white/40 font-black tracking-[0.5em] uppercase italic">Status: EMERGENCY_MEETING_PENDING</p>
            </div>
          </div>
          <div className="flex gap-12 items-center">
             <div className="text-right">
              <div className="text-[12px] text-white/40 font-black uppercase italic">Oxygen Levels</div>
              <div className={`font-orbitron text-2xl font-black ${systemState.oxygen < 30 ? 'text-[#c51111] animate-pulse' : 'text-[#38fedc]'}`}>{systemState.oxygen.toFixed(1)}%</div>
            </div>
            <div className="h-14 w-2 bg-black rounded-full"></div>
            <div className="text-right">
              <div className="text-[12px] text-white/40 font-black uppercase italic">Ship Status</div>
              <div className="font-orbitron text-2xl text-[#c51111] italic font-black uppercase drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">Sabotaged</div>
            </div>
          </div>
        </div>
      </header>

      <AlertBanner message="O2 ROOM SABOTAGED -- FIX ELECTRICAL -- REACTOR MELTDOWN IMMINENT" />

      {/* Main Grid */}
      <main className="max-w-[1800px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10 min-h-[calc(100vh-220px)] mb-20">
        
        {/* Left Side: Vitals & Resources */}
        <div className="lg:col-span-3 flex flex-col gap-10">
          <div className="min-h-[400px]">
            <BiometricMonitor crew={crew} />
          </div>
          <div className="min-h-[400px]">
            <TelemetryOverlay state={systemState} />
          </div>
        </div>

        {/* Center Side: Map & Controls */}
        <div className="lg:col-span-6 flex flex-col gap-10">
          <div className="among-panel relative overflow-hidden group border-8 border-black aspect-video flex-shrink-0">
             <div className="absolute inset-0 bg-[#000] pointer-events-none flex items-center justify-center">
                <div className="absolute top-10 right-10 flex items-center gap-3 z-10">
                   <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse border-4 border-black"></div>
                   <span className="text-white font-black text-sm uppercase italic tracking-widest">CAM_02 (SECURITY)</span>
                </div>
                
                <svg viewBox="0 0 100 100" className="w-4/5 h-4/5 text-white/10">
                   <path d="M10 30 L30 10 L70 10 L90 30 L90 70 L70 90 L30 90 L10 70 Z" fill="none" stroke="currentColor" strokeWidth="3" />
                   <path d="M40 30 L60 30 L60 70 L40 70 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
                   {sectors.filter(s => s.isBreached).map((s, i) => (
                     <g key={i}>
                        <circle cx={20 + (i * 30)} cy={20 + (i * 30)} r="5" fill="#c51111" className="animate-ping" />
                        <text x={20 + (i * 30)} y={20 + (i * 30) - 10} fill="#c51111" fontSize="5" fontWeight="900" textAnchor="middle">SABOTAGE!</text>
                     </g>
                   ))}
                </svg>
             </div>
             
             <div className="absolute top-10 left-10 font-orbitron text-lg text-[#f5f512] uppercase italic font-black drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] z-10">
               LOCATION: NAVIGATION<br/>
               <span className="text-[#38fedc] text-sm">GRID_RESERVE: {systemState.power.toFixed(1)}%</span>
             </div>

            <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
              <SystemControls onAction={handleAction} disabled={isProcessing} />
            </div>
          </div>
          
          <div className="among-panel p-5 overflow-hidden flex flex-col border-8 border-black min-h-[250px]">
            <h3 className="text-xs font-black text-white/50 mb-3 tracking-widest uppercase italic">Task Activity Log</h3>
            <div className="flex-1 overflow-y-auto space-y-2 font-black">
              {logs.map(log => (
                <div key={log.id} className="text-[11px] border-l-8 border-black pl-4 bg-black/40 p-2 rounded-2xl">
                  <span className="text-white/30 italic">[{log.timestamp}]</span>{' '}
                  <span className={log.level === 'CRITICAL' ? 'text-[#c51111]' : 'text-[#38fedc]'}>{log.level}:</span>{' '}
                  <span className="text-white uppercase italic tracking-tight">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: AI & Diagnostics */}
        <div className="lg:col-span-3 flex flex-col gap-10">
           <div className="min-h-[450px]">
             <AIAssistant systemState={systemState} />
           </div>
           <div className="min-h-[400px]">
             <SectorDiagnostic sectors={sectors} />
           </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full border-t-8 border-black bg-[#121b28] p-4 z-50">
        <div className="max-w-[1800px] mx-auto flex justify-between items-center text-xs font-black text-white/40 tracking-[0.2em] uppercase italic">
          <div className="flex gap-12">
            <span className="text-[#38fedc] flex items-center gap-3">
               <div className="w-3 h-3 rounded-full bg-[#38fedc] border-2 border-black"></div> Ship_Comms_Stable
            </span>
            <span className="text-[#c51111] flex items-center gap-3 animate-pulse">
               <div className="w-3 h-3 rounded-full bg-[#c51111] border-2 border-black"></div> Impostor_Danger_High
            </span>
          </div>
          <div className="hidden sm:block text-white/10 font-orbitron">Skeld_v1.0.42_Terminal</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
