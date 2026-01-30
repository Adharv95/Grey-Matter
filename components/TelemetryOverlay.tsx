
import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { SystemState } from '../types';

interface TelemetryOverlayProps {
  state: SystemState;
}

const TelemetryOverlay: React.FC<TelemetryOverlayProps> = ({ state }) => {
  const historyData = Array.from({ length: 15 }, (_, i) => ({
    name: i,
    val: state.oxygen - (15 - i) * 0.5 + (Math.random() * 2),
  }));

  const ResourceBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="mb-5">
      <div className="flex justify-between text-[11px] font-black mb-1 tracking-widest uppercase italic text-white/70">
        <span>{label}</span>
        <span className={value < 30 ? 'text-[#c51111] animate-pulse' : 'text-white'}>
          {value.toFixed(1)}%
        </span>
      </div>
      <div className="h-4 w-full bg-black border-4 border-black rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${color} border-r-4 border-black/20`} 
          style={{ width: `${value}%` }}
        >
          <div className="w-full h-1 bg-white/20"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="among-panel p-6 h-full flex flex-col">
      <h3 className="font-orbitron text-sm font-black mb-6 text-[#f5f512] flex items-center gap-3 tracking-[0.2em] uppercase italic">
        <div className="w-4 h-4 bg-[#f5f512] rounded border-4 border-black"></div>
        SHIP_RESOURCES
      </h3>
      
      <div className="flex-1">
        <ResourceBar label="Oxygen" value={state.oxygen} color="bg-[#38fedc]" />
        <ResourceBar label="Reactor" value={state.power} color="bg-[#f5f512]" />
        <ResourceBar label="Water" value={state.water} color="bg-[#132ed1]" />
        <ResourceBar label="Hull" value={state.integrity} color="bg-[#c51111]" />
      </div>

      <div className="h-24 mt-4 bg-black/40 rounded-2xl border-4 border-black p-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={historyData}>
            <Area 
              type="stepAfter" 
              dataKey="val" 
              stroke="#50ef39" 
              strokeWidth={4}
              fill="#50ef39"
              fillOpacity={0.2} 
              isAnimationActive={false} 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TelemetryOverlay;
