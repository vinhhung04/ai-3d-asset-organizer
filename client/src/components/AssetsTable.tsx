import { Table2, Download } from 'lucide-react';
import type { ClassifiedAsset } from '../types';
import Badge from './Badge';

interface AssetsTableProps {
  assets: ClassifiedAsset[];
  onExport?: () => void;
}

const confidenceColor = (c: number) =>
  c >= 0.9 ? 'text-emerald-400' : c >= 0.7 ? 'text-yellow-400' : 'text-red-400';

export default function AssetsTable({ assets, onExport }: AssetsTableProps) {
  const hasConfidence = assets.some(a => a.confidence !== undefined);

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Table2 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Classified Assets</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 bg-white/5 rounded-full px-2.5 py-0.5">
            {assets.length} assets
          </span>
          {onExport && (
            <button
              onClick={onExport}
              className="btn-outline text-xs gap-1.5 py-1 px-2.5"
            >
              <Download className="w-3 h-3" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs text-white/30 font-medium px-5 py-3 w-8">#</th>
              <th className="text-left text-xs text-white/30 font-medium px-3 py-3">Original Name</th>
              <th className="text-left text-xs text-white/30 font-medium px-3 py-3">Category</th>
              <th className="text-left text-xs text-white/30 font-medium px-3 py-3 hidden lg:table-cell">Type</th>
              <th className="text-left text-xs text-white/30 font-medium px-3 py-3">Suggested Slug</th>
              <th className="text-left text-xs text-white/30 font-medium px-3 py-3">Priority</th>
              {hasConfidence && (
                <th className="text-left text-xs text-white/30 font-medium px-3 py-3 hidden md:table-cell">
                  Confidence
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, idx) => (
              <tr
                key={asset.suggested_slug + idx}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors group ${
                  idx % 2 === 0 ? '' : 'bg-white/[0.02]'
                }`}
              >
                <td className="px-5 py-3 text-xs text-white/30">{idx + 1}</td>
                <td className="px-3 py-3">
                  <div className="font-medium text-white/80 text-xs leading-snug">{asset.original_name}</div>
                  {asset.classification_reason && (
                    <div className="text-xs text-white/30 mt-0.5 leading-snug">{asset.classification_reason}</div>
                  )}
                  <div className="text-xs text-white/30 mt-0.5 hidden group-hover:block lg:hidden">
                    {asset.asset_type}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <Badge text={asset.category} />
                </td>
                <td className="px-3 py-3 hidden lg:table-cell">
                  <span className="text-xs text-white/50 font-mono">{asset.asset_type}</span>
                </td>
                <td className="px-3 py-3">
                  <code className="text-xs text-cyan-300/70 font-mono bg-cyan-500/5 rounded px-1.5 py-0.5 break-all">
                    {asset.suggested_slug}
                  </code>
                  {asset.management_note && (
                    <div className="text-xs text-white/25 mt-0.5 italic leading-snug">{asset.management_note}</div>
                  )}
                </td>
                <td className="px-3 py-3">
                  <Badge text={asset.priority} variant={asset.priority} />
                </td>
                {hasConfidence && (
                  <td className="px-3 py-3 hidden md:table-cell">
                    {asset.confidence !== undefined ? (
                      <span className={`text-xs font-semibold tabular-nums ${confidenceColor(asset.confidence)}`}>
                        {Math.round(asset.confidence * 100)}%
                      </span>
                    ) : (
                      <span className="text-xs text-white/20">—</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
