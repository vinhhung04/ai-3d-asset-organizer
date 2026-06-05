import { LayoutGrid, Tag, FileText, Code2 } from 'lucide-react';
import type { ProjectMetadata } from '../types';
import Badge from './Badge';

interface MetadataCardProps {
  metadata: ProjectMetadata;
}

export default function MetadataCard({ metadata }: MetadataCardProps) {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white">{metadata.project_name}</h3>
          <span className="text-sm text-white/50">{metadata.project_type} Project</span>
        </div>
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center">
          <LayoutGrid className="w-5 h-5 text-cyan-400" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-2xl font-bold text-white">{metadata.total_assets}</div>
          <div className="text-xs text-white/40 mt-0.5">Total Assets</div>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="text-2xl font-bold text-white">{metadata.main_categories.length}</div>
          <div className="text-xs text-white/40 mt-0.5">Categories</div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1.5 text-xs text-white/40 mb-2">
          <Tag className="w-3.5 h-3.5" />
          <span>Categories Found</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {metadata.main_categories.map(cat => (
            <Badge key={cat} text={cat} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center gap-1.5 text-xs text-white/40 mb-1.5">
          <FileText className="w-3.5 h-3.5" />
          <span>AI Summary</span>
        </div>
        <p className="text-sm text-white/70 leading-relaxed">{metadata.summary}</p>
      </div>

      <div>
        <div className="flex items-center gap-1.5 text-xs text-white/40 mb-1.5">
          <Code2 className="w-3.5 h-3.5" />
          <span>Recommended Naming Convention</span>
        </div>
        <pre className="text-xs font-mono text-cyan-300/80 bg-white/5 rounded-lg p-3 whitespace-pre-wrap break-all">
          {metadata.recommended_naming_convention}
        </pre>
      </div>
    </div>
  );
}
