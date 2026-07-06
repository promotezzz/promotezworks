import { FolderGit2, FolderOpen, FolderClosed, Database } from 'lucide-react';

interface ProjectInfo {
  name: string;
  path: string;
  is_git: boolean;
  size_bytes: number;
  folder_count: number;
  file_count: number;
}

interface WorkspaceStatus {
  total_projects: number;
  projects: ProjectInfo[];
}

interface WorkspaceViewProps {
  status: WorkspaceStatus | null;
  loading: boolean;
  onSelectProject: (path: string) => void;
}

export default function WorkspaceView({ status, loading, onSelectProject }: WorkspaceViewProps) {
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-violet-400">
            <FolderOpen className="w-5 h-5" />
            Workspace Projects
          </h2>
          <span className="text-xs bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full font-mono font-bold">
            {status ? `${status.total_projects} PROJECTS` : 'SCANNING...'}
          </span>
        </div>

        <p className="text-sm text-slate-400 mb-4">
          Monitoring projects in <code className="text-violet-300 text-xs px-1 py-0.5 bg-slate-950/60 rounded">Desktop/projects</code>
        </p>

        {loading && !status ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-mono text-slate-400">Scanning local directory...</span>
          </div>
        ) : status && status.projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 border border-dashed border-slate-700/50 rounded-xl">
            <FolderClosed className="w-8 h-8 text-slate-500" />
            <span className="text-sm text-slate-400 font-mono">No subdirectories found.</span>
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-violet-500/20">
            {status?.projects.map((project) => (
              <div
                key={project.name}
                onClick={() => onSelectProject(project.path)}
                className="group flex items-center justify-between p-3.5 bg-slate-900/30 hover:bg-violet-950/20 border border-slate-800 hover:border-violet-500/30 rounded-xl cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-800 group-hover:bg-violet-900/30 rounded-lg text-slate-400 group-hover:text-violet-400 transition-colors">
                    {project.is_git ? (
                      <FolderGit2 className="w-5 h-5 text-violet-400" />
                    ) : (
                      <FolderOpen className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors font-mono">
                      {project.name}
                    </span>
                    <span className="text-xxs text-slate-500 font-mono mt-0.5 truncate max-w-[200px]" title={project.path}>
                      {project.path}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div className="flex flex-col font-mono text-xs text-slate-400">
                    <span className="font-bold text-white">{formatSize(project.size_bytes)}</span>
                    <span className="text-slate-500 text-xxs mt-0.5">
                      {project.file_count} files / {project.folder_count} dirs
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-xs font-mono flex items-center justify-between text-slate-400">
        <span className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-violet-400" /> Disk Querying:
        </span>
        <span className="text-emerald-400">OK</span>
      </div>
    </div>
  );
}
