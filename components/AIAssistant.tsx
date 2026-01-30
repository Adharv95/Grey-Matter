
import React, { useState, useRef, useEffect } from 'react';
import { getAIAssistance } from '../services/geminiService';
import { SystemState } from '../types';

interface AIAssistantProps {
  systemState: SystemState;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ systemState }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'SABOTAGE DETECTED. FIX SHIP TASKS TO SURVIVE.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    const response = await getAIAssistance(userText, systemState);
    
    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsTyping(false);
  };

  return (
    <div className="among-panel flex flex-col h-full min-h-[450px] overflow-hidden bg-[#222a35]">
      <div className="p-4 bg-black/30 border-b-4 border-black flex justify-between items-center">
        <span className="text-xs font-black text-white flex items-center gap-3 italic uppercase">
          <div className="w-3 h-3 rounded-full bg-[#38fedc] border-2 border-black animate-pulse"></div>
          SHIP_AI_COMMS
        </span>
        <span className="text-[10px] text-white/30 font-black">CHANNEL: EMERGENCY</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 font-black">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl border-4 border-black shadow-md ${
              m.role === 'user' 
                ? 'bg-white text-black' 
                : 'bg-[#121b28] text-[#38fedc]'
            }`}>
              <div className="text-[8px] opacity-60 mb-1 uppercase tracking-tighter">
                {m.role === 'user' ? 'PLAYER' : 'SHIP_AI'}
              </div>
              <div className="text-[11px] leading-tight uppercase italic">{m.text}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-[#38fedc] text-[10px] animate-bounce px-2 font-black">AI IS TYPING...</div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-black/40 border-t-4 border-black">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-[#121b28] border-4 border-black rounded-2xl p-3 text-[12px] text-white placeholder-white/20 focus:outline-none focus:border-[#38fedc] transition-all font-black uppercase italic"
          />
          <button type="submit" className="absolute right-3 top-2.5 bg-[#38fedc] border-2 border-black p-1 rounded-lg text-black hover:scale-110 active:scale-95 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIAssistant;
