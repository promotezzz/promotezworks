import { CheckCircle, XCircle, Settings, ShieldCheck } from 'lucide-react';

interface ToolStatus {
  name: string;
  installed: boolean;
  version: string;
}

interface StatusIndicatorProps {
  tools: ToolStatus[] | null;
  loading: boolean;
}

export default function StatusIndicator({ tools, loading }: StatusIndicatorProps) {
  const getToolDisplayName = (name: string): string => {
    switch (name.toLowerCase()) {
      case 'git': return 'Git Version Control';
      case 'node': return 'Node.js Runtime';
      case 'npm': return 'npm Package Manager';
      case 'cargo': return 'Cargo (Rust)';
      default: return name;
    }
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-violet-400">
            <Settings className="w-5 h-5" />
            Environment Tools
          </h2>
          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
            {loading ? 'CHECKING...' : 'SYNCED'}
          </span>
        </div>

        <p className="text-sm text-slate-400 mb-4">
          Verifying critical developer tools installed in the system PATH.
        </p>

        {loading && !tools ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-mono text-slate-400">Querying path binaries...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tools?.map((tool) => (
              <div
                key={tool.name}
                className="flex items-center justify-between p-3 bg-slate-900/30 border border-slate-800 rounded-xl"
              >
                <div className="flex items-center gap-2.5">
                  {tool.installed ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white font-mono">
                      {getToolDisplayName(tool.name)}
                    </span>
                    <span className="text-xs text-slate-500 font-mono mt-0.5">
                      {tool.installed ? tool.version : 'Not available in system environment'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className={`text-xxs px-2 py-0.5 rounded-full font-mono font-bold ${
                    tool.installed
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {tool.installed ? 'ACTIVE' : 'MISSING'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-teal-950/20 rounded-xl border border-teal-500/10 text-xs font-mono flex items-center justify-between text-slate-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> System Integrity Check:
        </span>
        <span className="text-teal-400 font-bold">SECURE</span>
      </div>
    </div>
  );
}
