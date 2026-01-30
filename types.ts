
export interface SystemState {
  oxygen: number;
  power: number;
  water: number;
  integrity: number;
  temperature: number;
  co2Levels: number;
}

export interface CrewStatus {
  id: string;
  name: string;
  heartRate: number;
  oxygenSat: number;
  condition: 'STABLE' | 'DISTRESS' | 'CRITICAL';
}

export interface SectorDiagnostic {
  name: string;
  status: number;
  load: number;
  isBreached: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'CRITICAL';
  message: string;
}

export type EmergencyAction = 'VENT_CO2' | 'REROUTE_POWER' | 'SEAL_SECTOR' | 'STABILIZE_LS';
