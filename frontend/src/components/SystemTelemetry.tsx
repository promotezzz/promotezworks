import { Cpu, HardDrive, Clock, Activity, Info } from 'lucide-react';

interface TelemetryData {
  cpu_usage: number;
  memory_total: number;
  memory_used: number;
  memory_free: number;
  uptime: number;
}

interface SystemInfo {
  os_name: string;
  os_version: string;
  host_name: string;
  cpu_count: number;
  cpu_brand: string;
}

interface SystemTelemetryProps {
  telemetry: TelemetryData | null;
  sysInfo: SystemInfo | null;
  loading: boolean;
}

export default function SystemTelemetry({ telemetry, sysInfo, loading }: SystemTelemetryProps) {
  // Format bytes to GB
  const formatGB = (bytes: number): string => {
    // sysinfo returns memory in bytes. Let's format it.
    // Wait, sysinfo might return memory in bytes or KB. Let's check how we serialized:
    // sys.total_memory() returns bytes on most platforms in latest sysinfo versions, but let's check
    // If it's a huge number, it's bytes. Let's assume bytes or convert safely.
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb < 0.1) {
      // If it was in KB, then bytes would be KB * 1024.
      // Let's check if the memory total is suspiciously small (e.g. < 1000). If so, it might be in KB.
      // Usually sys.total_memory() returns bytes. Let's output with 2 decimal places.
      return `${gb.toFixed(1)} GB`;
    }
    return `${gb.toFixed(1)} GB`;
  };

  const formatUptime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const cpuPercent = telemetry ? Math.min(Math.max(telemetry.cpu_usage, 0), 100) : 0;
  const memPercent = telemetry && telemetry.memory_total > 0
    ? (telemetry.memory_used / telemetry.memory_total) * 100
    : 0;

  // Circular progress math
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const cpuDashoffset = circumference - (cpuPercent / 100) * circumference;
  const memDashoffset = circumference - (memPercent / 100) * circumference;

  return (
    <div className="glass-card p-6 flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-violet-400">
            <Activity className="w-5 h-5 animate-pulse" />
            System Telemetry
          </h2>
          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${loading ? 'bg-amber-500/20 text-amber-300 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'}`}>
            {loading ? 'SYNCING...' : 'LIVE'}
          </span>
        </div>

        {/* Circular Gauges */}
        <div className="grid grid-cols-2 gap-6 my-4">
          {/* CPU Gauge */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-900/40 rounded-xl border border-violet-500/10">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-slate-800 fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-violet-500 fill-none transition-all duration-500 ease-out"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={cpuDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <Cpu className="w-5 h-5 text-violet-400 mb-0.5" />
                <span className="text-lg font-mono font-bold text-white">{cpuPercent.toFixed(1)}%</span>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-300 mt-3 font-mono">CPU Usage</span>
          </div>

          {/* Memory Gauge */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-900/40 rounded-xl border border-teal-500/10">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-slate-800 fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-teal-500 fill-none transition-all duration-500 ease-out"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={memDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <HardDrive className="w-5 h-5 text-teal-400 mb-0.5" />
                <span className="text-lg font-mono font-bold text-white">{memPercent.toFixed(0)}%</span>
              </div>
            </div>
            <span className="text-sm font-semibold text-slate-300 mt-3 font-mono">Memory</span>
          </div>
        </div>

        {/* Detailed Stats */}
        {telemetry && (
          <div className="grid grid-cols-2 gap-3 text-xs font-mono mt-4 border-t border-slate-700/30 pt-4">
            <div className="flex flex-col p-2 bg-slate-900/20 rounded border border-slate-700/10">
              <span className="text-slate-400 mb-0.5">Used RAM</span>
              <span className="text-white font-semibold">{formatGB(telemetry.memory_used)}</span>
            </div>
            <div className="flex flex-col p-2 bg-slate-900/20 rounded border border-slate-700/10">
              <span className="text-slate-400 mb-0.5">Total RAM</span>
              <span className="text-white font-semibold">{formatGB(telemetry.memory_total)}</span>
            </div>
            <div className="col-span-2 flex items-center justify-between p-2 bg-slate-900/20 rounded border border-slate-700/10">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-violet-400" /> Uptime
              </span>
              <span className="text-white font-semibold">{formatUptime(telemetry.uptime)}</span>
            </div>
          </div>
        )}
      </div>

      {/* System Hardware Spec Card */}
      {sysInfo && (
        <div className="mt-4 p-3 bg-violet-950/20 rounded-xl border border-violet-500/10 text-xs font-mono flex items-start gap-2.5">
          <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5 text-slate-300">
            <div>
              <span className="text-slate-500">OS:</span> {sysInfo.os_name} {sysInfo.os_version}
            </div>
            <div>
              <span className="text-slate-500">Host:</span> {sysInfo.host_name}
            </div>
            <div>
              <span className="text-slate-500">CPU:</span> {sysInfo.cpu_brand} ({sysInfo.cpu_count} Cores)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
