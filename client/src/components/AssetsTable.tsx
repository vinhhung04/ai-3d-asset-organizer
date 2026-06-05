import { Table2 } from 'lucide-react';
import type { ClassifiedAsset } from '../types';
import Badge from './Badge';

interface AssetsTableProps {
  assets: ClassifiedAsset[];
}

export default function AssetsTable({ assets }: AssetsTableProps) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Table2 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Classified Assets</h3>
        </div>
        <span className="text-xs text-white/40 bg-white/5 rounded-full px-2.5 py-0.5">
          {assets.length} assets
        </span>
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
                </td>
                <td className="px-3 py-3">
                  <Badge text={asset.priority} variant={asset.priority} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
