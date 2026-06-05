import { AlertTriangle } from 'lucide-react';
import type { DataQualityWarning } from '../types';

interface WarningsPanelProps {
  warnings: DataQualityWarning[];
}

export default function WarningsPanel({ warnings }: WarningsPanelProps) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="glass-card p-5 border-orange-500/20">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-orange-400" />
        <h3 className="text-sm font-semibold text-white">Data Quality Warnings</h3>
        <span className="text-xs bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-full px-2 py-0.5">
          {warnings.length}
        </span>
      </div>
      <div className="space-y-2.5">
        {warnings.map((warning, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/15"
          >
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-orange-300 mb-0.5">
                  {warning.issue}
                </div>
                <div className="text-xs text-white/50 mb-1">
                  Asset: <span className="text-white/70 font-mono">{warning.asset}</span>
                </div>
                <div className="text-xs text-white/50">
                  Fix: <span className="text-white/60">{warning.suggestion}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
