import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Trash2, Play } from 'lucide-react';

interface LogLine {
  text: string;
  type: 'system' | 'info' | 'api' | 'success' | 'warn';
  timestamp: string;
}

interface DevConsoleProps {
  logs: LogLine[];
  onClearLogs: () => void;
  onRunSimulatedCommand: (command: string) => void;
}

export default function DevConsole({ logs, onClearLogs, onRunSimulatedCommand }: DevConsoleProps) {
  const [inputVal, setInputVal] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll logs
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onRunSimulatedCommand(inputVal);
    setInputVal('');
  };

  const getLogColor = (type: LogLine['type']): string => {
    switch (type) {
      case 'system': return 'text-violet-400';
      case 'api': return 'text-teal-400';
      case 'success': return 'text-emerald-400';
      case 'warn': return 'text-amber-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full min-h-[350px]">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-violet-400" />
          <h2 className="text-xl font-bold text-violet-400">Developer Console</h2>
        </div>
        <button
          onClick={onClearLogs}
          className="p-1.5 bg-slate-900/60 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/30 rounded-lg text-slate-400 hover:text-rose-400 transition-all duration-300"
          title="Clear Terminal Output"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 flex flex-col bg-slate-950/70 border border-slate-800 rounded-xl p-4 overflow-hidden">
        {/* Log Viewer */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto mb-3 font-mono text-xs space-y-1.5 scrollbar-thin scrollbar-thumb-violet-500/10 pr-1"
        >
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-slate-600 select-none">[{log.timestamp}]</span>
              <span className={`font-bold uppercase select-none ${getLogColor(log.type)}`}>
                {log.type}:
              </span>
              <span className="text-slate-200">{log.text}</span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="h-full flex items-center justify-center text-slate-500 italic select-none">
              Console idle. Type a command or interact with the dashboard to trigger log cycles.
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-900 pt-3 shrink-0">
          <span className="text-violet-400 font-mono font-bold select-none">&gt;</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type 'help' or execute 'cargo run baerna'..."
            className="flex-1 bg-transparent text-xs font-mono text-white focus:outline-none border-none placeholder-slate-600"
          />
          <button
            type="submit"
            className="p-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-white transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
          </button>
        </form>
      </div>
    </div>
  );
}
